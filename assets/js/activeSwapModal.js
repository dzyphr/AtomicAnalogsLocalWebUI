function showStartingOrderIDModal(swapTicketID)
{
        window.dialog.showModal();
        const ID = "<h1>Swap ID:</h1><p>" + swapTicketID + "</p>"
        document.getElementById("swapiddiv").innerHTML = ID;
        document.getElementById("swapresponsestatusdiv").style.display = "none";
        document.getElementById("autoclaimdiv").style.display = "none";
        document.getElementById("swapfinalizeddiv").style.display = "none";
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
        autoclaimdivelement.style.display = "block";
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
