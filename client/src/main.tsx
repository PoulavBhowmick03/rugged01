import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

import "./index.css";
import { init } from "@dojoengine/sdk";
import { DojoStarterSchemaType, schema } from "./bindings/models.gen.ts";
import { dojoConfig } from "../dojoConfig.ts";
import { DojoContextProvider } from "./DojoContext.tsx";
import { setupBurnerManager } from "@dojoengine/create-burner";

async function main() {
    const sdk = await init<DojoStarterSchemaType>(
        {
            client: {
                rpcUrl: dojoConfig.rpcUrl,
                toriiUrl: dojoConfig.toriiUrl,
                relayUrl: dojoConfig.relayUrl,
                worldAddress: dojoConfig.manifest.world.address,
            },
            domain: {
                name: "dojo_starter-rugged",
                version: "1.0",
                chainId: "KATANA",
                revision: "1",
            },
        },
        schema
    );

    createRoot(document.getElementById("root")!).render(
        <StrictMode>
            <DojoContextProvider
                burnerManager={await setupBurnerManager(dojoConfig)}
            >
                <App sdk={sdk} />
            </DojoContextProvider>
        </StrictMode>
    );
}

main().catch((error) => {
    console.error("Failed to initialize the application:", error);
});
