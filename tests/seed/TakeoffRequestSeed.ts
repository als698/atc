import { generateAirplaneSeed } from "./AirplaneSeed";
import { generateRunwaySeed } from "./RunwaySeed";
import { generateWeatherSeed } from "./WeatherSeed";
import { TakeoffRequest } from "../../src/services/TakeoffRequest";

export async function generateTakeoffRequestSeed() {
  const airplane = await generateAirplaneSeed().save();
  const runway = await generateRunwaySeed().save();
  const weather = await generateWeatherSeed().save();

  return new TakeoffRequest(undefined, airplane, runway, weather);
}

export async function createTakeoffRequestSeed() {
  const airplane = await generateAirplaneSeed().save();
  const runway = await generateRunwaySeed().save();
  const weather = await generateWeatherSeed().save();

  return TakeoffRequest.createTakeoffRequest(airplane, runway, weather);
}
