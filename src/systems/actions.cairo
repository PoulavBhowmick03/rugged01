use dojo_starter::models::PlayerBalance;
use dojo_starter::models::PlatformFees;
use dojo_starter::models::GameOutcome;

// define the interface
#[starknet::interface]
trait IHitThePlay<T> {
    fn initialize_platform_fees(ref self: T, fee_percentage: u8);
    fn play_game(ref self: T, bet_amount: u128);
}

// dojo decorator
#[dojo::contract]
pub mod rugged {
    use starknet::{ContractAddress, get_caller_address};
    use dojo_starter::models::{PlayerBalance, PlatformFees, GameOutcome};
    use core::traits::TryInto;

    use dojo::model::{ModelStorage, ModelValueStorage};
    use dojo::event::EventStorage;
    use super::IHitThePlay;

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub enum Event {
        GamePlayed: GamePlayed,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct GamePlayed {
        #[key]
        player: ContractAddress,
        result: bool, // True if won, False if lost
        amount: u128, // Amount won/lost
    }


    // // Initializes platform fees
    // fn initialize_platform_fees(ref self: ContractState, fee_percentage: u8) {
    //     let admin = get_caller_address();
    //     let mut world = self.world(@"dojo_starter");

    //     // Create and set platform fees
    //     set!(world, (PlatformFees { admin, fee_percentage, }));
    // }

    // Main game logic where the player bets and plays.
    fn play_game(ref self: ContractState, bet_amount: u128) {
        let player = get_caller_address();
        let mut world = self.world(@"dojo_starter");

        // Get player balance or initialize new one
        let mut player_balance :PlayerBalance = world.read_model(player);

        // Ensure the player has enough balance
        assert(player_balance.balance >= bet_amount, 'Insufficient balance');

        // Deduct bet amount from player balance
        player_balance.balance -= bet_amount;
        player_balance.total_games += 1;

        // Generate pseudo-random number using block timestamp and player address
        let block_timestamp = starknet::get_block_timestamp();
        let seed = pedersen::hash(block_timestamp.into(), player.into());
        let random_value = seed % 10;

        // 30% chance to win (values 0,1,2 represent win)
        let won = random_value < 3;

        let mut amount_won: u128 = 0;
        if won {
            // Get platform fees
            let fees = 100;
            let fee_percentage: u128 = fees.fee_percentage.into();
            let fee_deduction = (bet_amount * fee_percentage) / 100;
            amount_won = bet_amount * 2 - fee_deduction; // Double the bet minus fees

            // Update player stats
            player_balance.balance += amount_won;
            player_balance.wins += 1;
        } else {
            player_balance.losses += 1;
        }

        // Update world state
        let game_outcome = GameOutcome {
            player: player,
            won: won,
            amount_won: amount_won,
        };
        world.write_model(@game_outcome);

        let player_balance = PlayerBalance {
            player: player,
            balance: player_balance.balance,
            total_games: player_balance.total_games,
            wins: player_balance.wins,
            losses: player_balance.losses,
        };
        world.write_model(@player_balance);

        // Emit game played event
        self.emit(GamePlayed { player, result: won, amount: amount_won });
    }
}
