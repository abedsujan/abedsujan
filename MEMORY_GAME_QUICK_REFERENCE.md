# Memory Game Project - Quick Instructor Reference

## 🎮 Project Overview

**Duration:** 3 weeks  
**Format:** Pair programming  
**Deliverable:** Full-stack Memory Card Game  
**Tech Stack:** HTML/CSS/JS frontend + Node.js/Express backend + PostgreSQL

---

## 📋 Three-Week Structure

| Week | Focus | Deliverable |
|------|-------|-------------|
| **Week 1** | Frontend | Flippable card + Grid + Counters/Timers |
| **Week 2** | Backend + Logic | Database + API + Complete game mechanics |
| **Week 3** | Polish + Present | 3+ custom features + Deployment + Presentation |

---

## 💡 Session 1: Project Kickoff (Week 1)

### Time Breakdown
- **Intro & Overview** (45 min): Project brief, examples, requirements
- **Pair Programming & Trello** (45 min): Pairs, project management, MoSCoW
- **GitHub Workflow** (30 min): Collaboration, branches, PRs
- **Technical Walkthrough** (60 min): Card flip, grid, counters
- **Work Time** (45 min): Start building
- **Wrap-up** (15 min): Homework, next week

### Key Teaching Points
✅ Show completed Memory Game demo  
✅ Emphasize pair programming (not one person watches)  
✅ Teach MoSCoW prioritization  
✅ Demonstrate Git collaboration workflow  
✅ Live code the card flip animation  
✅ Explain shuffle algorithm  

### Week 1 Milestone
- [ ] Single flippable card with animation
- [ ] Card grid (minimum 3x3, 18 cards)
- [ ] Move counter
- [ ] Game timer

### Common Issues
- Git merge conflicts (teach resolution)
- CSS perspective confusion (show visually)
- Shuffle algorithm complexity (provide code)
- Pair coordination (encourage communication)

---

## 💡 Session 2: Backend Integration (Week 2)

### Time Breakdown
- **Progress Review** (30 min): Demo Week 1 work
- **Backend Basics** (45 min): Database design + API setup
- **Integration** (40 min): Fetch from API
- **Game Logic** (60 min): Match checking, win condition
- **Work Time** (60 min): Implement backend + logic
- **Wrap-up** (15 min): Homework, next week

### Key Teaching Points
✅ Design simple database schema  
✅ Live code Express API endpoint  
✅ Show Postman testing  
✅ Demonstrate fetch() vs hardcoded  
✅ Explain state management (firstCard, secondCard, lockBoard)  
✅ Implement match/mismatch logic  
✅ Show win condition check  

### Week 2 Milestone
- [ ] Database created with card data
- [ ] API endpoint: GET /api/cards
- [ ] Frontend fetches from API
- [ ] Card matching logic works
- [ ] Win condition triggers
- [ ] Reset button functional

### Common Issues
- Database connection failures (check credentials)
- CORS errors (configure Express)
- Async/await confusion (explain step-by-step)
- State bugs (lockBoard crucial)
- Timing issues (delays for animations)

---

## 💡 Session 3: Polish & Presentations (Week 3)

### Time Breakdown
- **Progress Review** (40 min): Play games, celebrate
- **Custom Features** (50 min): Brainstorm, implement examples
- **Deployment** (45 min): Netlify + Heroku walkthrough
- **Presentation Prep** (30 min): Guidelines, practice
- **Work Time** (60 min): Features + deploy + prep
- **PRESENTATIONS** (60+ min): Each team presents
- **Closing** (20 min): Reflection, celebration

### Key Teaching Points
✅ Show feature examples (difficulty, scoring, sounds)  
✅ Live deploy frontend and backend  
✅ Explain presentation structure  
✅ Create supportive atmosphere  
✅ Celebrate all achievements  

### Week 3 Milestone
- [ ] Minimum 3 custom features
- [ ] Frontend deployed (Netlify/Vercel)
- [ ] Backend deployed (Heroku/Railway)
- [ ] QR code created
- [ ] Presentation delivered

### Custom Feature Ideas
- Difficulty levels (grid size)
- Scoring system
- Local storage best score
- Leaderboard (database)
- Sound effects
- Themes/card sets
- Hint button
- Move/time limits

---

## 🎯 Quick Teaching Tips

### Live Coding
- Type slowly, explain as you go
- Make intentional mistakes
- Think out loud
- Ask "what next?"

### Debugging Help
- "What have you tried?"
- Check console together
- Use Network tab for API
- Teach process, not just fix

### Pair Management
- Check in regularly
- Ensure both contribute
- Mediate conflicts early
- Celebrate collaboration

### Time Management
- Prioritize hands-on work
- Adjust pace to class
- Have backup examples ready
- Help with realistic scoping

---

## ⚡ Essential Code Snippets

