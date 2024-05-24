function representOrderType(marketName, CoinA, CoinB, MinVol, MaxVol, CoinA_Price, CoinB_Price, OrderTypeUUID)
{
        const newOrderTypeRepresentation = document.createElement("div");
        const individualMarketOrderContainer = document.createElement("div");
        individualMarketOrderContainer.className = "individualMarketOrderContainer";

        const newOrderTypeSwapName = document.createElement("div");
        newOrderTypeSwapName.innerHTML += "<h3>" + marketName  +"</h3>";

        const testnetErgoIMG_path = "../images/ErgoTestnetTransparentWhite.png";
        const testnetErgoIMG_className = "ergoTestnetCheckboxImage";
        const newOrderTypeCoin1 = document.createElement("div");
        const newOrderTypeCoin1IMG = document.createElement("img");
        const newOrderTypeCoin2 = document.createElement("div");
        const newOrderTypeCoin2IMG = document.createElement("img");
        const SepoliaIMG_path = "../images/Sepolia-Ethereum-Logo-PNG-tranparentBG.png";
        const SepoliaIMG_className = "sepoliaCheckboxImage";
        coinA_ticker = "";
        if (CoinA == "TestnetErgo")
        {
                coinA_ticker = "tERG";
                newOrderTypeCoin1IMG.src = testnetErgoIMG_path;
                newOrderTypeCoin1IMG.className = testnetErgoIMG_className;
        }
        else if (CoinA == "Sepolia")
        {
                coinA_ticker = "sepETH";
                newOrderTypeCoin1IMG.src = SepoliaIMG_path;
                newOrderTypeCoin1IMG.className = SepoliaIMG_className;
        }
        else
        {
                console.log("unhandled coin: ", CoinA);
        }
        newOrderTypeCoin1.appendChild(newOrderTypeCoin1IMG);
        coinB_ticker = "";
        if (CoinB == "TestnetErgo")
        {
                coinB_ticker = "tERG";
                newOrderTypeCoin2IMG.src = testnetErgoIMG_path;
                newOrderTypeCoin2IMG.className = testnetErgoIMG_className;
        }
        else if (CoinB == "Sepolia")
        {
                coinB_ticker = "sepETH";
                newOrderTypeCoin2IMG.src = SepoliaIMG_path;
                newOrderTypeCoin2IMG.className = SepoliaIMG_className;
        }
        else
        {
                console.log("unhandled coin: ", CoinB);
        }
        newOrderTypeCoin2.appendChild(newOrderTypeCoin2IMG);

        const newOrderTypeMinVol = document.createElement("div");
        newOrderTypeMinVol.innerHTML += "<h1>" + MinVol + "</h1>";

        const newOrderTypeMaxVol = document.createElement("div");
        newOrderTypeMaxVol.innerHTML += "<h1>" + MaxVol + "</h1>";

        const ConversionArray = coinPriceConversion(1, CoinA_Price, CoinB_Price);
        //currently using 1 instead of real amount works, needs test to verify
        const newOrderTypePrice = document.createElement("div");
        newOrderTypePrice.innerHTML +=
                "<h1>1 " + coinA_ticker + " = " + ConversionArray[0]  + " " + coinB_ticker + "</h1> " +
                "<h1>1 " + coinB_ticker + " = " + ConversionArray[1]  + " " + coinA_ticker + "</h1>"

        //append in order: Market Name Offering Coin Accepting Coin Minimum Vol Maximum Vol Offer Price
        individualMarketOrderContainer.appendChild(newOrderTypeSwapName);
        individualMarketOrderContainer.appendChild(newOrderTypeCoin1);
        individualMarketOrderContainer.appendChild(newOrderTypeCoin2);
        individualMarketOrderContainer.appendChild(newOrderTypeMinVol);
        individualMarketOrderContainer.appendChild(newOrderTypeMaxVol);
        individualMarketOrderContainer.appendChild(newOrderTypePrice);

        newOrderTypeRepresentation.appendChild(individualMarketOrderContainer);
        newOrderTypeRepresentation.className = OrderTypeUUID;
        newOrderTypeRepresentation.addEventListener("click",
                function (event)
                {
                        showSwapClaimWindow(event, CoinA, CoinB, CoinA_Price, CoinB_Price, OrderTypeUUID);
			populateMarketExistingAccounts("", "", true) //clear before populating to be sure
			populateMarketExistingAccounts(CoinB, CoinA, false)
                });
        const marketOrderInfoContainer = document.getElementById("marketOrderInfoContainer");
	const marketOrderSlider = document.getElementById("marketOrderInfoSlider");
        if (marketOrderSlider) {
            marketOrderSlider.appendChild(newOrderTypeRepresentation);
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
                        const exists = existingOrderTypes.some(obj => obj[marketurl]);
                        if (!exists)
                        {
                                const marketOrdersObj = {
                                        [marketurl]: jsonData
                                };
                                existingOrderTypes.push(marketOrdersObj)
                        }
                        else
                        {
                                for (let i = 0; i < existingOrderTypes.length; i++) {
                                    if (existingOrderTypes[i][marketurl]) {
                                        // Update the object with the matching marketurl
                                        existingOrderTypes[i][marketurl] = jsonData;
                                        break;
                                    }
                                }
                        }
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
                                representOrderType(marketName, CoinA, CoinB, MinVol, MaxVol, CoinA_Price, CoinB_Price, OrderTypeUUID);
                        }
                });

        }
        localStorage.setItem(orderTypeKey, JSON.stringify(existingOrderTypes))
        console.log(existingOrderTypes);
}

