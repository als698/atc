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

export class LandingRequest extends RequestModel implements RequestInterface {
  constructor(
    id: string | undefined,
    airplane: Airplane,
    runway: Runway,
    weather: Weather,
    data: Partial<LandingRequest> = {},
  ) {
    super();

    this.id = id ?? uuidv4();
    this.type = RequestType.Landing;
    this.airplane = airplane;
    this.runway = runway;
    this.weather = weather;

    Database.assignSelective(this, data);
  }

  static fromData(data: any): LandingRequest {
    return new LandingRequest(
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

  static async createLandingRequest(
    airplane: Airplane,
    runway: Runway,
    weather: Weather,
  ): Promise<LandingRequest> {
    const request = new LandingRequest(undefined, airplane, runway, weather);
    request.status = "pending";
    await request.save();
    return request;
  }

  static async getRequests(): Promise<LandingRequest[]> {
    const requestsSnapshot = await getDocs(collection(db, "requests"));

    return Database.processSnapshot(requestsSnapshot, LandingRequest.fromData);
  }

  async canConfirm(): Promise<boolean> {
    return (
      (await Runway.checkAvailability(this.runway.id)) &&
      this.weather.condition !== WeatherCondition.Stormy &&
      this.weather.visibility > 2
    );
  }

  async whatsTheReason(): Promise<string> {
    return !(await Runway.checkAvailability(this.runway.id))
      ? "Runway not available"
      : this.weather.condition === WeatherCondition.Stormy
        ? "Weather condition: " + this.weather.condition
        : this.weather.visibility <= 2
          ? "Low visibility"
          : "Unknown reason";
  }
}
