import { safeToFixed } from "./safeToFixed";
export const dataToParse = {
    currentPrice: 'Current Price',
    allTimeHigh: 'All Time High',
    allTimeLow: 'All Time Low',
    athRoi: 'ATH ROI',
    increaseFromATL: '% Increase from ATL',
    totalHoldings: 'Total Holdings',
    trueBudgetPerCoin: 'True Budget on this Coin',
    additionalBudget: 'Additional Budget Catch Up Bottom',
    projectedRoi: 'Projected ROI (70x)',
    projectedRoi: 'Projected ROI (70x)',
    marketCap: 'Market Cap',
    totalSupply: 'Total Supply',
    circulatingSupply: 'Circulating Supply',
    maxSupply: 'Max Supply',
    tradingVolume: '24h Trading Volume'
}
const formats = {
    isMoneyWithConversion: [
        'currentPrice',
        'allTimeHigh',
        'allTimeLow',
        'totalHoldings',
        'trueBudgetPerCoin',
        'additionalBudget',
        'projectedRoi',
    ],
    isMoney: ['marketCap', 'tradingVolume',],
    isBigNums: ['totalSupply', 'circulatingSupply', 'maxSupply',]
}
export function generateTableData(data, dataToParse, exchangeRate) {
    const result = [
        ['Shares', data.shares]
    ]
    for (k in dataToParse) {
        if (k === 'maxSupply' && data[k] === 0) {
            result.push([dataToParse[k], 'Unlimited']);
            continue;
        }

        const value = data[k] ?? 'N/A'
        let item = typeof value === 'number' ? safeToFixed(value) : value
        if (formats.isMoneyWithConversion.includes(k)) {
            item = `$${Number(item).toLocaleString()}|₱${Number(safeToFixed((Number(item) * exchangeRate))).toLocaleString()}`
        }
        if (formats.isMoney.includes(k)) {
            item = `$${Number(item).toLocaleString()}`
        }
        if (formats.isBigNums.includes(k)) {
            item = Number(item).toLocaleString()
        }
        if (isNaN(value)) {
            item = 0
        }
        result.push([
            dataToParse[k], item
        ])
    }
    return result
}