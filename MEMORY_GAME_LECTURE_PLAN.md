# Foundation Project - Memory Game
## Complete Instructor Lecture Plan

**Instructor:** Abed Sujan  
**Duration:** 3 Weeks (3 Sessions)  
**Project:** Memory Game - Browser-based Card Matching Game  
**Work Mode:** Pair Programming (2 trainees per team)  
**Prerequisites:** HTML, CSS, JavaScript, Node.js/Express, Database fundamentals

---

## 🎯 Project Overview

Students will build a classic Memory Game where players flip cards to find matching pairs. This project encompasses:
- **Frontend:** Interactive card game with animations
- **Backend:** RESTful API to serve card data
- **Database:** Storing card information and (optionally) player scores
- **Project Management:** Using Trello with MoSCoW prioritization
- **Collaboration:** Pair programming and GitHub workflow

---

## 📚 Module Learning Goals

### Technical Skills
- ✅ Design and implement layout using HTML and CSS
- ✅ Use DOM manipulation for interactive elements
- ✅ Apply JavaScript functions, types, loops, and more
- ✅ Use GET requests to fetch data
- ✅ Implement an API to return data
- ✅ Test APIs with Postman
- ✅ Design database schemas
- ✅ Create and populate database tables

### Soft Skills
- ✅ Practice working in a team on the same project
- ✅ Develop self-guided learning skills
- ✅ Practice building from a brief
- ✅ Interpret requirements and make assumptions
- ✅ Break big problems into smaller tasks
- ✅ Manage tasks within tight deadlines
- ✅ Know when and how to ask for help
- ✅ Take a project from idea to completion

### Organizational Skills
- ✅ Work as pairs to complete the project
- ✅ Use Trello for project organization
- ✅ Define tasks with Trello cards
- ✅ Prioritize with MoSCoW method
- ✅ Organize into weekly sprints
- ✅ Submit pull requests for each milestone

---

## 🗓️ Three-Week Structure

### Week 1: Frontend Foundation & Card Mechanics
**Milestone:** Flippable card + Card grid + Counters/Timers

### Week 2: Backend Integration & Game Logic
**Milestone:** Database/API + Complete game mechanics

### Week 3: Polish & Custom Features
**Milestone:** 3+ custom features + Deployment + Presentation

---

## 📅 SESSION 1: Project Kickoff & Frontend Foundation

**Duration:** 3-4 hours  
**Week 1 Milestone:** Flippable card, card grid, counters, and timers

---

### Part 1: Introduction & Project Overview (45 minutes)

#### Opening (15 min)

**Start with Energy!**
- Welcome everyone with enthusiasm
- "You're about to build something people will actually want to play!"
- Show a completed Memory Game example (prepare one in advance)
- Explain: This is different from previous exercises - it's a REAL project

**What Makes This Special:**
- Full-stack application (frontend + backend + database)
- Pair programming experience
- Real-world project management
- Portfolio piece they can be proud of
- Deployed and playable by anyone

#### Project Brief Walkthrough (30 min)

**Present the Memory Game Concept:**
1. Show examples of memory games online (2-3 different styles)
2. Discuss what makes them fun and engaging
3. Walk through the project requirements document
4. Explain the three weekly milestones clearly

**Key Points to Emphasize:**
- Week 1: Build the interactive frontend
- Week 2: Add backend and complete game logic
- Week 3: Make it YOURS with custom features

**Q&A:** Answer any clarification questions

---

### Part 2: Pair Programming & Project Management (45 minutes)

#### Pair Assignments (10 min)

**Announce the pairs** (pre-organized by staff):
- Introduce each pair
- Have pairs sit together or join breakout rooms
- Quick ice-breaker: Share one thing they're excited about

#### Trello & Project Management (35 min)

**Teach Project Organization:**

1. **Introduction to Trello** (10 min)
   - Create a board live (or show template)
   - Explain columns: Backlog, To Do, In Progress, Review, Done
   - Create sample cards
   - Show how to assign members, add checklists, due dates

2. **MoSCoW Prioritization** (10 min)
   - **M**ust have - Essential features (the requirements)
   - **S**hould have - Important but not vital
   - **C**ould have - Nice to have if time permits
   - **W**on't have - Out of scope for now
   
   **Live Example:**
   - Must: Flippable cards (requirement)
   - Should: Smooth animations
   - Could: Sound effects
   - Won't: Multiplayer mode (for this project)

3. **Breaking Down Week 1 Tasks** (15 min)
   - Demonstrate breaking "Flippable Card" into smaller tasks:
     * Set up HTML structure
     * Style the card (front and back)
     * Add click event listener
     * Implement flip animation
     * Test on different browsers
   
   **Group Exercise:** Have pairs start listing tasks for Week 1 milestone

**Action Items for Students:**
- Create Trello board together
- Break down Week 1 milestone into cards
- Apply MoSCoW labels
- Assign initial tasks

---

### Part 3: GitHub Workflow for Pairs (30 minutes)

#### Git Collaboration Setup (30 min)

