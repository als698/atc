import { generateAirplaneSeed } from "./AirplaneSeed";
import { generateRunwaySeed } from "./RunwaySeed";
import { generateWeatherSeed } from "./WeatherSeed";
import { LandingRequest } from "../../src/services/LandingRequest";

export async function generateLandingRequestSeed() {
  const airplane = await generateAirplaneSeed().save();
  const runway = await generateRunwaySeed().save();
  const weather = await generateWeatherSeed().save();

  return new LandingRequest(undefined, airplane, runway, weather);
}

export async function createLandingRequestSeed() {
  const airplane = await generateAirplaneSeed().save();
  const runway = await generateRunwaySeed().save();
  const weather = await generateWeatherSeed().save();

  return LandingRequest.createLandingRequest(airplane, runway, weather);
}
