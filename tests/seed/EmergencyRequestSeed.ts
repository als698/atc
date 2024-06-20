import { EmergencyRequest } from "../../src/services/EmergencyRequest";
import { generateAirplaneSeed } from "./AirplaneSeed";
import { generateRunwaySeed } from "./RunwaySeed";
import { generateWeatherSeed } from "./WeatherSeed";

export async function generateEmergencyRequestSeed() {
  const airplane = await generateAirplaneSeed().save();
  const runway = await generateRunwaySeed().save();
  const weather = await generateWeatherSeed().save();
  const reasons = EmergencyRequest.possibleReasons;

  return new EmergencyRequest(
    undefined,
    airplane,
    runway,
    weather,
    reasons[Math.floor(Math.random() * reasons.length)],
  );
}

export async function createEmergencyRequestSeed() {
  const airplane = await generateAirplaneSeed().save();
  const runway = await generateRunwaySeed().save();
  const weather = await generateWeatherSeed().save();
  const reasons = EmergencyRequest.possibleReasons;

  return EmergencyRequest.createEmergencyRequest(
    airplane,
    runway,
    weather,
    reasons[Math.floor(Math.random() * reasons.length)],
  );
}
