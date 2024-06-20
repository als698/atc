<script lang="ts" setup>
import { useStore } from "../../../store";
import LoadingComponent from "../../common/LoadingComponent.vue";

const { emergencyRequests, loading, fetchEmergencyRequests } = useStore();

onMounted(fetchEmergencyRequests);
</script>

<template>
  <div>
    <h2 class="mb-4 text-xl font-bold">Emergency Requests</h2>
    <LoadingComponent v-if="loading.emergencyRequests" />

    <template v-else>
      <div
        v-for="emergency in emergencyRequests"
        :key="emergency.id"
        class="mb-4"
      >
        <p>
          {{ emergency.airplane.tailNumber }} - {{ emergency.type }} -
          {{ emergency.runway.id }}
        </p>
      </div>
    </template>
  </div>
</template>
