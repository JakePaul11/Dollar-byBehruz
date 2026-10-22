const CRYPTO_MARKET_API =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";


let cryptoCoins = [];


const cryptoList =
    document.getElementById("cryptoList");

const cryptoSearch =
    document.getElementById("cryptoSearch");

const cryptoFrom =
    document.getElementById("cryptoFrom");

const cryptoTo =
    document.getElementById("cryptoTo");

const cryptoAmount =
    document.getElementById("cryptoAmount");

const cryptoResult =
    document.getElementById("cryptoResult");


async function loadCrypto() {

    cryptoList.innerHTML =
        `<p class="helper">Loading crypto market...</p>`;


    try {

        const response =
            await fetch(CRYPTO_MARKET_API);


        if (!response.ok) {

            throw new Error(
                "Crypto API failed"
            );

        }


        cryptoCoins =
            await response.json();


        renderCrypto(
            cryptoCoins
        );


        populateCryptoSelectors();

    }

    catch (error) {

        cryptoList.innerHTML =
            `<p class="helper">
                Could not load cryptocurrency data.
            </p>`;

    }

}


function renderCrypto(coins) {

    cryptoList.innerHTML = "";


    coins.forEach(coin => {

        const row =
            document.createElement("div");


        row.className =
            "crypto-row";


        const change =
            coin.price_change_percentage_24h;


        row.innerHTML = `

            <div class="crypto-name">

                <img
                    src="${coin.image}"
                    alt="${coin.name}"
                >

                <div>

                    <strong>
                        ${coin.symbol.toUpperCase()}
                    </strong>

                    <small>
                        ${coin.name}
                    </small>

                </div>

            </div>


            <strong>
                ${formatUSD(
                    coin.current_price
                )}
            </strong>


            <span class="${
                change >= 0
                    ? "positive"
                    : "negative"
            }">

                ${
                    change == null
                        ? "—"
                        : change.toFixed(2) + "%"
                }

            </span>


            <span>
                ${compactNumber(
                    coin.market_cap
                )}
            </span>

        `;


        cryptoList.appendChild(
            row
        );

    });

}


function populateCryptoSelectors() {

    cryptoFrom.innerHTML = "";
    cryptoTo.innerHTML = "";


    cryptoCoins.forEach(coin => {

        const name =
            `${coin.symbol.toUpperCase()} — ${coin.name}`;


        cryptoFrom.add(
            new Option(
                name,
                coin.id
            )
        );


        cryptoTo.add(
            new Option(
                name,
                coin.id
            )
        );

    });


    const bitcoin =
        cryptoCoins.find(
            coin =>
                coin.id === "bitcoin"
        );


    const ethereum =
        cryptoCoins.find(
            coin =>
                coin.id === "ethereum"
        );


    if (bitcoin) {
        cryptoFrom.value =
            bitcoin.id;
    }


    if (ethereum) {
        cryptoTo.value =
            ethereum.id;
    }

}


cryptoSearch.addEventListener(
    "input",
    () => {

        const search =
            cryptoSearch.value
                .toLowerCase()
                .trim();


        const filtered =
            cryptoCoins.filter(coin =>

                coin.name
                    .toLowerCase()
                    .includes(search)

                ||

                coin.symbol
                    .toLowerCase()
                    .includes(search)

            );


        renderCrypto(filtered);

    }
);


document
    .getElementById("cryptoConvert")
    .addEventListener(
        "click",
        () => {

            const amount =
                Number(
                    cryptoAmount.value
                );


            if (
                !amount ||
                amount <= 0
            ) {

                cryptoResult.textContent =
                    "Enter a valid amount.";

                cryptoResult.classList.remove(
                    "hidden"
                );

                return;
            }


            const from =
                cryptoCoins.find(
                    coin =>
                        coin.id ===
                        cryptoFrom.value
                );


            const to =
                cryptoCoins.find(
                    coin =>
                        coin.id ===
                        cryptoTo.value
                );


            if (!from || !to) {
                return;
            }


            const usdValue =
                amount *
                from.current_price;


            const converted =
                usdValue /
                to.current_price;


            cryptoResult.textContent =

                `${formatCrypto(amount)}
                 ${from.symbol.toUpperCase()}
                 =
                 ${formatCrypto(converted)}
                 ${to.symbol.toUpperCase()}`;


            cryptoResult.classList.remove(
                "hidden"
            );

        }
    );


function formatUSD(number) {

    if (number < 0.01) {

        return "$" +
            Number(number)
                .toLocaleString(
                    undefined,
                    {
                        maximumFractionDigits: 8
                    }
                );

    }


    return "$" +
        Number(number)
            .toLocaleString(
                undefined,
                {
                    maximumFractionDigits: 2
                }
            );

}


function formatCrypto(number) {

    return Number(number)
        .toLocaleString(
            undefined,
            {
                maximumFractionDigits: 8
            }
        );

}


function compactNumber(number) {

    return "$" +
        Intl.NumberFormat(
            "en",
            {
                notation: "compact",
                maximumFractionDigits: 2
            }
        ).format(number);

}


loadCrypto();