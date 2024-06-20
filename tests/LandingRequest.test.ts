import { expect, test } from "vitest";
import { createLandingRequestSeed } from "./seed/LandingRequestSeed";
import { LandingRequest } from "../src/services/LandingRequest";
import { Runway } from "../src/services/Runway";
import { generateWeatherSeedWithCondition } from "./seed/WeatherSeed";
import { WeatherCondition } from "../src/services/Weather";

test("LandingRequest createLandingRequest", async () => {
  const landingRequest = await createLandingRequestSeed();

  expect(landingRequest.status).toBe("pending");

  const requests = await LandingRequest.getRequests();

  expect(requests).toContainEqual(landingRequest);
});

test("Confirm landing", async () => {
  const landingRequest = await createLandingRequestSeed();

  await Runway.releaseRunway(landingRequest.runway.id);

  landingRequest.weather = generateWeatherSeedWithCondition(
    WeatherCondition.Sunny,
    10,
  );
  landingRequest.weather.visibility = 3;

  const canConfirm = await landingRequest.canConfirm();

  expect(canConfirm).toBe(true);
});

test("Runway not available", async () => {
  const landingRequest = await createLandingRequestSeed();

  await Runway.occupyRunway(landingRequest.runway.id);

  const reason = await landingRequest.whatsTheReason();

  expect(reason).toBe("Runway not available");
});

test("Stormy weather", async () => {
  const landingRequest = await createLandingRequestSeed();

  await Runway.releaseRunway(landingRequest.runway.id);

  landingRequest.weather = generateWeatherSeedWithCondition(
    WeatherCondition.Stormy,
    10,
  );

  const reason = await landingRequest.whatsTheReason();

  expect(reason).toBe("Weather condition: " + WeatherCondition.Stormy);
});

test("Low visibility", async () => {
  const landingRequest = await createLandingRequestSeed();

  await Runway.releaseRunway(landingRequest.runway.id);

  landingRequest.weather = generateWeatherSeedWithCondition(
    WeatherCondition.Sunny,
    1,
  );
  landingRequest.weather.visibility = 1;

  const reason = await landingRequest.whatsTheReason();

  expect(reason).toBe("Low visibility");
});
