/**
 * Demo 1: Single Flippable Card
 * 
 * This demonstrates the basic card flip animation using CSS 3D transforms.
 * 
 * Key Concepts:
 * - CSS perspective for 3D space
 * - transform-style: preserve-3d to maintain 3D positioning
 * - backface-visibility: hidden to hide the back when facing away
 * - Transform rotateY to flip the card
 */

/**
 * Flips a card by toggling the 'flipped' class
 * @param {HTMLElement} card - The card element to flip
 */
function flipCard(card) {
    card.classList.toggle('flipped');
    
    // Optional: Log the state for learning purposes
    if (card.classList.contains('flipped')) {
        console.log('Card flipped to back side');
    } else {
        console.log('Card flipped to front side');
    }
}

// Optional: Add keyboard support (press Space to flip)
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        const card = document.querySelector('.card');
        if (card) {
            flipCard(card);
        }
    }
});

// Add visual feedback on load
console.log('Demo 1: Single Flippable Card loaded');
console.log('Click the card or press Space to flip it!');
