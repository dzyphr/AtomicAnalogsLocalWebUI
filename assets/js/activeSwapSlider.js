function representActiveSwap(CoinA, CoinB, AmtCoinA, AmtCoinB, SwapID)
{
        const activeSwapTemp = document.createElement("div");
        activeSwapTemp.className = "activeSwapTemplate";


        //if ergo (testnet) 
        const coinA_image = document.createElement("img");
        coinA_image.className = "ergoTestnetCheckboxImage";
        coinA_image.src = "../images/ErgoTestnetTransparentWhite.png";

        const coinA_amount = document.createElement("h1");
        coinA_amount.insertAdjacentHTML("beforeend", AmtCoinA);

        const swaparrows = document.createElement("img");
        swaparrows.src = "../img/swaparrows.png"; //static/img path

        //if sepolia
        const coinB_amount = document.createElement("h1");
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

        const activeSwapSlider = document.getElementById("activeSwapSlider");
        if (activeSwapSlider)
        {
                activeSwapSlider.appendChild(activeSwapTemp);
        }
}

