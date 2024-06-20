import { expect, test } from "vitest";
import { createTakeoffRequestSeed } from "./seed/TakeoffRequestSeed";
import {
  approveRequest,
  cancelRequest,
  completeRequest,
  rejectRequest,
} from "../src/services/ControlTowerService";
import { Runway } from "../src/services/Runway";

test("Approve request", async () => {
  const request = await createTakeoffRequestSeed();

  await approveRequest(request);

  expect(await Runway.checkAvailability(request.runway.id)).toBe(false);

  expect(request.status).toBe("approved");
});

test("Reject request", async () => {
  const request = await createTakeoffRequestSeed();

  await rejectRequest(request);

  expect(request.status).toBe("rejected");
});

test("Complete request", async () => {
  const request = await createTakeoffRequestSeed();

  await completeRequest(request);

  expect(await Runway.checkAvailability(request.runway.id)).toBe(true);

  expect(request.status).toBe("completed");
});

test("Cancel request", async () => {
  const request = await createTakeoffRequestSeed();

  await cancelRequest(request);

  expect(request.status).toBe("cancelled");
});
