import { fileURLToPath, URL } from "node:url";

import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";

function removeAttributes(options: Array<string>): Plugin {
  return {
    name: "remove-attributes",
    enforce: "pre",
    transform(code): string {
      const attrs = options ?? ["data-testid"];
      attrs.forEach((attribute) => {
        const regex = new RegExp(
          `(\\s(:|v-bind:)?${attribute}\\s*=\\s*(['"\`])((?:(?!\\3).)*)(\\3))|(\\s(:|v-bind:)?${attribute}(?=[\\s>]))`,
          "gi"
        );
        code = code.replace(regex, "");
      });
      return code;
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), removeAttributes(["data-testid"])],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  base: "./",
});
