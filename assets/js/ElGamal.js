function isObject(value) {
  return value !== null && typeof value === 'object';
}

function loadElGamalKeys()
{
        //use a local get request to load ElGamal Pubs saved in the main .env file for AtomicAPI
        getJSON("http://localhost:3031/v0.0.1/ElGamalPubs").then((jsonData) => {
		console.log(jsonData);
//                const jsonobj = JSON.parse(jsonData.replace(/\\/g, '').replace(/\\n/g, '\n'));
		var jsonobj;
		if (isObject(jsonData))
		{
			jsonobj = jsonData
		}
		else
		{
			jsonobj = JSON.parse(jsonData.replace(/\\/g, '').replace(/\\n/g, '\n'));
		}
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

	keyobj = JSON.parse(localStorage.getItem(marketElGCompatKey)); //more logic to add
	var key;
	if (Array.isArray(keyobj) == true)
	{
		key = keyobj[0]
	}
	else
	{
		console.log(keyobj)
		key = keyobj
	}
	return key
}

function getElGamalQGChannel(marketurl)
{
	marketElGCompatQGChannel = marketurl + "_ElGCompatQGChannels";
	QG = JSON.parse(localStorage.getItem(marketElGCompatQGChannel))[0];
	return QG
}

