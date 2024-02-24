import { create } from 'zustand';

const useCoinDataStore = create((set) => ({
    coinData: [],
    addCoinData: (coin) => set((state) => ({ coinData: [...state.coinData, coin] })),
    deleteCoin: (coinId) => set((state) => {
        console.log("Deleting coin with ID:", coinId); // Add this line
        return { coinData: state.coinData.filter(coin => coin.id !== coinId) };
    }),

    updateShares: (coinId, newShares) => set((state) => ({
        coinData: state.coinData.map(coin =>
            coin.id === coinId ? { ...coin, shares: newShares } : coin
        )
    })),
}));

export default useCoinDataStore;