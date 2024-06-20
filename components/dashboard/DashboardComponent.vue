<script lang="ts" setup>
import { ref } from "vue";
import RunwayWidget from "./widgets/RunwayWidget.vue";
import ClockWidget from "./widgets/ClockWidget.vue";
import WeatherWidget from "./widgets/WeatherWidget.vue";
import EmergencyAlertsWidget from "./widgets/EmergencyAlertsWidget.vue";
import PendingRequestsWidget from "./widgets/PendingRequestsWidget.vue";
import ActiveFlightsWidget from "./widgets/ActiveFlightsWidget.vue";
import AirplaneRequestWidget from "./widgets/AirplaneRequestWidget.vue";
import RadarWidget from "./widgets/RadarWidget.vue";

const showMainPanel = ref(true);
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-5">
    <!-- Dashboard Title -->
    <h1 class="mb-5 text-center text-3xl font-bold">ATC Dashboard</h1>

    <div class="mb-4 flex justify-end">
      <button
        class="rounded-md bg-blue-500 px-4 py-2 font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
        @click="showMainPanel = !showMainPanel"
      >
        {{ showMainPanel ? "Airplane Request" : "ATC" }}
      </button>
    </div>

    <div
      v-if="showMainPanel"
      class="grid animate-fade-in-scale gap-4 md:grid-cols-3"
    >
      <!-- Runways -->
      <div class="col-span-1 flex items-center rounded-lg bg-white p-5 shadow">
        <RunwayWidget />
      </div>

      <!-- Clock -->
      <div
        class="col-span-1 flex items-center justify-center rounded-lg bg-white p-5 shadow"
      >
        <ClockWidget />
      </div>

      <!-- Weather -->
      <div
        class="col-span-1 flex items-center justify-center rounded-lg bg-white p-5 shadow"
      >
        <WeatherWidget />
      </div>

      <!-- Emergency Requests -->
      <div class="col-span-1 rounded-lg bg-red-500 p-5 text-white shadow">
        <EmergencyAlertsWidget />
      </div>

      <!-- Active Requests -->
      <div class="col-span-2 rounded-lg bg-white p-5 shadow">
        <PendingRequestsWidget />
      </div>

      <!-- Next Flights -->
      <div class="col-span-2 rounded-lg bg-white p-5 shadow">
        <ActiveFlightsWidget />
      </div>

      <!-- Radar -->
      <div
        class="col-span-1 flex items-center justify-center rounded-lg bg-white p-5 shadow"
      >
        <RadarWidget />
      </div>
    </div>

    <div v-else class="flex animate-fade-in-scale justify-center">
      <div class="col-span-1 w-full rounded-lg bg-white p-5 shadow md:w-1/2">
        <AirplaneRequestWidget />
      </div>
    </div>
  </div>
</template>
