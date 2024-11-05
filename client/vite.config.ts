// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";
// import topLevelAwait from "vite-plugin-top-level-await";
// import wasm from "vite-plugin-wasm";
// import fs from 'fs';
// import mkcert from'vite-plugin-mkcert'

// export default defineConfig({
//     plugins: [react(), wasm(), topLevelAwait()],
//     server: {
//         port: 5173,
//         https: {
//             key: fs.readFileSync('localhost+2-key.pem'),   // updated filename
//             cert: fs.readFileSync('localhost+2.pem'),      // updated filename
//         },
//     },
// });
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), wasm(), topLevelAwait()],
});
