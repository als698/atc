<script lang="ts" setup>
import { ref } from "vue";
import { Weather } from "../../../src/services/Weather";
import { LandingRequest } from "../../../src/services/LandingRequest";
import { TakeoffRequest } from "../../../src/services/TakeoffRequest";
import { TaxiRequest } from "../../../src/services/TaxiRequest";
import { EmergencyRequest } from "../../../src/services/EmergencyRequest";
import { RequestType } from "../../../src/services/RequestInterface";
import { RequestModel } from "../../../src/services/RequestModel";
import { useStore } from "../../../store";
import LoadingComponent from "../../common/LoadingComponent.vue";
import ChatWidget from "./ChatWidget.vue";

const { airplanes, runways, loading, init } = useStore();

const requests = ref(RequestModel.possibleRequests);
const emergencyReasons = ref(EmergencyRequest.possibleReasons);

const selectedPlane = ref();
const selectedRunway = ref();
const selectedRequest = ref();
const selectedEmergencyReason = ref();

const isFormValid = computed(() => {
  if (selectedRequest.value === RequestType.Emergency) {
    return (
      selectedPlane.value &&
      selectedRunway.value &&
      selectedEmergencyReason.value
    );
  }
  return selectedPlane.value && selectedRunway.value && selectedRequest.value;
});

const sendRequest = async () => {
  const weather = (await Weather.getLatestWeather()) as Weather;

  switch (selectedRequest.value) {
    case RequestType.Landing:
      await LandingRequest.createLandingRequest(
        selectedPlane.value,
        selectedRunway.value,
        weather,
      );
      break;
    case RequestType.Takeoff:
      await TakeoffRequest.createTakeoffRequest(
        selectedPlane.value,
        selectedRunway.value,
        weather,
      );
      break;
    case RequestType.Taxi:
      await TaxiRequest.createTaxiRequest(
        selectedPlane.value,
        selectedRunway.value,
        weather,
      );
      break;
    case RequestType.Emergency:
      await EmergencyRequest.createEmergencyRequest(
        selectedPlane.value,
        selectedRunway.value,
        weather,
        selectedEmergencyReason.value,
      );
      break;
  }

  const currentPlane = selectedPlane.value;

  selectedPlane.value = undefined;
  selectedRunway.value = undefined;
  selectedRequest.value = undefined;
  selectedEmergencyReason.value = undefined;

  await init();

  selectedPlane.value = currentPlane;
};

watch(selectedPlane, (newPlane) => {
  requests.value = RequestModel.possibleRequests;

  if (newPlane) {
    if (newPlane.isFlying) {
      requests.value = requests.value.filter(
        (request) =>
          request !== RequestType.Takeoff && request !== RequestType.Taxi,
      );
    } else {
      requests.value = requests.value.filter(
        (request) => request !== RequestType.Landing,
      );
    }
  }
});

onMounted(init);
</script>

<template>
  <h2 class="mb-4 text-xl font-bold">Airplane Request</h2>

  <LoadingComponent v-if="loading.airplanes || loading.runways" />

  <div v-else class="space-y-4 p-4">
    <select
      v-model="selectedPlane"
      class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
    >
      <option :value="undefined" disabled selected>Select Plane</option>

      <option v-for="plane in airplanes" :key="plane.id" :value="plane">
        {{ plane.tailNumber }}
      </option>
    </select>

    <select
      v-model="selectedRunway"
      class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
    >
      <option :value="undefined" disabled selected>Select Runway</option>

      <option v-for="runway in runways" :key="runway.id" :value="runway">
        {{ runway.id }}
      </option>
    </select>

    <select
      v-model="selectedRequest"
      class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
    >
      <option :value="undefined" disabled selected>Select Request</option>

      <option v-for="request in requests" :key="request" :value="request">
        {{ request }}
      </option>
    </select>

    <select
      v-if="selectedRequest === RequestType.Emergency"
      v-model="selectedEmergencyReason"
      class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
    >
      <option :value="undefined" disabled selected>
        Select Emergency Reason
      </option>

      <option v-for="reason in emergencyReasons" :key="reason" :value="reason">
        {{ reason }}
      </option>
    </select>

    <button
      :disabled="!isFormValid"
      class="w-full rounded-md bg-blue-500 px-4 py-2 font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-50"
      @click="sendRequest"
    >
      Send Request
    </button>
  </div>

  <ChatWidget v-if="selectedPlane" :airplane="selectedPlane" />
</template>

<style lang="scss" scoped></style>
