<script lang="ts">
    import * as CardComp from '$lib/components/ui/card';
    import { Input } from '$lib/components//ui/input';
    import { Label } from '$lib/components/ui/label';
    import { Button } from '$lib/components/ui/button';

    import type { Player } from '$lib/player.svelte';

    const {
        player,
        onbet,
    }: {
        player: Player;
        onbet?: (bet: number) => void;
    } = $props();

    let bet = $state(0);
    let error = $state('');
    let locked = $state(false);

    const onsubmit = (ev: SubmitEvent) => {
        ev.preventDefault();
        error = '';

        // if bet <= 0 or bet is a decimal
        if (bet <= 0 || bet !== Math.floor(bet)) {
            error = 'Bet must be a postive integer';
            return;
        }

        if (bet > player.balance) {
            error = 'You do not have enough balance to bet this amount';
            return;
        }

        onbet?.(bet);
        locked = true;
    };
</script>

<CardComp.Root class="w-full max-w-sm">
    <CardComp.Header>
        <CardComp.Title>{player.name}</CardComp.Title>
        <CardComp.Action>
            Balance: {player.balance}
        </CardComp.Action>
    </CardComp.Header>

    <CardComp.Content>
        <form {onsubmit} class="flex flex-col gap-2">
            <Label for="bet">Bet</Label>
            <div>
                <Input id="bet" type="number" min={0} step={1} bind:value={bet} disabled={locked} />
                {#if error}
                    <p class="text-destructive">{error}</p>
                {/if}
            </div>
            {#if locked}
                <p class="text-muted-foreground">Bet Placed</p>
            {:else}
                <Button class="self-end" type="submit" disabled={locked}>Place Bet</Button>
            {/if}
        </form>
    </CardComp.Content>
</CardComp.Root>
