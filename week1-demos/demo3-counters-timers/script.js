/**
 * Demo 3: Counters and Timers
 * 
 * This demonstrates:
 * - Move counter that tracks card reveals
 * - Game timer that starts on first card flip
 * - Timer formatting (minutes:seconds)
 * - Pause/resume functionality
 * - Game state management
 */

// Card data
const cards = [
    { id: 1, name: 'cat', emoji: '🐱' },
    { id: 2, name: 'dog', emoji: '🐶' },
    { id: 3, name: 'bird', emoji: '🐦' },
    { id: 4, name: 'fish', emoji: '🐠' }
];

// Game state
let moveCount = 0;
let gameStarted = false;
let startTime = null;
let timerInterval = null;
let isPaused = false;
let pausedTime = 0;

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
    if (gameStarted) return; // Already started
    
    gameStarted = true;
    startTime = Date.now();
    updateStatus('Playing');
    
    timerInterval = setInterval(() => {
        if (!isPaused) {
            const elapsed = Math.floor((Date.now() - startTime - pausedTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            updateTimer(minutes, seconds);
        }
    }, 1000);
    
    console.log('Timer started');
}

/**
 * Updates the timer display
 */
function updateTimer(minutes, seconds) {
    const timerElement = document.getElementById('timer');
    timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Pauses or resumes the timer
 */
function pauseTimer() {
    if (!gameStarted) return;
    
    const pauseBtn = document.getElementById('pause-btn');
    
    if (isPaused) {
        // Resume
        isPaused = false;
        pauseBtn.textContent = 'Pause Timer';
        updateStatus('Playing');
        console.log('Timer resumed');
    } else {
        // Pause
        isPaused = true;
        pauseBtn.textContent = 'Resume Timer';
        updateStatus('Paused');
        console.log('Timer paused');
    }
}

/**
 * Increments the move counter
 */
function incrementMoves() {
    moveCount++;
    const counterElement = document.getElementById('move-counter');
    counterElement.textContent = moveCount;
    
    // Add animation
    counterElement.classList.add('animating');
    setTimeout(() => counterElement.classList.remove('animating'), 300);
    
    console.log(`Move count: ${moveCount}`);
}

/**
 * Updates the status display
 */
function updateStatus(status) {
    const statusElement = document.getElementById('status');
    statusElement.textContent = status;
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
    
    // Add click handler
    card.addEventListener('click', () => handleCardClick(card));
    
    return card;
}

/**
 * Handles card click
 */
function handleCardClick(card) {
    const wasFlipped = card.classList.contains('flipped');
    
    // Flip the card
    card.classList.toggle('flipped');
    
    // If card was just flipped to reveal (not already flipped)
    if (!wasFlipped) {
        // Start timer on first reveal
        if (!gameStarted) {
            startTimer();
        }
        
        // Increment move counter
        incrementMoves();
    }
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
    // Create game cards (4 pairs + 1 single for 3x3 grid)
    const selectedCards = cards.slice(0, 4);
    const pairedCards = [...selectedCards, ...selectedCards];
    const gameCards = [...pairedCards, cards[0]];
    const shuffledCards = shuffle(gameCards);
    
    // Render grid
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
    gameStarted = false;
    isPaused = false;
    pausedTime = 0;
    
    // Reset displays
    document.getElementById('move-counter').textContent = '0';
    document.getElementById('timer').textContent = '0:00';
    updateStatus('Ready');
    document.getElementById('pause-btn').textContent = 'Pause Timer';
    
    // Flip all cards back
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => card.classList.remove('flipped'));
    
    // Re-shuffle and render
    setTimeout(() => {
        initGame();
    }, 300);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Demo 3: Counters and Timers loaded');
    initGame();
});
