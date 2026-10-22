const CURRENCY_API =
    "https://api.exchangerate-api.com/v4/latest/USD";


let currencyRates = {};


const currencyAmount =
    document.getElementById("currencyAmount");

const currencyFrom =
    document.getElementById("currencyFrom");

const currencyTo =
    document.getElementById("currencyTo");

const currencyResult =
    document.getElementById("currencyResult");


async function loadCurrencies() {

    try {

        const response =
            await fetch(CURRENCY_API);

        if (!response.ok) {
            throw new Error("Currency API failed");
        }


        const data =
            await response.json();


        currencyRates =
            data.rates;


        const currencies =
            Object.keys(currencyRates)
                .sort();


        currencyFrom.innerHTML = "";
        currencyTo.innerHTML = "";


        currencies.forEach(code => {

            const fromOption =
                new Option(code, code);

            const toOption =
                new Option(code, code);


            currencyFrom.add(
                fromOption
            );

            currencyTo.add(
                toOption
            );

        });


        currencyFrom.value =
            currencies.includes("USD")
                ? "USD"
                : currencies[0];


        currencyTo.value =
            currencies.includes("UZS")
                ? "UZS"
                : currencies[1];

    }

    catch (error) {

        currencyResult.textContent =
            "Could not load currency rates.";

        currencyResult.classList.remove(
            "hidden"
        );

    }

}


function convertCurrency() {

    const amount =
        Number(currencyAmount.value);


    if (
        !amount ||
        amount <= 0
    ) {

        currencyResult.textContent =
            "Enter a valid amount.";

        currencyResult.classList.remove(
            "hidden"
        );

        return;
    }


    const from =
        currencyFrom.value;

    const to =
        currencyTo.value;


    const result =
        amount /
        currencyRates[from] *
        currencyRates[to];


    currencyResult.textContent =
        `${formatNumber(amount)} ${from} = ${formatNumber(result)} ${to}`;


    currencyResult.classList.remove(
        "hidden"
    );

}


document
    .getElementById("currencyConvert")
    .addEventListener(
        "click",
        convertCurrency
    );


document
    .getElementById("currencySwap")
    .addEventListener(
        "click",
        () => {

            const old =
                currencyFrom.value;

            currencyFrom.value =
                currencyTo.value;

            currencyTo.value =
                old;

            convertCurrency();

        }
    );


function formatNumber(number) {

    return Number(number)
        .toLocaleString(
            undefined,
            {
                maximumFractionDigits:
                    number < 1 ? 8 : 2
            }
        );

}


loadCurrencies();