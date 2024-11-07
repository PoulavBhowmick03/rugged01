import { useContext } from 'react';
import { DojoContext } from './DojoContext';
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojoStore } from "./App";
import { v4 as uuidv4 } from "uuid";

export const useSystemCalls = () => {
    const context = useContext(DojoContext);
    if (!context) {
        throw new Error('useSystemCalls must be used within a DojoContextProvider');
    }

    const { systemCalls, account } = context;
    const state = useDojoStore((state) => state);

    const generateEntityId = () => {
        return getEntityIdFromKeys([BigInt(account.account.address)]);
    };

    const initializePlatformFees = async (feePercentage: number) => {
        try {
            await systemCalls.rugged.initializePlatformFees(account.account, feePercentage);
            console.log("Platform fees initialized successfully");
        } catch (error) {
            console.error("Error initializing platform fees:", error);
            throw error;
        }
    };

    const playGame = async () => {
        const entityId = generateEntityId();
        const transactionId = uuidv4();
        const betAmount = BigInt(100);
        // Apply an optimistic update to the state
        state.applyOptimisticUpdate(transactionId, (draft) => {
            if (draft.entities[entityId]?.models?.dojo_starter?.PlayerBalance) {
                const playerBalance = draft.entities[entityId].models.dojo_starter.PlayerBalance;
                if (playerBalance.balance !== undefined) {
                    playerBalance.balance -= betAmount;
                }
                playerBalance.total_games = (playerBalance.total_games ?? 0) + 1;
            }
        });

        try {
            await systemCalls.rugged.playGame(account.account);

            // Wait for the entity to be updated with the new state
            await state.waitForEntityChange(entityId, (entity) => {
                return (entity?.models?.dojo_starter?.PlayerBalance?.total_games ?? 0) > 0;
            });
        } catch (error) {
            state.revertOptimisticUpdate(transactionId);
            console.error("Error executing play_game:", error);
            throw error;
        } finally {
            state.confirmTransaction(transactionId);
        }
    };

    return {
        initializePlatformFees,
        playGame,
    };
};