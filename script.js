// Select the container element where the cards will be displayed
const gridContainer = document.querySelector(".grid-container");

// Initialize variables to be used throughout the game
let cardsData = []; // Stores all possible card data from JSON
let firstCard, secondCard; // Track the two cards being compared
let lockBoard = false; // Prevent interaction during card comparison
let turns = 0; // Number of turns taken
let flippedCards = 0; // Track the number of matched cards
let amountOfCards = 0; // Total number of cards
let cards = []; // Cards in the current game

// Display the initial turn count on the UI
document.querySelector(".turns").textContent = turns;

// Ask the player how many cards they want to play with
let cardsUsed = askCards();

// Fetch the card data from a JSON file
fetch("./data/cards.json")
    .then((res) => res.json()) // Parse JSON response
    .then((data) => {
        cardsData = [...data]; // Store all card data
        createCards(cardsUsed); // Create the card set for the game
        shuffleCards(); // Shuffle the cards
        generateCards(); // Generate the cards on the grid
    });

// Shuffle the cards randomly
function shuffleCards() {
    cards.sort((a, b) => -0.5 + Math.random());
}

// Prompt the player for the number of cards to play with
function askCards() {
    let requestedCards;
    do {
        requestedCards = Number(prompt("How many cards (between 8 and 18) do you want?"));
    }
    // Ensure the number is even and within the valid range
    while (requestedCards % 2 !== 0 || requestedCards == 0 || requestedCards < 8 || requestedCards > 18);
    return requestedCards;
}

// Create a set of cards based on the number the player requested
function createCards(cardsRevealed) {
    let cardsSingleData = cardsData.slice(0, cardsRevealed / 2); // Get the required number of unique cards
    cards = [...cardsSingleData, ...cardsSingleData]; // Duplicate each card to create pairs
}

// Generate the card elements and add them to the grid
function generateCards() {
    cards.forEach(card => {
        const cardElement = document.createElement("div");
        amountOfCards += 1; // Track total number of cards
        cardElement.classList.add("card"); // Add the "card" class
        cardElement.setAttribute("data-name", card.name); // Set card's name for matching logic
        cardElement.innerHTML = `
            <div class="front">
                <img class="front-image" src=${card.image} /> <!-- Card front image -->
            </div>
            <div class="back"></div>`; // Back of the card
        gridContainer.appendChild(cardElement); // Add card to the grid
        cardElement.addEventListener("click", flipCard); // Add click event to flip the card
    });
}

// Flip a card and handle logic for comparing cards
function flipCard() {
    if (lockBoard) return; // Prevent flipping if the board is locked
    if (this === firstCard) return; // Prevent flipping the same card twice

    this.classList.add("flipped"); // Flip the card

    if (!firstCard) {
        firstCard = this; // Set as the first flipped card
        return;
    }

    secondCard = this; // Set as the second flipped card
    turns++; // Increment the turn count
    document.querySelector(".turns").textContent = turns; // Update the UI
    lockBoard = true; // Lock the board for comparison

    checkForMatch(); // Check if the cards match
}

// Check if the two flipped cards match
function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name; // Compare card names

    if (isMatch) {
        disableCards(); // Disable the matched cards
        flippedCards += 2; // Increment the count of matched cards
        console.log(flippedCards); // Debugging: Log the count of flipped cards
    } else {
        unflipCards(); // Unflip the cards if they don't match
    }

    // Restart the game if all cards are matched
    if (flippedCards >= amountOfCards) {
        autoRestart();
    }
}

// Disable the event listeners for matched cards
function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetBoard(); // Reset the board state
}

// Unflip cards if they don't match
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard(); // Reset the board state after unflipping
    }, 1000); // Delay for better visual feedback
}

// Automatically restart the game after a short delay
function autoRestart() {
    setTimeout(() => {
        restart();
    }, 2000); // Delay to let the player see their success
}

// Reset variables related to the board state
function resetBoard() {
    firstCard = null; // Clear the first card
    secondCard = null; // Clear the second card
    lockBoard = false; // Unlock the board
}

// Restart the game
function restart() {
    resetBoard(); // Reset the board state
    let cardsUsed = askCards(); // Ask for the number of cards again
    createCards(cardsUsed); // Create a new set of cards
    shuffleCards(); // Shuffle the new set
    turns = 0; // Reset the turn count
    document.querySelector(".turns").textContent = turns; // Update the UI
    gridContainer.innerHTML = ""; // Clear the grid
    generateCards(); // Generate the new cards
}
