import type { SchemaType } from "@dojoengine/sdk";

// Type definition for `dojo_starter::models::GameOutcome` struct
export interface GameOutcome {
	fieldOrder: string[];
	player: string;
	won: boolean;
	amount_won: number;
}

// Type definition for `dojo_starter::models::GameOutcomeValue` struct
export interface GameOutcomeValue {
	fieldOrder: string[];
	won: boolean;
	amount_won: number;
}

// Type definition for `dojo_starter::models::PlatformFees` struct
export interface PlatformFees {
	fieldOrder: string[];
	admin: string;
	fee_percentage: number;
}

// Type definition for `dojo_starter::models::PlatformFeesValue` struct
export interface PlatformFeesValue {
	fieldOrder: string[];
	fee_percentage: number;
}

// Type definition for `dojo_starter::models::PlayerBalance` struct
export interface PlayerBalance {
	fieldOrder: string[];
	player: string;
	balance: number;
	total_games: number;
	wins: number;
	losses: number;
}

// Type definition for `dojo_starter::models::PlayerBalanceValue` struct
export interface PlayerBalanceValue {
	fieldOrder: string[];
	balance: number;
	total_games: number;
	wins: number;
	losses: number;
}

export interface DojoStarterSchemaType extends SchemaType {
	dojo_starter: {
		GameOutcome: GameOutcome,
		GameOutcomeValue: GameOutcomeValue,
		PlatformFees: PlatformFees,
		PlatformFeesValue: PlatformFeesValue,
		PlayerBalance: PlayerBalance,
		PlayerBalanceValue: PlayerBalanceValue,
		ERC__Balance: ERC__Balance,
		ERC__Token: ERC__Token,
		ERC__Transfer: ERC__Transfer,
	},
}
export const schema: DojoStarterSchemaType = {
	dojo_starter: {
		GameOutcome: {
			fieldOrder: ['player', 'won', 'amount_won'],
			player: "",
			won: false,
			amount_won: 0,
		},
		GameOutcomeValue: {
			fieldOrder: ['won', 'amount_won'],
			won: false,
			amount_won: 0,
		},
		PlatformFees: {
			fieldOrder: ['admin', 'fee_percentage'],
			admin: "",
			fee_percentage: 0,
		},
		PlatformFeesValue: {
			fieldOrder: ['fee_percentage'],
			fee_percentage: 0,
		},
		PlayerBalance: {
			fieldOrder: ['player', 'balance', 'total_games', 'wins', 'losses'],
			player: "",
			balance: 0,
			total_games: 0,
			wins: 0,
			losses: 0,
		},
		PlayerBalanceValue: {
			fieldOrder: ['balance', 'total_games', 'wins', 'losses'],
			balance: 0,
			total_games: 0,
			wins: 0,
			losses: 0,
		},
		ERC__Balance: {
			fieldOrder: ['balance', 'type', 'tokenmetadata'],
			balance: '',
			type: 'ERC20',
			tokenMetadata: {
				fieldOrder: ['name', 'symbol', 'tokenId', 'decimals', 'contractAddress'],
				name: '',
				symbol: '',
				tokenId: '',
				decimals: '',
				contractAddress: '',
			},
		},
		ERC__Token: {
			fieldOrder: ['name', 'symbol', 'tokenId', 'decimals', 'contractAddress'],
			name: '',
			symbol: '',
			tokenId: '',
			decimals: '',
			contractAddress: '',
		},
		ERC__Transfer: {
			fieldOrder: ['from', 'to', 'amount', 'type', 'executed', 'tokenMetadata'],
			from: '',
			to: '',
			amount: '',
			type: 'ERC20',
			executedAt: '',
			tokenMetadata: {
				fieldOrder: ['name', 'symbol', 'tokenId', 'decimals', 'contractAddress'],
				name: '',
				symbol: '',
				tokenId: '',
				decimals: '',
				contractAddress: '',
			},
			transactionHash: '',
		},

	},
};
// Type definition for ERC__Balance struct
export type ERC__Type = 'ERC20' | 'ERC721';
export interface ERC__Balance {
    fieldOrder: string[];
    balance: string;
    type: string;
    tokenMetadata: ERC__Token;
}
export interface ERC__Token {
    fieldOrder: string[];
    name: string;
    symbol: string;
    tokenId: string;
    decimals: string;
    contractAddress: string;
}
export interface ERC__Transfer {
    fieldOrder: string[];
    from: string;
    to: string;
    amount: string;
    type: string;
    executedAt: string;
    tokenMetadata: ERC__Token;
    transactionHash: string;
}