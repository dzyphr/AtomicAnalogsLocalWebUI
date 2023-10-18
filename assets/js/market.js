//import fs from 'fs';

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function postJSON(url, data)
{
	return fetch(urlLocation + url, {
		method: "POST", 
		headers: authHeaders, 
		body: JSON.stringify(data)
	}).then((res) => res.json());
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
	//get an html element to target the market name
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

function deleteLocalstorage()
{
	localStorage.clear();
}

function refreshOrderTypeList()
{
	const orderTypeKey = 'OrderTypeList';
	const existingOrderTypes = JSON.parse(localStorage.getItem(orderTypeKey)) || [];
	const marketlistKey = 'marketlist';
	const existingMarketLists = JSON.parse(localStorage.getItem(marketlistKey)) || [];
	for (market in existingMarketLists)
	{
		getJSON(existingMarketLists[market].marketurl).then((jsonData) => {
			const marketurl = existingMarketLists[market].marketurl;
			const exists = existingOrderTypes.some(obj => obj[marketurl]);
			if (!exists)
			{
				const marketOrdersObj = {
					[marketurl]: jsonData
				};
				existingOrderTypes.push(marketOrdersObj)
			}
			else 
			{
				for (let i = 0; i < existingOrderTypes.length; i++) {
				    if (existingOrderTypes[i][marketurl]) {
					// Update the object with the matching marketurl
					existingOrderTypes[i][marketurl] = jsonData;
					break; 
				    }
				}
			}
		});
	}
	localStorage.setItem(orderTypeKey, JSON.stringify(existingOrderTypes))
	console.log(existingOrderTypes);
}
