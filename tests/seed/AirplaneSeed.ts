import { Airplane } from "../../src/services/Airplane";

export function generateAirplaneSeed() {
  const airplaneTypes = [
    "Boeing 737",
    "Airbus A320",
    "Cessna 172",
    "Embraer E190",
    "Bombardier CRJ200",
    "Gulfstream G650",
    "Boeing 777",
    "Airbus A380",
    "Boeing 787",
    "Airbus A350",
  ];

  const from = [
    "JFK",
    "LAX",
    "SFO",
    "ORD",
    "ATL",
    "MIA",
    "SEA",
    "DFW",
    "DEN",
    "BOS",
    "",
  ];

  const airplane = new Airplane(undefined);
  airplane.tailNumber = `N${Math.floor(10000 + Math.random() * 90000)}`;
  airplane.type =
    airplaneTypes[Math.floor(Math.random() * airplaneTypes.length)];
  airplane.isFlying = Math.random() < 0.5;
  airplane.altitude = airplane.isFlying ? Math.floor(Math.random() * 45000) : 0;
  airplane.speed = airplane.isFlying ? Math.floor(Math.random() * 600) : 0;
  airplane.heading = airplane.isFlying ? Math.floor(Math.random() * 360) : 0;
  airplane.from = airplane.isFlying
    ? from[Math.floor(Math.random() * from.length)]
    : "";
  airplane.passengers = Math.floor(Math.random() * 500);
  airplane.cargo = Math.floor(Math.random() * 20000);
  airplane.fuelLevel = Math.floor(Math.random() * 100);

  return airplane;
}
