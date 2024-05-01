function logIn()
{
	//	document.getElementById
	const menuItems = document.querySelectorAll('menuitem');
	menuItems.forEach(function (item) {
	    if (item.classList.contains('selected'))
	    {
		item.classList.remove('selected');
	    }
	});
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
		    link.textContent = accountObj[key];
		    menuItem.appendChild(link);
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
	})
}

document.addEventListener("DOMContentLoaded", function() {
    populateExistingAccounts();
});
