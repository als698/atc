<script lang="ts" setup>
import { onMounted } from "vue";
import LoadingComponent from "../../common/LoadingComponent.vue";
import { useStore } from "../../../store";

const { weather, loading, fetchWeather } = useStore();

onMounted(fetchWeather);
</script>

<template>
  <div>
    <div class="flex items-center">
      <Icon name="pepicons-pop:cloud" />
      <span class="text-lg font-bold">Weather</span>
    </div>
    <LoadingComponent v-if="loading.weather" />

    <template v-else-if="weather">
      <p>Temperature: {{ weather.temperature }}°C</p>
      <p>Condition: {{ weather.condition }}</p>
      <p>Wind Speed: {{ weather.windSpeed }} knots</p>
      <p>Visibility: {{ weather.visibility }} miles</p>
    </template>

    <template v-else>
      <p>No weather data available</p>
    </template>
  </div>
</template>
