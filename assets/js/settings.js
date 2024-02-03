function updateEVM_Gas_Config(RateOrMod, Val, Chain)
{
	if (RateOrMod == "Rate")
	{
		if (Chain == "Sepolia")
		{
			Key = "SEPOLIA_EVM_GAS_CONTROL"
			updateMainEnv(Key, Val)
		}
	}
	else if (RateOrMod == "Mod")
	{
		if (Chain == "Sepolia")
                {
			Key = "SEPOLIA_EVM_GASMOD_CONTROL"
			updateMainEnv(Key, Val)
                }
	}
	else
	{
		console.log("unkown val for RateOrMod variable: ", RateOrMod);
		return false;
	}
}
