import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/Firebase";
import type { RequestInterface } from "./RequestInterface";
import { RequestType } from "./RequestInterface";
import { EmergencyRequest } from "./EmergencyRequest";
import { LandingRequest } from "./LandingRequest";
import { TakeoffRequest } from "./TakeoffRequest";
import { TaxiRequest } from "./TaxiRequest";

export const setRequest = (request: RequestInterface) => {
  switch (request.type) {
    case RequestType.Landing:
      return LandingRequest.fromData(request);
    case RequestType.Takeoff:
      return TakeoffRequest.fromData(request);
    case RequestType.Taxi:
      return TaxiRequest.fromData(request);
    case RequestType.Emergency:
      return EmergencyRequest.fromData(request);
    default:
      return request;
  }
};

export const getAllRequests = async (): Promise<RequestInterface[]> => {
  const requestsSnapshot = await getDocs(collection(db, "requests"));
  const requests: RequestInterface[] = [];
  requestsSnapshot.forEach((doc) => {
    const data = doc.data();
    requests.push(
      <RequestInterface>setRequest({ id: doc.id, ...data } as RequestInterface),
    );
  });
  return requests;
};

export const getPendingRequests = async (): Promise<RequestInterface[]> => {
  const requestsSnapshot = await getDocs(collection(db, "requests"));
  const requests: RequestInterface[] = [];
  requestsSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.status === "pending") {
      requests.push(
        <RequestInterface>(
          setRequest({ id: doc.id, ...data } as RequestInterface)
        ),
      );
    }
  });
  return requests;
};

export const getActiveFlights = async (): Promise<RequestInterface[]> => {
  const requestsSnapshot = await getDocs(collection(db, "requests"));
  const requests: RequestInterface[] = [];

  requestsSnapshot.forEach((doc) => {
    const data = doc.data();
    if (
      data.status !== "pending" &&
      data.status !== "cancelled" &&
      data.status !== "completed"
    ) {
      requests.push(
        <RequestInterface>(
          setRequest({ id: doc.id, ...data } as RequestInterface)
        ),
      );
    }
  });

  return requests;
};

export type ChatRequest = {
  id: string;
  type: RequestType;
  status: string;
  message: string;
  response: string;
  date: string;
};

export const fetchChatRequests = async (
  airplaneId: string,
): Promise<ChatRequest[]> => {
  const chatMessages = await getAllRequests().then((requests) => {
    return requests
      .filter((request) => request.airplane.id === airplaneId)
      .map((request) => {
        return [
          {
            id: request.id,
            type: request.type,
            status: request.status,
            message: `Request ${request.type} on runway ${request.runway.id}`,
            response: `Request ${request.type} has been ${request.status}`,
            date:
              new Date(request.timestamp.seconds * 1000).toLocaleTimeString() +
              " " +
              new Date(request.timestamp.seconds * 1000).toLocaleDateString(),
          },
        ];
      });
  });

  return chatMessages.flat();
};
