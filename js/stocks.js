
const STOCK_API_KEY =
    "5dbd3f103530424bbd46b7a7ae7099b6";


const TWELVE_DATA =
    "https://api.twelvedata.com";


const stockSearch =
    document.getElementById(
        "stockSearch"
    );

const stockResults =
    document.getElementById(
        "stockResults"
    );

const stockDetail =
    document.getElementById(
        "stockDetail"
    );



async function searchStocks() {

    const query =
        stockSearch.value.trim();


    if (!query) {

        stockResults.innerHTML =
            `<p class="helper">
                Enter a company name or ticker.
            </p>`;

        return;
    }


    stockResults.innerHTML =
        `<p class="helper">
            Searching market...
        </p>`;


    try {

        const url =
            `${TWELVE_DATA}/symbol_search?symbol=${encodeURIComponent(query)}&outputsize=30&apikey=${STOCK_API_KEY}`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Search failed"
            );

        }


        const data =
            await response.json();


        if (
            data.status === "error"
        ) {

            throw new Error(
                data.message
            );

        }


        const stocks =
            (data.data || [])
                .filter(item => {

                    const type =
                        (
                            item.instrument_type ||
                            ""
                        ).toLowerCase();


                    return (
                        type.includes("stock") ||
                        type.includes("equity") ||
                        type.includes("common")
                    );

                });


        renderStockResults(
            stocks
        );

    }

    catch (error) {

        console.error(error);


        stockResults.innerHTML =
            `<p class="helper">
                Stock search failed.
                Check your API key or API limit.
            </p>`;

    }

}



function renderStockResults(stocks) {

    stockResults.innerHTML = "";


    if (!stocks.length) {

        stockResults.innerHTML =
            `<p class="helper">
                No matching public companies found.
            </p>`;

        return;
    }


    stocks.forEach(stock => {

        const item =
            document.createElement("div");


        item.className =
            "stock-item";


        item.innerHTML = `

            <div>

                <p>
                    ${
                        stock.instrument_name ||
                        stock.symbol
                    }
                </p>

                <small>

                    ${
                        stock.exchange ||
                        "Exchange"
                    }

                    •

                    ${
                        stock.country ||
                        "International"
                    }

                </small>

            </div>


            <div class="stock-symbol">
                ${stock.symbol}
            </div>

        `;


        item.addEventListener(
            "click",
            () => {

                loadStock(
                    stock.symbol,
                    stock.instrument_name,
                    stock.exchange
                );

            }
        );


        stockResults.appendChild(
            item
        );

    });

}



async function loadStock(
    symbol,
    name,
    exchange
) {

    stockDetail.classList.remove(
        "hidden"
    );


    document.getElementById(
        "stockName"
    ).textContent =
        name || symbol;


    document.getElementById(
        "stockTicker"
    ).textContent =
        symbol;


    document.getElementById(
        "stockExchange"
    ).textContent =
        exchange || "STOCK";


    document.getElementById(
        "stockPrice"
    ).textContent =
        "Loading...";


    try {

        const url =
            `${TWELVE_DATA}/quote?symbol=${encodeURIComponent(symbol)}&apikey=${STOCK_API_KEY}`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Quote failed"
            );

        }


        const data =
            await response.json();


        if (
            data.status === "error"
        ) {

            throw new Error(
                data.message
            );

        }


        displayStockQuote(
            data
        );

    }

    catch (error) {

        console.error(error);


        document.getElementById(
            "stockPrice"
        ).textContent =
            "Unavailable";

    }

}



function displayStockQuote(data) {

    const currency =
        data.currency || "USD";


    const price =
        Number(
            data.close ||
            data.price ||
            0
        );


    const change =
        Number(
            data.percent_change || 0
        );


    document.getElementById(
        "stockPrice"
    ).textContent =
        `${formatStockPrice(price)} ${currency}`;


    const changeElement =
        document.getElementById(
            "stockChange"
        );


    changeElement.textContent =
        `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;


    changeElement.className =
        change >= 0
            ? "positive"
            : "negative";


    setStockValue(
        "stockOpen",
        data.open
    );


    setStockValue(
        "stockHigh",
        data.high
    );


    setStockValue(
        "stockLow",
        data.low
    );


    setStockValue(
        "stockPrevious",
        data.previous_close
    );


    document.getElementById(
        "stockVolume"
    ).textContent =

        data.volume

            ? Number(
                data.volume
            ).toLocaleString()

            : "—";

}



function setStockValue(
    id,
    value
) {

    document.getElementById(
        id
    ).textContent =

        value
            ? formatStockPrice(
                Number(value)
            )
            : "—";

}


function formatStockPrice(price) {

    return Number(price)
        .toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4
            }
        );

}



document
    .getElementById(
        "stockSearchButton"
    )
    .addEventListener(
        "click",
        searchStocks
    );


stockSearch.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            searchStocks();

        }

    }
);


document
    .getElementById(
        "closeStock"
    )
    .addEventListener(
        "click",
        () => {

            stockDetail.classList.add(
                "hidden"
            );

        }
    );