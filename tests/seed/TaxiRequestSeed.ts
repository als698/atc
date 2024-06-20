import { TaxiRequest } from "../../src/services/TaxiRequest";
import { generateWeatherSeed } from "./WeatherSeed";
import { generateRunwaySeed } from "./RunwaySeed";
import { generateAirplaneSeed } from "./AirplaneSeed";

export async function generateTaxiRequestSeed() {
  const airplane = await generateAirplaneSeed().save();
  const runway = await generateRunwaySeed().save();
  const weather = await generateWeatherSeed().save();

  return new TaxiRequest(undefined, airplane, runway, weather);
}

export async function createTaxiRequestSeed() {
  const airplane = await generateAirplaneSeed().save();
  const runway = await generateRunwaySeed().save();
  const weather = await generateWeatherSeed().save();

  return TaxiRequest.createTaxiRequest(airplane, runway, weather);
}
