function representActiveSwap(CoinA, CoinB, AmtCoinA, AmtCoinB, SwapID)
{
	const activeSwapSlider = document.getElementById("activeSwapSlider");
        const activeSwapTemp = document.createElement("div");
        activeSwapTemp.className = "activeSwapTemplate";


        //if ergo (testnet) 
        const coinA_image = document.createElement("img");
        coinA_image.className = "ergoTestnetCheckboxImage";
        coinA_image.src = "../images/ErgoTestnetTransparentWhite.png";

        const coinA_amount = document.createElement("h2");
        coinA_amount.insertAdjacentHTML("beforeend", AmtCoinA);

        const swaparrows = document.createElement("img");
        swaparrows.src = "../img/swaparrows.png"; //static/img path

        //if sepolia
        const coinB_amount = document.createElement("h2");
        coinB_amount.insertAdjacentHTML("beforeend", AmtCoinB);

        const coinB_image = document.createElement("img");
        coinB_image.className = "sepoliaCheckboxImage";
        coinB_image.src = "../images/Sepolia-Ethereum-Logo-PNG-tranparentBG.png";


        activeSwapTemp.appendChild(coinA_image);
        activeSwapTemp.appendChild(coinA_amount);
        activeSwapTemp.appendChild(swaparrows);
        activeSwapTemp.appendChild(coinB_amount);
        activeSwapTemp.appendChild(coinB_image);

	activeSwapTemp.id = SwapID;

        activeSwapTemp.addEventListener("click",
                function(event)
                {
                        loadModalInfoFromStorage(SwapID);
                        storeActiveSwapInfo(SwapID, "SettingModalFocus", "", [true]);
                }
        );

        if (activeSwapSlider)
        {
                activeSwapSlider.appendChild(activeSwapTemp);
        }

}

