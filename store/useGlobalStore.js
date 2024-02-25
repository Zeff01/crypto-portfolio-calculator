
import { create } from 'zustand';

const useGlobalStore = create((set) => ({
    usdToPhpRate: null,
    budgetPerCoin: 0,
    setUsdToPhpRate: (rate) => set(() => ({ usdToPhpRate: rate })),
    setBudgetPerCoin: (budget) => set(() => ({ budgetPerCoin: budget })),
}));

export default useGlobalStore;
