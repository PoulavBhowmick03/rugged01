"use client";
import React, { useState, useRef } from "react";
import { useEffect, useMemo } from "react";
import { SDK, createDojoStore } from "@dojoengine/sdk";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { RpcProvider, addAddressPadding } from "starknet";
import "./styles/App.css"
import { Models, Schema } from "./bindings.ts";
import { useDojo } from "./useDojo.tsx";
import useModel from "./useModel.tsx";
import { useSystemCalls } from "./useSystemCalls.ts";
import ControllerConnector from "@cartridge/connector";
import { Chain, sepolia } from "@starknet-react/chains";
import { StarknetConfig, starkscan , jsonRpcProvider} from "@starknet-react/core";

export const useDojoStore = createDojoStore<Schema>();
function provider(chain: Chain) {
    return new RpcProvider({
      nodeUrl: "https://api.cartridge.gg/x/starknet/sepolia",
    });
  }
  
  const ETH_TOKEN_ADDRESS =
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
  
  const connector = new ControllerConnector({
    policies: [
      {
        target: ETH_TOKEN_ADDRESS,
        method: "approve",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      },
      {
        target: ETH_TOKEN_ADDRESS,
        method: "transfer",
      },
      // Add more policies as needed
    ],
    rpc: "https://api.cartridge.gg/x/starknet/sepolia",
    // Uncomment to use a custom theme
    // theme: "dope-wars",
    // colorMode: "light"
  });
  
  interface GameStats {
    wins: number;
    losses: number;
    totalGames: number;
  }
  
  type VideoRefType = React.RefObject<HTMLVideoElement>;
  
