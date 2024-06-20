import { Runway } from "./Runway";
import { Weather } from "./Weather";
import { Timestamp } from "firebase/firestore";
import type { Airplane } from "./Airplane";

export enum RequestType {
  Landing = "Landing",
  Takeoff = "Takeoff",
  Taxi = "Taxi",
  Emergency = "Emergency",
}

export interface RequestInterface {
  id: string;
  type: RequestType;
  airplane: Airplane;
  runway: Runway;
  weather: Weather;
  status: string;
  reason: string | boolean;
  AIConfirm: boolean | null;
  timestamp: Timestamp;

  canConfirm(): Promise<boolean>;

  whatsTheReason(): Promise<string>;

  approveRequest(): Promise<void>;

  rejectRequest(): Promise<void>;

  completeRequest(): Promise<void>;

  cancelRequest(): Promise<void>;

  save(): Promise<this>;
}
