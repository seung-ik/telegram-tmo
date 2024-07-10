import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
// import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
    // viteStaticCopy({
    //   targets: [
    //     {
    //       src: "src/game/**/*", // 복사할 파일들의 경로
    //       dest: "public/game-files", // 복사된 파일들이 저장될 목적지
    //     },
    //   ],
    // }),
  ],

  base: "/telegram-tmo/",
  build: {
    rollupOptions: {},
  },
});
