/**
 * Demo 2: Card Grid Layout
 * 
 * This demonstrates:
 * - Card data structure
 * - Doubling cards to create pairs
 * - Fisher-Yates shuffle algorithm
 * - Dynamic rendering of card grid
 * - CSS Grid layout
 */

// Card data - in a real game, this would be more extensive
const cards = [
    { id: 1, name: 'cat', emoji: '🐱' },
    { id: 2, name: 'dog', emoji: '🐶' },
    { id: 3, name: 'bird', emoji: '🐦' },
    { id: 4, name: 'fish', emoji: '🐠' }
];

/**
 * Fisher-Yates shuffle algorithm
 * Randomly shuffles an array in place
 * @param {Array} array - The array to shuffle
 * @returns {Array} The shuffled array
 */
function shuffle(array) {
    const shuffled = [...array]; // Create a copy to avoid mutating original
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Creates a card DOM element
 * @param {Object} cardData - The card data (id, name, emoji)
 * @param {number} index - The index in the grid
 * @returns {HTMLElement} The card element
 */
function createCardElement(cardData, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.cardId = cardData.id;
    card.dataset.index = index;
    
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                <div class="card-question">?</div>
            </div>
            <div class="card-back">
                <div class="card-emoji">${cardData.emoji}</div>
                <div class="card-name">${cardData.name}</div>
            </div>
        </div>
    `;
    
    // Add click handler
    card.addEventListener('click', () => flipCard(card));
    
    return card;
}

/**
 * Flips a card
 * @param {HTMLElement} card - The card element to flip
 */
function flipCard(card) {
    card.classList.toggle('flipped');
}

/**
 * Renders the card grid
 * @param {Array} cardsToRender - Array of card data to render
 */
function renderGrid(cardsToRender) {
    const grid = document.getElementById('card-grid');
    grid.innerHTML = ''; // Clear existing cards
    
    cardsToRender.forEach((cardData, index) => {
        const cardElement = createCardElement(cardData, index);
        grid.appendChild(cardElement);
    });
    
    console.log(`Rendered ${cardsToRender.length} cards`);
}

/**
 * Initializes the game grid
 * Creates pairs, shuffles, and renders
 */
function initGrid() {
    // For a 3x3 grid (9 cards), we need 4 pairs + 1 single
    // Take first 4 cards and double them (8 cards), plus 1 more card (9 total)
    const pairsNeeded = 4;
    const selectedCards = cards.slice(0, pairsNeeded);
    
    // Create pairs (double the cards)
    const pairedCards = [...selectedCards, ...selectedCards];
    
    // Add one more card to make it 9 (for 3x3 grid)
    const gameCards = [...pairedCards, cards[0]];
    
    // Shuffle the cards
    const shuffledCards = shuffle(gameCards);
    
    // Render the grid
    renderGrid(shuffledCards);
}

/**
 * Resets the grid with a new shuffle
 */
function resetGrid() {
    console.log('Resetting and shuffling grid...');
    
    // Flip all cards back before reset
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        if (card.classList.contains('flipped')) {
            card.classList.remove('flipped');
        }
    });
    
    // Wait a moment for flip animation, then re-initialize
    setTimeout(() => {
        initGrid();
    }, 300);
}

// Initialize the grid when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Demo 2: Card Grid Layout loaded');
    initGrid();
});
