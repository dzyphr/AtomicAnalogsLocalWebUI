window.addEventListener("DOMContentLoaded", (event) => {
	document.getElementById('swapSettingsButton').addEventListener('click', function() {
		document.getElementById('swap-settings-overlay-menu').classList.add('open');
		refreshChooseMarketsList()
	});

	document.getElementById('swap-settings-overlay-menu').addEventListener('click', function(e) {
		if (e.target === this) {
			this.classList.remove('open');
		}
	});
  document.getElementById('activeSwapDataModal').addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('open');
    }
  });
	simpleMarket_populateMarketExistingAccounts("Sepolia", "TestnetErgo")
  updateOngoingSwapsListStatuses()
});

function expandOngoingSwapsList()
{
  var div = document.querySelector('.ongoingSwapsList');
  div.classList.toggle('expanded');
}

function toggleActiveSwapModal() {
    var div = document.querySelector('.activeSwapDataModal');
    
    if (div.classList.contains('open')) {
        div.classList.toggle('open'); // This will remove the 'open' class if it exists
    } else {
        div.classList.add('open'); // This will add the 'open' class if it does not exist
    }
}

function populateActiveSwapModalData(SwapID, swapState, localAddr, remoteAddr )
{
  activeSwapModalTitle = document.getElementById('ActiveSwapModalTitle')
  swapid = activeSwapModalTitle.querySelector('#swapid')
  if (SwapID != null)
  {
    swapid.textContent = SwapID
  }
  ActiveSwapModalStatus = document.getElementById('ActiveSwapModalStatus')  
  swapstatus = ActiveSwapModalStatus.querySelector('#swapstatus')
  if (swapState != null)
  {
    PossibleSwapStatesMap = {
        "initiated": "initiated", //0
        "uploadingResponseContract": "uploading", //1 #TODO change uploading to deploying makes more sense
        "uploadedResponseContract": "uploaded", //2
        "fundingResponseContract": "funding", //3
        "fundedResponseContract": "funded",  //4
        "responding": "responding", //5
        "responded_unsubmitted": "responded", //6
        "responded_submitted": "responded", //7
        "finalized": "finalized", //8
        "verifyingFinalizedContractValues": "verifying", //9
        "verifiedFinalizedContractValues": "verified", //10
        "claiming": "claiming", //11
        "refunding": "refunding", //12
        "claimed": "claimed", //13
        "refunded": "refunded", //14
    };
    swapstatus.textContent = PossibleSwapStatesMap[swapState]
  }
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
  if ((End.includes(swapState) == true) || (Middle.includes(swapState) == true))
  {
    POST_get_responderJSON_by_swap_ID(SwapID).then(response => {
      cleanresp = response.replace(/[\n\r\s]+/g, '')
      .split('\n').join('')
      .replace(/\\n/g, '')
      .slice(1, -1)
      .replaceAll("\\", '')
      responderJSON = JSON.parse(cleanresp)
      EVMContractAddr = responderJSON["responderContractAddr"]
      ActiveSwapModalLocalContract = document.getElementById('ActiveSwapModalLocalContract');
      ActiveSwapModalLocalContract.style.display = "flex";
      localcontract = ActiveSwapModalLocalContract.querySelector('#swaplocalcontract');
      link = "https://sepolia.etherscan.io/address/" + EVMContractAddr
      localcontract.innerHTML = '<a href="' + link + '">Etherscan</a>';
    });
  }
  else
  {
    ActiveSwapModalLocalContract = document.getElementById('ActiveSwapModalLocalContract');
    ActiveSwapModalLocalContract.style.display = "none";
  }
  if (End.includes(swapState) == true)
  {
    POST_get_responderJSON_by_swap_ID(SwapID).then(response => {
      cleanresp = response.replace(/[\n\r\s]+/g, '')
      .split('\n').join('')
      .replace(/\\n/g, '')
      .slice(1, -1)
      .replaceAll("\\", '')
      responderJSON = JSON.parse(cleanresp)
      boxID = responderJSON["boxId"]
      POST_get_boxAddr(SwapID).then(ergoaddr => {
        ErgoAddr = ergoaddr.replaceAll("\"", "")
        /*POST_getBoxValue(swapTicketID).then( response => {
            ergs = NanoErgToErg(response.replaceAll("\"", ""))
          });*/
        link = "https://testnet.ergoplatform.com/en/addresses/" + ErgoAddr
        ActiveSwapModalRemoteContract = document.getElementById('ActiveSwapModalRemoteContract');
        ActiveSwapModalRemoteContract.style.display = "flex";
        remotecontract = ActiveSwapModalRemoteContract.querySelector('#swapremotecontract');
        remotecontract.innerHTML = '<a href="' + link + '">ErgoPlatformExplorer</a>';
      })
    })
  }
  else
  {
    ActiveSwapModalRemoteContract = document.getElementById('ActiveSwapModalRemoteContract');
    ActiveSwapModalRemoteContract.style.display = "none";
  }

}

