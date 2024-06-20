import {
  collection,
  doc,
  getDoc,
  QuerySnapshot,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../utils/Firebase";
import { toPlainObject } from "../utils/ObjectUtils";
import { uuidv4 } from "@firebase/util";
import type { DocumentData } from "@firebase/firestore-types";

export class Database {
  id: string = uuidv4();
  collection: string | undefined;
  timestamp: Timestamp = Timestamp.now();

  static assignSelective(target: any, source: any) {
    for (const key of Object.keys(source)) {
      if (typeof source[key] === "object" && target[key] instanceof Database) {
        // Skip if the target property is already an instance of a class
        continue;
      }
      target[key] = source[key];
    }
  }

  static processSnapshot<T>(
    snapshot: QuerySnapshot<DocumentData>,
    createInstance: (data: any) => T,
  ): T[] {
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      data.id = doc.id;
      return createInstance(data);
    });
  }

  async getById(id: string) {
    if (!this.collection) {
      throw new Error("Collection is not defined");
    }

    const docRef = doc(db, this.collection, id);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() ? docSnap.data() : null;
  }

  async save(): Promise<this> {
    const data: any = toPlainObject(this);
    delete data.id;
    delete data.collection;

    const docRef = doc(collection(db, this.collection as string), this.id);
    await setDoc(docRef, toPlainObject(data), { merge: true });

    return this;
  }
}
