function showSwapClaimWindow(event, CoinA, CoinB, CoinA_Price, CoinB_Price, OrderTypeUUID)
{
        const swapClaimWindow = document.getElementById("swapClaimWindow");
        if (window.getComputedStyle(swapClaimWindow).visibility === "hidden")
        {
                swapClaimWindow.style.visibility = "visible";
                const coinBEntry = document.getElementById("coinBEntry");
                coinBEntry.placeholder = CoinB;
                const outputElement = document.getElementById("coinAConvertedValue");
                coinBEntry.addEventListener("input", function() {
                        outputElement.innerHTML = coinPriceConversion(coinBEntry.value, CoinA_Price, CoinB_Price)[1]
                });
                const swapButton = document.getElementById("claimSwapButton");
                swapButton.addEventListener("click",
                        function (event)
                        {
				localChainAccountMenu = document.getElementById("localaccountMenu");
		                crossChainAccountMenu = document.getElementById("crossaccountMenu");
				hasSelectedLocalAccount = false;
				hasSelectedCrossAccount = false;
				localAccount = ""
				crossAccount = ""
				if (localChainAccountMenu.firstChild)
				{
					for (const child of localChainAccountMenu.children)
					{
						if (child.classList.contains('localselected'))
						{
							hasSelectedLocalAccount = true;
							localAccount = child.textContent
						}
					}
					//.classList.contains('localselected')
				}
				if (crossChainAccountMenu.firstChild)
                                {
                                        for (const child of crossChainAccountMenu.children)
                                        {
                                                if (child.classList.contains('crossselected'))
                                                {
                                                        hasSelectedCrossAccount = true;
							crossAccount = child.textContent
                                                }
                                        }
                                }
				if (hasSelectedCrossAccount == false || hasSelectedLocalAccount == false)
				{
					console.log("chain accounts not selected!")
				}
				else
				{
	                                claimSwap(
						event, 
						OrderTypeUUID, 
						coinBEntry.value, 
						CoinA_Price, 
						CoinB_Price, 
						localAccount, 
						crossAccount
					)
				}
                        });
                document.getElementById("estReceivedCoinA").innerHTML = CoinA;
        }
        else if (window.getComputedStyle(swapClaimWindow).visibility === "visible")
        {
                swapClaimWindow.style.visibility = "hidden";
		populateMarketExistingAccounts("", "", true) //clear when unclicked
        }
}

function claimSwap(event, OrderTypeUUID, coinAmount, CoinA_Price, CoinB_Price, localAccount, crossAccount)
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
					//
					//
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
					/*
                                        const CoinA = jsonobj[key]["CoinA"];
                                        const CoinB = jsonobj[key]["CoinB"];
                                        console.log("CoinA", CoinA, "CoinB", CoinB);
                                        let data  = {
                                                "id": uuidv4(),
                                                "request_type": "requestEncryptedInitiation",
                                                "OrderTypeUUID": OrderTypeUUID,
						"QGChannel": getElGamalQGChannel(existingMarketLists[market].marketurl),
                                                "ElGamalKey": getElGamalKey(existingMarketLists[market].marketurl)
                                        };
					console.log(data);
					marketurl = existingMarketLists[market].marketurl
                                        const postmod = existingMarketLists[market].marketurl.replace("ordertypes", "publicrequests");
                                        postJSON(
						postmod, 
						data, 
						getStarterRESTAPIKeyFromMarketUrlAtIndex(
							marketurl, 
							0
						)
					).then(respJSON => {
							const respJSONOBJ = JSON.parse(respJSON);
							const swapTicketID = respJSONOBJ["SwapTicketID"];
							const ENCinit = respJSONOBJ["ENC_init.bin"];
							showStartingOrderIDModal(swapTicketID);
							storeActiveSwapInfo(swapTicketID, "SettingModalFocus", "", [true]);
							//set modal focus to true as soon as swap starts
							const makeSwapDirData  = {
								"id": uuidv4(),
								"request_type": "makeSwapDir",
								"SwapTicketID": swapTicketID,
								"ENCInit": ENCinit
							};
							makeSwapDir(makeSwapDirData, swapTicketID, CoinA, 
								CoinB, coinAmount, postmod, CoinA_Price, CoinB_Price, marketurl);
                                        	
					});*/
                                     	break;
                                }
                        }
                });
        }
}

