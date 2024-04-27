//functions for initializing an account on a specific blockchain
//an "account" in this sense refers to a collection of private data used for blockchain interactions
//the account can be encrypted or plaintext as of recent updates
function showHideChainInitUI(chain)
{
	ergoAccountSetupBox = document.getElementById("ergoAccountSetupBox");
	sepoliaAccountSetupBox = document.getElementById("SepoliaAccountSetupBox");
	if (chain == "Ergo")
	{
		console.log(chain)
		if (ergoAccountSetupBox.style.display != "flex")
		{
			if (sepoliaAccountSetupBox.style.display === "flex")
                        {
                        	sepoliaAccountSetupBox.style.display = "none"
                        }
			ergoAccountSetupBox.style.display = "flex"
		}
		else
		{
			ergoAccountSetupBox.style.display = "none"
		}
	}
	if (chain == "Sepolia")
	{
		console.log(chain)
                if (sepoliaAccountSetupBox.style.display != "flex")
                {
			if (ergoAccountSetupBox.style.display === "flex")
			{
				ergoAccountSetupBox.style.display = "none"
			}
                        sepoliaAccountSetupBox.style.display = "flex"
                }
                else
                {
                        sepoliaAccountSetupBox.style.display = "none"
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
		ErgoAccountName = ErgoAccountNameInput.value;
		ErgoNodeURL = ErgoNodeURLInput.value;
		ErgoMnemonic = ErgoMnemonicInput.value;
		ErgoMnemonicPass = ErgoMnemonicPassInput.value;
		EIP3Secret = EIP3SecretInput.value;
		ErgoPubkey = ErgoPubkeyInput.value;
		ErgoExplorerAPI = ErgoExplorerAPIInput.value;
		fulldirpath = "Ergo/SigmaParticle/" + ErgoAccountName;
		fullenvpath = fulldirpath + "/.env";
		initErgoAccountNonInteractive(
			ErgoNodeURL, ErgoMnemonic, ErgoMnemonicPass, EIP3Secret, 
			ErgoPubkey, ErgoExplorerAPI, fulldirpath, fullenvpath)
	}
}

function initializeSepoliaAccountUI_clickAttempt()
{
	SepoliaAccountNameInput = document.getElementById("accountName");
	SepoliaSenderAddrInput = document.getElementById("SepoliaSenderAddrSetup");
	SepoliaPrivKeyInput = document.getElementById("SepoliaPrivKeySetup");
	SepoliaRPCInput = document.getElementById("SepoliaRPCSetup");
	SepoliaChainIDInput = document.getElementById("SepoliaChainIDSetup");
	SepoliaScanInput = document.getElementById("SepoliaScanSetup");
	SolidityCompilerVersionInput = document.getElementById("SolidityCompilerVersionSetup");
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
	let checklist = [checkForElement(SepoliaAccountNameInput),
		checkForElement(SepoliaSenderAddrInput),
		checkForElement(SepoliaPrivKeyInput), 
		checkForElement(SepoliaRPCInput),
		checkForElement(SepoliaChainIDInput), 
		checkForElement(SepoliaScanInput),
		checkForElement(SolidityCompilerVersionInput)];
	if (checklist.includes(false))
        {
                console.log("false:", checklist);
                return false
        }
	else
	{
		SepoliaAccountName = SepoliaAccountNameInput.value;
		SepoliaSenderAddr = SepoliaSenderAddrInput.value;
		SepoliaPrivKey = SepoliaPrivKeyInput.value;
		SepoliaRPC = SepoliaRPCInput.value;
		SepoliaChainID = SepoliaChainIDInput.value;
		SepoliaScan = SepoliaScanInput.value;
		SolidityCompilerVersion = SolidityCompilerVersionInput.value;
		fulldirpath = "EVM/Atomicity/" + SepoliaAccountName;
                fullenvpath = fulldirpath + "/.env";
		initSepoliaAccountNonInteractive(
			SepoliaSenderAddr, SepoliaPrivKey, SepoliaRPC, SepoliaChainID, SepoliaScan, 
        		SolidityCompilerVersion, fulldirpath, fullenvpath
		)
	}

}
