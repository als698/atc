import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../utils/Firebase";
import { Database } from "./Database";

export enum WeatherCondition {
  Sunny = "Sunny",
  Cloudy = "Cloudy",
  Rainy = "Rainy",
  Stormy = "Stormy",
  Snowy = "Snowy",
}

export class Weather extends Database {
  static possibleConditions = Object.values(WeatherCondition);

  temperature: number;
  condition: WeatherCondition;
  windSpeed: number;
  visibility: number;

  constructor(
    temperature: number,
    condition: WeatherCondition,
    windSpeed: number,
    visibility: number,
    data: Partial<Weather> = {},
  ) {
    super();

    this.collection = "weather";
    this.temperature = temperature;
    this.condition = condition;
    this.windSpeed = windSpeed;
    this.visibility = visibility;

    Database.assignSelective(this, data);
  }

  static fromData(data: any): Weather {
    return new Weather(
      data.temperature,
      data.condition,
      data.windSpeed,
      data.visibility,
      data,
    );
  }

  static async getLatestWeather(): Promise<Weather | null> {
    const weatherQuery = query(
      collection(db, "weather"),
      orderBy("timestamp.seconds", "desc"),
      limit(1),
    );

    const weatherSnapshot = await getDocs(weatherQuery);

    const weathers = Weather.processSnapshot(weatherSnapshot, Weather.fromData);

    return weathers[0] || null;
  }
}
