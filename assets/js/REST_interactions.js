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


function POST_getBoxValue(boxID, boxValPATH, swapName)
{
        checkBoxValueData = {
                "id": uuidv4(),
                "request_type": "checkBoxValue",
                "SwapTicketID": swapName,
                "fileName": boxValPATH,
                "boxID": boxID
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

function POST_get_address_by_boxID(boxID)
{
        getAddressData = {
                "id": uuidv4(),
                "request_type": "SigmaParticle_box_to_addr",
                "boxID": boxID
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

function POST_ENC_responder_claim(swapTicketID)
{
        data = {
                "id": uuidv4(),
                "request_type": "ENCresponderClaim",
                "SwapTicketID": swapTicketID,
        };
        console.log(localClientPostJSON(data));
}

