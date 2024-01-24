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
//TODO: allow to click on an active swap entry, and update the current swap modal UI with the info for that entry

function makeSwapDir(makeSwapDirData, swapTicketID, CoinA, CoinB, coinAmount, postmod, CoinA_Price, CoinB_Price)
{
	localClientPostJSON(makeSwapDirData).then(respText => {
			generateEncryptedResponseData = {
				"id": uuidv4(),
				"request_type": "generateEncryptedResponse",
				"SwapTicketID": swapTicketID,
				"responderCrossChain": CoinA,
				"responderLocalChain": CoinB,
				"ElGamalKey": getElGamalKey(),
				"ElGamalKeyPath": "Key0.ElGamalKey", //TODO
				"swapAmount": coinAmount
			};
			generateEncryptedResponse(generateEncryptedResponseData, swapTicketID, postmod);
			const ConversionArray = coinPriceConversion(coinAmount, CoinA_Price, CoinB_Price);
			AmtCoinB = coinAmount; //we are the responder here
			AmtCoinA = ConversionArray[1]; // TODO Hide active swaps if there aren't any
			representActiveSwap(CoinA, CoinB, AmtCoinA, AmtCoinB, swapTicketID);
			storeActiveSwapInfo(swapTicketID, "Funding", 
				[CoinA, CoinB, AmtCoinB, CoinA_Price, CoinB_Price], 
				"");
			//generate active swap entry here 
		});
}

function generateEncryptedResponse(generateEncryptedResponseData, swapTicketID, postmod)
{
	localClientPostJSON(generateEncryptedResponseData)
		.then( respText => {
			cleanresp = respText
				.replace("\"", "")
				.replace("\\", "\n")
				.replace("n", "")
				.replace(/\\n/g, '\n');
			POST_get_response_data(swapTicketID, JSON.parse(localStorage.getItem(swapTicketID + "_modalFocus"))[0])
			submitEncryptedResponseData = {
				"id": uuidv4(),
				"request_type": "submitEncryptedResponse",
				"SwapTicketID": swapTicketID,
				"encryptedResponseBIN": cleanresp
			};
			//here the responder can check the price of initiator's contract
			//and proceed accordingly
			submitEncryptedResponse(
				submitEncryptedResponseData, swapTicketID, postmod)
		});
}

function submitEncryptedResponse(submitEncryptedResponseData, swapTicketID, postmod)
{
	storeActiveSwapInfo(swapTicketID, "Waiting For Finalization", "", "");
	postJSONgetText(postmod, submitEncryptedResponseData).then(respText =>
	{
		cleanresp = respText
				.replace("\"", "")
				.replace("\\", "\n")
				.replace("n", "")
				.replace(/\\n/g, '\n');
		POST_write_ENC_finalization(swapTicketID, cleanresp);
		POST_ElGamal_decrypt_swapFile(
			swapTicketID,
			"ENC_finalization.bin",
			getElGamalKey(),
			"Key0.ElGamalKey").then(function(result){
				console.log(result);
				cleanresult = result
					.replace(/[\n\r\s]+/g, '')
					.split('\n').join('')
					.replace(/\\n/g, '')
					.slice(1, -1)
					.replaceAll("\\", '');
				console.log(cleanresult);
				j = JSON.parse(cleanresult);
				boxid = j["boxId"];
				console.log("boxID: ", boxid);
				responder_ergobox_finalUI(boxid, swapTicketID, 
					JSON.parse(localStorage.getItem(swapTicketID + "_modalFocus"))[0]);
				storeActiveSwapInfo(swapTicketID, "Finalized", "", [boxid]);
			});
	});
}

function responder_ergobox_finalUI(boxid, swapTicketID, UI_bool)
{
	POST_get_address_by_boxID(boxid)
		.then(function(result){
			console.log("address:", result);
			cleanresult = result.replaceAll("\"", "");
			POST_getBoxValue(boxid, "boxValue", swapTicketID)
				.then(function(result){
					console.log("box value:", result);
					nanoergs = result.replaceAll("\"", "");
					ergs = NanoErgToErg(nanoergs);
					if (UI_bool == true)
					{
						updateSwapFinalizationStatus(swapTicketID, cleanresult, ergs)
					}
		//enforce manual or automated configuration here
					storeActiveSwapInfo(swapTicketID, "Unclaimed", "", [ergs]); 
					//make sure ergs are stored in metalist
					POST_ENC_responder_claim(swapTicketID);
					storeActiveSwapInfo(swapTicketID, "Claimed", "", "");
				});
		});
}


