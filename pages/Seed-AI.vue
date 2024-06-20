<script lang="ts" setup>
import { seedAI } from "../src/ai/SeedAI";

if (confirm("Would you like to start Seed AI?")) {
  seedAI();
}
</script>

<template>
  <h1>Seed AI</h1>
</template>

<style lang="scss" scoped></style>
