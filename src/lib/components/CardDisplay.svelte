<script lang="ts">
    import type { Card } from '$lib/deck';

	import Club from '@lucide/svelte/icons/club';
	import Spade from '@lucide/svelte/icons/spade';
	import Diamond from '@lucide/svelte/icons/diamond';
	import Heart from '@lucide/svelte/icons/heart';

    const { card }: { card: Card | undefined } = $props();

    const suitMap  = {
        'clubs': Club, // '♧',
        'spades': Spade,// '♤',
        'diamonds': Diamond, // '♢',
        'hearts': Heart, // '♡',
    };

    const isRed = () => card && (card.suit === 'diamonds' || card.suit === 'hearts');
    const Icon = $derived(card ? suitMap[card.suit] : undefined);

    const cardImage = $derived(card && card.suit[0].toUpperCase() + card.value);
</script>

<span class="flex flex-col items-center text-xl gap-1 {isRed() ? 'text-destructive' : ''}">
    {#if card}
        <img src="/cards/{cardImage}.png" alt="{card.value} of {card.suit}" class="w-[2em]" />
        <span class="flex flex-row items-center">
            <Icon size="1em" fill="currentColor" /> {card!.value}
        </span>
    {:else}
        <img src="/cards/Back_Red.png" alt="Hidden Card" class="w-[2em]" />
        <span class="flex flex-row items-center">
            Hidden
        </span>
    {/if}
</span>