### Card Flip CSS
```css
.card {
  perspective: 1000px;
  width: 150px;
  height: 200px;
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

### Shuffle Algorithm
```javascript
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
```

### Database Schema
```sql
CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  category VARCHAR(50)
);
```

### Express API
```javascript
app.get('/api/cards', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cards');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

### Match Logic
```javascript
let firstCard = null;
let secondCard = null;
let lockBoard = false;

function checkForMatch() {
  lockBoard = true;
  const isMatch = firstCard.dataset.cardId === secondCard.dataset.cardId;
  
  if (isMatch) {
    handleMatch();
  } else {
    handleMismatch();
  }
}

function handleMismatch() {
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetTurn();
  }, 1500);
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}
```

---

## 📊 Quick Grading Rubric

| Criteria | Points | What to Check |
|----------|--------|---------------|
| **Functionality** | 30 | All 3 milestones working |
| **Code Quality** | 15 | Clean, organized, readable |
| **Frontend** | 15 | UI/UX, responsive, animations |
| **Backend** | 15 | API works, database proper |
| **Project Mgmt** | 10 | Trello used, commits regular |
| **Collaboration** | 10 | Both contributed equally |
| **Presentation** | 5 | Clear demo, good communication |
| **TOTAL** | 100 | |

---

## 🆘 Troubleshooting Guide

| Issue | Solution |
|-------|----------|
| Git merge conflict | Teach: fetch, resolve in editor, commit |
| Database won't connect | Check: credentials, postgres running, pool config |
| CORS error | Add: `app.use(cors())` in Express |
| Cards won't flip | Check: CSS classes, JavaScript toggle |
| API returns empty | Check: database has data, query correct |
| Timer won't start | Check: startTimer called, interval set |
| Deployment fails | Check: env vars, build settings, logs |

---

## 🎤 Presentation Day Checklist

### Before Presentations:
- [ ] Set welcoming, supportive tone
- [ ] Share QR code format/tool
- [ ] Remind: 7-10 minutes each
- [ ] Test projection/screen share
- [ ] Have timer visible

### During Presentations:
- [ ] Keep time
- [ ] Take notes for feedback
- [ ] Ask 2-3 questions
- [ ] Applaud each team
- [ ] Stay positive and encouraging

### Presentation Structure (7-10 min):
1. **Trello Board** (2 min) - workflow, organization
2. **Live Demo** (3-4 min) - play the game, show features
3. **Contributions** (2-3 min) - each person explains their work
4. **Q&A** (1-2 min) - answer questions

---

## ✅ Pre-Session Checklist

### Session 1:
- [ ] Pairs assigned
- [ ] Demo game ready
- [ ] Card images available
- [ ] Trello template created
- [ ] Git cheat sheet prepared

### Session 2:
- [ ] Week 1 PRs reviewed
- [ ] Database setup tested
- [ ] Postman examples ready
- [ ] API code tested

### Session 3:
- [ ] Week 2 PRs reviewed
- [ ] Deployment tested
- [ ] Presentation schedule set
- [ ] QR code tool ready
- [ ] Celebration planned

---

## 💪 Motivational Reminders

**For You:**
- "Pair struggles = learning moments"
- "Every question helps the whole class"
- "Process > perfection"
- "Your enthusiasm is contagious"
- "You're building future developers!"

**For Students:**
- "Asking questions is smart, not weak"
- "Every bug fixed = skill gained"
- "Your game will be playable by anyone!"
- "Teamwork makes the dream work"
- "You've got this!"

---

## 🎯 Success Indicators

### Good Signs:
- ✅ Pairs communicating well
- ✅ Questions being asked
- ✅ Students helping each other
- ✅ Regular commits happening
- ✅ Trello boards updated
- ✅ Enthusiasm about project

### Warning Signs:
- ⚠️ One person doing all work
- ⚠️ No questions (might be stuck)
- ⚠️ No commits for days
- ⚠️ Avoiding specific features
- ⚠️ Scope too ambitious

---

## 🌟 Final Day Tips

**Create Celebration Atmosphere:**
- Play upbeat music before start
- Have snacks (if in-person)
- Set up photo opportunities
- Prepare certificates (optional)
- Share projects on social media (with permission)

**After Presentations:**
- Send written feedback within 48 hours
- Share photos/videos
- Encourage LinkedIn posts
- Connect students for networking
- Stay available for questions

---

## 📚 Essential Resources URLs

**Tools:**
- Trello: trello.com
- Postman: postman.com
- Netlify: netlify.com
- Heroku: heroku.com
- QR Generator: qr-code-generator.com

**Assets:**
- Images: unsplash.com, pexels.com
- Sounds: freesound.org
- Icons: fontawesome.com

**Learning:**
- MDN: developer.mozilla.org
- Express: expressjs.com
- PostgreSQL: postgresql.org/docs

---

**Quick Reference Version:** 2.0 (Memory Game)  
**Last Updated:** January 2026  
**Instructor:** Abed Sujan

*Keep this guide handy during all three sessions!*
