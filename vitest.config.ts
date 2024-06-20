import { defineConfig } from "vite";

export default defineConfig({
  test: {
    setupFiles: ["./tests/setupTests.ts"],
  },
});
