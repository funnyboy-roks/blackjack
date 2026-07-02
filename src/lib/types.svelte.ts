/**
 * Miscellaneous types that don't fit cleanly into other categories
 */

// A player's state for a win.  Undefined means the game is still running (and not lost/blackjack)
export type WinState = undefined | 'win' | 'blackjack' | 'push' | 'lose';