**Key Concepts to Cover:**

1. **One Repository, Two Developers** (10 min)
   - One person creates the repo
   - Add partner as collaborator (Settings → Collaborators)
   - Both clone the repository
   
2. **Branch Strategy** (10 min)
   - Never work directly on `main`
   - Create feature branches: `feature/card-flip`, `feature/grid-layout`
   - Show the workflow:
     ```bash
     git checkout -b feature/card-flip
     # make changes
     git add .
     git commit -m "Add card flip animation"
     git push origin feature/card-flip
     ```
   - Create Pull Request on GitHub
   - Partner reviews and merges

3. **Avoiding Conflicts** (10 min)
   - Communication is key!
   - Pull latest changes before starting: `git pull origin main`
   - Work on different files when possible
   - Commit and push frequently
   - If conflicts occur, don't panic - ask for help

**Live Demo:**
- Create a repository
- Add collaborator
- Create branch
- Make a change
- Push and create PR
- Show review process

**Common Issues to Warn About:**
- Forgetting to pull before starting
- Both editing the same file
- Merge conflicts (assure them you'll help)
- Not committing frequently enough

---

### Part 4: Week 1 Technical Walkthrough (60 minutes)

#### The Flippable Card (25 min)

**Learning Objective:** Create a single card that flips on click with animation

**Live Coding Demonstration:**

1. **HTML Structure** (5 min)
   ```html
   <div class="card" onclick="flipCard(this)">
     <div class="card-inner">
       <div class="card-front">
         <img src="card-back.jpg" alt="Card back">
       </div>
       <div class="card-back">
         <img src="card-image.jpg" alt="Card">
       </div>
     </div>
   </div>
   ```

2. **CSS Flip Animation** (10 min)
   ```css
   .card {
     width: 150px;
     height: 200px;
     perspective: 1000px;
   }
   
   .card-inner {
     position: relative;
     width: 100%;
     height: 100%;
     transition: transform 0.6s;
     transform-style: preserve-3d;
   }
   
   .card.flipped .card-inner {
     transform: rotateY(180deg);
   }
   
   .card-front, .card-back {
     position: absolute;
     width: 100%;
     height: 100%;
     backface-visibility: hidden;
   }
   
   .card-back {
     transform: rotateY(180deg);
   }
   ```

3. **JavaScript Flip Function** (10 min)
   ```javascript
   function flipCard(cardElement) {
     cardElement.classList.toggle('flipped');
   }
   ```

**Key Teaching Points:**
- Explain CSS `perspective` and `transform-style: preserve-3d`
- Show how `backface-visibility` works
- Demonstrate the flip in action
- Show browser dev tools to inspect styles

**Students' Turn:**
- "Now you implement this in your project"
- Encourage adding their own style
- Available for questions

---

#### The Card Grid (20 min)

**Learning Objective:** Display multiple unique card pairs in a grid

**Concepts to Cover:**

1. **Data Structure** (5 min)
   ```javascript
   const cards = [
     { id: 1, name: 'cat', image: 'cat.jpg' },
     { id: 2, name: 'dog', image: 'dog.jpg' },
     { id: 3, name: 'bird', image: 'bird.jpg' }
   ];
   ```

2. **Doubling and Shuffling** (10 min)
   ```javascript
   // Double the cards (each card appears twice)
   const gameCards = [...cards, ...cards];
   
   // Shuffle using Fisher-Yates algorithm
   function shuffle(array) {
     for (let i = array.length - 1; i > 0; i--) {
       const j = Math.floor(Math.random() * (i + 1));
       [array[i], array[j]] = [array[j], array[i]];
     }
     return array;
   }
   
   const shuffledCards = shuffle(gameCards);
   ```

3. **Rendering the Grid** (5 min)
   ```javascript
   function renderGrid(cards) {
     const grid = document.getElementById('card-grid');
     grid.innerHTML = '';
     
     cards.forEach((card, index) => {
       const cardElement = createCardElement(card, index);
       grid.appendChild(cardElement);
     });
   }
   ```

**CSS Grid Layout:**
```css
#card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}
```

**Challenge for Students:**
- "Start with a 3x3 grid (9 unique cards, 18 total)"
- "Make sure all cards still flip!"

---

#### Counters and Timers (15 min)

**Learning Objective:** Track moves and time

**Implementation Guide:**

1. **Move Counter** (7 min)
   ```javascript
   let moveCount = 0;
   
   function handleCardReveal() {
     moveCount++;
     document.getElementById('move-counter').textContent = moveCount;
   }
   ```

2. **Game Timer** (8 min)
   ```javascript
   let startTime;
   let timerInterval;
   let gameStarted = false;
   
   function startTimer() {
     if (gameStarted) return;
     gameStarted = true;
     startTime = Date.now();
     
     timerInterval = setInterval(() => {
       const elapsed = Math.floor((Date.now() - startTime) / 1000);
       const minutes = Math.floor(elapsed / 60);
       const seconds = elapsed % 60;
       document.getElementById('timer').textContent = 
         `${minutes}:${seconds.toString().padStart(2, '0')}`;
     }, 1000);
   }
   ```

**Key Points:**
- Counter increments on REVEAL, not on every click
- Timer starts on first card click
- Use `setInterval` for timer updates

---

### Part 5: Getting Started (45 minutes)

#### Pair Work Time

**What Students Should Do:**

1. **Set Up Project** (15 min)
   - One person creates GitHub repo
   - Add partner as collaborator
   - Clone repository
   - Create initial file structure
   - Make first commit together

2. **Create Trello Board** (10 min)
   - Set up board with columns
   - Create cards for Week 1 tasks
   - Apply MoSCoW prioritization
   - Assign first tasks to each person

3. **Start Coding** (20 min)
   - Begin with the flippable card
   - One person works on HTML/CSS
   - Other works on JavaScript
   - Communicate frequently!

**Instructor's Role:**
- Walk around (physically or virtually)
- Check each pair's progress
- Help with Git setup issues
- Answer questions
- Make sure everyone has a clear starting point

---

### Part 6: Session 1 Wrap-Up (15 minutes)

#### Review and Preview

**Recap Today:**
- ✅ Understood project requirements
- ✅ Organized into pairs
- ✅ Set up Trello and GitHub
- ✅ Learned core concepts: card flip, grid, counters
- ✅ Started building!

**Week 1 Homework:**
- Complete Week 1 milestone:
  * Flippable card with animation
  * Card grid (at least 3x3)
  * Move counter
  * Game timer
- Submit PR by [specific date]
- Update Trello board regularly
- Communicate with your partner

**Next Week Preview:**
- Database design and setup
- Building your first API
- Complete game logic
- Making it actually playable!

**Final Encouragement:**
- "You've got this!"
- "Remember: asking questions is smart, not weak"
- "Help each other - that's what teammates do"
- "Have fun building something cool!"

**Communication:**
- Share your contact info/office hours
- Remind about class chat for questions
- Encourage pairs to schedule work sessions together

---

## 📅 SESSION 2: Backend Integration & Game Logic

**Duration:** 3-4 hours  
**Week 2 Milestone:** Database + API + Complete game logic

---

### Part 1: Progress Review & Celebration (30 minutes)

#### Check-In (30 min)

**Opening:**
- "Who wants to show what they built last week?"
- Have 2-3 pairs demo their Week 1 progress
- Celebrate successes (working animations, creative designs, etc.)

**Common Challenges Discussion:**
- "What was harder than you expected?"
- Address common issues as a group
- Share solutions that pairs discovered

**Quick Wins:**
- Show impressive features students implemented
- Encourage students who are behind
- Emphasize learning over perfection

---

### Part 2: Backend Basics Review (45 minutes)

#### Database Design (25 min)

**Learning Objective:** Design a schema for storing cards

**Database Schema Discussion:**

1. **What to Store** (10 min)
   ```sql
   CREATE TABLE cards (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     image_url VARCHAR(255) NOT NULL,
     category VARCHAR(50),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

   **Fields Explanation:**
   - `id`: Unique identifier
   - `name`: Card name (e.g., "cat", "dog")
   - `image_url`: Path to image
   - `category`: Optional grouping (e.g., "animals", "fruits")

2. **Sample Data** (5 min)
   ```sql
   INSERT INTO cards (name, image_url, category) VALUES
   ('cat', '/images/cat.jpg', 'animals'),
   ('dog', '/images/dog.jpg', 'animals'),
   ('apple', '/images/apple.jpg', 'fruits');
   ```

3. **Optional: Scores Table** (10 min)
   ```sql
   CREATE TABLE scores (
     id SERIAL PRIMARY KEY,
     player_name VARCHAR(100),
     moves INT NOT NULL,
     time_seconds INT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

**Activity:**
- Have pairs design their schema on paper/whiteboard
- Share and discuss different approaches
- Emphasize: Simple is better than complex

---

#### API Development (20 min)

**Learning Objective:** Create an API endpoint to serve cards

**Live Coding: Express API**

1. **Setup** (5 min)
   ```bash
   npm init -y
   npm install express pg
   ```

   ```javascript
   // server.js
   const express = require('express');
   const app = express();
   const PORT = 3000;
   
   app.use(express.json());
   app.use(express.static('public')); // Serve frontend files
   ```

2. **Database Connection** (5 min)
   ```javascript
   const { Pool } = require('pg');
   const pool = new Pool({
     user: 'your_user',
     host: 'localhost',
     database: 'memory_game',
     password: 'your_password',
     port: 5432,
   });
   ```

3. **GET /api/cards Endpoint** (10 min)
   ```javascript
   app.get('/api/cards', async (req, res) => {
     try {
       const result = await pool.query('SELECT * FROM cards');
       res.json(result.rows);
     } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Server error' });
     }
   });
   
   app.listen(PORT, () => {
     console.log(`Server running on http://localhost:${PORT}`);
   });
   ```

**Testing with Postman** (demonstrated):
- Start server: `node server.js`
- Open Postman
- GET request to `http://localhost:3000/api/cards`
- Show successful response

