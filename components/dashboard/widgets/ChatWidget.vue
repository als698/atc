<script lang="ts" setup>
import { onMounted, ref } from "vue";
import {
  type ChatRequest,
  fetchChatRequests,
} from "../../../src/services/RequestService";
import { Airplane } from "../../../src/services/Airplane";

const props = defineProps<{ airplane: Airplane }>();

const chatRequests = ref<ChatRequest[]>([]);

onMounted(async () => {
  chatRequests.value = await fetchChatRequests(props.airplane.id);
});

// WatchEffect for props
watchEffect(() => {
  chatRequests.value = [];
  fetchChatRequests(props.airplane.id).then((requests) => {
    chatRequests.value = requests;
  });
});
</script>

<template>
  <div class="flex flex-col space-y-4 p-4">
    <div
      v-for="request in chatRequests"
      :key="request.id"
      class="flex flex-col space-y-2"
    >
      <div class="flex justify-end">
        <div class="w-auto max-w-xs rounded-lg bg-blue-100 p-4">
          <p class="font-bold">{{ request.type }}</p>
          <p>{{ request.message }}</p>
          <small class="text-gray-400">{{ request.date }}</small>
        </div>
      </div>
      <div v-if="request.status !== 'pending'" class="flex justify-start">
        <div class="w-auto max-w-xs rounded-lg bg-gray-100 p-4">
          <p>{{ request.response }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
