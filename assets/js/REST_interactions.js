//TODO: modularly inject a local or server-compatible REST-API key at the REST interaction function call
//
//on client side: just generate a key, save it to accepted private keys json, create a private GET endpoint to read the json,
//read it into local storage (or just one key depending on the userflow undetermined), have a function return that key, 
//feed it into the (new) REST API key argument that should be added to REST API interaction functions

function manualAddPrivateAcceptedClientAPIKeytoLocalStorage(APIKey)
{
	acceptedPrivateAPIKeysLocalStorageKey = "acceptedPrivateClientAPIKeys";
	if (localStorage.getItem(acceptedPrivateAPIKeysLocalStorageKey))
	{
		currentkeysobj = JSON.parse(localStorage.getItem(acceptedPrivateAPIKeysLocalStorageKey));
		currentkeysobj[Object.keys(currentkeysobj).length] = APIKey;
		localStorage.setItem(acceptedPrivateAPIKeysLocalStorageKey, JSON.stringify(currentkeysobj))
		console.log(localStorage.getItem(acceptedPrivateAPIKeysLocalStorageKey));
	}
	else
	{
		obj = {
			0: APIKey
		}
		localStorage.setItem(acceptedPrivateAPIKeysLocalStorageKey, JSON.stringify(obj));
	}
}

function updateAcceptedPrivateClientAPIKeysStorage()
{
	//TODO: make the private GET endpoint for these keys
	//
	//TODO: solve "chicken or egg" with first API key, for now client is not hosted online at all so this key will be...
	//somewhat irrelevant, however if the client ever hosts any endpoints online, this key will be more security critical,
	//initially key will just connect the frontend to the backend on the users own device,
	//in the future these keys could be used to apply certain permissions to someone connecting to the client accross the internet
	url = "http://localhost:3031/v0.0.1/acceptedPrivateAPIKeys";
	getJSON(url).then((result) => {
		obj = JSON.parse(result);
		acceptedPrivateAPIKeysLocalStorageKey = "acceptedPrivateClientAPIKeys";
		localStorage.setItem(acceptedPrivateAPIKeysLocalStorageKey, JSON.stringify(obj));
	});
}

function getBottomPrivateClientRESTAPIKeyFromLocalStorage()
{
	acceptedPrivateAPIKeysLocalStorageKey = "acceptedPrivateClientAPIKeys";
        if (localStorage.getItem(acceptedPrivateAPIKeysLocalStorageKey))
        {
		currentkeys = JSON.parse(localStorage.getItem(acceptedPrivateAPIKeysLocalStorageKey));
		bottomkey = currentkeys[0];
		return bottomkey
	}
	else
	{
		console.log("no private client REST API keys found in local storage!")
	}
}

