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
//info list needs at least 5 items. Items: CoinA, CoinB, CoinB_Amt, CoinA_price, CoinB_price
function storeActiveSwapInfo(swapTicketID, Stage, infoList, metaList)
{
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
        console.log(localStorage.getItem(swapTicketID + "_autoclaim"));
        console.log(localStorage.getItem(swapTicketID + "_modalFocus"));
}

