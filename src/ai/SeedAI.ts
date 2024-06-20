import { generateAirplaneSeed } from "../../tests/seed/AirplaneSeed";
import { generateRunwaySeed } from "../../tests/seed/RunwaySeed";
import { TakeoffRequest } from "../services/TakeoffRequest";
import { Airplane } from "../services/Airplane";
import { Runway } from "../services/Runway";
import { TaxiRequest } from "../services/TaxiRequest";
import { LandingRequest } from "../services/LandingRequest";
import { EmergencyRequest } from "../services/EmergencyRequest";
import { generateWeatherSeed } from "../../tests/seed/WeatherSeed";
import type { RequestInterface } from "../services/RequestInterface";
import { RequestType } from "../services/RequestInterface";
import { approveRequest, rejectRequest } from "../services/ControlTowerService";

const airplanes: Airplane[] = [];
const runways: Runway[] = [];
const takeoffRequests: TakeoffRequest[] = [];
const landingRequests: LandingRequest[] = [];
const taxiRequests: TaxiRequest[] = [];
const emergencyRequests: EmergencyRequest[] = [];

export const seedAI = async () => {
  startSeed().then(() => {
    console.log("Seed AI has finished seeding.");

    const data = {
      takeoffRequests,
      landingRequests,
      taxiRequests,
      emergencyRequests,
    };

    const json = JSON.stringify(data, null, 2);
    triggerDownload(json, "seedAIData.json");
  });
};

export const startSeed = async () => {
  await seedAirplanes(10);
  await seedRunways();
  await seedTakeoffRequests();
  await seedLandingRequests();
  await seedTaxiRequests();
  await seedEmergencyRequests();

  await repeat(10, async () => {
    await repeat(5, async () => {
      await Promise.all([
        ...emergencyRequests.map(tryToApprove),
        ...takeoffRequests.map(tryToApprove),
        ...landingRequests.map(tryToApprove),
        ...taxiRequests.map(tryToApprove),
      ]);

      await new Promise((resolve) => setTimeout(resolve, 200));
      await completeRequests();
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    await completeRequests();

    await Promise.all([
      ...emergencyRequests.map(resolveRequest),
      ...takeoffRequests.map(resolveRequest),
      ...landingRequests.map(resolveRequest),
      ...taxiRequests.map(resolveRequest),
    ]);
  });
};

export const seedAirplanes = async (count = 20) => {
  await repeat(count, async () => {
    airplanes.push(await generateAirplaneSeed().save());
  });
};

export const seedRunways = async (count = 4) => {
  await repeat(count, async () => {
    runways.push(await generateRunwaySeed().save());
  });
};

export const seedTakeoffRequests = async () => {
  await repeat(airplanes.length, async (i) => {
    const weather = generateWeatherSeed();
    takeoffRequests.push(
      await TakeoffRequest.createTakeoffRequest(
        airplanes[i],
        runways[i % runways.length],
        weather,
      ),
    );
  });
};

export const seedLandingRequests = async () => {
  await repeat(airplanes.length, async (i) => {
    const weather = generateWeatherSeed();
    landingRequests.push(
      await LandingRequest.createLandingRequest(
        airplanes[i],
        runways[i % runways.length],
        weather,
      ),
    );
  });
};

export const seedTaxiRequests = async () => {
  await repeat(airplanes.length, async (i) => {
    const weather = generateWeatherSeed();
    taxiRequests.push(
      await TaxiRequest.createTaxiRequest(
        airplanes[i],
        runways[i % runways.length],
        weather,
      ),
    );
  });
};

export const seedEmergencyRequests = async () => {
  await repeat(airplanes.length, async (i) => {
    const weather = generateWeatherSeed();
    emergencyRequests.push(
      await EmergencyRequest.createEmergencyRequest(
        airplanes[i],
        runways[i % runways.length],
        weather,
        EmergencyRequest.possibleReasons[
          i % EmergencyRequest.possibleReasons.length
        ],
      ),
    );
  });
};

const repeat = (count: number, fn: (i: number) => Promise<void>) => {
  const promises = [];
  for (let i = 0; i < count; i++) {
    promises.push(fn(i));
  }
  return Promise.all(promises);
};

const tryToApprove = async (request: RequestInterface) => {
  console.log("Trying to approve request");

  if (request.type === RequestType.Emergency) {
    await cancelRequestOfRunway(request.runway);
  }

  if (await request.canConfirm()) {
    await approveRequest(request);
  }
};

const resolveRequest = async (request: RequestInterface) => {
  console.log("Resolving request");

  if (request.type === RequestType.Emergency) {
    await cancelRequestOfRunway(request.runway);
  }

  if (await request.canConfirm()) {
    await approveRequest(request);
  } else {
    await rejectRequest(request);
  }
};

const cancelRequestOfRunway = async (runway: Runway) => {
  const request = [
    ...takeoffRequests,
    ...landingRequests,
    ...taxiRequests,
  ].find(
    (request) =>
      request.runway.id === runway.id && request.status === "approved",
  );

  if (request) {
    await request.cancelRequest();
  }
};

const completeRequests = async () => {
  const requests = [
    ...takeoffRequests,
    ...landingRequests,
    ...taxiRequests,
    ...emergencyRequests,
  ].filter((request) => request.status === "approved");

  await Promise.all(requests.map((request) => request.completeRequest()));
};

const triggerDownload = (json: any, filename: string) => {
  const blob = new Blob([json], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