---

### Part 3: Frontend-Backend Integration (40 minutes)

#### Fetching Data from API (40 min)

**Learning Objective:** Replace hardcoded cards with API data

**Refactoring the Frontend:**

1. **Before (Hardcoded)** (5 min)
   ```javascript
   // Old way
   const cards = [
     { id: 1, name: 'cat', image: 'cat.jpg' },
     { id: 2, name: 'dog', image: 'dog.jpg' }
   ];
   ```

2. **After (API Fetch)** (15 min)
   ```javascript
   // New way
   async function fetchCards() {
     try {
       const response = await fetch('/api/cards');
       if (!response.ok) throw new Error('Failed to fetch cards');
       const cards = await response.json();
       return cards;
     } catch (error) {
       console.error('Error fetching cards:', error);
       return [];
     }
   }
   
   async function initGame() {
     const cards = await fetchCards();
     if (cards.length === 0) {
       alert('Failed to load cards. Please try again.');
       return;
     }
     
     const gameCards = [...cards, ...cards]; // Double
     const shuffledCards = shuffle(gameCards); // Shuffle
     renderGrid(shuffledCards); // Render
   }
   
   // Start the game
   initGame();
   ```

3. **Error Handling & Loading States** (10 min)
   ```javascript
   function showLoading() {
     document.getElementById('game').innerHTML = '<div class="loading">Loading...</div>';
   }
   
   function hideLoading() {
     document.querySelector('.loading')?.remove();
   }
   
   async function initGame() {
     showLoading();
     const cards = await fetchCards();
     hideLoading();
     // ... rest of code
   }
   ```

