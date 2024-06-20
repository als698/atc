import { expect, test } from "vitest";
import { Runway } from "../src/services/Runway";
import { EmergencyRequest } from "../src/services/EmergencyRequest";
import { createEmergencyRequestSeed } from "./seed/EmergencyRequestSeed";

test("EmergencyRequest createEmergencyRequest", async () => {
  const emergencyRequest = await createEmergencyRequestSeed();

  expect(emergencyRequest.status).toBe("pending");

  const requests = await EmergencyRequest.getRequests();

  expect(requests).toContainEqual(emergencyRequest);
});

test("EmergencyRequest canConfirm checks runway availability", async () => {
  const emergencyRequest = await createEmergencyRequestSeed();

  await Runway.releaseRunway(emergencyRequest.runway.id);

  const canConfirm = await emergencyRequest.canConfirm();

  expect(canConfirm).toBe(true);
});

test("EmergencyRequest whatsTheReason returns reason for not confirming", async () => {
  const emergencyRequest = await createEmergencyRequestSeed();

  await Runway.occupyRunway(emergencyRequest.runway.id);

  const reason = await emergencyRequest.whatsTheReason();

  expect(reason).toBe("Runway not available");
});
