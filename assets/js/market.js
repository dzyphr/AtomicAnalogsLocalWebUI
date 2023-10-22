
function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

window.onload = function() {
  refreshOrderTypeList();
};

function localClientPostJSON(data)
{
	url = "http://localhost:3031/v0.0.1/requests"
	const headers = {
                Authorization: "Bearer " + "PASSWORD",
                "Content-Type": "application/json"
        }
	console.log(data);
	return fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
                headers: headers,
        }).then(async res  =>
                {
                         return await res.text();
                });
}

function postJSONgetText(url, data)
{
        const headers = {
                Authorization: "Bearer " + "NONE",
                "Content-Type": "application/json"
        }
        return fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
                headers: headers,
        }).then(async res  =>
                {
                         return await res.text();
                });
}


function postJSON(url, data)
{
	const headers = {
		Authorization: "Bearer " + "NONE",
		"Content-Type": "application/json"
	}
	return fetch(url, {
		method: "POST", 
		body: JSON.stringify(data),
		headers: headers,		
	}).then(async res  => 
		{
			 return await res.json();
		});
}

function getJSON(url)
{
	const authHeaders = {
		Authorization: "Bearer " + "NONE",
	};
	return fetch(url, {
		method: "GET",
	}).then((res) => res.text()).then((textres) => JSON.parse(textres)).then((json) => json)
}

function addMarket()
{
	const marketname = document.getElementById("marketnamesetup");
	const marketurl = document.getElementById("marketapisetup");
	const marketKey = 'marketlist';
	const existingMarkets = JSON.parse(localStorage.getItem(marketKey)) || [];
	if (marketname.value in existingMarkets == false && marketurl.value in existingMarkets == false)
	{
		const newMarket = {
			marketname: marketname.value,
			marketurl: marketurl.value
		};
		existingMarkets.push(newMarket);
		localStorage.setItem(marketKey, JSON.stringify(existingMarkets));
		refreshOrderTypeList();
	}
}

function removeMarket()
{
	//get an html element to target the market name or url
	const existingMarketList = JSON.parse(localStorage.getItem('marketlist')) || [];
	const itemToRemove = 'ItemNameToRemove'; //replace w element content
	const updatedMarketList = existingMarketList.filter(item => item.marketname !== itemToRemove);
	localStorage.setItem('marketlist', JSON.stringify(updatedMarketList));
}

function getMarkets()
{
	const marketKey = 'marketlist';
	const existingData = JSON.parse(localStorage.getItem(marketKey)) || [];
	console.log(existingData);
}

function deleteLocalstorage()
{
	localStorage.clear();
}

function representOrderType(marketName, CoinA, CoinB, MinVol, MaxVol, CoinA_Price, CoinB_Price, OrderTypeUUID)
{
	const newOrderTypeRepresentation = document.createElement("div");
	const individualMarketOrderContainer = document.createElement("div");
	individualMarketOrderContainer.className = "individualMarketOrderContainer"; 

	const newOrderTypeSwapName = document.createElement("div");
	newOrderTypeSwapName.innerHTML += "<h1>" + marketName  +"</h1>";
	
	const testnetErgoIMG_path = "../images/ErgoTestnetTransparentWhite.png";
	const testnetErgoIMG_className = "ergoTestnetCheckboxImage";
	const newOrderTypeCoin1 = document.createElement("div");
	const newOrderTypeCoin1IMG = document.createElement("img");
	const newOrderTypeCoin2 = document.createElement("div");
        const newOrderTypeCoin2IMG = document.createElement("img");
	const SepoliaIMG_path = "../images/Sepolia-Ethereum-Logo-PNG-tranparentBG.png";
	const SepoliaIMG_className = "sepoliaCheckboxImage";
	if (CoinA == "TestnetErgo")
	{
		newOrderTypeCoin1IMG.src = testnetErgoIMG_path;
		newOrderTypeCoin1IMG.className = testnetErgoIMG_className;
	}
	else if (CoinA == "Sepolia")
	{
		newOrderTypeCoin1IMG.src = SepoliaIMG_path;
                newOrderTypeCoin1IMG.className = SepoliaIMG_className;
	}
	else
	{
		console.log("unhandled coin: ", CoinA);
	}
	newOrderTypeCoin1.appendChild(newOrderTypeCoin1IMG);
	if (CoinB == "TestnetErgo")
        {
                newOrderTypeCoin2IMG.src = testnetErgoIMG_path;
                newOrderTypeCoin2IMG.className = testnetErgoIMG_className;
        }
	else if (CoinB == "Sepolia")
        {
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
	const newOrderTypePrice = document.createElement("div");
	newOrderTypePrice.innerHTML +=
		"<h1>1 " + CoinA + " = " + ConversionArray[0]  + " " + CoinB + "</h1> " + 
		"<h1>1 " + CoinB + " = " + ConversionArray[1]  + " " + CoinA + "</h1>"

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
		});
	const marketOrderInfoContainer = document.getElementById("marketOrderInfoContainer");
	if (marketOrderInfoContainer) {
	    marketOrderInfoContainer.appendChild(newOrderTypeRepresentation);
	}
}

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
				claimSwap(event, OrderTypeUUID, coinBEntry.value)
			});
		document.getElementById("estReceivedCoinA").innerHTML = CoinA;
	}
	else if (window.getComputedStyle(swapClaimWindow).visibility === "visible")
	{
		swapClaimWindow.style.visibility = "hidden";
	}
}

