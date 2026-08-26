import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://lau.ucsd.edu",
  redirects: {
    "/zoom": "https://ucsd.zoom.us/my/samlau",
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ["sam-lau-macbook-pro-cli.tailb2b28e.ts.net"],
    },
  },
});
