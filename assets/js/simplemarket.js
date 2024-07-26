window.addEventListener("DOMContentLoaded", (event) => {
document.getElementById('swapSettingsButton').addEventListener('click', function() {
  document.getElementById('swap-settings-overlay-menu').classList.add('open');
});

document.getElementById('swap-settings-overlay-menu').addEventListener('click', function(e) {
  if (e.target === this) {
    this.classList.remove('open');
  }
});
});

function estimateReturnSellToBuy(CoinA, CoinB) {
	sellAmountInput = document.getElementById("sellAmountInput");
	buyAmountInput = document.getElementById("buyAmountInput");
	const marketlistKey = 'marketlist';
        const existingMarketLists = JSON.parse(localStorage.getItem(marketlistKey)) || [];	
	for (market in existingMarketLists)
        {
		getJSON(existingMarketLists[market].marketurl,
                getBottomPrivateClientRESTAPIKeyFromLocalStorage()).then((jsonData) => {
			const marketurl = existingMarketLists[market].marketurl;
                        var jsonobj = JSON.parse(jsonData);
                        for (key in jsonobj)
                        {
//                              console.log(key, ":", jsonobj[key]);
                                OrderTypeUUID = key;
                                marketName = existingMarketLists[market].marketname;
                                serverCoinA = jsonobj[key]["CoinA"];
                                serverCoinB = jsonobj[key]["CoinB"];
                                MinVol = jsonobj[key]["MinVolCoinA"];
                                MaxVol = jsonobj[key]["MaxVolCoinA"];
                                CoinA_Price = jsonobj[key]["CoinA_price"];
                                CoinB_Price = jsonobj[key]["CoinB_price"];
				console.log(((CoinA == serverCoinA) && (CoinB == serverCoinB)))
				if ((CoinA == serverCoinA) && (CoinB == serverCoinB))
				{
					sellAmountInput.addEventListener("input", function() {
						buyAmountInput.value = coinPriceConversion(
							sellAmountInput.value, CoinA_Price, CoinB_Price
						)[1]
					});
				}
                        }

		});
	}
}

function estimateReturnBuyToSell(CoinA, CoinB) {
        sellAmountInput = document.getElementById("sellAmountInput");
        buyAmountInput = document.getElementById("buyAmountInput");
        const marketlistKey = 'marketlist';
        const existingMarketLists = JSON.parse(localStorage.getItem(marketlistKey)) || [];
        for (market in existingMarketLists)
        {
                getJSON(existingMarketLists[market].marketurl,
                getBottomPrivateClientRESTAPIKeyFromLocalStorage()).then((jsonData) => {
                        const marketurl = existingMarketLists[market].marketurl;
                        var jsonobj = JSON.parse(jsonData);
                        for (key in jsonobj)
                        {
//                              console.log(key, ":", jsonobj[key]);
                                OrderTypeUUID = key;
                                marketName = existingMarketLists[market].marketname;
                                serverCoinA = jsonobj[key]["CoinA"];
                                serverCoinB = jsonobj[key]["CoinB"];
                                MinVol = jsonobj[key]["MinVolCoinA"];
                                MaxVol = jsonobj[key]["MaxVolCoinA"];
                                CoinA_Price = jsonobj[key]["CoinA_price"];
                                CoinB_Price = jsonobj[key]["CoinB_price"];
                                console.log(((CoinA == serverCoinA) && (CoinB == serverCoinB)))
                                if ((CoinA == serverCoinA) && (CoinB == serverCoinB))
                                {
                                        buyAmountInput.addEventListener("input", function() {
                                                sellAmountInput.value = coinPriceConversion(
                                                        buyAmountInput.value, CoinA_Price, CoinB_Price
                                                )[0]
                                        });
                                }
                        }

                });
        }
}


function refreshOrderTypeList()
{
        const orderTypeKey = 'OrderTypeList';
        const existingOrderTypes = JSON.parse(localStorage.getItem(orderTypeKey)) || [];
        const marketlistKey = 'marketlist';
        const existingMarketLists = JSON.parse(localStorage.getItem(marketlistKey)) || [];
        for (market in existingMarketLists)
        {
                getJSON(existingMarketLists[market].marketurl,
                getBottomPrivateClientRESTAPIKeyFromLocalStorage()).then((jsonData) => {
                        const marketurl = existingMarketLists[market].marketurl;
                        var jsonobj = JSON.parse(jsonData);
                        for (key in jsonobj)
                        {
//                              console.log(key, ":", jsonobj[key]);
                                OrderTypeUUID = key;
                                marketName = existingMarketLists[market].marketname;
                                CoinA = jsonobj[key]["CoinA"];
                                CoinB = jsonobj[key]["CoinB"];
                                MinVol = jsonobj[key]["MinVolCoinA"];
                                MaxVol = jsonobj[key]["MaxVolCoinA"];
                                CoinA_Price = jsonobj[key]["CoinA_price"];
                                CoinB_Price = jsonobj[key]["CoinB_price"];
                        }
                });

        }
        localStorage.setItem(orderTypeKey, JSON.stringify(existingOrderTypes))
        console.log(existingOrderTypes);
}

