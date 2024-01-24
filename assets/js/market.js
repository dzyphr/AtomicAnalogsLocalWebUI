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

//create some local storage for active swaps
//allocate to it only the most vital high level data such as  what stage of the swap its at
//when the swap modal is closed, shut down the UI parts of the loop, leave the other interactions going
//update the local storage as the other interactions finish
//if the user brings the swap back up again, bring up a newly hydrated modal, use the local storage to determine
//which stage of the swap its at, use calls to backend to populate with accurate data
//info list needs at least 6 items. Items: CoinA, CoinB, CoinB_Amt, CoinA_price, CoinB_price
function storeActiveSwapInfo(swapTicketID, Stage, infoList, metaList)
{
	//Stages:
	//Funding 
	//Submitting
	//Waiting for Finalization
	//Finalized
	//Claimed (to be deleted)
	//Unclaimed (claim or refund cycle then deleted)
	if (Stage == "Funding")
	{
		//the swap just started, we need to get all it's high level info to store
		if (infoList.length == 5)
		{
			infoList.push(Stage);
			localStorage.setItem(swapTicketID, JSON.stringify(infoList)); // save info list to local storage @swapID
		}
		else
		{
			console.log("info list needs exactly 5 items on funding." + 
				"Items: CoinA, CoinB, CoinB_Amt, CoinA_price, CoinB_price")
			return false
		}
	}
	if (Stage == "Submitting")
	{
		if (metaList.length == 1)
                {
			//we have the contract address that we funded already
                        //metalist should contain a single item which is the funded address
			localStorage.setItem(swapTicketID + "_meta", JSON.stringify(metaList));
			infoList = JSON.parse(localStorage.getItem(swapTicketID));
			infoList.pop();
			infoList.push(Stage);
			localStorage.setItem(swapTicketID, JSON.stringify(infoList));
		}
		else
                {
                        console.log("meta list requires exactly 1 item in Submitting stage. Item: funded address")
                        return false
                }
	}
	if (Stage == "Waiting for Finalization")
	{
		infoList = JSON.parse(localStorage.getItem(swapTicketID));
		infoList.pop();
		infoList.push(Stage);
		localStorage.setItem(swapTicketID, JSON.stringify(infoList));
	}
	if (Stage == "Finalized")
	{
		//we have the contract address from the finalizer / initiator
		//can be just box id because we can get its address and value in UI function
		if (metaList.length == 1)
                {
			updateMetaList = JSON.parse(localStorage.getItem(swapTicketID + "_meta"));
			finalizedAddr = metaList[0];
			updateMetaList.push(finalizedAddr)
			localStorage.setItem(swapTicketID + "_meta", JSON.stringify(updateMetaList));
			infoList = JSON.parse(localStorage.getItem(swapTicketID));
			infoList.pop();
			infoList.push(Stage);
			localStorage.setItem(swapTicketID, JSON.stringify(infoList));
		}
		else
		{
			console.log("meta list requires exactly 1 item in Submitting stage. Item: funded address")
                        return false
		}
	}
	if (Stage == "Claimed")
	{
		//finalized contract has been spent from already from claim or refund
		infoList = JSON.parse(localStorage.getItem(swapTicketID));
		infoList.pop();
                infoList.push(Stage);
                localStorage.setItem(swapTicketID, JSON.stringify(infoList));
	}
	if (Stage == "Unclaimed")
	{
		//finalized contract has NOT been spent from already from claim or refund
		if (metaList.length == 1)
                {
			updateMetaList = JSON.parse(localStorage.getItem(swapTicketID + "_meta"));
                        scriptBalance = metaList[0];
                        updateMetaList.push(scriptBalance)
                        localStorage.setItem(swapTicketID + "_meta", JSON.stringify(updateMetaList));
			infoList = JSON.parse(localStorage.getItem(swapTicketID));
			infoList.pop();
			infoList.push(Stage);
			localStorage.setItem(swapTicketID, JSON.stringify(infoList));
		}
		else
		{
			console.log("meta list requires exactly 1 item in Unclaimed stage. Item: script/addr balance")
			//need balance of the output or contract that we can claim from 
                        return false
		}
	}
	if (Stage == "SettingAutoClaim")
	{
		if (metaList.length == 2)
                {
			localStorage.setItem(swapTicketID + "_autoclaim", JSON.stringify(metaList))
                }
                else
                {
                        console.log("meta list requires exactly 2 items in SettingAutoClaim. " + 
				"Items: [AutoClaim(Boolean), MinAutoClaimVal(int)].")
                        return false
                }
	}
	if (Stage == "SettingModalFocus")
	{
		if (metaList.length == 1) //1 item: modalFocus(bool)
                {
                        localStorage.setItem(swapTicketID + "_modalFocus", JSON.stringify(metaList))
                }
		else
                {
                        console.log("meta list requires exactly 1 item in SettingModalFocus. " +
                                "Item: [modalFocus(bool)]")
                        return false
                }
	}
	console.log(localStorage.getItem(swapTicketID));
	console.log(localStorage.getItem(swapTicketID + "_meta"))
	console.log(localStorage.getItem(swapTicketID + "_autoclaim"));
	console.log(localStorage.getItem(swapTicketID + "_modalFocus"));
}


//boolean for if this is the current swap (to look at in the modal)
//if yes populate the modal UI when the swap updates in each step
//if no only push info to local storage
//after allow to click on an active swap entry, and update the current swap modal UI with the info for that entry

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


