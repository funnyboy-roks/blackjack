<script lang="ts">
    import * as CardComp from '$lib/components/ui/card';
    import CardDisplay from '$lib/components/CardDisplay.svelte';

    import { type WinState } from '$lib/types.svelte';
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
                Value: {handValue.softValue === null
                    ? handValue.value
                    : `${handValue.value} or ${handValue.softValue}`}
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

    {#if player.hasBusted()}
        <CardComp.Footer class="flex flex-col items-start gap-2">
            <h2 class="font-bold text-destructive text-2xl">Bust!</h2>
        </CardComp.Footer>
    {:else if win === 'blackjack'}
        <CardComp.Footer class="flex flex-col items-start gap-2">
            <h2 class="font-bold text-green-400 text-2xl">Blackjack!</h2>
        </CardComp.Footer>
    {:else if win === 'win'}
        <CardComp.Footer class="flex flex-col items-start gap-2">
            <h2 class="font-bold text-green-400 text-2xl">Player Wins!</h2>
        </CardComp.Footer>
    {:else if win === 'lose'}
        <CardComp.Footer class="flex flex-col items-start gap-2">
            <h2 class="font-bold text-destructive text-2xl">Dealer Wins!</h2>
        </CardComp.Footer>
    {:else if win === 'push'}
        <CardComp.Footer class="flex flex-col items-start gap-2">
            <h2 class="font-bold text-2xl">Push</h2>
        </CardComp.Footer>
    {:else if win === undefined && !isDealer && turn}
        <CardComp.Footer class="flex flex-col items-start gap-2">
            <h2 class="font-bold">Actions</h2>
            <div class="flex flex-row gap-1">
                <Button disabled={!turn} onclick={() => onaction?.('hit')}>Hit</Button>
                <Button disabled={!turn} onclick={() => onaction?.('stay')}>Stay</Button>
                <Button disabled={!turn} onclick={() => onaction?.('double-down')}
                    >Double Down</Button
                >
            </div>
        </CardComp.Footer>
    {/if}
</CardComp.Root>
