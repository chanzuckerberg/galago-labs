import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const STAGING_KEYWORD = "staging"; // Running in galago-labs

/**
 * Generate config for vite. Docs -- https://vitejs.dev/config/
 *
 * Unlike most code where you can access the build env vars via magic string
 * like `import.meta.env.MODE`, you can't inside the config. Instead, you need
 * to have the config accept a function that takes `mode` (and other args if
 * desired) and returns the config after any logic is done.
 *
 * This is necessary because our staging and prod versions of the app get
 * served from different URLs so we inject that here.
 */
export default defineConfig(({mode}) => {
  console.log("vite build mode:", mode); // REMOVE
  let basePath = "/galago";
  if (mode.toLowerCase() === STAGING_KEYWORD) {
    basePath = "/galago-labs";
  }
  return {
    plugins: [react()],
    base: basePath,
  };
});
