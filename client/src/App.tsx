"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { SDK, createDojoStore } from "@dojoengine/sdk";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { RpcProvider, addAddressPadding } from "starknet";
import "./styles/App.css";
import { Models, Schema } from "./bindings";
import { useDojo } from "./useDojo";
import useModel from "./useModel";
import { useSystemCalls } from "./useSystemCalls";
import ControllerConnector from "@cartridge/connector";
import { sepolia } from "@starknet-react/chains";
import {
  StarknetConfig,
  starkscan,
} from "@starknet-react/core";
import cartridgeConnector from "./cartridgeConnector";

export const useDojoStore = createDojoStore<Schema>();
function provider() {
  return new RpcProvider({
    nodeUrl: "https://api.cartridge.gg/x/starknet/sepolia",
  });
}

const connector = new ControllerConnector({
  rpc: "https://api.cartridge.gg/x/starknet/sepolia",
});

type VideoRefType = React.RefObject<HTMLVideoElement>;

function App({ sdk }: { sdk: SDK<Schema> }) {
  const {
    account,
  } = useDojo();
  const state = useDojoStore((state) => state);

  const { playGame } = useSystemCalls();

  const entityId = useMemo(
    () => getEntityIdFromKeys([BigInt(account?.account.address)]),
    [account?.account.address]
  );

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const subscribe = async () => {
      const subscription = await sdk.subscribeEntityQuery(
        {
          dojo_starter: {
            PlayerBalance: {
              $: {
                where: {
                  player: {
                    $is: addAddressPadding(account.account.address),
                  },
                },
              },
            },
            GameOutcome: {
              $: {
                where: {
                  player: {
                    $is: addAddressPadding(account.account.address),
                  },
                },
              },
            },
          },
        },
        (response) => {
          if (response.error) {
            console.error("Error setting up entity sync:", response.error);
          } else if (response.data && response.data[0].entityId !== "0x0") {
            console.log("subscribed", response.data[0]);
            state.updateEntity(response.data[0]);
          }
        },
        { logging: true }
      );

      unsubscribe = () => subscription.cancel();
    };

    subscribe();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [sdk, account?.account.address]);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        await sdk.getEntities(
          {
            dojo_starter: {
              PlayerBalance: {
                $: {
                  where: {
                    player: {
                      $eq: addAddressPadding(account.account.address),
                    },
                  },
                },
              },
              GameOutcome: {
                $: {
                  where: {
                    player: {
                      $eq: addAddressPadding(account.account.address),
                    },
                  },
                },
              },
            },
          },
          (resp) => {
            if (resp.error) {
              console.error("resp.error.message:", resp.error.message);
              return;
            }
            if (resp.data) {
              state.setEntities(resp.data);
            }
          }
        );
      } catch (error) {
        console.error("Error querying entities:", error);
      }
    };

    fetchEntities();
  }, [sdk, account?.account.address]);

  const playerBalance = useModel(entityId, Models.PlayerBalance);
  const gameOutcome = useModel(entityId, Models.GameOutcome);

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [showOutcome, setShowOutcome] = useState<boolean>(false);
  const [outcomeVideo, setOutcomeVideo] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(true);
  const bgVideoRef: VideoRefType = useRef<HTMLVideoElement>(null);

  const handlePlay = async (): Promise<void> => {
    setIsClicked(true);
    setIsHovered(false);

    try {
      // Call playGame system call
      await playGame();
    } catch (error) {
      console.error("Error playing game:", error);
    }
  };

  useEffect(() => {
    if (gameOutcome) {
      const isWin = gameOutcome.won;
      const videoPath = isWin ? "/videos/win.mp4" : "/videos/lose.mp4";
      setOutcomeVideo(videoPath);
      setShowOutcome(true);

      // Update stats from playerBalance
      if (playerBalance) {
        // No need to manually update wins, losses, totalGames; they're displayed directly
      }
    }
  }, [gameOutcome]);

  const handleMouseEnter = (): void => {
    if (!isClicked) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = (): void => {
    setIsHovered(false);
    setIsClicked(false);
  };

  const handleOutcomeEnd = (): void => {
    setShowOutcome(false);
    setOutcomeVideo("");
  };


  const handlePopupConnect = async (): Promise<void> => {
    setShowPopup(false);
    if (bgVideoRef.current) {
      bgVideoRef.current.muted = false;
      bgVideoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
    await connector.connect();
  };

  const renderStatsText = (): string => {
    if (playerBalance) {
      return `Wins - ${playerBalance.wins} \u00A0\u00A0\u00A0\u00A0 Losses - ${playerBalance.losses} \u00A0\u00A0\u00A0\u00A0 Total games played - ${playerBalance.total_games} \u00A0\u00A0\u00A0\u00A0`;
    }
    return "";
  };

  return (
    <StarknetConfig
      autoConnect
      chains={[sepolia]}
      connectors={[cartridgeConnector]}
      explorer={starkscan}
      provider={provider}
    >
      <div className="App">
        <div className="media-container">
          <video
            ref={bgVideoRef}
            className="video-background"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/videos/bg.mp4" type="video/mp4" />
          </video>

          <div className="content-container">
            <img
              src="/images/screen.png"
              alt="Screen"
              className="screen-image"
            />

            <img
              src={isHovered ? "/images/playhover.png" : "/images/play.png"}
              alt="Play Button"
              className="play-button"
            />
            <svg
              className="button-svg"
              viewBox="0 0 2048 1152"
              preserveAspectRatio="xMidYMid slice"
            >
              <g transform="scale(1)" className="svg-group">
                <rect className="button-container" width="2048" height="1152" />
                <path
                  className="button-path"
                  d="M1197,704c0-9.128,5.19-9,9-9h84c5.13,0,11,1.027,11,11v65c0,10.313-8.05,11-11,11h-76c-7.89,0-15-2.564-15-11C1199,761.18,1197,713.128,1197,704Z"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={handlePlay}
                />
              </g>
            </svg>

            <svg
              className="text-window"
              viewBox="0 0 2048 1152"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <clipPath id="text-clip">
                  <path d="M732,694l390,2v76.513H729.7Z" />
                </clipPath>
              </defs>
              <rect className="text-container" width="2048" height="1152" />
              <foreignObject
                x="732"
                y="694"
                width="390"
                height="78.513"
                clipPath="url(#text-clip)"
              >
                <div className="scrolling-text">
                  {[1, 2, 3].map((_, index) => (
                    <span key={index}>{renderStatsText()}</span>
                  ))}
                </div>
              </foreignObject>
            </svg>
          </div>

          {showOutcome && (
            <video
              className="outcome-video"
              autoPlay
              playsInline
              onEnded={handleOutcomeEnd}
            >
              <source src={outcomeVideo} type="video/mp4" />
            </video>
          )}

          {showPopup && (
            <div className="popup-overlay">
              <div className="popup-content">
                <p>Rugged is a high-risk trading simulator.</p>
                <p>Rugged does not offer financial advice.</p>
                <p>Rugged doesn't care if you lose it all!</p>
                <p className="connect-text">
                  Connect wallet below if you are a degenerate gambler.
                </p>
                <button onClick={handlePopupConnect}>
                  I'm a crypto genius!
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </StarknetConfig>
  );
}

export default App;
