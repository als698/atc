import { Weather } from "../src/services/Weather";
import { beforeAll, expect, test } from "vitest";
import { generateWeatherSeed } from "./seed/WeatherSeed";
import { Timestamp } from "firebase/firestore";
import { deleteCollection } from "../src/utils/Seed";

beforeAll(async () => {
  await deleteCollection("weather");
});

test("Add weather", async () => {
  const weather = generateWeatherSeed();
  // set +1 year to the timestamp to avoid the same timestamp from other tests
  weather.timestamp = Timestamp.fromDate(
    new Date(
      Timestamp.now()
        .toDate()
        .setFullYear(new Date().getFullYear() + 1),
    ),
  );
  await weather.save();

  const latestWeather = await Weather.getLatestWeather();

  expect(latestWeather).toEqual(weather);
});