function estimateReturnSellToBuy(CoinA, CoinB) {
	sellAmountInput = document.getElementById("sellAmountInput");
	buyAmountInput = document.getElementById("buyAmountInput");
	const marketlistKey = 'marketlist';
  const existingMarketLists = JSON.parse(localStorage.getItem(marketlistKey)) || [];	
	for (market in existingMarketLists)
  {
    getJSON(existingMarketLists[market].marketurl,
    getBottomPrivateClientRESTAPIKeyFromLocalStorage()).then((jsonData) => {
      const marketurl = existingMarketLists[market].marketurl;
      var jsonobj = JSON.parse(jsonData);
      for (key in jsonobj)
      {
          OrderTypeUUID = key;
          marketName = existingMarketLists[market].marketname;
          serverCoinA = jsonobj[key]["CoinA"];
          serverCoinB = jsonobj[key]["CoinB"];
          MinVol = jsonobj[key]["MinVolCoinA"];
          MaxVol = jsonobj[key]["MaxVolCoinA"];
          CoinA_Price = jsonobj[key]["CoinA_price"];
          CoinB_Price = jsonobj[key]["CoinB_price"];
          console.log(((CoinA == serverCoinA) && (CoinB == serverCoinB)))
          if ((CoinA == serverCoinA) && (CoinB == serverCoinB))
          {
            sellAmountInput.addEventListener("input", function() {
              buyAmountInput.value = coinPriceConversion(
                sellAmountInput.value, CoinA_Price, CoinB_Price
              )[1]
            });
          }
      }
    });
  }
}

function estimateReturnBuyToSell(CoinA, CoinB) {
        sellAmountInput = document.getElementById("sellAmountInput");
        buyAmountInput = document.getElementById("buyAmountInput");
        const marketlistKey = 'marketlist';
        const existingMarketLists = JSON.parse(localStorage.getItem(marketlistKey)) || [];
        for (market in existingMarketLists)
        {
          getJSON(existingMarketLists[market].marketurl,
          getBottomPrivateClientRESTAPIKeyFromLocalStorage()).then((jsonData) => {
              const marketurl = existingMarketLists[market].marketurl;
              var jsonobj = JSON.parse(jsonData);
              for (key in jsonobj)
              {
                  OrderTypeUUID = key;
                  marketName = existingMarketLists[market].marketname;
                  serverCoinA = jsonobj[key]["CoinA"];
                  serverCoinB = jsonobj[key]["CoinB"];
                  MinVol = jsonobj[key]["MinVolCoinA"];
                  MaxVol = jsonobj[key]["MaxVolCoinA"];
                  CoinA_Price = jsonobj[key]["CoinA_price"];
                  CoinB_Price = jsonobj[key]["CoinB_price"];
                  console.log(((CoinA == serverCoinA) && (CoinB == serverCoinB)))
                  if ((CoinA == serverCoinA) && (CoinB == serverCoinB))
                  {
                      buyAmountInput.addEventListener("input", function() {
                          sellAmountInput.value = coinPriceConversion(
                             buyAmountInput.value, CoinA_Price, CoinB_Price
                          )[0]
                      });
                  }
              }

          });
        }
}


