import * as tf from "@tensorflow/tfjs";
import type { RequestInterface } from "../services/RequestInterface";

let model: any = null;

export async function loadModel() {
  if (!model) {
    model = await tf.loadLayersModel("/model/model.json");
  }
}

export async function predictApproval(features: number[]): Promise<boolean> {
  await loadModel();
  if (model) {
    const tensor = tf.tensor2d([features]);
    const prediction = model.predict(tensor);
    const result = (await prediction.data())[0];
    return result > 0.43;
  }
  return false;
}

export async function evaluateRequest(
  request: RequestInterface,
): Promise<boolean> {
  const features = extractFeatures(request);
  return await predictApproval(features);
}

export function extractFeatures(request: RequestInterface): number[] {
  let features: number[] = [];
  if (request.type === "Takeoff") {
    features = [
      request.runway.isAvailable ? 1 : 0,
      request.airplane.fuelLevel,
      request.weather.condition === "Stormy" ? 1 : 0,
      request.weather.windSpeed,
    ];
  } else if (request.type === "Taxi") {
    features = [request.runway.isAvailable ? 1 : 0, request.weather.visibility];
    while (features.length < 4) {
      features.push(0);
    }
  } else if (request.type === "Landing") {
    features = [
      request.runway.isAvailable ? 1 : 0,
      request.weather.condition === "Stormy" ? 1 : 0,
      request.weather.visibility,
    ];
    while (features.length < 4) {
      features.push(0);
    }
  } else if (request.type === "Emergency") {
    features = [request.runway.isAvailable ? 1 : 0];
    while (features.length < 4) {
      features.push(0);
    }
  }
  return features;
}
