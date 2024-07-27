import {create} from 'zustand';
import getDecks from '../utils/createShuffleCards';
import cardCount from '../utils/cardCount';

const initialDecks = getDecks();

const useStore = create((set) => ({
  randomizedDecks: initialDecks,
  chipCount: 1000,
  betAmount: 0,
  lockedBet: 0,
  previousBet: 0,
  dealersCards: [],
  dealerCount: 0,
  playersCards: [],
  playerCount: 0,
  isPlayerBusted: false,
  isDealersTurn: false,
  isHandComplete: true,
  winner: "",
  setRandomizedDecks: (decks) => set({ randomizedDecks: decks }),
  setChipCount: (updateFn) => set((state) => ({ chipCount: updateFn(state.chipCount) })),
    setBetAmount: (updateFn) => set((state) => {
        const amount = updateFn(state.betAmount);
        return {
            betAmount: amount
        }
    }),
  setLockedBet: (amount) => set({ lockedBet: amount }),
  setPreviousBet: (amount) => set({ previousBet: amount }),
  // eslint-disable-next-line no-unused-vars
    setDealersCards: (updateFn) => set((state) => {
        const newCards = updateFn(state.dealersCards);
        return {
            dealersCards: newCards,
            dealerCount: cardCount(newCards)
          };
    }),
  // eslint-disable-next-line no-unused-vars
    setPlayersCards: (updateFn) => set((state) => {
        const newCards = updateFn(state.playersCards);
        return {
            playersCards: newCards,
            playerCount: cardCount(newCards),
          };
    }),
            
  setIsPlayerBusted: (value) => set({ isPlayerBusted: value }),
  setIsDealersTurn: (value) => set({ isDealersTurn: value }),
  setIsHandComplete: (value) => set({ isHandComplete: value }),
  setWinner: (winner) => set({ winner }),
  resetGame: () => set({
    dealersCards: [],
    dealerCount: 0,
    playersCards: [],
      playerCount: 0,
    isPlayerBusted: false,
    isDealersTurn: false,
    isHandComplete: true,
    lockedBet: 0
  }),
  reshuffleDecks: () => set({ randomizedDecks: getDecks() })
}));

export default useStore;
