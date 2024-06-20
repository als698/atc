import { Airplane } from "./Airplane";
import { useStore } from "../../store";
import type { RequestInterface } from "./RequestInterface";

const { init } = useStore();

export const approveRequest = async (flight: RequestInterface) => {
  flight.airplane = Airplane.fromData(flight.airplane);
  await flight.airplane.approveRequest(flight);
  await flight.approveRequest();
  await init();
};

export const rejectRequest = async (flight: RequestInterface) => {
  await flight.rejectRequest();
  flight.airplane = Airplane.fromData(flight.airplane);
  await flight.airplane.rejectRequest(flight);
  await init();
};

export const completeRequest = async (flight: RequestInterface) => {
  await flight.completeRequest();
  await init();
};

export const cancelRequest = async (flight: RequestInterface) => {
  await flight.cancelRequest();
  await init();
};
