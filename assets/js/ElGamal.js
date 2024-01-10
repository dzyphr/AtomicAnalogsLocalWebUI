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

function getElGamalKey()
{
        const ElGamalKey_Key = "ElGamalPubKey";
        const existingElGamalKeys = JSON.parse(localStorage.getItem(ElGamalKey_Key)) || [];
        console.log(existingElGamalKeys);
        return existingElGamalKeys[0];
}

