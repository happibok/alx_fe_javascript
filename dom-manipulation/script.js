const API_URL = "https://jsonplaceholder.typicode.com/posts"; 

let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const formContainer = document.getElementById("formContainer");

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        const serverQuotes = await response.json();

        quotes = mergeQuotes(quotes, serverQuotes);
        saveQuotes();
        populateCategories();
        showRandomQuote();
    } catch (error) {
        console.error("Error fetching server quotes:", error);
    }
}

function mergeQuotes(localQuotes, serverQuotes) {
    const merged = [...serverQuotes];

    localQuotes.forEach(localQuote => {
        if (!serverQuotes.some(serverQuote => serverQuote.text === localQuote.text)) {
            merged.push(localQuote);
        }
    });

    return merged;
}


function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

async function syncLocalChanges() {
    try {
        for (const quote of quotes) {
           
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(quote),
            });
        }
    } catch (error) {
        console.error("Error syncing local changes:", error);
    }
}

function showRandomQuote() {
    let filteredQuotes = quotes;

    if (categoryFilter.value !== "all") {
        filteredQuotes = quotes.filter(q => q.category === categoryFilter.value);
    }

    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes available in this category.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const selectedQuote = filteredQuotes[randomIndex];

    quoteDisplay.innerHTML = `"${selectedQuote.text}" <br> <strong>- ${selectedQuote.category}</strong>`;
}

function populateCategories() {
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    const categories = [...new Set(quotes.map(q => q.category))];
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}


async function addQuote() {
    const text = document.getElementById("newQuoteText").value.trim();
    const category = document.getElementById("newQuoteCategory").value.trim();

    if (text === "" || category === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    const newQuote = { text, category };

   
    quotes.push(newQuote);
    saveQuotes();
    await syncLocalChanges();
    populateCategories();

    alert("Quote added successfully!");
}

function createAddQuoteForm() {
    const form = document.createElement("div");
    form.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote">
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category">
        <button id="addQuoteBtn">Add Quote</button>
    `;
    formContainer.appendChild(form);
    document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
}


setInterval(fetchQuotesFromServer, 30000); 


document.addEventListener("DOMContentLoaded", async () => {
    createAddQuoteForm();
    await fetchQuotesFromServer();
    populateCategories();
    showRandomQuote();
    newQuoteButton.addEventListener("click", showRandomQuote);

    function notifyUser(message) {
        const notification = document.createElement("div");
        notification.textContent = message;
        notification.style.position = "fixed";
        notification.style.bottom = "10px";
        notification.style.right = "10px";
        notification.style.backgroundColor = "lightgreen";
        notification.style.padding = "10px";
        notification.style.borderRadius = "5px";
        document.body.appendChild(notification);
    
        setTimeout(() => notification.remove(), 3000);
    }
    
    async function fetchQuotesFromServer() {
        try {
            const response = await fetch(API_URL);
            const serverQuotes = await response.json();
    
            const oldQuoteCount = quotes.length;
            quotes = mergeQuotes(quotes, serverQuotes);
            saveQuotes();
            populateCategories();
            showRandomQuote();
    
            if (quotes.length > oldQuoteCount) {
                notifyUser("New quotes have been added from the server!");
            }
        } catch (error) {
            console.error("Error fetching server quotes:", error);
        }
    }
});