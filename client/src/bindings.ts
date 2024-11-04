interface PlayerBalance {
    fieldOrder: string[];
    player: string;
    balance: bigint;
    total_games: number;
    wins: number;
    losses: number;
}

interface PlatformFees {
    fieldOrder: string[];
    admin: string;
    fee_percentage: number;
}

interface GameOutcome {
    fieldOrder: string[];
    player: string;
    won: boolean;
    amount_won: bigint;
}

type Schema = {
    dojo_starter: {
        PlayerBalance: PlayerBalance;
        PlatformFees: PlatformFees;
        GameOutcome: GameOutcome;
    };
};

enum Models {
    PlayerBalance = "dojo_starter-PlayerBalance",
    PlatformFees = "dojo_starter-PlatformFees",
    GameOutcome = "dojo_starter-GameOutcome",
}

const schema: Schema = {
    dojo_starter: {
        PlayerBalance: {
            fieldOrder: ["player", "balance", "total_games", "wins", "losses"],
            player: "" as string,
            balance: BigInt(0),
            total_games: 0,
            wins: 0,
            losses: 0,
        },
        PlatformFees: {
            fieldOrder: ["admin", "fee_percentage"],
            admin: "" as string,
            fee_percentage: 0,
        },
        GameOutcome: {
            fieldOrder: ["player", "won", "amount_won"],
            player: "" as string,
            won: false,
            amount_won: BigInt(0),
        },
    },
};

export type { Schema, PlayerBalance, PlatformFees, GameOutcome };
export { schema, Models };