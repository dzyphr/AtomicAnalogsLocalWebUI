function deleteLocalstorage()
{
        localStorage.clear();
}

//create some local storage for active swaps
//allocate to it only the most vital high level data such as  what stage of the swap its at
//when the swap modal is closed, shut down the UI parts of the loop, leave the other interactions going
//update the local storage as the other interactions finish
//if the user brings the swap back up again, bring up a newly hydrated modal, use the local storage to determine
//which stage of the swap its at, use calls to backend to populate with accurate data
//info list needs at least 6 items. Items: CoinA, CoinB, CoinB_Amt, CoinA_price, CoinB_price
function storeActiveSwapInfo(swapTicketID, Stage, infoList, metaList)
{
        //Stages:
        //Funding
        //Submitting
        //Waiting for Finalization
        //Finalized
        //Claimed (to be deleted)
        //Unclaimed (claim or refund cycle then deleted)
        if (Stage == "Funding")
        {
                //the swap just started, we need to get all it's high level info to store
                if (infoList.length == 5)
                {
                        infoList.push(Stage);
                        localStorage.setItem(swapTicketID, JSON.stringify(infoList)); // save info list to local storage @swapID
                }
                else
                {
                        console.log("info list needs exactly 5 items on funding." +
                                "Items: CoinA, CoinB, CoinB_Amt, CoinA_price, CoinB_price")
                        return false
                }
        }
        if (Stage == "Submitting")
        {
                if (metaList.length == 1)
                {
                        //we have the contract address that we funded already
                        //metalist should contain a single item which is the funded address
                        localStorage.setItem(swapTicketID + "_meta", JSON.stringify(metaList));
                        infoList = JSON.parse(localStorage.getItem(swapTicketID));
                        infoList.pop();
                        infoList.push(Stage);
                        localStorage.setItem(swapTicketID, JSON.stringify(infoList));
                }
                else
                {
                        console.log("meta list requires exactly 1 item in Submitting stage. Item: funded address")
                        return false
                }
        }
        if (Stage == "Waiting for Finalization")
        {
                infoList = JSON.parse(localStorage.getItem(swapTicketID));
                infoList.pop();
                infoList.push(Stage);
                localStorage.setItem(swapTicketID, JSON.stringify(infoList));
        }
        if (Stage == "Finalized")
        {
                //we have the contract address from the finalizer / initiator
                //can be just box id because we can get its address and value in UI function
                if (metaList.length == 1)
                {
                        updateMetaList = JSON.parse(localStorage.getItem(swapTicketID + "_meta"));
                        finalizedAddr = metaList[0];
                        updateMetaList.push(finalizedAddr)
                        localStorage.setItem(swapTicketID + "_meta", JSON.stringify(updateMetaList));
                        infoList = JSON.parse(localStorage.getItem(swapTicketID));
                        infoList.pop();
                        infoList.push(Stage);
                        localStorage.setItem(swapTicketID, JSON.stringify(infoList));
                }
                else
                {
                        console.log("meta list requires exactly 1 item in Submitting stage. Item: funded address")
                        return false
                }
        }
        if (Stage == "Claimed")
        {
                //finalized contract has been spent from already from claim or refund
                infoList = JSON.parse(localStorage.getItem(swapTicketID));
                infoList.pop();
                infoList.push(Stage);
                localStorage.setItem(swapTicketID, JSON.stringify(infoList));
        }
        if (Stage == "Unclaimed")
        {
                //finalized contract has NOT been spent from already from claim or refund
                if (metaList.length == 1)
                {
                        updateMetaList = JSON.parse(localStorage.getItem(swapTicketID + "_meta"));
                        scriptBalance = metaList[0];
                        updateMetaList.push(scriptBalance)
                        localStorage.setItem(swapTicketID + "_meta", JSON.stringify(updateMetaList));
                        infoList = JSON.parse(localStorage.getItem(swapTicketID));
                        infoList.pop();
                        infoList.push(Stage);
                        localStorage.setItem(swapTicketID, JSON.stringify(infoList));
                }
                else
                {
                        console.log("meta list requires exactly 1 item in Unclaimed stage. Item: script/addr balance")
                        //need balance of the output or contract that we can claim from
                        return false
                }
        }
        if (Stage == "SettingAutoClaim")
        {
                if (metaList.length == 2)
                {
                        localStorage.setItem(swapTicketID + "_autoclaim", JSON.stringify(metaList))
                }
                else
                {
                        console.log("meta list requires exactly 2 items in SettingAutoClaim. " +
                                "Items: [AutoClaim(Boolean), MinAutoClaimVal(int)].")
                        return false
                }
        }
        if (Stage == "SettingModalFocus")
        {
                if (metaList.length == 1) //1 item: modalFocus(bool)
                {
                        localStorage.setItem(swapTicketID + "_modalFocus", JSON.stringify(metaList))
                }
                else
                {
                        console.log("meta list requires exactly 1 item in SettingModalFocus. " +
                                "Item: [modalFocus(bool)]")
                        return false
                }
        }
        console.log(localStorage.getItem(swapTicketID));
        console.log(localStorage.getItem(swapTicketID + "_meta"))
        console.log(localStorage.getItem(swapTicketID + "_autoclaim"));
        console.log(localStorage.getItem(swapTicketID + "_modalFocus"));
}

