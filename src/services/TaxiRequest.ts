import { collection, getDocs } from "firebase/firestore";
import { Runway } from "./Runway";
import { Weather } from "./Weather";
import { uuidv4 } from "@firebase/util";
import { db } from "../utils/Firebase";
import { Airplane } from "./Airplane";
import { RequestModel } from "./RequestModel";
import type { RequestInterface } from "./RequestInterface";
import { RequestType } from "./RequestInterface";
import { Database } from "./Database";

export class TaxiRequest extends RequestModel implements RequestInterface {
  constructor(
    id: string | undefined,
    airplane: Airplane,
    runway: Runway,
    weather: Weather,
    data: Partial<TaxiRequest> = {},
  ) {
    super();

    Database.assignSelective(this, data);

    this.id = id ?? uuidv4();
    this.airplane = airplane;
    this.runway = runway;
    this.weather = weather;
    this.type = RequestType.Taxi;
  }

  static fromData(data: any): TaxiRequest {
    return new TaxiRequest(
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

  static async createTaxiRequest(
    airplane: Airplane,
    runway: Runway,
    weather: Weather,
  ): Promise<TaxiRequest> {
    const request = new TaxiRequest(undefined, airplane, runway, weather);
    request.status = "pending";
    await request.save();
    return request;
  }

  static async getRequests(): Promise<TaxiRequest[]> {
    const requestsSnapshot = await getDocs(collection(db, "requests"));

    return Database.processSnapshot(requestsSnapshot, TaxiRequest.fromData);
  }

  async canConfirm(): Promise<boolean> {
    return (
      (await Runway.checkAvailability(this.runway.id)) &&
      this.weather.visibility > 1
    );
  }

  async whatsTheReason(): Promise<string> {
    return !(await Runway.checkAvailability(this.runway.id))
      ? "Runway not available"
      : this.weather.visibility <= 1
        ? "Low visibility"
        : "Unknown reason";
  }
}
