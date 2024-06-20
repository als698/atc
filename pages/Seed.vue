<script lang="ts" setup>
import { seed } from "../src/utils/Seed";

if (confirm("Would you like to start Seed?")) {
  seed().then(() => {
    navigateTo("/");
  });
}
</script>

<template>
  <div>
    <h1>Seed</h1>
  </div>
</template>

<style lang="scss" scoped></style>