4. **Testing** (10 min)
   - Demonstrate the flow:
     * Start backend server
     * Open frontend in browser
     * Check network tab in DevTools
     * Show API request and response
     * Verify cards load correctly

**Key Teaching Points:**
- Difference between `fetch` and direct variable access
- Why we need `async/await`
- Importance of error handling
- How to debug with Network tab

---

### Part 4: Game Logic Implementation (60 minutes)

#### Complete Game Mechanics (60 min)

**Learning Objective:** Make it a playable game!

**Core Game Logic:**

1. **Card Selection State** (15 min)
   ```javascript
   let firstCard = null;
   let secondCard = null;
   let lockBoard = false; // Prevent clicking during animation
   
   function handleCardClick(cardElement, cardData) {
     // Prevent invalid clicks
     if (lockBoard) return;
     if (cardElement === firstCard) return; // Same card clicked twice
     if (cardElement.classList.contains('matched')) return; // Already matched
     
     // Flip the card
     flipCard(cardElement);
     
     if (!firstCard) {
       // First card in pair
       firstCard = cardElement;
       firstCard.dataset.cardId = cardData.id;
       moveCount++; // Increment counter
       updateMoveCounter();
       
       if (!gameStarted) startTimer(); // Start timer on first card
     } else {
       // Second card in pair
       secondCard = cardElement;
       secondCard.dataset.cardId = cardData.id;
       moveCount++; // Increment counter
       updateMoveCounter();
       
       checkForMatch();
     }
   }
   ```

2. **Match Checking** (20 min)
   ```javascript
   function checkForMatch() {
     lockBoard = true; // Lock during check
     
     const isMatch = firstCard.dataset.cardId === secondCard.dataset.cardId;
     
     if (isMatch) {
       handleMatch();
     } else {
       handleMismatch();
     }
   }
   
   function handleMatch() {
     // Mark as matched
     firstCard.classList.add('matched');
     secondCard.classList.add('matched');
     
     // Optional: fade out or special animation
     setTimeout(() => {
       firstCard.style.visibility = 'hidden';
       secondCard.style.visibility = 'hidden';
     }, 500);
     
     resetTurn();
     checkWin();
   }
   
   function handleMismatch() {
     // Flip back after delay
     setTimeout(() => {
       firstCard.classList.remove('flipped');
       secondCard.classList.remove('flipped');
       resetTurn();
     }, 1500); // Show for 1.5 seconds
   }
   
   function resetTurn() {
     firstCard = null;
     secondCard = null;
     lockBoard = false;
   }
   ```

3. **Win Condition** (15 min)
   ```javascript
   function checkWin() {
     const allCards = document.querySelectorAll('.card');
     const matchedCards = document.querySelectorAll('.card.matched');
     
     if (matchedCards.length === allCards.length) {
       handleWin();
     }
   }
   
   function handleWin() {
     // Stop timer
     clearInterval(timerInterval);
     
     // Calculate final time
     const finalTime = Math.floor((Date.now() - startTime) / 1000);
     
     // Show win message
     setTimeout(() => {
       alert(`🎉 You won!\nMoves: ${moveCount}\nTime: ${formatTime(finalTime)}`);
       
       // Ask to play again
       if (confirm('Play again?')) {
         resetGame();
       }
     }, 500);
   }
   ```

