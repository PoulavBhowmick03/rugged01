import { useDojo } from './useDojo';
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojoStore } from "../App";
import { v4 as uuidv4 } from "uuid";
import { Account } from 'starknet';

export const useSystemCalls = () => {
    const state = useDojoStore((state) => state);

    const {
        setup: { setupWorld },
        account: { account },
    } = useDojo();


    // const generateEntityId = () => {
    //     return getEntityIdFromKeys([BigInt(account?.address)]);
    // };

    const initializePlatformFees = async (feePercentage: number) => {
        try {
            (await setupWorld).rugged.initializePlatformFees(account, feePercentage);
            console.log("Platform fees initialized successfully");
        } catch (error) {
            console.error("Error initializing platform fees:", error);
            throw error;
        }
    };

    const playGame = async (account: Account) => {
        // const entityId = generateEntityId();
        const transactionId = uuidv4();
        // const betAmount = BigInt(100);

        // state.applyOptimisticUpdate(transactionId, (draft) => {
        //     if (draft.entities[entityId]?.models?.dojo_starter?.PlayerBalance) {
        //         const playerBalance = draft.entities[entityId].models.dojo_starter.PlayerBalance;
        //         if (playerBalance.balance !== undefined) {
        //             playerBalance.balance -= Number(betAmount);
        //         }
        //         playerBalance.total_games = (playerBalance.total_games ?? 0) + 1;
        //     }
        // });

        try {
            await (await (setupWorld)).rugged.playGame(account);

            // await state.waitForEntityChange(entityId, (entity) => {
            //     return (entity?.models?.dojo_starter?.PlayerBalance?.total_games ?? 0) > 0;
            // });
        } catch (error) {
            // state.revertOptimisticUpdate(transactionId);
            // console.error("Error executing play_game:", error);
            throw new Error(`Errror executing play_game: ${error}`);
        } finally {
            state.confirmTransaction(transactionId);
        }
    };

    return {
        initializePlatformFees,
        playGame,
    };
};