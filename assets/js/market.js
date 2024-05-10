function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
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
		console.log("adding market")
		localStorage.setItem(marketKey, JSON.stringify(existingMarkets));
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
/*		setTimeout(function() {
		console.log(getStarterRESTAPIKeyFromMarketUrlAtIndex(marketurl.value, 0));
		}, 100); //takes a while to store used somewhere less than 100ms*/
		ElGPubKey_JSON = getJSON(ElGPubKeyURL).then( result => { return result; } );
		QGChannels_JSON = getJSON(QGChannelURL).then( result => {  } );
		//replace todos with get bottom api key for this specific market function to be made
		refreshOrderTypeList();
	}
}

function syncLocalElGamalPubKeyIndexes()
{
	ElGamalKeyLocalIndexesStorageKey = "ElGamalKeyLocalIndexes"
	ElGamalPubsEndpointURL = "http://127.0.0.1:3031/v0.0.1/ElGamalPubs"
	getJSON(ElGamalPubsEndpointURL).then((result) => {
		resJSON = JSON.parse(result);
		localStorage.setItem(ElGamalKeyLocalIndexesStorageKey, JSON.stringify(resJSON)) 
	});
}

function getKeyByVal(obj, val)
{
	return Object.keys(obj).find(key => obj[key] === val)
}

function getLocalElGamalPubKeyIndexFromLocalStorage(pubkey)
{
	ElGamalKeyLocalIndexesStorageKey = "ElGamalKeyLocalIndexes"
	currentkeysobj = JSON.parse(localStorage.getItem(ElGamalKeyLocalIndexesStorageKey))
	var index = getKeyByVal(currentkeysobj, pubkey)
	if (index !== undefined)
	{
		return index;
	}
	else
	{

		console.log("Given ElGamal PubKey Not Found in Local Storage Indexes.\n PubKey: ", pubkey)
	}

}

