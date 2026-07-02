<script lang="ts">
	import NewGame from "$lib/components/NewGame.svelte";
	import * as Card from '$lib/components/ui/card';

	import { type WinState } from "$lib/types.svelte";
    import { Deck } from '$lib/deck';
	import PlayerCard from "$lib/components/PlayerCard.svelte";
	import { onMount } from "svelte";
	import { Button } from "$lib/components/ui/button";
	import { Player, type PlayerAction } from "$lib/player.svelte";

    let playerNames = $state<string[]>(['foo', 'bar']);

    // TODO: use pages for this
    let stage: 'new' | 'play' | 'score' = $state('new');

    let dealer = $state<Player>(new Player('Dealer'));
    let players = $state<Player[]>([]);
    let deck = $state<Deck>(new Deck(2));
    let turn = $state<'dealer' | number>(0);

    const sleep = (millis: number) => new Promise<void>(res => setTimeout(() => res(), millis));

    const onstart = () => {
        players = playerNames.map(name => new Player(name));
        stage = 'play';

        reset();
    };

    const dealerTurn = async () => {
        while (true) {
            const value = dealer.finalValue();
            if (value === 'bust' || value > 17) {
                break;
            }
            await sleep(100);
            dealer.hand.push(deck.takeCard()!);
        }
        stage = 'score';
    };

    const nextTurn = () => {
        // if we are on the last player, go to the dealer
        if (turn === players.length - 1) {
            turn = 'dealer';
            dealerTurn();
            return;
        }

        // reset calls nextTurn in this state.  It shouldn't happen in any other case
        if (turn === 'dealer') {
            turn = 0;
        } else {
            // otherwise, just add one
            turn += 1;
        }

        // if the new player has blackjack, then we move on
        if (players[turn].hasBlackjack()) {
            nextTurn();
        }
    };

    const onPlayerAction = (action: PlayerAction, playerIndex: number) => {
        const player = players[playerIndex];
        switch (action) {
            case 'hit': {
                player.hand.push(deck.takeCard()!);
                if (player.hasBusted()) {
                    nextTurn();
                }
            }; break;
            case 'stay': {
                nextTurn();
            }; break;
            case 'double-down': {
                player.hand.push(deck.takeCard()!);
                // TODO: bets
                nextTurn();
            }; break;
        }
    };

    const getPlayerWinState = (player: Player): WinState => {
        if (player.hasBlackjack()) return 'blackjack';

        if (player.hasBusted()) return 'lose';
        if (dealer.hasBusted()) return 'win';

        // if the game is still running, then we don't know what the final state is
        if (stage !== 'score') return undefined;

        if (dealer.finalValue() === player.finalValue()) return 'push';

        return player.finalValue() > dealer.finalValue() ? 'win' : 'lose';
    };

    const reset = () => {
        deck = new Deck(2);
        dealer = new Player('Dealer');
        for (const player of players) {
            player.hand = [];
        }
        turn = 'dealer';
        stage = 'play';

        deck.shuffle();

        // deal cards in a circle (dealer -> players -> dealer -> players)
        dealer.hand.push(deck.takeCard()!);
        for (const player of players) {
            player.hand.push(deck.takeCard()!);
        }
        dealer.hand.push(deck.takeCard()!);
        for (const player of players) {
            player.hand.push(deck.takeCard()!);
        }

        // switch to player 0
        nextTurn();
    };

    onMount(() => {
        onstart();
    });
</script>

<div class="w-screen h-screen flex flex-col justify-center items-center gap-6 py-6">
    <h1 class="text-6xl">Blackjack</h1>
    {#if stage === 'new'}
        <NewGame bind:players={playerNames} onstart={onstart} />
    {:else if stage === 'play' || stage === 'score'}
        <div class="grow w-full flex flex-col gap-4 items-center">
            <div>
                {(turn === 'dealer' ? dealer : players[turn]).name}'s turn 
            </div>
            <PlayerCard
                player={dealer}
                isDealer
                turn={turn === 'dealer'}
                win={undefined}
            />
            <div class="flex flex-row gap-4 w-full justify-center">
                {#each players as player, i (i)}
                    <PlayerCard
                        {player}
                        turn={turn === i}
                        onaction={action => onPlayerAction(action, i)}
                        win={getPlayerWinState(player)}
                    />
                {/each}
            </div>
            {#if stage === 'score'}
                <Button onclick={reset}>Reset</Button>
            {/if}
        </div>
    {/if}
</div>
