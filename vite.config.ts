import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  fmt: {
    sortPackageJson: {
      sortScripts: true,
    },
    sortTailwindcss: {
      stylesheet: "./src/styles/global.css",
    },
  },
});
