<script lang="ts" setup>
import { ref } from "vue";

const currentTime = ref(new Date());

let intervalId: any | null = null;
onMounted(() => {
  intervalId = setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

const formattedTime = computed(() => {
  return currentTime.value.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
});
</script>

<template>
  <div>
    <div class="flex items-center">
      <Icon name="pepicons-pop:clock" />
      <span class="text-lg font-bold">Clock</span>
    </div>

    <div class="text-center text-3xl font-bold">{{ formattedTime }}</div>
  </div>
</template>

<style lang="scss" scoped></style>
