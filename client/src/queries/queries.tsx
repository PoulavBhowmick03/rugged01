import { addAddressPadding } from "starknet";

export const queryEntities = (accountAddress: string) => {
    return {
        dojo_starter: {
            PlayerBalance: {
                $: {
                    where: {
                        player: {
                            $eq: addAddressPadding(accountAddress),
                        },
                    },
                },
            },
            GameOutcome: {
                $: {
                    where: {
                        player: {
                            $eq: addAddressPadding(accountAddress),
                        },
                    },
                },
            },
        },
    };
};

export const subscribeEntities = (accountAddress: string) => {
    return {
        dojo_starter: {
            PlayerBalance: {
                $: {
                    where: {
                        player: {
                            $is: addAddressPadding(accountAddress),
                        },
                    },
                },
            },
            GameOutcome: {
                $: {
                    where: {
                        player: {
                            $is: addAddressPadding(accountAddress),
                        },
                    },
                },
            },
        },
    };
};