function localClientPostJSON(data)
{
        url = "http://localhost:3031/v0.0.1/requests"
        const headers = {
                Authorization: "Bearer " + getBottomPrivateClientRESTAPIKeyFromLocalStorage(),
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

function initSepoliaAccountNonInteractive(SepoliaSenderAddr, SepoliaPrivKey, SepoliaRPC, SepoliaChainID, SepoliaScan, 
	SolidityCompilerVersion, FullDirPath, FullEnvPath)
{
	initSepoliaAccountNonInteractiveData = {
		"id": uuidv4(),
                "request_type": "initSepoliaAccountNonInteractive",
		"SepoliaSenderAddr": SepoliaSenderAddr, 
		"SepoliaPrivKey": SepoliaPrivKey, 
		"Sepolia": SepoliaRPC,
		"SepoliaID": SepoliaChainID,
		"SepoliaScan": SepoliaScan,
		"SolidityCompilerVersion": SolidityCompilerVersion,
		"FullDirPath": FullDirPath,
		"FullEnvPath": FullEnvPath
	}
	return localClientPostJSON(initSepoliaAccountNonInteractiveData).then( respText => {
                return respText
        });
}

function initErgoAccountNonInteractive(testnetNode, mnemonic, mnemonicPass, senderEIP3Secret, senderPubKey, apiURL, fulldirpath, fullenvpath)
{
        initErgoAccountNonInteractiveData = {
                "id": uuidv4(),
                "request_type": "initErgoAccountNonInteractive",
                "ErgoTestnetNodeURL": testnetNode,
                "ErgoMnemonic": mnemonic,
		"ErgoMnemonicPass": mnemonicPass, 
		"ErgoSenderEIP3Secret": senderEIP3Secret,
		"ErgoSenderPubKey": senderPubKey,
		"ErgoAPIURL": apiURL,
		"FullDirPath": fulldirpath,
		"FullEnvPath": fullenvpath
        }
        return localClientPostJSON(initErgoAccountNonInteractiveData).then( respText => {
                return respText
        });

}


function updateMainEnv(Key, Value)
{
	updateMainEnvData = {
		"id": uuidv4(),
		"request_type": "updateMainEnv",
		"Key": Key,
		"Value": Value
	}
	return localClientPostJSON(updateMainEnvData).then( respText => {
		return respText
	});

}

function postJSONgetText(url, data, APIKey) //neccesarily NON LOCAL / PRIVATE CLIENT POSTS
{
	if (APIKey)
        {
		const headers = {
			Authorization: "Bearer " + APIKey,
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
	else
        {
                console.log("no APIKey provided");
        }
}

function loadStarterRESTAPIKeysFromMarketUrl(marketURL)
{
	newURL = marketURL.replace("ordertypes", "publicrequests/starterAPIKeys")
	console.log(newURL);
	getJSON(newURL).then((starterAPIKeysJSON) =>
		{
				try{

					localStorage.setItem(newURL, starterAPIKeysJSON);
				}
				catch (e)
				{
					console.error("Error in  setItem:", e);
				}
				console.log(starterAPIKeysJSON);
//			obj = JSON.parse(starterAPIKeysJSON);
		})
}

function getStarterRESTAPIKeyFromMarketUrlAtIndex(marketURL, index)
{
	newURL  = marketURL.replace("ordertypes", "publicrequests/starterAPIKeys");
	console.log(newURL);
	console.log(localStorage.getItem(newURL));
	starterKeysString = localStorage.getItem(newURL);
	console.log(starterKeysString);
	starterKeysOBJ = JSON.parse(starterKeysString);
	if (starterKeysOBJ.hasOwnProperty(index))
	{
		return 	starterKeysOBJ[index]
	}
	else
	{
		console.log("no starter key at index!");
	}
}

function POST_loginToPasswordEncryptedAccount(Chain, AccountName, Password)
{

	data = {
		"id": uuidv4(),
		"request_type": "logInToPasswordEncryptedAccount",
		"Chain": Chain,
		"AccountName": AccountName,
		"Password": Password
	}
	return localClientPostJSON(data).then(function(result) {
		console.log(result.replace(/"/g, ''));
		cleanresult = result.replace(/"/g, '');
		if (cleanresult === "True")
		{
			return true;
		}
		/*if (cleanresult === "false")
		{}*/ //needs to be implemented at REST API level still

	})
}

function postJSON(url, data, APIKey) //neccesarily NON LOCAL / PRIVATE CLIENT POSTS
{
	if (APIKey)
	{
		const headers = {
			Authorization: "Bearer " + APIKey,
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
	else
	{
		console.log("no APIKey provided");
	}
}

function getJSON(url)
{
/*		const authHeaders = {
			Authorization: "Bearer " + APIKey,
		};*/
		return fetch(url, {
			method: "GET",
		}).then((res) => res.text()).then((textres) => JSON.parse(textres)).then((json) => json)
}

function getAllChainAccountsJSON()
{
	url = "http://localhost:3031/v0.0.1/AllChainAccountsMap"
	return getJSON(url)
}

function POST_getBoxValue(boxID, boxValPATH, swapName, crossChain)
{
        checkBoxValueData = {
                "id": uuidv4(),
                "request_type": "checkBoxValue",
                "SwapTicketID": swapName,
                "fileName": boxValPATH,
                "boxID": boxID,
		"CrossChain": crossChain
        }
        return localClientPostJSON(checkBoxValueData).then( respText => {
                return respText
        });
}

function POST_ElGamal_decrypt_swapFile(swapTicketID, SwapFileName, ElGamalKey, ElGamalKeyPath)
{
        ElGamalDecryptData = {
                "id": uuidv4(),
                "request_type": "ElGamal_decrypt_swapFile",
                "SwapTicketID": swapTicketID,
                "SwapFileName": SwapFileName,
                "ElGamalKey": ElGamalKey,
                "ElGamalKeyPath": ElGamalKeyPath
        };
        return localClientPostJSON(ElGamalDecryptData).then( respText => {
                return respText
        });
}

function POST_get_address_by_boxID(boxID, swapTicketID)
{
        getAddressData = {
                "id": uuidv4(),
                "request_type": "SigmaParticle_box_to_addr",
                "boxID": boxID,
		"swapName": swapTicketID
        };
        return localClientPostJSON(getAddressData).then( respText => {
                return respText;
        });

}

function POST_get_response_data(swapTicketID, UI_bool)
{
        getResponseData = {
                "id": uuidv4(),
                "request_type": "readSwapFile",
                "SwapTicketID": swapTicketID,
                "SwapFileName": "response_path.json"
        };
        localClientPostJSON(getResponseData).then( respText => {
                var cleanresp = respText
                        .replace(/[\n\r\s]+/g, '')
                        .split('\n').join('')
                        .replace(/\\n/g, '')
                        .slice(1, -1)
                        .replaceAll("\\", '');
                console.log(cleanresp);
                cleanrespjsonobj = JSON.parse(cleanresp);
                console.log(cleanrespjsonobj);
                contractAddr = cleanrespjsonobj["responderContractAddr"];
		if (UI_bool == true)
		{
		// UI
	                updateSwapResponseStatus(swapTicketID, contractAddr);
		//
		}
		storeActiveSwapInfo(swapTicketID, "Submitting", "", [contractAddr]);
        });
}

function POST_write_ENC_finalization(swapTicketID, ENCfin)
{
        writeFinalizationData = {
                "id": uuidv4(),
                "request_type": "writeSwapFile",
                "SwapTicketID": swapTicketID,
                "SwapFileName": "ENC_finalization.bin",
                "FileContents": ENCfin
        };
        localClientPostJSON(writeFinalizationData)
}

function POST_ReloadAllSwapStates()
{
	ReloadData = {
		"id": uuidv4(),
                "request_type": "reloadAllSwapStates"
	}
	localClientPostJSON(ReloadData).then(function(result) {
		console.log(result);	
	});
}

function POST_getResponseBIN_bySwapID(swapTicketID)
{
	POST_getResponseBIN_bySwapID_data = {
                "id": uuidv4(),
                "request_type": "readSwapFile",
                "SwapTicketID": swapTicketID,
                "SwapFileName": "ENC_response_path.bin"
        }
        return localClientPostJSON(POST_getResponseBIN_bySwapID_data)
}

function POST_getResponderJSON_bySwapID(swapTicketID)
{
	POST_getResponderJSON_bySwapID_data = {
		"id": uuidv4(),
                "request_type": "readSwapFile",
                "SwapTicketID": swapTicketID,
                "SwapFileName": "responder.json"
	}
	return localClientPostJSON(POST_getResponderJSON_bySwapID_data)
}

function POST_getMarketURL_bySwapID(swapTicketID)
{
	getMarketURL_bySwapID_data = {
		"id": uuidv4(),
                "request_type": "readSwapFile",
                "SwapTicketID": swapTicketID,
                "SwapFileName": "MarketURL"
	}
	return localClientPostJSON(getMarketURL_bySwapID_data);
}

function POST_saveMarketURLToSwapFolder(swapTicketID, URL)
{
	saveMarketURLData = {
		"id": uuidv4(),
                "request_type": "writeSwapFile",
                "SwapTicketID": swapTicketID,
		"SwapFileName": "MarketURL",
		"FileContents": URL
	}
	return localClientPostJSON(saveMarketURLData);
}


function POST_ENC_responder_claim(swapTicketID)
{
        data = {
                "id": uuidv4(),
                "request_type": "ENCresponderClaim",
                "SwapTicketID": swapTicketID,
        };
        console.log(localClientPostJSON(data));
}