4. **Reset Game** (10 min)
   ```javascript
   function resetGame() {
     // Reset variables
     moveCount = 0;
     gameStarted = false;
     firstCard = null;
     secondCard = null;
     lockBoard = false;
     
     // Reset UI
     updateMoveCounter();
     clearInterval(timerInterval);
     document.getElementById('timer').textContent = '0:00';
     
     // Reinitialize game
     initGame();
   }
   
   // Add reset button
   document.getElementById('reset-btn').addEventListener('click', resetGame);
   ```

**Live Demonstration:**
- Show the complete game working
- Play through a quick game
- Explain each state transition
- Show what happens when cards match/don't match

**Key Teaching Points:**
- State management is crucial
- Timing is important (delays for animations)
- User experience considerations (locking board)
- Edge cases (clicking same card twice, etc.)

---

### Part 5: Pair Work Time (60 minutes)

#### Implementation Time

**What Students Should Do:**

1. **Set Up Backend** (20 min)
   - Create database
   - Set up Express server
   - Implement GET /api/cards endpoint
   - Test with Postman

2. **Integrate Frontend** (20 min)
   - Refactor to use fetch()
   - Remove hardcoded cards
   - Add error handling
   - Test integration

3. **Implement Game Logic** (20 min)
   - Add card matching logic
   - Implement win condition
   - Add reset functionality
   - Test thoroughly

**Instructor's Role:**
- Help with database connection issues
- Debug API problems
- Assist with async/await confusion
- Check each pair's progress
- Identify teams that need extra support

**Common Issues to Watch For:**
- CORS errors (if frontend and backend on different ports)
- Database connection failures
- Async/await misuse
- State management bugs

---

### Part 6: Session 2 Wrap-Up (15 minutes)

#### Review and Preview

**Recap Today:**
- ✅ Designed database schema
- ✅ Built API endpoints
- ✅ Integrated frontend with backend
- ✅ Implemented complete game logic
- ✅ Made the game actually playable!

**Week 2 Homework:**
- Complete Week 2 milestone
- Game should be fully playable
- Database and API working
- Test thoroughly for bugs
- Submit PR by [specific date]

**Next Week Preview:**
- Add YOUR custom features (minimum 3)
- Polish and perfect
- Deploy to the web
- Prepare presentations
- Show off your work!

**Brainstorm Custom Features:**
- "Start thinking about what YOU want to add"
- "What would make YOUR game special?"
- Examples: difficulty levels, sound effects, themes, scores, leaderboards

---

## 📅 SESSION 3: Custom Features & Presentations

**Duration:** 3-4 hours  
**Week 3 Milestone:** Custom features + Deployment + Presentations

---

### Part 1: Progress Review & Demo Time (40 minutes)

#### Game Showcase (40 min)

**Opening:**
- "Let's play some games!"
- Have each pair show their working game
- Quick 2-3 minute demos
- Classmates test games on their devices (QR codes)

**Celebration:**
- Applaud every team's progress
- Highlight unique implementations
- Note creative design choices
- Acknowledge challenges overcome

**Quick Feedback:**
- What works well
- Minor bugs noticed (constructively)
- Inspiration for custom features

---

### Part 2: Custom Features Workshop (50 minutes)

#### Ideation and Planning (20 min)

**Feature Ideas Brainstorm:**

Present these categories with examples:

1. **Difficulty Levels** (5 min)
   - Easy: 3x3 grid, no time limit
   - Medium: 4x4 grid
   - Hard: 6x6 grid, time limit
   - How: Add difficulty selector, adjust grid size

2. **Scoring System** (5 min)
   - Points based on moves and time
   - Formula: `score = 10000 - (moves * 10) - (time * 5)`
   - Bonus points for combos
   - How: Calculate on win, display prominently

3. **Persistence** (3 min)
   - Save best score in localStorage
   - Display personal best
   - How: `localStorage.setItem('bestScore', score)`

4. **Leaderboard** (3 min)
   - Top 10 scores stored in database
   - POST /api/scores endpoint
   - Display leaderboard page
   - How: Database table + API + UI

5. **Enhanced UX** (4 min)
   - Sound effects (card flip, match, win)
   - Particle effects on match
   - Themes (dark mode, different card sets)
   - Smooth transitions

**More Ideas:**
- Multiple card sets (animals, fruits, countries)
- Hint button (shows all cards briefly)
- Move limit challenge
- Achievement badges
- Statistics dashboard
- Social sharing

**Pair Activity:**
- "Choose minimum 3 features to implement"
- "Prioritize with MoSCoW"
- "Add to Trello"

---

#### Implementation Guidance (30 min)

**Feature Implementation Examples:**

