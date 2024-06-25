async function updateActiveSwapFocusedModals()
{
	while (true)
	{
		getSwapStateMap().then(SwapStateMap => {
			for (key in SwapStateMap)
			{
				modalFocus = JSON.parse(localStorage.getItem(key + "_modalFocus"))[0]
				console.log(modalFocus)
				if (modalFocus == true)
				{
					loadModalInfoFromStorage(key)
					break
				}
			}
		});	
		await new Promise(r => setTimeout(r, 10000));
	}
}

function loadModalInfoFromStorage(swapTicketID)
{
	PossibleSwapStates = [
		"initiated", //0
		"uploadingResponseContract", //1
		"uploadedResponseContract", //2
		"fundingResponseContract", //3
		"fundedResponseContract",  //4
		"responding", //5
		"responded_unsubmitted", //6
		"responded_submitted", //7
		"finalized", //8
		"verifyingFinalizedContractValues", //9
		"verifiedFinalizedContractValues", //10
		"claiming", //11
		"refunding", //12
		"claimed", //13
		"refunded", //14
		"terminated", //15
		"tbd"//16
	];
	Beginning = [
		PossibleSwapStates[0],
		PossibleSwapStates[1],
		PossibleSwapStates[2],
		PossibleSwapStates[3]
	]
	Middle = [
                PossibleSwapStates[4],
                PossibleSwapStates[5],
                PossibleSwapStates[6],
                PossibleSwapStates[7],
		PossibleSwapStates[8],
		PossibleSwapStates[9]
        ]
	End = [
		PossibleSwapStates[10],
                PossibleSwapStates[11],
                PossibleSwapStates[12],
                PossibleSwapStates[13],
                PossibleSwapStates[14],
                PossibleSwapStates[15],
		PossibleSwapStates[16]
	]
	console.log(Beginning, Middle, End)

	getSwapStateMap().then(result => {
		SwapStateMap = result
		for (key in SwapStateMap)
		{
			if (key == swapTicketID)
			{
				SwapState = SwapStateMap[key]["SwapState"]
				if (Beginning.includes(SwapState) == true)
				{
					showStartingOrderIDModal(swapTicketID)

				}
				if (Middle.includes(SwapState) == true)
				{
                                        POST_get_responderJSON_by_swap_ID(swapTicketID).then(response => {
                                                cleanresp = response.replace(/[\n\r\s]+/g, '')
                                                        .split('\n').join('')
                                                        .replace(/\\n/g, '')
                                                        .slice(1, -1)
                                                        .replaceAll("\\", '')
                                                console.log(JSON.parse(cleanresp))
						responderJSON = JSON.parse(cleanresp)
						EVMContractAddr = responderJSON["responderContractAddr"]
						showStartingOrderIDModal(swapTicketID)
				                updateSwapResponseStatus(swapTicketID, EVMContractAddr)
                                        })
				}
				if (End.includes(SwapState) == true)
				{
					POST_get_responderJSON_by_swap_ID(swapTicketID).then(response => {
						cleanresp = response.replace(/[\n\r\s]+/g, '')
                                                        .split('\n').join('')
                                                        .replace(/\\n/g, '')
                                                        .slice(1, -1)
                                                        .replaceAll("\\", '')
						responderJSON = JSON.parse(cleanresp)
						EVMContractAddr = responderJSON["responderContractAddr"]
						boxID = responderJSON["boxId"]
						console.log(POST_get_boxAddr(swapTicketID))
						POST_get_boxAddr(swapTicketID).then(ergoaddr => {
							console.log(ergoaddr.replaceAll("\"", ""))
							ErgoAddr = ergoaddr.replaceAll("\"", "")
							POST_getBoxValue(swapTicketID).then( response => {
								ergs = NanoErgToErg(response.replaceAll("\"", ""))
								showStartingOrderIDModal(swapTicketID);
								updateSwapResponseStatus(swapTicketID, EVMContractAddr);
								updateSwapFinalizationStatus(swapTicketID, ErgoAddr, ergs)
							});
						})
					})
				}
			}
		}
	});
}

function showStartingOrderIDModal(swapTicketID)
{
        window.dialog.showModal();
        const ID = "<h1>Swap ID:</h1><p>" + swapTicketID + "</p>"
        document.getElementById("swapiddiv").innerHTML = ID;
        document.getElementById("swapresponsestatusdiv").style.display = "none";
        document.getElementById("autoclaimdiv").style.display = "none";
        document.getElementById("swapfinalizeddiv").style.display = "none";
	modalX = document.getElementById("modalX");
	modalX.addEventListener("click",
		function (event)
		{
			storeActiveSwapInfo(swapTicketID, "SettingModalFocus", "", [false]);
		}
	);
}

function updateSwapResponseStatus(swapTicketID, address)
{

        var swapresponsestatusdivelement = document.getElementById("swapresponsestatusdiv")
        swapresponsestatusdivelement.style.display = "block";


        while(swapresponsestatusdivelement.firstChild)
        {
                swapresponsestatusdivelement.removeChild(swapresponsestatusdivelement.firstChild)
        }
        swapresponsestatusdivelement.insertAdjacentHTML("beforeend", "<h1>Swap Contract Uploaded</h1>" +
              "<h2><a href=\"https://sepolia.etherscan.io/address/" + address  + "\" >" +
              "Sepolia Etherscan Contract Address</a></h2>");
        //TODO Chain Specific
        var autoclaimdivelement = document.getElementById("autoclaimdiv");
	var autoClaimSwitch = document.getElementById("autoClaimCheckbox");
	autoclaimval = document.getElementById("autoclaimval");
	autoclaimval.addEventListener("input",
		function(event)
		{
			autoClaimSwitch.checked = false;
			storeActiveSwapInfo(swapTicketID, "SettingAutoClaim", "", [false, 0]);
		}
	);
	autoClaimSwitch.addEventListener("click",
                function (event)
                {
			if (autoClaimSwitch.checked)
			{
				autoclaimval = document.getElementById("autoclaimval");
				console.log("autoclaimval.value", autoclaimval.value);
				if (autoclaimval &&  autoclaimval.value && autoclaimval.value != 0 && 
					!isNaN(autoclaimval.value))
				{
					storeActiveSwapInfo(swapTicketID, "SettingAutoClaim", "", [true, autoclaimval.value]);
				}
				else
				{
					autoClaimSwitch.checked = false;
				}
			}
			else
			{
				storeActiveSwapInfo(swapTicketID, "SettingAutoClaim", "", [false, 0]);
			}
                });
        autoclaimdivelement.style.display = "block";
	//attach a function event to this that stores the autoclaim properties in localstorage when interacted with by UI

}

function updateSwapFinalizationStatus(swapTicketID, address, ergs)
{
        var swapfinalizeddivelement = document.getElementById("swapfinalizeddiv")
        swapfinalizeddivelement.style.display = "block";
        while(swapfinalizeddivelement.firstChild)
        {
                swapfinalizeddivelement.removeChild(swapfinalizeddivelement.firstChild);
        }
        swapfinalizeddivelement.insertAdjacentHTML("beforeend", "<h1>Swap finalized!</h1>" +
          "<h2>" +
            "<a href=\"https://testnet.ergoplatform.com/en/addresses/" + address + "\" >" +
              "Ergo Testnet Script Address" +
            "</a>" +
          "</h2>" +
          "<h2>Value Recieved: " + ergs + " Erg</h2>");
}
