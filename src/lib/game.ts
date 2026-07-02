import { Deck } from './deck';
import { Player, type PlayerAction } from './player.svelte';
import type { WinState } from './types.svelte';
import { sleep } from './utils';

// NOTE: this is not a class so we have full reactivity
export interface GameState {
    dealer: Player;
    players: Player[];
    deck: Deck;
    stage: 'new' | 'play' | 'score';
    turn: 'dealer' | number;
}

const dealerTurn = async (game: GameState) => {
    while (true) {
        const value = game.dealer.finalValue();
        if (value === 'bust' || value > 17) {
            break;
        }
        await sleep(100);
        game.dealer.hand.push(game.deck.takeCard()!);
    }
    game.stage = 'score';
};

const nextTurn = (game: GameState) => {
    // if we are on the last player, go to the dealer
    if (game.turn === game.players.length - 1) {
        game.turn = 'dealer';
        dealerTurn(game);
        return;
    }

    // reset calls nextTurn in this state.  It shouldn't happen in any other case
    if (game.turn === 'dealer') {
        game.turn = 0;
    } else {
        // otherwise, just add one
        game.turn += 1;
    }

    // if the new player has blackjack, then we move on
    if (game.players[game.turn].hasBlackjack()) {
        nextTurn(game);
    }
};

/**
 * Reset the game back to a clean state, removing and re-dealing cards
 */
export const resetGame = (game: GameState) => {
    game.deck = new Deck(2);
    game.dealer = new Player('Dealer');
    for (const player of game.players) {
        player.hand = [];
    }
    game.turn = 'dealer';
    game.stage = 'play';

    game.deck.shuffle();

    // deal cards in a circle (dealer -> players -> dealer -> players)
    game.dealer.hand.push(game.deck.takeCard()!);
    for (const player of game.players) {
        player.hand.push(game.deck.takeCard()!);
    }
    game.dealer.hand.push(game.deck.takeCard()!);
    for (const player of game.players) {
        player.hand.push(game.deck.takeCard()!);
    }

    // switch to player 0
    nextTurn(game);
};

export const onPlayerAction = (game: GameState, action: PlayerAction, playerIndex: number) => {
    const player = game.players[playerIndex];
    switch (action) {
        case 'hit':
            {
                player.hand.push(game.deck.takeCard()!);
                if (player.hasBusted()) {
                    nextTurn(game);
                }
            }
            break;
        case 'stay':
            {
                nextTurn(game);
            }
            break;
        case 'double-down':
            {
                player.hand.push(game.deck.takeCard()!);
                // TODO: bets
                nextTurn(game);
            }
            break;
    }
};

export const getPlayerWinState = (game: GameState, player: Player): WinState => {
    if (player.hasBlackjack()) return 'blackjack';

    if (player.hasBusted()) return 'lose';
    if (game.dealer.hasBusted()) return 'win';

    // if the game is still running, then we don't know what the final state is
    if (game.stage !== 'score') return undefined;

    if (game.dealer.finalValue() === player.finalValue()) return 'push';

    return player.finalValue() > game.dealer.finalValue() ? 'win' : 'lose';
};