1. **Difficulty Selector** (10 min)
   ```html
   <select id="difficulty" onchange="setDifficulty()">
     <option value="easy">Easy (3x3)</option>
     <option value="medium">Medium (4x4)</option>
     <option value="hard">Hard (6x6)</option>
   </select>
   ```

   ```javascript
   let gridSize = { easy: 3, medium: 4, hard: 6 };
   let currentDifficulty = 'easy';
   
   function setDifficulty() {
     currentDifficulty = document.getElementById('difficulty').value;
     resetGame();
   }
   
   async function initGame() {
     const size = gridSize[currentDifficulty];
     const pairsNeeded = (size * size) / 2;
     
     let allCards = await fetchCards();
     const selectedCards = allCards.slice(0, pairsNeeded);
     // ... rest of setup
   }
   ```

2. **Local Storage for Best Score** (10 min)
   ```javascript
   function saveScore(score) {
     const bestScore = localStorage.getItem('bestScore');
     if (!bestScore || score > parseInt(bestScore)) {
       localStorage.setItem('bestScore', score);
       alert('New personal best!');
     }
   }
   
   function displayBestScore() {
     const bestScore = localStorage.getItem('bestScore') || 0;
     document.getElementById('best-score').textContent = bestScore;
   }
   ```

3. **Sound Effects** (10 min)
   ```javascript
   const sounds = {
     flip: new Audio('/sounds/flip.mp3'),
     match: new Audio('/sounds/match.mp3'),
     win: new Audio('/sounds/win.mp3')
   };
   
   function playSound(soundName) {
     sounds[soundName].currentTime = 0; // Reset to start
     sounds[soundName].play();
   }
   
   // Use in code
   function flipCard(card) {
     playSound('flip');
     card.classList.toggle('flipped');
   }
   ```

**Free Resources:**
- Sound effects: Freesound.org, Zapsplat
- Images: Unsplash, Pexels
- Icons: Font Awesome, Heroicons

---

### Part 3: Deployment Workshop (45 minutes)

#### Deploying Full-Stack Application (45 min)

**Deployment Options:**

1. **Frontend: Netlify or Vercel** (15 min)
   
   **Netlify Deployment:**
   - Sign up at netlify.com
   - Connect GitHub repo
   - Configure build settings
   - Deploy!
   
   **Live Demo:**
   - Show the deployment process
   - Configure environment variables if needed
   - Show live site

2. **Backend: Heroku or Railway** (20 min)
   
   **Heroku Deployment:**
   ```bash
   # Install Heroku CLI
   npm install -g heroku
   
   # Login
   heroku login
   
   # Create app
   heroku create memory-game-api
   
   # Add PostgreSQL
   heroku addons:create heroku-postgresql:hobby-dev
   
   # Deploy
   git push heroku main
   
   # Run migrations
   heroku run npm run migrate
   ```
   
   **Key Points:**
   - Set environment variables
   - Configure database connection
   - Update frontend to use deployed API URL

3. **Testing Deployment** (10 min)
   - Visit deployed URLs
   - Test all features
   - Check API calls work
   - Test on mobile devices
   - Share QR code

**Deployment Checklist:**
- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] Database set up and populated
- [ ] API endpoints working
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] All features working on live site
- [ ] Tested on mobile

---

### Part 4: Presentation Preparation (30 minutes)

#### Presentation Guidelines (30 min)

**Structure (7-10 minutes per team):**

1. **Trello Board** (2 min)
   - Show your workflow
   - How you organized tasks
   - MoSCoW prioritization
   - Sprint planning

2. **Live Demo** (3-4 min)
   - Play the game live
   - Show core features
   - Demonstrate custom features
   - Highlight what makes it unique

3. **Individual Contributions** (2-3 min)
   - Each teammate explains what they built
   - Challenges faced
   - Solutions found
   - Proud moments

4. **Q&A** (1-2 min)

**Preparation Checklist:**
- [ ] QR code to live site prepared
- [ ] Trello board cleaned up and ready to show
- [ ] Each person knows what to present
- [ ] Demo is tested and working
- [ ] Backup screenshots prepared
- [ ] Both partners practice

**Tips for Great Presentations:**
- Be enthusiastic!
- Show your personality
- It's okay to mention challenges
- Focus on what you learned
- Have fun with it!

---

### Part 5: Pair Work Time (60 minutes)

#### Final Sprint

**What Students Should Do:**

1. **Implement Custom Features** (30 min)
   - Work on your chosen 3+ features
   - Test as you go
   - Help each other

2. **Deploy** (15 min)
   - Deploy frontend and backend
   - Test thoroughly
   - Fix any deployment issues

3. **Prepare Presentation** (15 min)
   - Clean up Trello board
   - Create QR code
   - Decide who presents what
   - Practice once

**Instructor's Role:**
- Help with feature implementation
- Debug deployment issues
- Test deployed sites
- Answer last-minute questions
- Encourage and motivate

---

### Part 6: PRESENTATIONS! (60+ minutes)

#### Game Showcase & Presentations

**Setup:**
- Everyone shares QR codes in chat/on screen
- Audience can test games during presentations
- Supportive, encouraging atmosphere

**Each Team Presents (7-10 min):**
1. Trello board walkthrough
2. Live game demo
3. Individual contributions
4. Q&A from peers and instructor

