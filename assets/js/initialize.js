function showHideChainInitUI(chain)
{
	if (chain == "Ergo")
	{
		console.log(chain)
		ergoAccountSetupBox = document.getElementById("ergoAccountSetupBox");
		if (ergoAccountSetupBox.style.display != "flex")
		{
			ergoAccountSetupBox.style.display = "flex"
		}
		else
		{
			ergoAccountSetupBox.style.display = "none"
		}
	}
}

function initializeErgoAccountUI_clickAttempt()
{
	//TODO Sepolia version then generalized based on UI selection
	ErgoAccountNameInput = document.getElementById("accountName");
	ErgoNodeURLInput = document.getElementById("nodeurlsetup");
	ErgoMnemonicInput = document.getElementById("mnemonicsetup");
	ErgoMnemonicPassInput = document.getElementById("mnemonicPassSetup");
	EIP3SecretInput = document.getElementById("ErgoEIP3SecretSetup");
	ErgoPubkeyInput = document.getElementById("ErgoPubkeySetup");
	ErgoExplorerAPIInput = document.getElementById("ErgoExplorerAPISetup");
	function checkForElement(Element) //TODO export to helpers / lib
	{
		if (Element)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	let checklist = [checkForElement(ErgoAccountNameInput),
	checkForElement(ErgoNodeURLInput),
	checkForElement(ErgoMnemonicInput),
	checkForElement(ErgoMnemonicPassInput),
	checkForElement(EIP3SecretInput),
	checkForElement(ErgoPubkeyInput),
	checkForElement(ErgoExplorerAPIInput)];
	if (checklist.includes(false))
	{
		console.log("false:", checklist);
		return false
	}
	else
	{
		//TODO make sure inputs arent bad values
		ErgoAccountName = ErgoAccountNameInput.value
		ErgoNodeURL = ErgoNodeURLInput.value
		ErgoMnemonic = ErgoMnemonicInput.value
		ErgoMnemonicPass = ErgoMnemonicPassInput.value
		EIP3Secret = EIP3SecretInput.value
		ErgoPubkey = ErgoPubkeyInput.value
		ErgoExplorerAPI = ErgoExplorerAPIInput.value
		fulldirpath = "Ergo/SigmaParticle/" + ErgoAccountName
		fullenvpath = fulldirpath + "/.env"
		initErgoAccountNonInteractive(
			ErgoNodeURL, ErgoMnemonic, ErgoMnemonicPass, EIP3Secret, 
			ErgoPubkey, ErgoExplorerAPI, fulldirpath, fullenvpath)
	}
}

function initializeSepoliaAccountUI_clickAttempt()
{

}
