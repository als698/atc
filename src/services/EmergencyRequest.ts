import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/Firebase";
import { Runway } from "./Runway";
import { Weather, WeatherCondition } from "./Weather";
import type { RequestInterface } from "./RequestInterface";
import { RequestType } from "./RequestInterface";
import { uuidv4 } from "@firebase/util";
import { RequestModel } from "./RequestModel";
import { Airplane } from "./Airplane";
import { Database } from "./Database";

export enum EmergencyReasons {
  Fire = "Fire",
  Medical = "Medical",
  Technical = "Technical",
}

export class EmergencyRequest extends RequestModel implements RequestInterface {
  static possibleReasons = Object.values(EmergencyReasons);

  emergencyReason: string;
  needAssistance: boolean = false;

  constructor(
    id: string | undefined,
    airplane: Airplane,
    runway: Runway,
    weather: Weather,
    emergencyReason: EmergencyReasons,
    data: Partial<EmergencyRequest> = {},
  ) {
    super();

    this.id = id ?? uuidv4();
    this.airplane = airplane;
    this.runway = runway;
    this.weather = weather;
    this.type = RequestType.Emergency;
    this.emergencyReason = emergencyReason;

    Database.assignSelective(this, data);
  }

  static fromData(data: any): EmergencyRequest {
    return new EmergencyRequest(
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
      data.emergencyReason,
      data,
    );
  }

  static async createEmergencyRequest(
    airplane: Airplane,
    runway: Runway,
    weather: Weather,
    emergencyReason: EmergencyReasons,
  ): Promise<EmergencyRequest> {
    const request = new EmergencyRequest(
      undefined,
      airplane,
      runway,
      weather,
      emergencyReason,
    );
    request.status = "pending";
    await request.save();
    return request;
  }

  static async getRequests(): Promise<EmergencyRequest[]> {
    const requestsSnapshot = await getDocs(collection(db, "requests"));
    const requests = Database.processSnapshot(
      requestsSnapshot,
      EmergencyRequest.fromData,
    );

    return requests.filter((request) => request.type === RequestType.Emergency);
  }

  async canConfirm(): Promise<boolean> {
    return await Runway.checkAvailability(this.runway.id);
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