function superclean(string)
{
	return string.replace(/(\r\n|\n|\r)/gm, "").trim().replace(/\\n/g, '').replace(/["\\]/g, '');
}

function loadCompatibleElGPubKeyFromQGChannelArray(QGChannelArrayJSON, marketurl)
{
	console.log(QGChannelArrayJSON);
	obj = JSON.parse(QGChannelArrayJSON);
	//marketurl information storage for elgamal {marketurl_ElGCompatKeys: [Store, Each, PubKey, In List]}
	//if multiple keys and one key is found not to work remove it immediately 
	//(only removed at high level still exists at local storage to deal with retiring entire Q Channels and subsequent keys later)
	for (var each in obj)
	{
		//TODO check for existing Q Channel Match
		if (checkElGQGChannelCorrectness(each) == true)
		{
			console.log("generating new pubkey")
			QGPubKeys = obj[each]
			var QGPubMatch;
			if (Array.isArray(QGPubKeys) == true)
			{
				QGPubMatch = QGPubKeys[0] //TODO use others in list
			}
			else
			{
				QGPubMatch = QGPubKeys
			}
			generateElGKeySpecificQG(each, QGPubMatch, marketurl)
			break //optionally later create more per market?
			//then match the key to the market in local storage somewhere
		}
	}
	if (isEmptyObject(obj) == true)
	{
		console.log("Error: QPubKeyArray  Object returned empty!");
	}
}

function generateElGKeySpecificQG(QG, QGPubMatch, marketurl)
{
	
	marketElGStorageKey = marketurl + "_ElGCompatKeys";
	marketElGQGChannelStoragekey = marketurl + "_ElGCompatQGChannels";
	ElGPubKeyIndexArrayStorageKey = "ElGPubKeyIndexArray";
	let generateElGKeySpecificQGdata = {
		"id": uuidv4(),
                "request_type": "generateElGKeySpecificQG",
		"QGChannel": QG
	}
	if (
		localStorage.getItem(marketElGQGChannelStoragekey) == null || 
		localStorage.getItem(marketElGQGChannelStoragekey) == undefined
	)
	{
		localStorage.setItem(marketElGQGChannelStoragekey, JSON.stringify([QG]));
	}
	else
	{
		list = JSON.parse(localStorage.getItem(marketElGQGChannelStoragekey));
		if (Array.isArray(list))
		{
			list.push(QG);
			localStorage.setItem(marketElGQGChannelStoragekey, JSON.stringify(list));
		}
		else
		{
			list = [list];
                        list.push(QG);
			localStorage.setItem(marketElGQGChannelStoragekey, JSON.stringify(list));
		}
	}
	localClientPostJSON(generateElGKeySpecificQGdata).then( newKeyText =>
                {
			keyresparray = newKeyText.split(' ');
			cleankeyindex = superclean(keyresparray[1]);
			cleanNewKey = superclean(keyresparray[0]);
			marketElGQGPubMatchStorageKey = marketurl + "_QGPubMatch" + "_" + cleanNewKey;
			localStorage.setItem(marketElGQGPubMatchStorageKey, QGPubMatch); //connect new key to server's key in local
			//localStorage.setItem(cleanNewKey, cleankeyindex); //set result of each pubkey to its local index, convenience
			//DEFUNCT ^^^
			//Replaced with:
			syncLocalElGamalPubKeyIndexes()		
			if(
				localStorage.getItem(marketElGStorageKey) === null || 
				localStorage.getItem(marketElGStorageKey) === undefined
			)
			{
				console.log(cleanNewKey);
				localStorage.setItem(marketElGStorageKey, JSON.stringify([cleanNewKey]));
				console.log("ElGKeyTest:", localStorage.getItem(marketElGStorageKey));
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

function checkElGQGChannelCorrectness(QG)
{
	let checkElGQGChannelCorrectnessData  = {
		"id": uuidv4(),
                "request_type": "checkElGQGChannelCorrectness",
		"QGChannel": QG
	}
	if (localClientPostJSON(checkElGQGChannelCorrectnessData)
	    .then(respText => respText === "true"))
	{
		return true
	}
	else if (localClientPostJSON(checkElGQGChannelCorrectnessData)
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

function makeSwapDir(makeSwapDirData, swapTicketID, CoinA, CoinB, coinAmount, postmod, CoinA_Price, CoinB_Price, marketurl)
{
	localClientPostJSON(makeSwapDirData).then(respText => {

			POST_saveMarketURLToSwapFolder(swapTicketID, marketurl).then(function(result) {
				POST_getMarketURL_bySwapID(swapTicketID).then(function(result) { console.log(result); })
			});
			console.log("ElGamalKeyPath")
			ElGamalKeyPath = "Key" + getLocalElGamalPubKeyIndexFromLocalStorage(getElGamalKey(marketurl)) + ".ElGamalKey";
			
			console.log(ElGamalKeyPath);
			console.log(marketurl);
			console.log("QPubMatchStorageKey")
			QGPubMatchStorageKey = marketurl + "_QGPubMatch" + "_" + getElGamalKey(marketurl);
			QGPubMatchElGMarketServerKey = localStorage.getItem(QGPubMatchStorageKey);
			generateEncryptedResponseData = {
				"id": uuidv4(),
				"request_type": "generateEncryptedResponse",
				"SwapTicketID": swapTicketID,
				"responderCrossChain": CoinA,
				"responderLocalChain": CoinB,
				"ElGamalKey": QGPubMatchElGMarketServerKey, //SERVER's Key here!!!
				"ElGamalKeyPath": ElGamalKeyPath, 
				"swapAmount": coinAmount
			};
			generateEncryptedResponse(generateEncryptedResponseData, swapTicketID, postmod, marketurl, CoinA, CoinB)
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

function generateEncryptedResponse(generateEncryptedResponseData, swapTicketID, postmod, marketurl, CoinA, CoinB)
{
	localClientPostJSON(generateEncryptedResponseData)
		.then( respText => {
			cleanresp = respText
				.replace("\"", "")
				.replace("\\", "\n")
				.replace("n", "")
				.replace(/\\n/g, '\n');
			//local call vv
			POST_get_response_data(swapTicketID, JSON.parse(localStorage.getItem(swapTicketID + "_modalFocus"))[0])
			submitEncryptedResponseData = {
				"id": uuidv4(),
				"request_type": "submitEncryptedResponse",
				"SwapTicketID": swapTicketID,
				"encryptedResponseBIN": cleanresp
			};
			//here the responder can check the price of initiator's contract
			//and proceed accordingly
			//to server call vv
			submitEncryptedResponse(
				submitEncryptedResponseData, swapTicketID, postmod, marketurl, CoinA, CoinB)
		});
}

function submitEncryptedResponse(submitEncryptedResponseData, swapTicketID, postmod, marketurl, CoinA, CoinB)
{
	storeActiveSwapInfo(swapTicketID, "Waiting For Finalization", "", "");
	postJSONgetText(
		postmod, 
		submitEncryptedResponseData,
		getStarterRESTAPIKeyFromMarketUrlAtIndex(marketurl, 0)
	).then(respText =>
	{
		cleanresp = respText
				.replace("\"", "")
				.replace("\\", "\n")
				.replace("n", "")
				.replace(/\\n/g, '\n');
		POST_write_ENC_finalization(swapTicketID, cleanresp);
		keypath = "Key" + getLocalElGamalPubKeyIndexFromLocalStorage(getElGamalKey(marketurl)) + ".ElGamalKey";
		QGPubMatchStorageKey = marketurl + "_QGPubMatch" + "_" + getElGamalKey(marketurl);
                QGPubMatchElGMarketServerKey = localStorage.getItem(QGPubMatchStorageKey);
		POST_ElGamal_decrypt_swapFile(
			swapTicketID,
			"ENC_finalization.bin",
			QGPubMatchElGMarketServerKey,
			keypath
		).then(function(result){
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
				responder_ergobox_finalUI(
					boxid, swapTicketID, 
					JSON.parse(localStorage.getItem(swapTicketID + "_modalFocus"))[0],
					CoinA, CoinB
				);
				storeActiveSwapInfo(swapTicketID, "Finalized", "", [boxid]);
			});
	});
}

function responder_ergobox_finalUI(boxid, swapTicketID, UI_bool, CoinA, CoinB)
{
	POST_get_address_by_boxID(boxid, swapTicketID)
		.then(function(result){
			console.log("address:", result);
			cleanresult = result.replaceAll("\"", "");
			crossChain = CoinB; 
			//since checking ergo box value cross chain means whatever other chain is used
			POST_getBoxValue(boxid, "boxValue", swapTicketID, crossChain)
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

