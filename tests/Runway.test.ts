import { expect, test } from "vitest";
import { generateRunwaySeed } from "./seed/RunwaySeed";
import { Runway } from "../src/services/Runway";

test("Add runway", async () => {
  const runway = generateRunwaySeed();
  await runway.save();

  const runways = await Runway.getRunways();
  expect(runways).toContainEqual(runway);
});
