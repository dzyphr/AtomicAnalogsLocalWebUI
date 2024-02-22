function loadElGamalKeys()
{
        //use a local get request to load ElGamal Pubs saved in the main .env file for AtomicAPI
        getJSON("http://localhost:3031/v0.0.1/ElGamalPubs").then((jsonData) => {
                const jsonobj = JSON.parse(jsonData.replace(/\\/g, '').replace(/\\n/g, '\n'));
                const ElGamalKey_Key = "ElGamalPubKey";
                const existingElGamalKeys = JSON.parse(localStorage.getItem(ElGamalKey_Key)) || [];
                Object.keys(jsonobj).forEach(function(key) {
                        if (jsonobj[key] in existingElGamalKeys == false)
                        {
                                existingElGamalKeys.push(jsonobj[key])
                        }
                });
                localStorage.setItem(ElGamalKey_Key, JSON.stringify(existingElGamalKeys));
        });
}

/* DEFUNCT
function saveElGamalKey()
{
        const ElGamalKeyEntry = document.getElementById("ElGamalKeyEntry");
        const ElGamalKey_Key = "ElGamalPubKey";
        const existingElGamalKeys = JSON.parse(localStorage.getItem(ElGamalKey_Key)) || [];
        existingElGamalKeys.push(ElGamalKeyEntry.value);
        localStorage.setItem(ElGamalKey_Key, JSON.stringify(existingElGamalKeys));
}
*/

function getElGamalKey(marketurl)
{
/*        const ElGamalKey_Key = "ElGamalPubKey";
        const existingElGamalKeys = JSON.parse(localStorage.getItem(ElGamalKey_Key)) || [];
        console.log(existingElGamalKeys);
        return existingElGamalKeys[0];*/
	//load per marketurl
	marketElGCompatKey = marketurl + "_ElGCompatKeys";
	console.log("url", marketurl);
	console.log("Test", localStorage.getItem(marketElGCompatKey));
	key = JSON.parse(localStorage.getItem(marketElGCompatKey))[0]; //more logic to add
	return key
}

function getElGamalQChannel(marketurl)
{
	marketElGCompatQChannel = marketurl + "_ElGCompatQChannels";
	Q = JSON.parse(localStorage.getItem(marketElGCompatQChannel))[0];
	return Q
}

