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
                                claimSwap(event, OrderTypeUUID, coinBEntry.value, CoinA_Price, CoinB_Price)
                        });
                document.getElementById("estReceivedCoinA").innerHTML = CoinA;
        }
        else if (window.getComputedStyle(swapClaimWindow).visibility === "visible")
        {
                swapClaimWindow.style.visibility = "hidden";
        }
}

function claimSwap(event, OrderTypeUUID, coinAmount, CoinA_Price, CoinB_Price)
{
        const marketlistKey = 'marketlist';
        const existingMarketLists = JSON.parse(localStorage.getItem(marketlistKey)) || [];
        for (market in existingMarketLists)
        {
                getJSON(existingMarketLists[market].marketurl).then((jsonData) => {
                        var jsonobj = JSON.parse(jsonData);
                        for (key in jsonobj)
                        {
                                if (key == OrderTypeUUID)
                                {
                                        console.log("ElGamalKey:", getElGamalKey());
                                        const CoinA = jsonobj[key]["CoinA"];
                                        const CoinB = jsonobj[key]["CoinB"];
                                        console.log("CoinA", CoinA, "CoinB", CoinB);
                                        let data  = {
                                                "id": uuidv4(),
                                                "request_type": "requestEncryptedInitiation",
                                                "OrderTypeUUID": OrderTypeUUID,
                                                "ElGamalKey": getElGamalKey()
                                        };
                                        const postmod = existingMarketLists[market].marketurl.replace("ordertypes", "publicrequests");
                                        postJSON(postmod, data).then(respJSON => {
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
                                                makeSwapDir(makeSwapDirData, swapTicketID, CoinA, CoinB, coinAmount, postmod, CoinA_Price, CoinB_Price);
                                        });
                                        break;
                                }
                        }
                });
        }
}

