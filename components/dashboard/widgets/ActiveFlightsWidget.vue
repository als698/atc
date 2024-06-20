<script lang="ts" setup>
import { onMounted } from "vue";
import LoadingComponent from "../../common/LoadingComponent.vue";
import { useStore } from "../../../store";
import { cancelRequest } from "../../../src/services/ControlTowerService";

const { activeFlights, loading, init } = useStore();

onMounted(init);
</script>

<template>
  <div>
    <h2 class="mb-4 text-xl font-bold">Active Flights</h2>
    <LoadingComponent v-if="loading.activeFlights" />

    <template v-else>
      <div
        v-for="flight in activeFlights"
        :key="flight.id"
        class="mb-4 grid grid-cols-2"
      >
        <p>
          {{ flight.airplane.tailNumber }} - {{ flight.type }} -
          {{ flight.runway.id }}
        </p>

        <button
          class="rounded bg-red-500 px-2 py-1 text-white"
          @click="cancelRequest(flight)"
        >
          Send Cancel Request
        </button>
      </div>
    </template>
  </div>
</template>
