const dataToParse = {
    currentPrice: 'Current Price',
    allTimeHigh: 'All Time High',
    allTimeLow: 'All Time Low',
    athRoi: 'ATH ROI',
    increaseFromATL: '% Increase from ATL',
    totalHoldings: 'Total Holdings',
    trueBudgetPerCoin: 'True Budget on this Coin',
    additionalBudget: 'Additional Budget Catch Up Bottom',
    projectedRoi:'Projected ROI (70x)',
    marketCap: 'Market Cap',
    totalSupply: 'Total Supply',
    circulatingSupply: 'Circulating Supply',
    maxSupply: 'Max Supply',
    tradingVolume:  '24h Trading Volume'
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
    isMoney: ['marketCap', 'tradingVolume'],

}

function generateTableData(data, dataToParse, exchangeRate) {
    const result = {
        titleData: ['key'],
        tableData:  [
            {
                data: ['value'],                
            }
        ],
    }
    for (k in dataToParse) {
        const value  = data[k] ?? 'N/A'
        let  item =  typeof value === 'number' ? safeToFixed(value) : value
        if (formats.isMoneyWithConversion.includes(k)) {
            item  = `$${item} |  ₱${safeToFixed(item*exchangeRate)}`
        }
        if (formats.isMoney.includes(k))  {
            item  = `$${item}`
        }
        result.titleData.push(dataToParse[k]) 
        result.tableData[0].data.push(item)
    }    
    return result
}