function refreshOrderTypeList()
{
        const orderTypeKey = 'OrderTypeList';
        const existingOrderTypes = JSON.parse(localStorage.getItem(orderTypeKey)) || [];
        const marketlistKey = 'marketlist';
        const existingMarketLists = JSON.parse(localStorage.getItem(marketlistKey)) || [];
        for (market in existingMarketLists)
        {
            getJSON(existingMarketLists[market].marketurl,
            getBottomPrivateClientRESTAPIKeyFromLocalStorage()).then((jsonData) => {
                const marketurl = existingMarketLists[market].marketurl;
                var jsonobj = JSON.parse(jsonData);
                for (key in jsonobj)
                {
                    OrderTypeUUID = key;
                    marketName = existingMarketLists[market].marketname;
                    CoinA = jsonobj[key]["CoinA"];
                    CoinB = jsonobj[key]["CoinB"];
                    MinVol = jsonobj[key]["MinVolCoinA"];
                    MaxVol = jsonobj[key]["MaxVolCoinA"];
                    CoinA_Price = jsonobj[key]["CoinA_price"];
                    CoinB_Price = jsonobj[key]["CoinB_price"];
                }
            });
        }
        localStorage.setItem(orderTypeKey, JSON.stringify(existingOrderTypes))
        console.log(existingOrderTypes);
}

function refreshChooseMarketsList()
{
	const marketKey = 'marketlist';
	const selectedMarketKey = 'selectedmarket';
	const existingMarkets = JSON.parse(localStorage.getItem(marketKey)) || [];
	for (market in existingMarkets)
	{
		marketname = existingMarkets[market]["marketname"]
		marketurl = existingMarkets[market]["marketurl"]
		var valueList = document.querySelector('.marketChoiceSetting .value-list');

		var newListItem = document.createElement('li');
		newListItem.addEventListener('click', function(e) {
			localStorage.setItem(selectedMarketKey, marketurl)
		});
		var items = valueList.getElementsByTagName('li');
		var repeat = false;
		for (var i = 0; i < items.length; i++) {
			if (items[i].textContent === marketname) {
				console.log('Marketname already found in the list.');
				repeat = true;
				break; // Exit li checking the for loop if item is found
			}
		}
		if (repeat === true)
		{
			break//Exit the existing market list for loop
		}
		newListItem.textContent = marketname;
		// Append the new <li> to the <ul>
		valueList.appendChild(newListItem)
		setStyledAndFilterableDropDownLists() //resets the list element group so that the new li element is included in its functionality
		//might need more specific naming
		//TODO: also need to check for duplicate market name and or url in addMarket() not just here
	}
}

function simpleMarket_addMarket()
{
    const marketname = document.getElementById("addMarketName");
    const marketurl = document.getElementById("addMarketURL");
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
        console.log(marketurl.value);
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
        ElGPubKey_JSON = getJSON(ElGPubKeyURL).then( result => { return result; } );
        QGChannels_JSON = getJSON(QGChannelURL).then( result => {  } );
        //replace todos with get bottom api key for this specific market function to be made
        refreshOrderTypeList();
    }
}

function simpleMarket_start_claimSwap(coinAmount, CoinA, CoinB, useLocalStorageSelectedMarket)
{
	estimateReturnSellToBuy(CoinA, CoinB)
	CoinA_Amount = document.getElementById("buyAmountInput");
	try
	{
		const [ orderType, CoinA_Price, CoinB_Price ] =
			findFittingOrderType(CoinA_Amount, CoinA, CoinB, useLocalStorageSelectedMarket)
	}
	catch(error)
	{
		console.log("no fitting order types!")
	}
	crossAccount = localStorage.getItem('CoinA_Account')
	localAccount = localStorage.getItem('CoinB_Account')
	incrementOngoingSwaps()
	simpleMarket_claimSwap(OrderTypeUUID, coinAmount, CoinA_Price, CoinB_Price, localAccount, crossAccount)
}

function isLocalStorageKeyEmpty(key) {
  const value = localStorage.getItem(key);
  return value === null || value.trim() === '';
}

function findFittingOrderType(coinAmount, CoinA, CoinB, useLocalStorageSelectedMarket)
{
	//Coin amount will be the servers Coin A per their Order Type
	if (useLocalStorageSelectedMarket == true)
	{
		if (!isLocalStorageKeyEmpty('selectedmarket'))
		{
			selectedMarket = localStorage.getItem('selectedmarket')
			getJSON(selectedMarket, getBottomPrivateClientRESTAPIKeyFromLocalStorage()).then((jsonData) => {
				var jsonobj = JSON.parse(jsonData);
				for (orderType in jsonobj)
				{
					if ((coinAmount >= jsonobj[orderType]["MinVolCoinA"] 
						&& coinAmount <= jsonobj[orderType]["MaxVolCoinA"]))
					{
						return  [ orderType, 
							jsonobj[orderType]["CoinA_Price"], 
							jsonobj[orderType]["CoinB_Price"] ];
					}
				}
			});
			console.log("no match");
		}
		else
		{
			console.log("No Market Selected!")
		}
	}
}

