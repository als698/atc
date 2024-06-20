<script lang="ts" setup>
import { onMounted } from "vue";
import LoadingComponent from "../../common/LoadingComponent.vue";
import { useStore } from "../../../store";

const { runways, loading, fetchRunways } = useStore();

onMounted(fetchRunways);
</script>

<template>
  <div class="w-full">
    <h2 class="mb-4 text-xl font-bold">Runways Status</h2>
    <LoadingComponent v-if="loading.runways" />

    <template v-else>
      <div v-for="runway in runways" :key="runway.id" class="mb-4">
        <p>
          <span
            v-if="runway.isAvailable"
            class="ml-2 rounded bg-green-500 px-2 py-1 text-white"
          >
            {{ runway.id }}
          </span>
          <span v-else class="ml-2 rounded bg-red-500 px-2 py-1 text-white">
            {{ runway.id }}
          </span>
        </p>
      </div>
    </template>
  </div>
</template>
