import { Runway } from "../../src/services/Runway";

export function generateRunwaySeed() {
  const runwayNumber = Math.floor(Math.random() * 36) + 1;
  const runwayDesignator = Math.random();

  let designator = "";
  if (runwayDesignator < 0.33) {
    designator = "L";
  } else if (runwayDesignator < 0.66) {
    designator = "R";
  }

  return new Runway(`Runway-${runwayNumber}${designator}`);
}
