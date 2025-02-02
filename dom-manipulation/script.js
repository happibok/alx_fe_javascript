let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
    { text: "Happiness depends upon ourselves.", category: "Happiness" },
    { text: "Do what you can, with what you have, where you are.", category: "Inspiration" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const formContainer = document.getElementById("formContainer");
const exportJsonButton = document.getElementById("exportJson");
const importFileInput = document.getElementById("importFile");

function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];

    quoteDisplay.innerHTML = `"${selectedQuote.text}" <br> <strong>- ${selectedQuote.category}</strong>`;

    sessionStorage.setItem("lastQuote", JSON.stringify(selectedQuote));
}

function createAddQuoteForm() {
    const form = document.createElement("div");
    form.id = "addQuoteForm";

    const quoteInput = document.createElement("input");
    quoteInput.id = "newQuoteText";
    quoteInput.type = "text";
    quoteInput.placeholder = "Enter a new quote";

    const categoryInput = document.createElement("input");
    categoryInput.id = "newQuoteCategory";
    categoryInput.type = "text";
    categoryInput.placeholder = "Enter quote category";

    const addQuoteButton = document.createElement("button");
    addQuoteButton.textContent = "Add Quote";

    form.appendChild(quoteInput);
    form.appendChild(categoryInput);
    form.appendChild(addQuoteButton);
    formContainer.appendChild(form);

    addQuoteButton.addEventListener("click", addQuote);
}


function addQuote() {
    const text = document.getElementById("newQuoteText").value.trim();
    const category = document.getElementById("newQuoteCategory").value.trim();

    if (text === "" || category === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    quotes.push({ text, category });
    saveQuotes();  // Save to local storage

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("Quote added successfully!");
}

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

function exportToJsonFile() {
    const jsonString = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                alert("Quotes imported successfully!");
            } else {
                alert("Invalid JSON file format.");
            }
        } catch (error) {
            alert("Error parsing JSON file.");
        }
    };
    reader.readAsText(file);
}

function loadLastViewedQuote() {
    const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
    if (lastQuote) {
        quoteDisplay.innerHTML = `"${lastQuote.text}" <br> <strong>- ${lastQuote.category}</strong>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    createAddQuoteForm();
    newQuoteButton.addEventListener("click", showRandomQuote);
    exportJsonButton.addEventListener("click", exportToJsonFile);
    importFileInput.addEventListener("change", importFromJsonFile);

    loadLastViewedQuote(); 
});