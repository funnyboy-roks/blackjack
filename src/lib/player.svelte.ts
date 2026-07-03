import type { Card } from './deck';

export type PlayerAction = 'hit' | 'stay' | 'double-down';

export class Player {
    name: string;
    hand: Card[] = $state([]);
    // balance in "chips"
    balance: number = $state(100);
    // bet for the current round
    bet: number = $state(0);

    constructor(name: string) {
        this.name = name;
    }

    handValue(): { value: number; softValue: number | null } {
        let sum = 0;
        let softSum = null;
        let hasAce = false;
        for (const card of this.hand) {
            switch (card.value) {
                case 'A':
                    {
                        if (hasAce) {
                            sum += 1; // Only one Ace can be 11, if we have more than one, then the second one _must_ be a 1
                        } else {
                            softSum = sum + 11;
                            sum += 1;
                            hasAce = true;
                        }
                    }
                    break;
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                    {
                        sum += card.value;
                        if (softSum !== null) softSum += card.value;
                    }
                    break;
                case 'J':
                case 'Q':
                case 'K':
                    {
                        sum += 10;
                        if (softSum !== null) softSum += 10;
                    }
                    break;
            }
        }

        return {
            value: sum,
            softValue: softSum && softSum > 21 ? null : softSum,
        };
    }

    finalValue(): number | 'bust' {
        let { value, softValue } = this.handValue();

        // if there is a soft value and it's bigger than value, then use that instead.
        if (softValue && softValue > value) {
            value = softValue;
        }

        if (value > 21) return 'bust';

        return value;
    }

    /**
     * Whether the player can split (has a pair)
     */
    canSplit(): boolean {
        return this.hand.length === 2 && this.hand[0].value === this.hand[1].value;
    }

    /**
     * Whether this player has busted
     */
    hasBusted(): boolean {
        return this.finalValue() === 'bust';
    }

    /**
     * Whether the player has blackjack (ace + 10 count)
     */
    hasBlackjack(): boolean {
        return (
            this.hand.length === 2 &&
            this.hand.some((c) => c.value === 'A') &&
            this.hand.some((c) => [10, 'J', 'Q', 'K'].includes(c.value))
        );
    }
}
