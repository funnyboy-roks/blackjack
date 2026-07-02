<script lang="ts">
    import { Button, buttonVariants } from '$lib/components/ui/button';
    import * as Card from '$lib/components/ui/card';
    import * as Tooltip from '$lib/components/ui/tooltip';
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';

    import Trash from '@lucide/svelte/icons/trash';

    const { players = $bindable<string[]>(), onstart }: { players: string[]; onstart: () => void } =
        $props();

    const canStart = (): boolean => {
        return players.length > 0 && players.every((p) => p.length > 0);
    };
</script>

<Card.Root class="w-full max-w-sm">
    <Card.Header>
        <Card.Title>Start a new Blackjack game</Card.Title>
        <Card.Description
            >To start a new game, add up to five players and press Start.</Card.Description
        >
    </Card.Header>
    <Card.Content>
        <div class="flex flex-col gap-6">
            {#each players as _, i (i)}
                <div class="flex flex-col gap-2">
                    <Label for={`p${i}-name`}>Player {i + 1} Name</Label>
                    <div class="flex flex-row gap-1">
                        <Input
                            id={`p${i}-name`}
                            placeholder="John Smith"
                            required
                            bind:value={players[i]}
                            class="grow"
                        />
                        {#if players.length > 1}
                            <Tooltip.Provider>
                                <Tooltip.Root>
                                    <Tooltip.Trigger
                                        class={buttonVariants({
                                            variant: 'destructive',
                                            size: 'icon',
                                        })}
                                        onclick={() => players.splice(i, 1)}
                                    >
                                        <Trash />
                                    </Tooltip.Trigger>
                                    <Tooltip.Content>
                                        <p>Remove Player</p>
                                    </Tooltip.Content>
                                </Tooltip.Root>
                            </Tooltip.Provider>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </Card.Content>
    <Card.Footer class="flex-col gap-2">
        <Button
            variant="secondary"
            class="w-full"
            disabled={!canStart() || players.length >= 5}
            onclick={() => canStart() && players.push('')}>Add Player</Button
        >
        <Button class="w-full" disabled={!canStart()} onclick={onstart}>Start</Button>
    </Card.Footer>
</Card.Root>
