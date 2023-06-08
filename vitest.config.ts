import { defineConfig } from "vitest/config";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "geometry/geometry.ts"),
      name: "geometry",
      // the proper extensions will be added
      fileName: "geometry",
    },
  },
  resolve: {
    alias: {
      "@geometry": resolve(__dirname, "./geometry"),
    },
  },
  plugins: [dts()],
});
