// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";
// import topLevelAwait from "vite-plugin-top-level-await";
// import wasm from "vite-plugin-wasm";
// import fs from 'fs';

// export default defineConfig({
//     plugins: [react(), wasm(), topLevelAwait()],
//     server: {
//         port: 5173,
//         https: {
//             key: fs.readFileSync('localhost+2-key.pem'),
//             cert: fs.readFileSync('localhost+2.pem'),
//         },
//     },
// });


// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";
// import topLevelAwait from "vite-plugin-top-level-await";
// import wasm from "vite-plugin-wasm";

// // https://vitejs.dev/config/
// export default defineConfig({
//     plugins: [react(), wasm(), topLevelAwait()],
// });

import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";
import mkcert from 'vite-plugin-mkcert'
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

export default defineConfig({
    plugins: [react(), wasm(), topLevelAwait(), mkcert()],
    server: {
        port: 5173,
        // no need to specify certificate files, mkcert will handle it
    },
});