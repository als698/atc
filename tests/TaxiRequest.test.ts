import { expect, test } from "vitest";
import { createTaxiRequestSeed } from "./seed/TaxiRequestSeed";
import { TaxiRequest } from "../src/services/TaxiRequest";
import { Runway } from "../src/services/Runway";

test("TaxiRequest createTaxiRequest", async () => {
  const taxiRequest = await createTaxiRequestSeed();

  expect(taxiRequest.status).toBe("pending");

  const requests = await TaxiRequest.getRequests();

  expect(requests).toContainEqual(taxiRequest);
});

test("Confirm taxi", async () => {
  const taxiRequest = await createTaxiRequestSeed();

  taxiRequest.weather.visibility = 10;

  await Runway.releaseRunway(taxiRequest.runway.id);

  const canConfirm = await taxiRequest.canConfirm();

  expect(canConfirm).toBe(true);
});

test("Runway not available", async () => {
  const taxiRequest = await createTaxiRequestSeed();

  await Runway.occupyRunway(taxiRequest.runway.id);

  const reason = await taxiRequest.whatsTheReason();

  expect(reason).toBe("Runway not available");
});

test("Low visibility", async () => {
  const taxiRequest = await createTaxiRequestSeed();

  await Runway.releaseRunway(taxiRequest.runway.id);

  taxiRequest.weather.visibility = 1;

  const reason = await taxiRequest.whatsTheReason();

  expect(reason).toBe("Low visibility");
});
