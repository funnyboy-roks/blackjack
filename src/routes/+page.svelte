<script lang="ts">
    import NewGame from '$lib/components/NewGame.svelte';

    import { Deck } from '$lib/deck';
    import PlayerCard from '$lib/components/PlayerCard.svelte';
    import { Button } from '$lib/components/ui/button';
    import { Player } from '$lib/player.svelte';
    import { getPlayerWinState, onPlayerAction, resetGame, type GameState } from '$lib/game';
    import PlayerBetCard from '$lib/components/PlayerBetCard.svelte';

    let playerNames = $state<string[]>(['']);

    const game = $state<GameState>({
        stage: 'new',
        dealer: new Player('Dealer'),
        players: [],
        deck: new Deck(2),
        turn: 'dealer',
    });

    const onstart = () => {
        game.players = playerNames.map((name) => new Player(name));
        game.stage = 'bet';

        resetGame(game);
    };

    const onbet = (player: Player, bet: number) => {
        player.balance -= bet;
        player.bet = bet;

        // If every player has bet, then let's start
        if (game.players.every(p => p.bet !== 0)) {
            game.stage = 'play';
        }
    };
</script>

<div class="w-screen h-screen flex flex-col justify-center items-center gap-6 py-6">
    <h1 class="text-6xl">Blackjack</h1>
    {#if game.stage === 'new'}
        <NewGame bind:players={playerNames} {onstart} />
    {:else if game.stage === 'bet'}
        <div class="grow w-full flex flex-col gap-4 items-center">
            <div>
                Place your bets!
            </div>
            <div class="flex flex-row gap-4 w-full justify-center">
                {#each game.players as player, i (i)}
                    <PlayerBetCard {player} onbet={(bet) => onbet(player, bet)} />
                {/each}
            </div>
        </div>
    {:else if game.stage === 'play' || game.stage === 'score'}
        <div class="grow w-full flex flex-col gap-4 items-center">
            <div>
                {(game.turn === 'dealer' ? game.dealer : game.players[game.turn]).name}'s turn
            </div>
            <PlayerCard
                player={game.dealer}
                isDealer
                turn={game.turn === 'dealer'}
                win={undefined}
            />
            <div class="flex flex-row gap-4 w-full justify-center">
                {#each game.players as player, i (i)}
                    <PlayerCard
                        {player}
                        turn={game.turn === i}
                        onaction={(action) => onPlayerAction(game, action, i)}
                        win={getPlayerWinState(game, player)}
                    />
                {/each}
            </div>
            {#if game.stage === 'score'}
                <Button onclick={() => resetGame(game)}>Reset</Button>
            {/if}
        </div>
    {/if}
</div>
