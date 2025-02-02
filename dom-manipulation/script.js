
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
    { text: "Happiness depends upon ourselves.", category: "Happiness" },
    { text: "Do what you can, with what you have, where you are.", category: "Inspiration" }
];


const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const formContainer = document.getElementById("formContainer");


function populateCategories() {

    categoryFilter.innerHTML = '<option value="all">All Categories</option>';


    const categories = [...new Set(quotes.map(q => q.category))];


    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

  
    const lastSelectedCategory = localStorage.getItem("selectedCategory");
    if (lastSelectedCategory) {
        categoryFilter.value = lastSelectedCategory;
    }
}


function showRandomQuote() {
    let filteredQuotes = quotes;

    const selectedCategory = categoryFilter.value;
    if (selectedCategory !== "all") {
        filteredQuotes = quotes.filter(q => q.category === selectedCategory);
    }

    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes available in this category.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const selectedQuote = filteredQuotes[randomIndex];

    quoteDisplay.innerHTML = `"${selectedQuote.text}" <br> <strong>- ${selectedQuote.category}</strong>`;
}


function filterQuotes() {
    showRandomQuote();
    localStorage.setItem("selectedCategory", categoryFilter.value); 
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
    saveQuotes();  

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    populateCategories(); 
    alert("Quote added successfully!");
}


function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}


document.addEventListener("DOMContentLoaded", () => {
    createAddQuoteForm();
    populateCategories();
    showRandomQuote(); 
    newQuoteButton.addEventListener("click", showRandomQuote);
});