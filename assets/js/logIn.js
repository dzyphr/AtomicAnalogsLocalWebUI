function logIn()
{
	//	document.getElementById
	

}

function populateExistingAccounts()
{
	accountMenu = document.getElementById("accountMenu");
	accounts = ["account1", "account2"];
	accounts.forEach(function(account) {
		menuItem = document.createElement("menuitem");
		var link = document.createElement("a");
	        link.textContent = account;
		menuItem.appendChild(link);
		accountMenu.appendChild(menuItem);
	});
}
document.addEventListener("DOMContentLoaded", function() {
    populateExistingAccounts();
});
