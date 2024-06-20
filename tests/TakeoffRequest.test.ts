import { expect, test } from "vitest";
import { createTakeoffRequestSeed } from "./seed/TakeoffRequestSeed";
import { Runway } from "../src/services/Runway";
import { TakeoffRequest } from "../src/services/TakeoffRequest";
import { generateWeatherSeedWithCondition } from "./seed/WeatherSeed";
import { WeatherCondition } from "../src/services/Weather";

test("TakeoffRequest createTakeoffRequest", async () => {
  const takeoffRequest = await createTakeoffRequestSeed();

  expect(takeoffRequest.status).toBe("pending");

  const requests = await TakeoffRequest.getRequests();

  expect(requests).toContainEqual(takeoffRequest);
});

test("Confirm takeoff", async () => {
  const takeoffRequest = await createTakeoffRequestSeed();

  await Runway.releaseRunway(takeoffRequest.runway.id);

  takeoffRequest.airplane.fuelLevel = 51;

  takeoffRequest.weather = generateWeatherSeedWithCondition(
    WeatherCondition.Sunny,
    1,
  );

  const canConfirm = await takeoffRequest.canConfirm();

  expect(canConfirm).toBe(true);
});

test("Runway not available", async () => {
  const takeoffRequest = await createTakeoffRequestSeed();

  await Runway.occupyRunway(takeoffRequest.runway.id);

  const reason = await takeoffRequest.whatsTheReason();

  expect(reason).toBe("Runway not available");
});

test("Low fuel level", async () => {
  const takeoffRequest = await createTakeoffRequestSeed();

  takeoffRequest.airplane.fuelLevel = 50;

  await Runway.releaseRunway(takeoffRequest.runway.id);

  const reason = await takeoffRequest.whatsTheReason();

  expect(reason).toBe("Low fuel level");
});

test("Stormy weather", async () => {
  const takeoffRequest = await createTakeoffRequestSeed();

  takeoffRequest.airplane.fuelLevel = 100;

  takeoffRequest.weather = generateWeatherSeedWithCondition(
    WeatherCondition.Stormy,
    10,
  );

  await Runway.releaseRunway(takeoffRequest.runway.id);

  const reason = await takeoffRequest.whatsTheReason();

  expect(reason).toBe("Weather condition: " + WeatherCondition.Stormy);
});

test("High wind speed", async () => {
  const takeoffRequest = await createTakeoffRequestSeed();

  takeoffRequest.airplane.fuelLevel = 100;

  takeoffRequest.weather = generateWeatherSeedWithCondition(
    WeatherCondition.Sunny,
    20,
  );

  await Runway.releaseRunway(takeoffRequest.runway.id);

  const reason = await takeoffRequest.whatsTheReason();

  expect(reason).toBe("High wind speed");
});
