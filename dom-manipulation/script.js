let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
    { text: "Happiness depends upon ourselves.", category: "Happiness" },
    { text: "Do what you can, with what you have, where you are.", category: "Inspiration" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const addQuoteButton = document.getElementById("addQuote");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `"${selectedQuote.text}" <br> <strong>- ${selectedQuote.category}</strong>`;
}

function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (text === "" || category === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    quotes.push({ text, category });

    newQuoteText.value = "";
    newQuoteCategory.value = "";

    alert("Quote added successfully!");
}

newQuoteButton.addEventListener("click", showRandomQuote);
addQuoteButton.addEventListener("click", addQuote);