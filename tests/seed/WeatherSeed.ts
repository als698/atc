import { Weather, WeatherCondition } from "../../src/services/Weather";

export function generateWeatherSeed() {
  const weatherConditions = Weather.possibleConditions;

  return new Weather(
    weatherConditions[Math.floor(Math.random() * weatherConditions.length)] ===
    WeatherCondition.Snowy
      ? Math.floor(-1 * (25 + Math.random() * 10))
      : Math.floor(25 + Math.random() * 10),
    weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
    Math.floor(Math.random() * 30),
    Math.floor(Math.random() * 10) + 1,
  );
}

export function generateWeatherSeedWithCondition(
  condition: WeatherCondition,
  windSpeed?: number,
) {
  return new Weather(
    condition === WeatherCondition.Snowy
      ? Math.floor(-1 * (25 + Math.random() * 10))
      : Math.floor(25 + Math.random() * 10),
    condition,
    windSpeed ?? Math.floor(Math.random() * 30),
    Math.floor(Math.random() * 10) + 1,
  );
}
