import { uuidv4 } from "@firebase/util";
import { Database } from "./Database";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/Firebase";
import type { RequestInterface } from "./RequestInterface";
import { RequestType } from "./RequestInterface";

export class Airplane extends Database {
  tailNumber: string = "";
  type: string = "";
  altitude: number = 0;
  speed: number = 0;
  heading: number = 0;
  from: string = "";
  passengers: number = 0;
  cargo: number = 0;
  isFlying: boolean = false;
  fuelLevel: number = 100;

  constructor(id: string | undefined, data: Partial<Airplane> = {}) {
    super();

    this.id = id ?? uuidv4();
    this.collection = "airplanes";

    Database.assignSelective(this, data);
  }

  static fromData(data: any): Airplane {
    return new Airplane(data.id, data);
  }

  static async getAirplanes(): Promise<Airplane[]> {
    const requestSnapshot = await getDocs(collection(db, "airplanes"));

    return Database.processSnapshot(requestSnapshot, Airplane.fromData);
  }

  async approveRequest(request: RequestInterface) {
    if (request.type === RequestType.Takeoff) {
      this.altitude = 1000;
      this.speed = 200;
      this.fuelLevel -= 10;
    } else if (request.type === RequestType.Landing) {
      this.altitude = 0;
      this.speed = 0;
      this.fuelLevel -= 5;
    }
  }

  async rejectRequest(request: RequestInterface) {
    if (request.type === RequestType.Takeoff) {
      this.altitude = 0;
      this.speed = 0;
    } else if (request.type === RequestType.Landing) {
      this.altitude = 1000;
      this.speed = 200;
    }
  }
}
