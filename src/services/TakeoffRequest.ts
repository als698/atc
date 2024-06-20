import { collection, getDocs } from "firebase/firestore";
import { Runway } from "./Runway";
import { Weather, WeatherCondition } from "./Weather";
import type { RequestInterface } from "./RequestInterface";
import { RequestType } from "./RequestInterface";
import { uuidv4 } from "@firebase/util";
import { db } from "../utils/Firebase";
import { RequestModel } from "./RequestModel";
import { Airplane } from "./Airplane";
import { Database } from "./Database";

export class TakeoffRequest extends RequestModel implements RequestInterface {
  constructor(
    id: string | undefined,
    airplane: Airplane,
    runway: Runway,
    weather: Weather,
    data: Partial<TakeoffRequest> = {},
  ) {
    super();

    this.id = id ?? uuidv4();
    this.type = RequestType.Takeoff;
    this.airplane = airplane;
    this.runway = runway;
    this.weather = weather;

    Database.assignSelective(this, data);
  }

  static fromData(data: any): TakeoffRequest {
    return new TakeoffRequest(
      data.id,
      new Airplane(data.airplane.id, data.airplane),
      new Runway(data.runway.id, data.runway),
      new Weather(
        data.weather.temperature,
        data.weather.condition,
        data.weather.windSpeed,
        data.weather.visibility,
        data.weather,
      ),
      data,
    );
  }

  static async createTakeoffRequest(
    airplane: Airplane,
    runway: Runway,
    weather: Weather,
  ): Promise<TakeoffRequest> {
    const request = new TakeoffRequest(undefined, airplane, runway, weather);
    request.status = "pending";
    await request.save();
    return request;
  }

  static async getRequests(): Promise<TakeoffRequest[]> {
    const requestsSnapshot = await getDocs(collection(db, "requests"));

    return Database.processSnapshot(requestsSnapshot, TakeoffRequest.fromData);
  }

  async canConfirm(): Promise<boolean> {
    return (
      (await Runway.checkAvailability(this.runway.id)) &&
      this.airplane.fuelLevel > 50 &&
      this.weather.condition !== WeatherCondition.Stormy &&
      this.weather.windSpeed < 20
    );
  }

  async whatsTheReason(): Promise<string> {
    return !(await Runway.checkAvailability(this.runway.id))
      ? "Runway not available"
      : this.airplane.fuelLevel <= 50
        ? "Low fuel level"
        : this.weather.condition === WeatherCondition.Stormy
          ? "Weather condition: " + this.weather.condition
          : this.weather.windSpeed >= 20
            ? "High wind speed"
            : "Unknown reason";
  }
}