function App({ sdk }: { sdk: SDK<Schema> }) {
    // const {
    //     account,
    //     setup: { client },
    // } = useDojo();
    // const state = useDojoStore((state) => state);
    // const entities = useDojoStore((state) => state.entities);

    // const { spawn } = useSystemCalls();

    // const entityId = useMemo(
    //     () => getEntityIdFromKeys([BigInt(account?.account.address)]),
    //     [account?.account.address]
    // );

    // useEffect(() => {
    //     let unsubscribe: (() => void) | undefined;

    //     const subscribe = async () => {
    //         const subscription = await sdk.subscribeEntityQuery(
    //             {
    //                 dojo_starter: {
    //                     Moves: {
    //                         $: {
    //                             where: {
    //                                 player: {
    //                                     $is: addAddressPadding(
    //                                         account.account.address
    //                                     ),
    //                                 },
    //                             },
    //                         },
    //                     },
    //                     Position: {
    //                         $: {
    //                             where: {
    //                                 player: {
    //                                     $is: addAddressPadding(
    //                                         account.account.address
    //                                     ),
    //                                 },
    //                             },
    //                         },
    //                     },
    //                 },
    //             },
    //             (response) => {
    //                 if (response.error) {
    //                     console.error(
    //                         "Error setting up entity sync:",
    //                         response.error
    //                     );
    //                 } else if (
    //                     response.data &&
    //                     response.data[0].entityId !== "0x0"
    //                 ) {
    //                     console.log("subscribed", response.data[0]);
    //                     state.updateEntity(response.data[0]);
    //                 }
    //             },
    //             { logging: true }
    //         );

    //         unsubscribe = () => subscription.cancel();
    //     };

    //     subscribe();

    //     return () => {
    //         if (unsubscribe) {
    //             unsubscribe();
    //         }
    //     };
    // }, [sdk, account?.account.address]);

    // useEffect(() => {
    //     const fetchEntities = async () => {
    //         try {
    //             await sdk.getEntities(
    //                 {
    //                     dojo_starter: {
    //                         Moves: {
    //                             $: {
    //                                 where: {
    //                                     player: {
    //                                         $eq: addAddressPadding(
    //                                             account.account.address
    //                                         ),
    //                                     },
    //                                 },
    //                             },
    //                         },
    //                     },
    //                 },
    //                 (resp) => {
    //                     if (resp.error) {
    //                         console.error(
    //                             "resp.error.message:",
    //                             resp.error.message
    //                         );
    //                         return;
    //                     }
    //                     if (resp.data) {
    //                         state.setEntities(resp.data);
    //                     }
    //                 }
    //             );
    //         } catch (error) {
    //             console.error("Error querying entities:", error);
    //         }
    //     };

    //     fetchEntities();
    // }, [sdk, account?.account.address]);

    // const moves = useModel(entityId, Models.Moves);
    // const position = useModel(entityId, Models.Position);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isClicked, setIsClicked] = useState<boolean>(false);
    const [showOutcome, setShowOutcome] = useState<boolean>(false);
    const [outcomeVideo, setOutcomeVideo] = useState<string>("");
    const [showPopup, setShowPopup] = useState<boolean>(true);
    const [wins, setWins] = useState<number>(0);
    const [losses, setLosses] = useState<number>(0);
    const [totalGames, setTotalGames] = useState<number>(0);
    const [pendingWin, setPendingWin] = useState<boolean>(false);
    const bgVideoRef: VideoRefType = useRef<HTMLVideoElement>(null);
  
    const handleClick = (): void => {
        setIsClicked(true);
        setIsHovered(false);
        const random: number = Math.random();
        const isWin: boolean = random <= 0.3;
        const videoPath: string = isWin ? "/videos/win.mp4" : "/videos/lose.mp4";
        setOutcomeVideo(videoPath);
        setShowOutcome(true);
        setPendingWin(isWin);
      };
    
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
        if (pendingWin) {
          setWins((prev) => prev + 1);
        } else {
          setLosses((prev) => prev + 1);
        }
        setTotalGames((prev) => prev + 1);
    
        setShowOutcome(false);
        setOutcomeVideo("");
        setPendingWin(false);
      };
    
      const handlePopupClose = (): void => {
        setShowPopup(false);
        if (bgVideoRef.current) {
          bgVideoRef.current.muted = false;
          bgVideoRef.current.play().catch((error) => {
            console.error("Error playing video:", error);
          });
        }
      };
    
      const handlePopupConnect = (): void => {
        setShowPopup(false);
        if (bgVideoRef.current) {
          bgVideoRef.current.muted = false;
          bgVideoRef.current.play().catch((error) => {
            console.error("Error playing video:", error);
          });
        }
        connector.connect();
      };
    
      const renderStatsText = ({ wins, losses, totalGames }: GameStats): string => {
        return `Wins - ${wins} \u00A0\u00A0\u00A0\u00A0 Losses - ${losses} \u00A0\u00A0\u00A0\u00A0 Total games played - ${totalGames} \u00A0\u00A0\u00A0\u00A0`;
      };
    
    // return (
    //     <div className="bg-black min-h-screen w-full p-4 sm:p-8">
    //         <div className="max-w-7xl mx-auto">
    //             <button
    //                 className="mb-4 px-4 py-2 bg-blue-600 text-white text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors duration-300"
    //                 onClick={() => account?.create()}
    //             >
    //                 {account?.isDeploying
    //                     ? "Deploying Burner..."
    //                     : "Create Burner"}
    //             </button>

    //             <div className="bg-gray-800 shadow-md rounded-lg p-4 sm:p-6 mb-6 w-full max-w-md">
    //                 <div className="text-lg sm:text-xl font-semibold mb-4 text-white">{`Burners Deployed: ${account.count}`}</div>
    //                 <div className="mb-4">
    //                     <label
    //                         htmlFor="signer-select"
    //                         className="block text-sm font-medium text-gray-300 mb-2"
    //                     >
    //                         Select Signer:
    //                     </label>
    //                     <select
    //                         id="signer-select"
    //                         className="w-full px-3 py-2 text-base text-gray-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                         value={account ? account.account.address : ""}
    //                         onChange={(e) => account.select(e.target.value)}
    //                     >
    //                         {account?.list().map((account, index) => (
    //                             <option value={account.address} key={index}>
    //                                 {account.address}
    //                             </option>
    //                         ))}
    //                     </select>
    //                 </div>
    //                 <button
    //                     className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 text-base rounded transition duration-300 ease-in-out"
    //                     onClick={() => account.clear()}
    //                 >
    //                     Clear Burners
    //                 </button>
    //             </div>

    //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
    //                 <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
    //                     <div className="grid grid-cols-3 gap-2 w-full h-48">
    //                         <div className="col-start-2">
    //                             <button
    //                                 className="h-12 w-12 bg-gray-600 rounded-full shadow-md active:shadow-inner active:bg-gray-500 focus:outline-none text-2xl font-bold text-gray-200"
    //                                 onClick={async () => await spawn()}
    //                             >
    //                                 +
    //                             </button>
    //                         </div>
    //                         <div className="col-span-3 text-center text-base text-white">
    //                             Moves Left:{" "}
    //                             {moves ? `${moves.remaining}` : "Need to Spawn"}
    //                         </div>
    //                         <div className="col-span-3 text-center text-base text-white">
    //                             {position
    //                                 ? `x: ${position?.vec?.x}, y: ${position?.vec?.y}`
    //                                 : "Need to Spawn"}
    //                         </div>
    //                         <div className="col-span-3 text-center text-base text-white">
    //                             {moves && moves.last_direction}
    //                         </div>
    //                     </div>
    //                 </div>

    //                 <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
    //                     <div className="grid grid-cols-3 gap-2 w-full h-48">
    //                         {[
    //                             {
    //                                 direction: "Up" as const,
    //                                 label: "↑",
    //                                 col: "col-start-2",
    //                             },
    //                             {
    //                                 direction: "Left" as const,
    //                                 label: "←",
    //                                 col: "col-start-1",
    //                             },
    //                             {
    //                                 direction: "Right" as const,
    //                                 label: "→",
    //                                 col: "col-start-3",
    //                             },
    //                             {
    //                                 direction: "Down" as const,
    //                                 label: "↓",
    //                                 col: "col-start-2",
    //                             },
    //                         ].map(({ direction, label, col }) => (
    //                             <button
    //                                 className={`${col} h-12 w-12 bg-gray-600 rounded-full shadow-md active:shadow-inner active:bg-gray-500 focus:outline-none text-2xl font-bold text-gray-200`}
    //                                 key={direction}
    //                                 onClick={async () => {
    //                                     await client.actions.move({
    //                                         account: account.account,
    //                                         direction: { type: direction },
    //                                     });
    //                                 }}
    //                             >
    //                                 {label}
    //                             </button>
    //                         ))}
    //                     </div>
    //                 </div>
    //             </div>

    //             <div className="mt-8 overflow-x-auto">
    //                 <table className="w-full border-collapse border border-gray-700">
    //                     <thead>
    //                         <tr className="bg-gray-800 text-white">
    //                             <th className="border border-gray-700 p-2">
    //                                 Entity ID
    //                             </th>
    //                             <th className="border border-gray-700 p-2">
    //                                 Player
    //                             </th>
    //                             <th className="border border-gray-700 p-2">
    //                                 Position X
    //                             </th>
    //                             <th className="border border-gray-700 p-2">
    //                                 Position Y
    //                             </th>
    //                             <th className="border border-gray-700 p-2">
    //                                 Can Move
    //                             </th>
    //                             <th className="border border-gray-700 p-2">
    //                                 Last Direction
    //                             </th>
    //                             <th className="border border-gray-700 p-2">
    //                                 Remaining Moves
    //                             </th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>
    //                         {Object.entries(entities).map(
    //                             ([entityId, entity]) => {
    //                                 const position =
    //                                     entity.models.dojo_starter.Position;
    //                                 const moves =
    //                                     entity.models.dojo_starter.Moves;

    //                                 return (
    //                                     <tr
    //                                         key={entityId}
    //                                         className="text-gray-300"
    //                                     >
    //                                         <td className="border border-gray-700 p-2">
    //                                             {entityId}
    //                                         </td>
    //                                         <td className="border border-gray-700 p-2">
    //                                             {position?.player ?? "N/A"}
    //                                         </td>
    //                                         <td className="border border-gray-700 p-2">
    //                                             {position?.vec?.x ?? "N/A"}
    //                                         </td>
    //                                         <td className="border border-gray-700 p-2">
    //                                             {position?.vec?.y ?? "N/A"}
    //                                         </td>
    //                                         <td className="border border-gray-700 p-2">
    //                                             {moves?.can_move?.toString() ??
    //                                                 "N/A"}
    //                                         </td>
    //                                         <td className="border border-gray-700 p-2">
    //                                             {moves?.last_direction ?? "N/A"}
    //                                         </td>
    //                                         <td className="border border-gray-700 p-2">
    //                                             {moves?.remaining ?? "N/A"}
    //                                         </td>
    //                                     </tr>
    //                                 );
    //                             }
    //                         )}
    //                     </tbody>
    //                 </table>
    //             </div>
    //         </div>
    //     </div>
    // );

    return (
        <StarknetConfig
          autoConnect
          chains={[sepolia]}
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
                      onClick={() => connector.connect()} // Updated to connect on click
                    />
                    {/* Removed the nested button */}
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
                        <span key={index}>
                          {renderStatsText({ wins, losses, totalGames })}
                        </span>
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
                    <p>Rugged is a high risk trading simulator.</p>
                    <p>Rugged does not offer financial advice.</p>
                    <p>Rugged don't give a fuq if you lose it all!</p>
                    <p className="connect-text">
                      Connect wallet below if you are a degenerate gambler.
                    </p>
                    <button onClick={handlePopupConnect}>
                      I'm a cripto jeenyus!
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
