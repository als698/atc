import { reactive, toRefs } from "vue";
import { Runway } from "../src/services/Runway";
import { Weather } from "../src/services/Weather";
import { EmergencyRequest } from "../src/services/EmergencyRequest";
import type { RequestInterface } from "../src/services/RequestInterface";
import {
  getActiveFlights,
  getPendingRequests,
} from "../src/services/RequestService";
import type { Airplane as AirplaneType } from "../src/services/Airplane";
import { Airplane } from "../src/services/Airplane";
import {evaluateRequest} from "../src/ai/Prediction";

const state = reactive({
  airplanes: [] as AirplaneType[],
  runways: [] as Runway[],
  weather: null as Weather | null,
  emergencyRequests: [] as EmergencyRequest[],
  activeFlights: [] as RequestInterface[],
  pendingRequests: [] as RequestInterface[],
  loading: {
    airplanes: true,
    runways: true,
    weather: true,
    emergencyRequests: true,
    activeFlights: true,
    pendingRequests: true,
  },
});

export const useStore = () => {
  const fetchAirplanes = async () => {
    state.loading.airplanes = true;
    state.airplanes = await Airplane.getAirplanes();
    state.loading.airplanes = false;
  };

  const fetchRunways = async () => {
    state.loading.runways = true;
    state.runways = await Runway.getRunways();
    state.loading.runways = false;
  };

  const fetchWeather = async () => {
    state.loading.weather = true;
    state.weather = await Weather.getLatestWeather();
    state.loading.weather = false;
  };

  const fetchEmergencyRequests = async () => {
    state.loading.emergencyRequests = true;
    state.emergencyRequests = await EmergencyRequest.getRequests();
    state.loading.emergencyRequests = false;
  };

  const fetchActiveFlights = async () => {
    state.loading.activeFlights = true;
    state.activeFlights = await getActiveFlights();
    state.loading.activeFlights = false;
  };

  const fetchPendingRequests = async () => {
    state.loading.pendingRequests = true;
    state.pendingRequests = await getPendingRequests();
    await Promise.all(
      state.pendingRequests.map(async (flight) => {
        flight.AIConfirm = await evaluateRequest(flight);
        if (!(await flight.canConfirm())) {
          flight.reason = await flight.whatsTheReason();
        }
      }),
    );
    state.loading.pendingRequests = false;
  };

  const init = async () => {
    await Promise.all([
      fetchAirplanes(),
      fetchRunways(),
      fetchWeather(),
      fetchEmergencyRequests(),
      fetchActiveFlights(),
      fetchPendingRequests(),
    ]);
  };

  return {
    ...toRefs(state),
    fetchAirplanes,
    fetchRunways,
    fetchWeather,
    fetchEmergencyRequests,
    fetchNextFlights: fetchActiveFlights,
    fetchPendingRequests,
    init,
  };
};
