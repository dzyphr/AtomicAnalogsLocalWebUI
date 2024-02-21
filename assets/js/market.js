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

		//http://127.0.0.1:3030/v0.0.1/ordertypes
		//marketurl will look like this:e add.r.e.ss:port/apiversion/ordertypes
		//ElGamal Q Channels located in this directory: apiversion/publicrequests/ElGamalQChannels
		//ElGamal Public Keys located in this directory: apiversion/publicrequests/ElGamalPubs
		//ElGamal QPubkey Array located in this directory: apiversion/publicrequests/QPubkeyArray
		//we need some info about the market to proceed:
		//ElGamal Q Channel and Corresponding Public Key
		//Use this to determine communicable Public Key for our client
		//After this proceed the swap normally using the selected Key
		QChannelURL = marketurl.value.replace("ordertypes", "publicrequests/ElGamalQChannels");
		ElGPubKeyURL = marketurl.value.replace("ordertypes", "publicrequests/ElGamalPubs");
		QPubKeyArrayURL = marketurl.value.replace("ordertypes", "publicrequests/QPubkeyArray");
		QPubKeyArray_JSON = getJSON(QPubKeyArrayURL).then( result => { loadCompatibleElGPubKeyFromQChannelArray(result); } );
		ElGPubKey_JSON = getJSON(ElGPubKeyURL).then( result => { return result; } );
		QChannels_JSON = getJSON(QChannelURL).then( result => {  } );
		refreshOrderTypeList();
	}
}

function superclean(string)
{
	return string.replace(/(\r\n|\n|\r)/gm, "").trim().replace(/\\n/g, '').replace(/["\\]/g, '');
}

function loadCompatibleElGPubKeyFromQChannelArray(QChannelArrayJSON, marketurl)
{
	console.log(QChannelArrayJSON);
	obj = JSON.parse(QChannelArrayJSON);
	//marketurl information storage for elgamal {marketurl_ElGCompatKeys: [Store, Each, PubKey, In List]}
	//if multiple keys and one key is found not to work remove it immediately 
	//(only removed at high level still exists at local storage to deal with retiring entire Q Channels and subsequent keys later)
	for (var each in obj)
	{
		//TODO check for existing Q Channel Match
		if (checkElGQChannelCorrectness(each) == true)
		{
			generateElGKeySpecificQ(each, marketurl)
			break //optionally later create more per market?
			//then match the key to the market in local storage somewhere
		}
	}
}

function generateElGKeySpecificQ(Q, marketurl)
{
	marketElGStorageKey = marketurl + "_ElGCompatKeys"
	let generateElGKeySpecificQdata = {
		"id": uuidv4(),
                "request_type": "generateElGKeySpecificQ",
		"QChannel": Q
	}
	localClientPostJSON(generateElGKeySpecificQdata).then( newKeyText =>
                {
			cleanNewKey = superclean(newKeyText);
			if(
				localStorage.getItem(marketElGStorageKey) === null || 
				localStorage.getItem(marketElGStorageKey) === undefined
			)
			{
				localStorage.setItem(marketElGStorageKey, JSON.stringify([cleanNewKey]));
				console.log(localStorage.getItem(marketElGStorageKey));
			}
			else
			{
				list = JSON.parse(localStorage.getItem(marketElGStorageKey));
				console.log(list);
				if (Array.isArray(list))
				{
					list.push(cleanNewKey);
					localStorage.setItem(marketElGStorageKey, JSON.stringify(list));
					console.log(localStorage.getItem(marketElGStorageKey))
				}
				else
				{
					list = [list];
					list.push(cleanNewKey);
                                        localStorage.setItem(marketElGStorageKey, JSON.stringify(list));
                                        console.log(localStorage.getItem(marketElGStorageKey))
				}
			}
                });
}

function checkElGQChannelCorrectness(Q)
{
	let checkElGQChannelCorrectnessData  = {
		"id": uuidv4(),
                "request_type": "checkElGQChannelCorrectness",
		"QChannel": Q
	}
	if (localClientPostJSON(checkElGQChannelCorrectnessData)
	    .then(respText => respText === "true"))
	{
		return true
	}
	else if (localClientPostJSON(checkElGQChannelCorrectnessData)
            .then(respText => respText === "false"))
        {
                return false
        }

}

function removeMarket()
{//untested
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


