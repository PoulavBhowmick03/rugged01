import { DojoProvider } from "@dojoengine/core";
import { Account } from "starknet";
import * as models from "./models.gen";

export async function setupWorld(provider: DojoProvider) {

	const rugged_initializePlatformFees = async (account: Account, feePercentage: number) => {
		try {
			return await provider.execute(
				account,
				{
					contractName: "rugged",
					entryPoint: "initialize_platform_fees",
					calldata: [feePercentage],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const rugged_playGame = async (account: Account) => {
		try {
			return await provider.execute(
				account,
				{
					contractName: "rugged",
					entryPoint: "play_game",
					calldata: [],
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	return {
		rugged: {
			initializePlatformFees: rugged_initializePlatformFees,
			playGame: rugged_playGame,
		},
	};
}