function simpleMarket_claimSwap(OrderTypeUUID, coinAmount, CoinA_Price, CoinB_Price, localAccount, crossAccount)
{
    const marketlistKey = 'marketlist';
    const existingMarketLists = JSON.parse(localStorage.getItem(marketlistKey)) || [];
    for (market in existingMarketLists)
    {
        return getJSON(
          existingMarketLists[market].marketurl, getBottomPrivateClientRESTAPIKeyFromLocalStorage()).then((jsonData) => 
          {
            var jsonobj = JSON.parse(jsonData);
            for (key in jsonobj)
            {
                if (key == OrderTypeUUID)
                {
                    //instead of raw handling the request here, lets keep the requests local
                    //start storing the state of this swap on the back end
                    //make the request from the backend and then query its state from here
                    //make a local request that anticipates the initiation being recieved to the backend
                    //replace further swap claiming functions with this behavior
                    //this makes reloading swaps and rendering state far more simple and rational
                    //TODO stronger link between Market specific ElGamal Key and QG channel to ensure consistency
                    const CoinA = jsonobj[key]["CoinA"]; //crosschain
                    const CoinB = jsonobj[key]["CoinB"]; //localchain
                    let LocalChain = CoinB;
                    let CrossChain = CoinA;
                    marketurl = existingMarketLists[market].marketurl
                    let ClientElGamalKey = getElGamalKey(marketurl);
                    ElGamalKeyPath =
                      "Key" +
                      getLocalElGamalPubKeyIndexFromLocalStorage(ClientElGamalKey) +
                      ".ElGamalKey";
                    QGPubMatchStorageKey = marketurl + "_QGPubMatch" + "_" + getElGamalKey(marketurl);
                    QGPubMatchElGMarketServerKey = localStorage.getItem(QGPubMatchStorageKey);
                    ServerElGamalKey = QGPubMatchElGMarketServerKey
                    const ConversionArray = coinPriceConversion(coinAmount, CoinA_Price, CoinB_Price);
                    CoinB_Amount = coinAmount; //we are the responder here
                    CoinA_Amount = ConversionArray[1]; // TODO Hide active swaps if there aren't any
                    let startSwapFromUIData = {
                      "id": uuidv4(),
                      "request_type": "startSwapFromUI",
                      "OrderTypeUUID": OrderTypeUUID,
                      "QGChannel": getElGamalQGChannel(marketurl),
                      "ElGamalKey": ClientElGamalKey,
                      "ServerElGamalKey": ServerElGamalKey,
                      "ElGamalKeyPath": ElGamalKeyPath,
                      "MarketURL": marketurl,
                      "MarketAPIKey": getStarterRESTAPIKeyFromMarketUrlAtIndex(marketurl, 0),
                      "LocalChain": LocalChain,
                      "CrossChain": CrossChain,
                      "LocalChainAccount": localAccount,
                      "CrossChainAccount": crossAccount,
                      "SwapRole": "Responder", //TODO for now client is always responder might change itf
                      "swapAmount": coinAmount
                    }
                    return localClientPostJSONgetJSON(startSwapFromUIData).then(function(response) {
                        cleanresp = response.replace(/[\n\r\s]+/g, '')
                          .split('\n').join('')
                          .replace(/\\n/g, '')
                          .slice(1, -1)
                          .replaceAll("\\", '');
                        console.log(JSON.parse(cleanresp))
                        respJSON = JSON.parse(cleanresp)
                        const swapTicketID = respJSON["SwapTicketID"];
                        representOngoingSwap(CoinA, CoinB, CoinA_Amount, CoinB_Amount, swapTicketID)
                        //showStartingOrderIDModal(swapTicketID);
                        //storeActiveSwapInfo(swapTicketID, "SettingModalFocus", "", [true]);
                        const ConversionArray = coinPriceConversion(coinAmount, CoinA_Price, CoinB_Price);
                        CoinB_Amount = coinAmount; //we are the responder here
                        CoinA_Amount = ConversionArray[1]; // TODO Hide active swaps if there aren't any
                        //TODO  replace swap stage logic with one that uses SwapStateMap async without
                        //relying on local storage
                    });
                    break;
                }
            }
        });
    }
}

