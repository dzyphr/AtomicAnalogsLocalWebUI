function goToMarket()
{
	window.location.href = "/market";
}

function logIn()
{
	passwordInputContents = document.getElementById('accountPassword').value
	if (passwordInputContents == "")
	{
		return console.log("ERROR: password not given for encrypted account")
	}
	//	document.getElementById
	const menuItems = document.querySelectorAll('menuitem');
	let matchFound = false;
	menuItems.forEach(function (item, index, arr) {
	    if (item.classList.contains('selected'))
	    {
		    //expecting only one selected at a time for now
		envpath = item.getAttribute("data-custom") // should store the key
		    // get the chain recursively
		ErgoTestnetFrameworkPath = "Ergo/SigmaParticle"
		SepoliaFrameworkPath = "EVM/Atomicity"
		let result = false
		if (envpath.includes(ErgoTestnetFrameworkPath))
		{
			console.log(item.textContent)
			POST_loginToPasswordEncryptedAccount("TestnetErgo", item.textContent, passwordInputContents)
			    .then(function(bool)
				    {
					    if (bool === true)
					    {
						    console.log(
							    "Chain: TestnetErgo\nAccount: ", 
							    item.textContent, 
							    "\nSuccessfully logged in!"
						    );
					    }
				    });
			matchFound = true;
		}
		else if (envpath.includes(SepoliaFrameworkPath)) 
		{
			console.log(item.textContent)
                        POST_loginToPasswordEncryptedAccount("Sepolia", item.textContent, passwordInputContents)
			    .then(function(bool)
                                    {
                                            if (bool === true)
                                            {
                                                    console.log(
                                                            "Chain: Sepolia\nAccount: ",
                                                            item.textContent, 
                                                            "\nSuccessfully logged in!"
                                                    );
                                            }
                                    });
			matchFound = true;
		}
		if (result === true)
		{
			console.log("Account: ", item.textContent, " successfully logged in!")
		}
	    }
	});
	if (!matchFound)
	{
		console.log("ERROR: No Account Selected")
	}
//	console.log("ERROR: No Account Selected or Login Failed")
}

function populateExistingAccounts()
{
	accountMenu = document.getElementById("accountMenu");
	let accountObj
	getAllChainAccountsJSON().then( function(result)
	{
		accountObj =  JSON.parse(result)
		for (let key in accountObj) {
		    const menuItem = document.createElement("menuitem");
		    const link = document.createElement("a");
		    if (key.includes('.encrypted'))
		    {
			    link.textContent = accountObj[key];
			    menuItem.appendChild(link);
			    menuItem.setAttribute('data-custom', key)
			    // Add the click event listener
			    menuItem.addEventListener('click', function (event) {
				if (menuItem.classList.contains('selected'))
				{
					menuItem.classList.remove('selected');
				}
				else
				{
					event.preventDefault(); // Prevent following links
					const menuItems = document.querySelectorAll('menuitem');
					// Remove "selected" class from all menu items
					menuItems.forEach(function (item) {
					    if (item.classList.contains('selected'))
					    {
						item.classList.remove('selected');
					    }
					});
					// Add "selected" class to the clicked menu item
					menuItem.classList.add('selected');
				}
			    });
			    accountMenu.appendChild(menuItem);
		    }
		}
	})
}

document.addEventListener("DOMContentLoaded", function() {
    populateExistingAccounts();
});
