

function NanoErgToErg(NanoErg)
{
    let oneErgInNanoErg = 1000000000;
    return precise(NanoErg / oneErgInNanoErg);
}

function coinPriceConversion(amountMod, CoinA_Price, CoinB_Price)
{
        ConversionInCoinA = precise((amountMod * CoinA_Price) / CoinB_Price);
        ConversionInCoinB = precise((amountMod * CoinB_Price) / CoinA_Price);
        console.log("CoinA to B:", ConversionInCoinA, "\nCoinB to A:", ConversionInCoinB);
        return [ConversionInCoinA, ConversionInCoinB];
}

