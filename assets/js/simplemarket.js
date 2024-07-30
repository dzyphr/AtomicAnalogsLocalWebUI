window.addEventListener("DOMContentLoaded", (event) => {
	document.getElementById('swapSettingsButton').addEventListener('click', function() {
		document.getElementById('swap-settings-overlay-menu').classList.add('open');
		refreshChooseMarketsList()
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

function refreshChooseMarketsList()
{
	const marketKey = 'marketlist';
	const selectedMarketKey = 'selectedmarket';
	const existingMarkets = JSON.parse(localStorage.getItem(marketKey)) || [];
	for (market in existingMarkets)
	{
		marketname = existingMarkets[market]["marketname"]
		marketurl = existingMarkets[market]["marketurl"]
		var valueList = document.querySelector('.marketChoiceSetting .value-list');

		var newListItem = document.createElement('li');
		newListItem.addEventListener('click', function(e) {
			localStorage.setItem(selectedMarketKey, marketurl)
		});
		var items = valueList.getElementsByTagName('li');
		var repeat = false;
		for (var i = 0; i < items.length; i++) {
			if (items[i].textContent === marketname) {
				console.log('Marketname already found in the list.');
				repeat = true;
				break; // Exit li checking the for loop if item is found
			}
		}
		if (repeat === true)
		{
			break//Exit the existing market list for loop
		}
		newListItem.textContent = marketname;
		// Append the new <li> to the <ul>
		valueList.appendChild(newListItem)
		setList() //resets the list element group so that the new li element is included in its functionality
		//might need more specific naming
		//TODO: also need to check for duplicate market name and or url in addMarket() not just here
	}
}

function simpleMarket_addMarket()
{
        const marketname = document.getElementById("addMarketName");
        const marketurl = document.getElementById("addMarketURL");
        const marketKey = 'marketlist';
        const existingMarkets = JSON.parse(localStorage.getItem(marketKey)) || [];
        if (marketname.value in existingMarkets == false && marketurl.value in existingMarkets == false)
        {
                const newMarket = {
                        marketname: marketname.value,
                        marketurl: marketurl.value
                };
                existingMarkets.push(newMarket);
                console.log("adding market")
                localStorage.setItem(marketKey, JSON.stringify(existingMarkets));
		console.log(marketurl.value);
                loadStarterRESTAPIKeysFromMarketUrl(marketurl.value);

                //http://127.0.0.1:3030/v0.0.1/ordertypes
                //marketurl will look like this:e add.r.e.ss:port/apiversion/ordertypes
                //ElGamal Q Channels located in this directory: apiversion/publicrequests/ElGamalQChannels
                //ElGamal Public Keys located in this directory: apiversion/publicrequests/ElGamalPubs
                //ElGamal QPubkey Array located in this directory: apiversion/publicrequests/QPubkeyArray
                //we need some info about the market to proceed:
                //ElGamal Q Channel and Corresponding Public Key
                //Use this to determine communicable Public Key for our client
                //After this proceed the swap normally using the selected Key
                QGChannelURL = marketurl.value.replace("ordertypes", "publicrequests/ElGamalQGChannels");
                ElGPubKeyURL = marketurl.value.replace("ordertypes", "publicrequests/ElGamalPubs");
                QGPubKeyArrayURL = marketurl.value.replace("ordertypes", "publicrequests/QGPubkeyArray");

                QGPubKeyArray_JSON = getJSON(QGPubKeyArrayURL).then( result => {
                        console.log("loading compatible pubkeys");
                        loadCompatibleElGPubKeyFromQGChannelArray(result, marketurl.value);
                } );
                ElGPubKey_JSON = getJSON(ElGPubKeyURL).then( result => { return result; } );
                QGChannels_JSON = getJSON(QGChannelURL).then( result => {  } );
                //replace todos with get bottom api key for this specific market function to be made
                refreshOrderTypeList();
        }
}

function simpleMarket_start_claimSwap(coinAmount, CoinA, CoinB, useLocalStorageSelectedMarket)
{
	orderType, coinAmount, CoinA_Price, CoinB_Price =
		findFittingOrderType(coinAmount, CoinA, CoinB, useLocalStorageSelectedMarket)
	localAccount = document.getElementById('')
	simpleMarket_claimSwap(OrderTypeUUID, coinAmount, CoinA_Price, CoinB_Price, localAccount, crossAccount)
}

function findFittingOrderType(coinAmount, CoinA, CoinB, useLocalStorageSelectedMarket)
{
	if (useLocalStorageSelectedMarket == true)
	{
		selectedMarket = localStorage.getItem('selectedmarket')
		getJSON(selectedMarket, getBottomPrivateClientRESTAPIKeyFromLocalStorage()).then((jsonData) => {
                	var jsonobj = JSON.parse(jsonData);
			for (orderType in jsonobj)
			{
				if ((coinAmount >= jsonobj[orderType]["MinVolCoinA"] 
					&& coinAmount <= jsonobj[orderType]["MaxVolCoinA"]))
				{
					return orderType, coinAmount, 
						jsonobj[orderType]["CoinA_Price"], 
						jsonobj[orderType]["CoinB_Price"] 
				}
			}
		});
	}
}

function simpleMarket_claimSwap(OrderTypeUUID, coinAmount, CoinA_Price, CoinB_Price, localAccount, crossAccount)
{
        const marketlistKey = 'marketlist';
        const existingMarketLists = JSON.parse(localStorage.getItem(marketlistKey)) || [];
        for (market in existingMarketLists)
        {
                getJSON(existingMarketLists[market].marketurl, getBottomPrivateClientRESTAPIKeyFromLocalStorage()).then((jsonData) => {
                        var jsonobj = JSON.parse(jsonData);
                        for (key in jsonobj)
                        {
                                if (key == OrderTypeUUID)
                                {
                                        //instead of raw handling the request here, lets keep the requests local
                                        //start storing the state of this swap on the back end
                                        //make the request from the backend and then query its state from here
                                        //make a local request that anticipates the initiation being recieved to the backend
                                        //replace further swap claiming functions with this behavior
                                        //this makes reloading swaps and rendering state far more simple and rational
                                        //TODO stronger link between Market specific ElGamal Key and QG channel to ensure consistency
                                        const CoinA = jsonobj[key]["CoinA"]; //crosschain
                                        const CoinB = jsonobj[key]["CoinB"]; //localchain
                                        let LocalChain = CoinB;
                                        let CrossChain = CoinA;
                                        marketurl = existingMarketLists[market].marketurl
                                        let ClientElGamalKey = getElGamalKey(marketurl);
                                        ElGamalKeyPath =
                                                "Key" +
                                                getLocalElGamalPubKeyIndexFromLocalStorage(ClientElGamalKey) +
                                                ".ElGamalKey";
                                        QGPubMatchStorageKey = marketurl + "_QGPubMatch" + "_" + getElGamalKey(marketurl);
                                        QGPubMatchElGMarketServerKey = localStorage.getItem(QGPubMatchStorageKey);
                                        ServerElGamalKey = QGPubMatchElGMarketServerKey
                                        let startSwapFromUIData = {
                                                "id": uuidv4(),
                                                "request_type": "startSwapFromUI",
                                                "OrderTypeUUID": OrderTypeUUID,
                                                "QGChannel": getElGamalQGChannel(marketurl),
                                                "ElGamalKey": ClientElGamalKey,
                                                "ServerElGamalKey": ServerElGamalKey,
                                                "ElGamalKeyPath": ElGamalKeyPath,
                                                "MarketURL": marketurl,
                                                "MarketAPIKey": getStarterRESTAPIKeyFromMarketUrlAtIndex(marketurl, 0),
                                                "LocalChain": LocalChain,
                                                "CrossChain": CrossChain,
                                                "LocalChainAccount": localAccount,
                                                "CrossChainAccount": crossAccount,
                                                "SwapRole": "Responder", //TODO for now client is always responder might change itf
                                                "swapAmount": coinAmount
                                        }
                                        return localClientPostJSONgetJSON(startSwapFromUIData).then(function(response) {
                                                cleanresp = response.replace(/[\n\r\s]+/g, '')
							.split('\n').join('')
							.replace(/\\n/g, '')
							.slice(1, -1)
							.replaceAll("\\", '');
                                                console.log(JSON.parse(cleanresp))
                                                respJSON = JSON.parse(cleanresp)
                                                const swapTicketID = respJSON["SwapTicketID"];
                                                showStartingOrderIDModal(swapTicketID);
                                                storeActiveSwapInfo(swapTicketID, "SettingModalFocus", "", [true]);
                                                const ConversionArray = coinPriceConversion(coinAmount, CoinA_Price, CoinB_Price);
                                                AmtCoinB = coinAmount; //we are the responder here
                                                AmtCoinA = ConversionArray[1]; // TODO Hide active swaps if there aren't any
                                                representActiveSwap(CoinA, CoinB, AmtCoinA, AmtCoinB, swapTicketID)
                                                //TODO  replace swap stage logic with one that uses SwapStateMap async without
                                                //relying on local storage
                                        });
                                        break;
                                }
                        }
                });
        }
}

