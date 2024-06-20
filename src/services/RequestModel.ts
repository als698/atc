import { Runway } from "./Runway";
import { Weather, WeatherCondition } from "./Weather";
import type { RequestInterface } from "./RequestInterface";
import { RequestType } from "./RequestInterface";
import { Airplane } from "./Airplane";
import { Database } from "./Database";

export abstract class RequestModel
  extends Database
  implements RequestInterface
{
  static possibleRequests = Object.values(RequestType);
  type!: RequestType;
  airplane: Airplane;
  runway: Runway;
  weather: Weather;
  status!: string;
  AIConfirm: boolean | null = null;
  reason: string | boolean = false;

  protected constructor() {
    super();

    this.collection = "requests";
    this.airplane = new Airplane(undefined);
    this.runway = new Runway(undefined);
    this.weather = new Weather(0, WeatherCondition.Sunny, 0, 0);
  }

  abstract canConfirm(): Promise<boolean>;

  abstract whatsTheReason(): Promise<string>;

  async approveRequest(): Promise<void> {
    this.status = "approved";
    await Runway.occupyRunway(this.runway.id);
    await this.save();
  }

  async rejectRequest(): Promise<void> {
    this.status = "rejected";
    this.reason = await this.whatsTheReason();
    await this.save();
  }

  async completeRequest(): Promise<void> {
    this.status = "completed";
    await Runway.releaseRunway(this.runway.id);
    await this.save();
  }

  async cancelRequest(): Promise<void> {
    this.status = "cancelled";
    await Runway.releaseRunway(this.runway.id);
    await this.save();
  }
}