function saveElGamalKey()
{
	const ElGamalKeyEntry = document.getElementById("ElGamalKeyEntry");
	const ElGamalKey_Key = "ElGamalPubKey";
	const existingElGamalKeys = JSON.parse(localStorage.getItem(ElGamalKey_Key)) || [];
	existingElGamalKeys.push(ElGamalKeyEntry.value);
	localStorage.setItem(ElGamalKey_Key, JSON.stringify(existingElGamalKeys));
}

function getElGamalKey()
{
	const ElGamalKey_Key = "ElGamalPubKey";
        const existingElGamalKeys = JSON.parse(localStorage.getItem(ElGamalKey_Key)) || [];
	console.log(existingElGamalKeys);
	return existingElGamalKeys[0];
}

function claimSwap(event, OrderTypeUUID, coinAmount)
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
						const data2  = {
							"id": uuidv4(),
							"request_type": "makeSwapDir",
							"SwapTicketID": swapTicketID,
							"ENCInit": ENCinit
						};
						localClientPostJSON(data2).then(respText => {
							data3 = {
								"id": uuidv4(),
								"request_type": "generateEncryptedResponse",
								"SwapTicketID": swapTicketID,
								"responderCrossChain": CoinA, 
								"responderLocalChain": CoinB,
								"ElGamalKey": getElGamalKey(),
								"ElGamalKeyPath": "Key0.ElGamalKey", //TODO
								"swapAmount": coinAmount
							};
							localClientPostJSON(data3).then( respText => {
								const postmod = existingMarketLists[market]
									.marketurl.replace("ordertypes", "publicrequests");
								const cleanresp = respText
									.replace("\"", "")
									.replace("\\", "\n")
									.replace("n", "")
									.replace(/\\n/g, '\n');
								data4 = {
									"id": uuidv4(),
									"request_type": "submitEncryptedResponse",
									"SwapTicketID": swapTicketID,
									"encryptedResponseBIN": cleanresp
													 
								};
								console.log(cleanresp);
								postJSONgetText(postmod, data4).then(respText => 
								{
									const cleanresp = respText
										.replace("\"", "")
										.replace("\\", "\n")
										.replace("n", "")
										.replace(/\\n/g, '\n');
									data5 = {
										"id": uuidv4(),
										"request_type": "ENCresponderClaim",
										"SwapTicketID": swapTicketID,
										"ENCFin": cleanresp
									}
									console.log(localClientPostJSON(data5))
								});
							});
						});
						

					});
					break;
				}
			}
		});
	}
}

function precise(x) {
  return x.toPrecision(6);
}


function coinPriceConversion(amountMod, CoinA_Price, CoinB_Price)
{
	ConversionInCoinA = precise((amountMod * CoinA_Price) / CoinB_Price);
	ConversionInCoinB = precise((amountMod * CoinB_Price) / CoinA_Price);
	console.log("CoinA to B:", ConversionInCoinA, "\nCoinB to A:", ConversionInCoinB);
	return [ConversionInCoinA, ConversionInCoinB];
}

function refreshOrderTypeList()
{
	const orderTypeKey = 'OrderTypeList';
	const existingOrderTypes = JSON.parse(localStorage.getItem(orderTypeKey)) || [];
	const marketlistKey = 'marketlist';
	const existingMarketLists = JSON.parse(localStorage.getItem(marketlistKey)) || [];
	for (market in existingMarketLists)
	{
		getJSON(existingMarketLists[market].marketurl).then((jsonData) => {
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
//				console.log(key, ":", jsonobj[key]);
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
