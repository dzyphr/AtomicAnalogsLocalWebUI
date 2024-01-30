function loadModalInfoFromStorage(swapTicketID)
{
	currentSwap = JSON.parse(localStorage.getItem(swapTicketID))
	
	Stage = currentSwap[5];
	if (Stage == "Funding")
	{
		console.log("Stage:", Stage);
		showStartingOrderIDModal(swapTicketID)
	}
	else if (Stage == "Submitting" || Stage == "Waiting for Finalization" || Stage == "Finalized")
	{
		console.log("Stage:", Stage);
		currentSwapMeta = JSON.parse(localStorage.getItem(swapTicketID + "_meta"));
		address = currentSwapMeta[0];
		showStartingOrderIDModal(swapTicketID);
		updateSwapResponseStatus(swapTicketID, address)
	}
	else if (Stage == "Unclaimed" || Stage == "Claimed") 
	{
		console.log("Stage:", Stage);
		currentSwapMeta = JSON.parse(localStorage.getItem(swapTicketID + "_meta"));
		address1 = currentSwapMeta[0];
		address2 = currentSwapMeta[1];
		ergs = currentSwapMeta[2];
		showStartingOrderIDModal(swapTicketID);
		updateSwapResponseStatus(swapTicketID, address1);
		updateSwapFinalizationStatus(swapTicketID, address2, ergs)
	}
	else
	{
		console.log("unknown stage:", Stage);
	}
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
