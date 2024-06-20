import { db } from "../utils/Firebase";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { uuidv4 } from "@firebase/util";
import { Database } from "./Database";

export class Runway extends Database {
  isAvailable: boolean = true;

  constructor(id: string | undefined, data: Partial<Runway> = {}) {
    super();

    this.id = id ?? uuidv4();
    this.collection = "runways";

    Database.assignSelective(this, data);
  }

  static fromData(data: any): Runway {
    return new Runway(data.id, data);
  }

  static async getRunways(): Promise<Runway[]> {
    const runwaysSnapshot = await getDocs(collection(db, "runways"));
    return Database.processSnapshot(runwaysSnapshot, Runway.fromData);
  }

  static async checkAvailability(id: string): Promise<boolean> {
    const runway = await Runway.getByIdStatic(id);
    return runway?.isAvailable ?? false;
  }

  static async occupyRunway(id: string): Promise<void> {
    const runway = await Runway.getByIdStatic(id);
    if (runway) {
      runway.isAvailable = false;
      await runway.save();
    }
  }

  static async releaseRunway(id: string): Promise<void> {
    const runway = await Runway.getByIdStatic(id);
    if (runway) {
      runway.isAvailable = true;
      await runway.save();
    }
  }

  static async getByIdStatic(id: string): Promise<Runway | null> {
    const docRef = doc(db, "runways", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return new Runway(id, data);
    } else {
      return null;
    }
  }
}
