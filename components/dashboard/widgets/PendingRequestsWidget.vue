<script lang="ts" setup>
import { onMounted } from "vue";
import {
  approveRequest,
  rejectRequest,
} from "../../../src/services/ControlTowerService";
import { useStore } from "../../../store";
import LoadingComponent from "../../common/LoadingComponent.vue";

const { pendingRequests, loading, fetchPendingRequests } = useStore();

const init = async () => {
  await fetchPendingRequests();
};

onMounted(init);
</script>

<template>
  <div>
    <h2 class="mb-4 text-xl font-bold">Pending Requests</h2>
    <LoadingComponent v-if="loading.pendingRequests" />

    <template v-else>
      <div v-for="flight in pendingRequests" :key="flight.id" class="mb-4">
        <p>
          {{ flight.airplane.tailNumber }} - {{ flight.type }} -
          {{ flight.runway.id }}
        </p>

        <p>Can Confirm: {{ !flight.reason }}</p>

        <p>AI Confirm: {{ flight.AIConfirm }}</p>

        <p v-if="flight.reason">Reason: {{ flight.reason }}</p>

        <button
          class="mr-2 mt-3 rounded bg-green-500 px-2 py-1 text-white"
          @click="
            approveRequest(flight);
            init();
          "
        >
          Approve
        </button>
        <button
          class="rounded bg-red-500 px-2 py-1 text-white"
          @click="
            rejectRequest(flight);
            init();
          "
        >
          Deny
        </button>
      </div>
    </template>
  </div>
</template>
