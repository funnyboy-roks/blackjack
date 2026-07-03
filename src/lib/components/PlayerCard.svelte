<script lang="ts">
    import * as CardComp from '$lib/components/ui/card';
    import CardDisplay from '$lib/components/CardDisplay.svelte';

    import { type WinState } from '$lib/types';
    import Button from './ui/button/button.svelte';
    import type { Card } from '$lib/deck';
    import type { Player, PlayerAction } from '$lib/player.svelte';

    const {
        player,
        isDealer = false,
        turn,
        onaction,
        win,
    }: {
        player: Player;
        isDealer?: boolean;
        turn: boolean;
        onaction?: (action: PlayerAction) => void;
        win: WinState;
    } = $props();

    const handValue = $derived(player.handValue());
</script>

<CardComp.Root class="w-full max-w-sm">
    <CardComp.Header>
        <CardComp.Title>{player.name}</CardComp.Title>

        {#if !isDealer || turn}
            <CardComp.Action>
                {#if !isDealer}
                    <p>Balance: {player.balance}</p>
                    <p>Bet: {player.bet}</p>
                {/if}
                <p>
                    Hand: {handValue.softValue === null
                        ? handValue.value
                        : `${handValue.value} or ${handValue.softValue}`}
                </p>
            </CardComp.Action>
        {/if}
    </CardComp.Header>

    {#if isDealer && !turn}
        <CardComp.Content>
            <div class="flex flex-row gap-2 flex-wrap">
                {#each (player.hand as Array<Card | undefined>).with(0, undefined) as card, i (i)}
                    <CardDisplay {card} />
                {/each}
            </div>
        </CardComp.Content>
    {:else}
        <CardComp.Content>
            <div class="flex flex-row gap-2 flex-wrap">
                {#each player.hand as card, i (i)}
                    <CardDisplay {card} />
                {/each}
            </div>
        </CardComp.Content>
    {/if}

    <CardComp.Footer class="flex flex-col items-start gap-2">
    {#if player.hasBusted()}
        <h2 class="font-bold text-destructive text-2xl">Bust!</h2>
    {:else if win === 'blackjack' || (isDealer && turn && player.hasBlackjack())} <!-- Either the win state is blackjack, OR it's the dealer's turn and it got blackjack -->
        <h2 class="font-bold text-green-400 text-2xl">Blackjack!</h2>
    {:else if win === 'win'}
        <h2 class="font-bold text-green-400 text-2xl">Player Wins!</h2>
    {:else if win === 'lose'}
        <h2 class="font-bold text-destructive text-2xl">Dealer Wins!</h2>
    {:else if win === 'push'}
        <h2 class="font-bold text-2xl">Push</h2>
    {:else if win === undefined && !isDealer && turn}
        <h2 class="font-bold">Actions</h2>
        <div class="flex flex-row gap-1">
            <Button disabled={!turn} onclick={() => onaction?.('hit')}>Hit</Button>
            <Button disabled={!turn} onclick={() => onaction?.('stay')}>Stay</Button>
            <Button disabled={!turn || player.balance < player.bet} onclick={() => onaction?.('double-down')}>
                Double Down
            </Button>
        </div>
    {/if}
    </CardComp.Footer>
</CardComp.Root>