function simpleMarket_populateMarketExistingAccounts(localChain, crossChain)
{
	CoinA_AccountSelectorDiv = document.getElementById("CoinA_AccountSelectorDiv");
  getAllChainAccountsJSON().then( function(result)
  {
    accountObj =  JSON.parse(result)
    for (let key in accountObj) {
      if (localChain == "Sepolia")
      {
          //TODO: keep track of logged in accounts in localStorage
              //check if account is .env.encrypted here and make sure its logged in before populating
          //TODO if only one acc exists per chain auto select that acc
          //TODO if no acc exists per chain link to create account for that chain page
          if (key.includes("Atomicity"))
          {
              var valueList = document.querySelector('.CoinB_AccountSelectorDiv .value-list');

              var newListItem = document.createElement('li');
              newListItem.addEventListener('click', function(e) {
                      localStorage.setItem('CoinB_Account', accountObj[key])
              });
              var items = valueList.getElementsByTagName('li');
              var repeat = false;
              for (var i = 0; i < items.length; i++) {
                      if (items[i].textContent === accountObj[key]) {
                              repeat = true;
                              break; // Exit li checking the for loop if item is found
                      }
              }
              if (repeat === true)
              {
                      break//Exit the accounts for loop
              }
              newListItem.textContent = accountObj[key];
              // Append the new <li> to the <ul>
              valueList.appendChild(newListItem)
              setStyledAndFilterableDropDownLists() 
              //resets the list element group so that the new li element is included in its function

          }
      }
      if (crossChain == "TestnetErgo")
      {
          if (key.includes("SigmaParticle"))
          {
              var valueList = document.querySelector('.CoinA_AccountSelectorDiv .value-list');

              var newListItem = document.createElement('li');
              newListItem.addEventListener('click', function(e) {
                      localStorage.setItem('CoinA_Account', accountObj[key])
              });
              var items = valueList.getElementsByTagName('li');
              var repeat = false;
              for (var i = 0; i < items.length; i++) {
                      if (items[i].textContent === accountObj[key]) {
                              repeat = true;
                              break; // Exit li checking the for loop if item is found
                      }
              }
              if (repeat === true)
              {updateOngoingSwapsListStatuses()
                      break//Exit the accounts for loop
              }
              newListItem.textContent = accountObj[key];
              // Append the new <li> to the <ul>
              valueList.appendChild(newListItem)
              setStyledAndFilterableDropDownLists() 
              //resets the list element group so that the new li element is included in its function
          }
      }
    }
  })
}

function checkVisibility(className){
	elements = document.getElementsByClassName('ongoingSwap');
	if (elements.length !== 0)
	{
		visibility = elements[0].style.visibility
		return visibility
	}
	else
	{
		return 'hidden'
	}
}

function toggleVisibility(className) {
    document.querySelectorAll(`.${className}`).forEach(element => {
        const currentVisibility = window.getComputedStyle(element).visibility;
        if (currentVisibility === 'hidden') {
            element.style.visibility = 'visible';
        } else {
            element.style.visibility = 'hidden';
        }
    });
}

function showOngoingSwaps()
{
  expandOngoingSwapsList()
}

function incrementOngoingSwaps()
{
	ongoingSwapsPanel = document.getElementById('ongoingSwapsPanel');
	pendingSwapsCounter = document.getElementById('pendingSwapsCounter');
	if (!isElementVisible(ongoingSwapsPanel))
	{
		ongoingSwapsPanel.style.visibility = 'visible';
	}
	if (pendingSwapsCounter.textContent.trim() === '') //check for empty
	{
		pendingSwapsCounter.textContent = '1'
		return
	}
	index = Number(pendingSwapsCounter.textContent);
	index += 1;
	pendingSwapsCounter.textContent = index;
}

