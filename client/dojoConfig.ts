import { createDojoConfig } from "@dojoengine/core";

import manifest from "../contracts/manifest_dev.json";

export const dojoConfig = createDojoConfig({
    manifest,
    rpcUrl: `https://api.cartridge.gg/x/rugged/katana`,
    toriiUrl: `https://api.cartridge.gg/x/rugged-torii/torii`,
    // relayUrl: `/dns4/api.cartridge.gg/tcp/443/x-parity-wss/%2Fx%2F$rugged-torii%2Ftorii%2Fwss`,
});
