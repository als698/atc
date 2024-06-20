import { expect, test } from "vitest";
import { Airplane } from "../src/services/Airplane";
import { generateAirplaneSeed } from "./seed/AirplaneSeed";

test("Add airplane", async () => {
  const airplane = generateAirplaneSeed();
  await airplane.save();

  const airplanes = await Airplane.getAirplanes();
  expect(airplanes).toContainEqual(airplane);
});