**After Each Presentation:**
- Applause!
- 2-3 questions from audience
- Instructor feedback highlights:
  * Specific strengths
  * Impressive features
  * Growth demonstrated
  * One area for future improvement

---

### Part 7: Closing & Celebration (20 minutes)

#### Reflection and Recognition

**Group Reflection:**
- "What was your biggest learning from this project?"
- "What surprised you?"
- "What are you most proud of?"
- "What would you do differently?"

**Instructor Recognition:**
- Acknowledge every team's unique achievements
- Highlight standout features across projects
- Recognize growth and perseverance
- Celebrate collaboration

**What's Next:**
- Add these projects to your portfolio
- Share on LinkedIn
- Show to potential employers
- Continue building and learning
- Stay connected with your pair partner

**Final Words:**
- "You came in not knowing how to build a full-stack application"
- "You leave with a working, deployed game that people can play"
- "That's incredible growth in 3 weeks"
- "You should be proud of yourselves"
- "Keep coding, keep learning, keep building!"

---

## 🎓 Teaching Philosophy & Best Practices

### Creating a Supportive Pair Programming Environment

1. **Encourage True Collaboration**
   - Not one person coding, one watching
   - Both contribute equally
   - Regular driver/navigator swaps
   - Shared decision-making

2. **Handle Pair Conflicts**
   - Check in with pairs regularly
   - Address skill imbalances
   - Mediate disagreements
   - Remind: different approaches are okay

3. **Promote Independence**
   - Don't solve problems immediately
   - Ask guiding questions
   - Point to resources
   - Build problem-solving skills

4. **Celebrate Progress**
   - Acknowledge small wins
   - Share successful solutions with class
   - Create positive momentum
   - Make it fun!

### Effective Teaching Strategies

**For Live Coding:**
- ✅ Type slowly and explain
- ✅ Make intentional mistakes to show debugging
- ✅ Think out loud
- ✅ Ask "what should we do next?"
- ✅ Use comments to explain logic

**For Debugging Help:**
- ✅ Ask "what have you tried?"
- ✅ Look at browser console together
- ✅ Use console.log strategically
- ✅ Check network tab for API issues
- ✅ Teach debugging process, not just fix

**For Time Management:**
- ✅ Keep sessions moving
- ✅ Use timers for activities
- ✅ Balance lecture vs. work time
- ✅ Adjust based on class pace
- ✅ Prioritize hands-on practice

### Managing Different Skill Levels

**For Advanced Students:**
- Suggest additional challenging features
- Ask them to help struggling peers
- Encourage creative solutions
- Set higher expectations

**For Struggling Students:**
- Break tasks into smaller steps
- Provide code snippets/examples
- Pair with stronger student (carefully)
- Schedule extra office hours
- Ensure minimum requirements met

---

## 📚 Resources & Materials

### Essential Tools

**Frontend:**
- Code editor: VS Code
- Browser: Chrome with DevTools
- Card images (provide or guide to free resources)
- Design inspiration: CodePen, Dribbble

**Backend:**
- Node.js and npm
- PostgreSQL (or MySQL)
- Postman for API testing
- Database GUI: pgAdmin, TablePlus

**Deployment:**
- Netlify/Vercel (frontend)
- Heroku/Railway (backend)
- Git and GitHub

**Project Management:**
- Trello
- GitHub Projects (alternative)

### Code Snippets Library

Prepare these for students:

1. **Card flip CSS** (complete working version)
2. **Shuffle algorithm**
3. **Database schema SQL**
4. **Basic Express setup**
5. **Fetch API template**
6. **Timer implementation**
7. **.gitignore file**
8. **CORS configuration**

### Troubleshooting Guide

Create a document with solutions to common issues:

- Git merge conflicts
- Database connection errors
- CORS errors
- Async/await problems
- Deployment issues
- CSS not applying
- JavaScript not loading

### Additional Resources

**Learning:**
- MDN Web Docs (JavaScript, APIs)
- PostgreSQL documentation
- Express.js guide
- Fetch API tutorial

**Free Assets:**
- Unsplash (images)
- Freesound (sounds)
- Font Awesome (icons)
- Google Fonts (typography)

---

## 💡 Common Challenges & Solutions

### Challenge 1: Git Collaboration Issues
**Solution:**
- Teach branch strategy clearly
- Demonstrate merge conflicts
- Create a Git cheat sheet
- Encourage frequent commits
- Be available for Git help

### Challenge 2: Async JavaScript Confusion
**Solution:**
- Use async/await (simpler than promises)
- Show step-by-step execution
- Use console.logs to track flow
- Provide working examples
- Practice with simpler examples first

### Challenge 3: Backend Overwhelm
**Solution:**
- Start simple (one endpoint)
- Test with Postman first
- Integrate frontend after backend works
- Provide working starter code
- Focus on understanding, not memorization

### Challenge 4: Time Pressure
**Solution:**
- Help prioritize features
- Remind: MVP first, enhancements later
- Extend deadlines if necessary
- Encourage realistic scope
- Celebrate what IS done

