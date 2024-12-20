import { AliasOptions, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// @ts-ignore
import path from "path";

// @ts-ignore
const root = path.resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": root,
    } as AliasOptions,
  },
  server: {
    host: "localhost",
    port: 5173,
    strictPort: true,
  },
});
