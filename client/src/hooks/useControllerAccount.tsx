"use client";

import { useEffect, useState } from "react";
import ControllerConnector from "@cartridge/connector";
import { ControllerOptions } from "@cartridge/controller";

const contract_address = "0x101face0e6e0f12425056a53fb84f0c7b55863bbff22c0e2a0cfa82836c0067";

const useControllerAccount = () => {
  const [connector, setConnector] = useState<ControllerConnector | null>(null);
  const [userAccountController, setUserAccount] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const controllerOptions: ControllerOptions = {
      policies: [
        {
          target: contract_address,
          method: "play_game",
          description: "Play the game",
        },
      ],
      rpc: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
      theme: "scaffold-stark",
      colorMode: "dark",
    };

    const controllerConnector = new ControllerConnector(controllerOptions);
    setConnector(controllerConnector);
  }, []);

  const handleConnect = async () => {
    if (!connector) return;

    try {
      const account = await connector.controller.connect();
      if (account) {
        setUserAccount(account.address);
        setIsConnected(true);

        const name = await connector.controller.username();
        setUserName(name || null);
      }
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  const handleDisconnect = async () => {
    if (!connector) return;

    try {
      await connector.controller.disconnect();
      setUserAccount(null);
      setUserName(null);
      setIsConnected(false);
      console.log("Disconnected successfully.");
    } catch (error) {
      console.error("Disconnection error:", error);
    }
  };

  return {
    userAccountController,
    userName,
    isConnected,
    handleConnect,
    handleDisconnect,
  };
};

export default useControllerAccount;
