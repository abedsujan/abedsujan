/**
 * Demo 4: Complete Week 1 Integration
 * 
 * This demonstrates all Week 1 features working together:
 * - Flippable cards with 3D animation
 * - Card grid layout (4x3 = 12 cards, 6 pairs)
 * - Move counter
 * - Game timer with pause/resume
 * - Pair matching detection
 * - Win condition
 * - Game reset
 */

// Card data - 6 unique cards for 6 pairs
const cards = [
    { id: 1, name: 'cat', emoji: '🐱' },
    { id: 2, name: 'dog', emoji: '🐶' },
    { id: 3, name: 'bird', emoji: '🐦' },
    { id: 4, name: 'fish', emoji: '🐠' },
    { id: 5, name: 'rabbit', emoji: '🐰' },
    { id: 6, name: 'lion', emoji: '🦁' }
];

// Game state
let moveCount = 0;
let pairsFound = 0;
let gameStarted = false;
let startTime = null;
let timerInterval = null;
let isPaused = false;
let firstCard = null;
let secondCard = null;
let lockBoard = false;

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Starts the game timer
 */
function startTimer() {
    if (gameStarted) return;
    
    gameStarted = true;
    startTime = Date.now();
    
    timerInterval = setInterval(() => {
        if (!isPaused) {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            updateTimer(minutes, seconds);
        }
    }, 1000);
}

/**
 * Updates the timer display
 */
function updateTimer(minutes, seconds) {
    document.getElementById('timer').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Toggles timer pause/resume
 */
function toggleTimer() {
    if (!gameStarted) return;
    
    const btn = document.getElementById('timer-btn');
    isPaused = !isPaused;
    btn.textContent = isPaused ? '▶️ Resume' : '⏸️ Pause';
}

/**
 * Increments the move counter
 */
function incrementMoves() {
    moveCount++;
    const counter = document.getElementById('move-counter');
    counter.textContent = moveCount;
    counter.classList.add('animating');
    setTimeout(() => counter.classList.remove('animating'), 300);
}

/**
 * Updates pairs found counter
 */
function updatePairs() {
    document.getElementById('pairs-found').textContent = `${pairsFound}/6`;
}

/**
 * Creates a card element
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
    
    card.addEventListener('click', () => handleCardClick(card));
    return card;
}

/**
 * Handles card click
 */
function handleCardClick(card) {
    // Prevent clicks if board is locked or card is already matched
    if (lockBoard) return;
    if (card === firstCard) return;
    if (card.classList.contains('matched')) return;
    
    // Flip the card
    card.classList.add('flipped');
    
    if (!firstCard) {
        // First card in pair
        firstCard = card;
        
        // Start timer on first card
        if (!gameStarted) {
            startTimer();
        }
        
        // Increment move counter
        incrementMoves();
    } else {
        // Second card in pair
        secondCard = card;
        
        // Increment move counter
        incrementMoves();
        
        // Check for match
        checkMatch();
    }
}

/**
 * Checks if two cards match
 */
function checkMatch() {
    lockBoard = true;
    
    const isMatch = firstCard.dataset.cardId === secondCard.dataset.cardId;
    
    if (isMatch) {
        handleMatch();
    } else {
        handleMismatch();
    }
}

/**
 * Handles matching cards
 */
function handleMatch() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    
    pairsFound++;
    updatePairs();
    
    console.log('Match found!');
    
    resetTurn();
    
    // Check if game is won
    if (pairsFound === 6) {
        setTimeout(handleWin, 500);
    }
}

/**
 * Handles non-matching cards
 */
function handleMismatch() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetTurn();
    }, 1000);
}

/**
 * Resets the turn
 */
function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

/**
 * Handles win condition
 */
function handleWin() {
    // Stop timer
    clearInterval(timerInterval);
    
    // Get final stats
    const finalTime = document.getElementById('timer').textContent;
    document.getElementById('final-moves').textContent = moveCount;
    document.getElementById('final-time').textContent = finalTime;
    
    // Show modal
    showModal();
    
    console.log('Game won!');
}

/**
 * Shows the win modal
 */
function showModal() {
    document.getElementById('win-modal').classList.add('active');
}

/**
 * Closes the win modal
 */
function closeModal() {
    document.getElementById('win-modal').classList.remove('active');
}

/**
 * Renders the card grid
 */
function renderGrid(cardsToRender) {
    const grid = document.getElementById('card-grid');
    grid.innerHTML = '';
    
    cardsToRender.forEach((cardData, index) => {
        const cardElement = createCardElement(cardData, index);
        grid.appendChild(cardElement);
    });
}

/**
 * Initializes the game
 */
function initGame() {
    // Create pairs (double the cards)
    const pairedCards = [...cards, ...cards];
    
    // Shuffle
    const shuffledCards = shuffle(pairedCards);
    
    // Render
    renderGrid(shuffledCards);
}

/**
 * Resets the game
 */
function resetGame() {
    console.log('Resetting game...');
    
    // Stop timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Reset state
    moveCount = 0;
    pairsFound = 0;
    gameStarted = false;
    isPaused = false;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    
    // Reset displays
    document.getElementById('move-counter').textContent = '0';
    document.getElementById('timer').textContent = '0:00';
    updatePairs();
    document.getElementById('timer-btn').textContent = '⏸️ Pause';
    
    // Close modal if open
    closeModal();
    
    // Re-initialize
    setTimeout(() => {
        initGame();
    }, 300);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Demo 4: Complete Week 1 Integration loaded');
    console.log('All Week 1 features demonstrated:');
    console.log('- Flippable cards with 3D animation');
    console.log('- Card grid (4x3)');
    console.log('- Move counter');
    console.log('- Game timer');
    console.log('- Pair matching');
    console.log('- Win condition');
    
    initGame();
    updatePairs();
});