function representOngoingSwap(CoinA, CoinB, CoinA_Amount, CoinB_Amount, SwapID)
{
	newongoingSwap = document.createElement('button');
	newongoingSwap.className = 'ongoingSwap'

	ongoingSwapTop = document.createElement('div');
	ongoingSwapTop.className = 'ongoingSwapTop'
	sepoliaIMG = document.createElement('img')
	sepoliaIMG.className = 'sepoliaCheckboxImage'
	sepoliaIMG.src = "../img/Sepolia-Ethereum-Logo-PNG-tranparentBG.png"
	statusText = document.createElement('h2');
	statusText.textContent = 'Pending';
	ergoTestnetIMG = document.createElement('img')
	ergoTestnetIMG.className = 'ergoTestnetCheckboxImage'
	ergoTestnetIMG.src = "../img/ErgoTestnetTransparentWhite.png"

	ongoingSwapBottom =  document.createElement('div');
	ongoingSwapBottom.className = 'ongoingSwapBottom';
	CoinB_Text = document.createElement('h3');
	CoinB_Text.textContent = `${CoinB_Amount} ${CoinB}`;

	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	svg.setAttribute("width", "25");
	svg.setAttribute("height", "36");
	svg.setAttribute("fill", "currentColor");
	svg.setAttribute("class", "bi bi-arrows");
	svg.setAttribute("viewBox", "0 0 16 16");
	svg.style.paddingRight = '5px'
	svg.style.paddingLeft = '5px'
	svg.style.position = "relative";
	svg.style.bottom = "8px";
	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.setAttribute("d", "M1.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L2.707 7.5h10.586l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L13.293 8.5H2.707l1.147 1.146a.5.5 0 0 1-.708.708z");
	svg.appendChild(path);

	CoinA_Text = document.createElement('h3');
	CoinA_Text.textContent = `${CoinA_Amount} ${CoinA}`

	ongoingSwapTop.appendChild(sepoliaIMG)
	ongoingSwapTop.appendChild(statusText)
	ongoingSwapTop.appendChild(ergoTestnetIMG)

	ongoingSwapBottom.appendChild(CoinB_Text)
	ongoingSwapBottom.appendChild(svg)
	ongoingSwapBottom.appendChild(CoinA_Text)

	newongoingSwap.appendChild(ongoingSwapTop)
	newongoingSwap.appendChild(ongoingSwapBottom)
	console.log(checkVisibility('ongoingSwap'))
  newongoingSwap.id = SwapID
	ongoingSwapsList = document.getElementById('ongoingSwapsList')


  newongoingSwap.addEventListener('click', function() {
    toggleActiveSwapModal()
    getSwapStateByID(SwapID).then(swapState => {
      populateActiveSwapModalData(SwapID, swapState)
    })
  });

	ongoingSwapsList.appendChild(newongoingSwap)
}

async function getSwapStateByID(SwapID)
{
  return getSwapStateMap().then(result => {
    const SwapStateMap = result;
    const swap = SwapStateMap[SwapID];
    const swapState = swap["SwapState"];
    return swapState
  });
}

async function updateOngoingSwapsListStatuses()
{
  PossibleSwapStatesMap = {
    "initiated": "initiated", //0
    "uploadingResponseContract": "uploading", //1 #TODO change uploading to deploying makes more sense
    "uploadedResponseContract": "uploaded", //2
    "fundingResponseContract": "funding", //3
    "fundedResponseContract": "funded",  //4
    "responding": "responding", //5
    "responded_unsubmitted": "responded", //6
    "responded_submitted": "responded", //7
    "finalized": "finalized", //8
    "verifyingFinalizedContractValues": "verifying", //9
    "verifiedFinalizedContractValues": "verified", //10
    "claiming": "claiming", //11
    "refunding": "refunding", //12
    "claimed": "claimed", //13
    "refunded": "refunded", //14
/*    "terminated", //15
    "tbd"//16*/
  };

  while(true)
  {
    ongoingSwaps = document.getElementsByClassName('ongoingSwap')
    if (ongoingSwaps.length != 0)
    {
      for (let i = 0; i < ongoingSwaps.length; i++) {
        const currentSwap = ongoingSwaps[i];
        getSwapStateMap().then(result => {
          const SwapStateMap = result;
          const swapid = currentSwap.id;
          const swap = SwapStateMap[swapid];

          const swapState = swap["SwapState"];
          swaptop = currentSwap.querySelector('.ongoingSwapTop')
          h2 = swaptop.querySelector("h2")
          h2.innerText = PossibleSwapStatesMap[swapState]
        });
      }
    }
    await new Promise(r => setTimeout(r, 2000));
  }
}
function isElementVisible(element) {
    return window.getComputedStyle(element).visibility !== 'hidden';
}
