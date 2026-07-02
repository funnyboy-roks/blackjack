export const cardSuits = ['clubs', 'spades', 'diamonds', 'hearts'] as const;
export type Suit = (typeof cardSuits)[number];

export const cardValues = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'] as const;
export type Value = (typeof cardValues)[number];

export interface Card {
    value: Value;
    suit: Suit;
}

export class Deck {
    // Cards left in the deck -- End is top
    #cards: Card[];

    constructor(numDecks = 1) {
        this.#cards = [];
        for (let i = 0; i < numDecks; ++i) {
            for (const suit of cardSuits) {
                for (const value of cardValues) {
                    this.#cards.push(<Card>{ suit, value });
                }
            }
        }
    }

    /**
     * Shuffle the deck
     */
    shuffle() {
        // shuffle the deck by walking the array and swapping with a random index
        for (let i = 1; i < this.#cards.length; ++i) {
            const otherI = Math.floor(Math.random() * i);
            const t = this.#cards[i];
            this.#cards[i] = this.#cards[otherI];
            this.#cards[otherI] = t;
        }
    }

    /**
     * Take a card from the top of the deck
     */
    takeCard(): Card | undefined {
        // return this.#cards.pop();
        return this.#cards.splice(Math.floor(Math.random() * this.#cards.length), 1)[0];
    }
}
