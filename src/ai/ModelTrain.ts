import * as fs from "fs";
import { dirname } from "pathe";
import { fileURLToPath } from "node:url";
import * as tf from "@tensorflow/tfjs-node";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read and parse JSON data
const rawData = fs.readFileSync(__dirname + "/seedAIData.json", "utf8");
const data = JSON.parse(rawData);

const extractFeaturesAndLabels = (
  requests: any,
  type: any,
  maxLength: number,
) => {
  return requests.map((request: any) => {
    let features;
    let label = request.status === "approved" ? 1 : 0;

    if (type === "Takeoff") {
      features = [
        request.runway.isAvailable ? 1 : 0,
        request.airplane.fuelLevel,
        request.weather.condition === "Stormy" ? 1 : 0,
        request.weather.windSpeed,
      ];
    } else if (type === "Taxi") {
      features = [
        request.runway.isAvailable ? 1 : 0,
        request.weather.visibility,
      ];
    } else if (type === "Landing") {
      features = [
        request.runway.isAvailable ? 1 : 0,
        request.weather.condition === "Stormy" ? 1 : 0,
        request.weather.visibility,
      ];
    } else if (type === "Emergency") {
      features = [request.runway.isAvailable ? 1 : 0];
    }

    // Pad features to maxLength
    while (features!.length < maxLength) {
      features!.push(0);
    }

    return { features, label };
  });
};

// Determine the maximum feature length
const maxLength = Math.max(
  4, // Takeoff features length
  2, // Taxi features length
  3, // Landing features length
  1, // Emergency features length
);

const takeoffData = extractFeaturesAndLabels(
  data.takeoffRequests,
  "Takeoff",
  maxLength,
);
const taxiData = extractFeaturesAndLabels(data.taxiRequests, "Taxi", maxLength);
const landingData = extractFeaturesAndLabels(
  data.landingRequests,
  "Landing",
  maxLength,
);
const emergencyData = extractFeaturesAndLabels(
  data.emergencyRequests,
  "Emergency",
  maxLength,
);

// Combine all data
const combinedData = [
  ...takeoffData,
  ...taxiData,
  ...landingData,
  ...emergencyData,
];

// Separate features and labels
const features = combinedData.map((item) => item.features);
const labels = combinedData.map((item) => item.label);

// Convert data to tensors
const featureTensor = tf.tensor2d(features);
const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

// Define the model
const model = tf.sequential();
model.add(
  tf.layers.dense({ units: 10, activation: "relu", inputShape: [maxLength] }),
);
model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

model.compile({
  optimizer: tf.train.adam(),
  loss: tf.losses.sigmoidCrossEntropy,
  metrics: ["accuracy"],
});

// Train the model
model
  .fit(featureTensor, labelTensor, {
    epochs: 50,
    batchSize: 32,
    callbacks: tf.node.tensorBoard("/tmp/fit_logs_1"),
  })
  .then(() => {
    console.log("Training Complete");

    // Save the model
    model.save(`file://${__dirname}/model`);
  });
