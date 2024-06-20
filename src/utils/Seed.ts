import { Weather } from "../services/Weather";
import { collection, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "./Firebase";
import { generateRunwaySeed } from "../../tests/seed/RunwaySeed";
import { generateAirplaneSeed } from "../../tests/seed/AirplaneSeed";
import { generateWeatherSeed } from "../../tests/seed/WeatherSeed";
import { createTakeoffRequestSeed } from "../../tests/seed/TakeoffRequestSeed";
import { createEmergencyRequestSeed } from "../../tests/seed/EmergencyRequestSeed";
import { createLandingRequestSeed } from "../../tests/seed/LandingRequestSeed";

const seedAirplanes = async () => {
  for (let i = 1; i <= 5; i++) {
    await generateAirplaneSeed().save();
  }
};

const seedWeather = async () => {
  const weatherConditions = Weather.possibleConditions;
  for (let i = 0; i < weatherConditions.length; i++) {
    await generateWeatherSeed().save();
  }
};

const seedRunways = async () => {
  for (let i = 1; i <= 3; i++) {
    await generateRunwaySeed().save();
  }
};

const seedRequests = async () => {
  await createTakeoffRequestSeed();
  await createEmergencyRequestSeed();
  await createLandingRequestSeed();
  await createLandingRequestSeed();
};

export const deleteCollection = async (collectionName: string) => {
  const collectionRef = collection(db, collectionName);
  const snapshot = await getDocs(collectionRef);
  snapshot.forEach((doc) => {
    deleteDoc(doc.ref);
  });
};

export const deleteAllData = async () => {
  // Confirm with the user
  const confirmation = window.confirm(
    "Are you sure you want to delete all data?",
  );
  if (confirmation) {
    await deleteCollection("weather");
    await deleteCollection("runways");
    await deleteCollection("airplanes");
    await deleteCollection("requests");
    console.log("All data has been deleted.");
  }
};

export const seed = async () => {
  await deleteAllData().then(async () => {
    await seedWeather();
    await seedRunways();
    await seedAirplanes();
    await seedRequests();
  });
};