### Challenge 5: Deployment Difficulties
**Solution:**
- Have backup deployment plan
- Help debug specific errors
- Provide deployment checklist
- Allow extra time for deployment
- Consider live deployment workshop

### Challenge 6: Pair Dynamics
**Solution:**
- Check in with pairs privately
- Facilitate communication
- Reassign if absolutely necessary
- Teach conflict resolution
- Emphasize teamwork value

---

## 📊 Assessment & Evaluation

### Project Evaluation Criteria (100 points)

**Functionality (30 points)**
- [ ] Week 1 features working (10)
- [ ] Week 2 features working (10)
- [ ] Week 3 custom features (10)

**Code Quality (15 points)**
- [ ] Clean, readable code (5)
- [ ] Proper structure and organization (5)
- [ ] Comments where helpful (5)

**Frontend (15 points)**
- [ ] Good UI/UX design (5)
- [ ] Responsive and accessible (5)
- [ ] Animations and polish (5)

**Backend (15 points)**
- [ ] Working API (10)
- [ ] Database properly designed (5)

**Project Management (10 points)**
- [ ] Trello used effectively (5)
- [ ] Regular commits and PRs (5)

**Collaboration (10 points)**
- [ ] Both partners contributed (5)
- [ ] Code reviews done (5)

**Presentation (5 points)**
- [ ] Clear communication (3)
- [ ] Demo worked well (2)

### Feedback Strategy

**Ongoing:**
- Check Trello boards weekly
- Review PRs with comments
- One-on-one pair check-ins
- Answer questions promptly

**Final:**
- Detailed written feedback
- Highlight specific achievements
- Suggestions for improvement
- Grade with rubric

---

## 🎯 Success Metrics

### For Students:
- ✅ Completed, deployed game
- ✅ Understanding of full-stack development
- ✅ Effective pair programming experience
- ✅ Portfolio-worthy project
- ✅ Confidence in building from scratch

### For You as Instructor:
- ✅ All pairs complete basic requirements
- ✅ Students demonstrate learning
- ✅ High engagement during sessions
- ✅ Quality presentations
- ✅ Positive feedback about pair work
- ✅ Students excited about their projects

---

## 📅 Pre-Session Preparation

### Before Session 1:
- [ ] Assign pairs
- [ ] Prepare demo Memory Game
- [ ] Test all code examples
- [ ] Prepare card images for students
- [ ] Create Trello template
- [ ] Set up example GitHub repo
- [ ] Prepare MoSCoW explanation
- [ ] List office hours schedule

### Before Session 2:
- [ ] Review Week 1 PRs
- [ ] Prepare feedback for each pair
- [ ] Test database setup
- [ ] Test API examples
- [ ] Prepare Postman examples
- [ ] Have deployment guides ready

### Before Session 3:
- [ ] Review Week 2 PRs
- [ ] Test deployment process
- [ ] Prepare QR code generator link
- [ ] Set up presentation schedule
- [ ] Prepare certificates (optional)
- [ ] Plan celebration/wrap-up

---

## 🌟 Making Students Recognize You as a Great Teacher

### Key Actions:

1. **Be Genuinely Invested**
   - Learn about their projects
   - Remember specific details
   - Celebrate their progress
   - Show you care about success

2. **Be Available and Responsive**
   - Answer questions promptly
   - Hold office hours
   - Be accessible on chat
   - Follow up on issues

3. **Make Complex Simple**
   - Break down hard concepts
   - Use analogies
   - Provide multiple explanations
   - Check for understanding

4. **Create a Safe Space**
   - Normalize struggling
   - Never make anyone feel dumb
   - Encourage questions
   - Share your own challenges

5. **Balance Guidance and Independence**
   - Don't solve everything for them
   - Teach problem-solving process
   - Guide, don't dictate
   - Build confidence

6. **Show Enthusiasm**
   - Be excited about their projects
   - Play their games
   - Give specific praise
   - Bring energy to every session

7. **Be Professional but Human**
   - Admit when you don't know
   - Show your personality
   - Use appropriate humor
   - Be relatable

8. **Go Above and Beyond**
   - Create helpful resources
   - Share extra tutorials
   - Offer career advice
   - Stay connected after course

---

## 🎉 Final Thoughts

Teaching the Foundation Memory Game Project is an opportunity to guide students through their first complete full-stack application. Your enthusiasm, clear instruction, and genuine support will make all the difference.

**Remember:**
- Students will struggle - that's learning
- Every pair is different - be flexible
- Process matters more than perfection
- Your encouragement builds confidence
- This project can change their career trajectory

**You're not just teaching code - you're building future developers!**

**Best of luck! You've got this!** 🚀

---

**Document Version:** 2.0 (Updated for Memory Game Project)  
**Last Updated:** January 2026  
**Instructor:** Abed Sujan  
**Based on:** HackYourFuture Foundation Project Brief

*This lecture plan is tailored to the Memory Game project. Adapt timing and depth based on your class's needs and pace.*
