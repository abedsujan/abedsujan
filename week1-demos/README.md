# Week 1 Demos - Memory Game Foundation Project

This folder contains four progressive demos that teach all Week 1 milestone features for the Memory Game project.

## 📋 Overview

These demos are designed for **live coding demonstrations** and **student reference** during the Foundation Project module, Week 1.

### Week 1 Learning Objectives:
✅ Create flippable cards with CSS 3D animations  
✅ Build a card grid layout  
✅ Implement move counter  
✅ Add game timer functionality

---

## 🎯 Demo Structure

### Demo 1: Single Flippable Card
**File:** `demo1-single-card/`  
**Focus:** CSS 3D transforms and basic card flip

**Features:**
- Single card with front and back faces
- 3D flip animation on click
- CSS `perspective`, `transform-style: preserve-3d`
- `backface-visibility` property
- Keyboard support (Space bar)

**Teaching Time:** 15-20 minutes  
**Use Case:** Start of Session 1, introduce card flip concept

**Key Concepts:**
```css
.card { perspective: 1000px; }
.card-inner { transform-style: preserve-3d; }
.card.flipped .card-inner { transform: rotateY(180deg); }
```

---

### Demo 2: Card Grid Layout
**File:** `demo2-card-grid/`  
**Focus:** Multiple cards, data structure, shuffle algorithm

**Features:**
- 3x3 grid of cards (9 cards, 4 pairs)
- Card data structure (objects with id, name, emoji)
- Fisher-Yates shuffle algorithm
- Dynamic card rendering
- CSS Grid layout
- Reset and shuffle functionality

**Teaching Time:** 20-25 minutes  
**Use Case:** Mid Session 1, after card flip is understood

**Key Concepts:**
```javascript
// Data structure
const cards = [{ id: 1, name: 'cat', emoji: '🐱' }];

// Doubling for pairs
const gameCards = [...cards, ...cards];

// Fisher-Yates shuffle
function shuffle(array) { /* implementation */ }
```

---

### Demo 3: Counters and Timers
**File:** `demo3-counters-timers/`  
**Focus:** Game state tracking, timer implementation

**Features:**
- Move counter (increments on card reveal)
- Game timer (starts on first card flip)
- Timer formatting (minutes:seconds)
- Pause/resume timer functionality
- Game state management
- Visual animations on counter updates

**Teaching Time:** 20-25 minutes  
**Use Case:** End of Session 1, add game mechanics

**Key Concepts:**
```javascript
// Move counter
let moveCount = 0;
function incrementMoves() { moveCount++; }

// Timer with setInterval
timerInterval = setInterval(() => {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  updateTimer(minutes, seconds);
}, 1000);
```

---

### Demo 4: Complete Week 1 Integration
**File:** `demo4-complete/`  
**Focus:** All features working together

**Features:**
- 4x3 grid (12 cards, 6 pairs)
- Complete card matching logic
- Pair tracking counter
- Full game flow (start → play → win)
- Win modal with final statistics
- Reset functionality
- Professional UI with all Week 1 features

**Teaching Time:** 30-40 minutes  
**Use Case:** Review/summary at end of Session 1, or beginning of Session 2

**Key Concepts:**
- All previous concepts integrated
- Game state management
- Win condition detection
- Modal implementation

---

## 🚀 How to Use These Demos

### For Instructors:

#### During Live Coding:
1. **Demo 1:** Start here. Code along with students, explaining each CSS property
2. **Demo 2:** Show data structure and shuffle algorithm. Let students implement their own
3. **Demo 3:** Demonstrate timer and counter. Have students add to their projects
4. **Demo 4:** Show as complete example. Students can reference when stuck

#### Teaching Strategy:
- **"I Do, We Do, You Do"** approach
  - **I Do:** Show the demo working
  - **We Do:** Code key parts together
  - **You Do:** Students implement in their projects

#### Tips:
- Open demos in browser before class
- Have browser DevTools open to show console logs
- Use demos to debug student issues
- Show source code when students need reference

### For Students:

#### How to View:
1. Clone/download this repository
2. Open any demo's `index.html` in a web browser
3. No build process needed - pure HTML/CSS/JS

#### How to Learn:
1. Play with the demo in browser
2. Read the source code (well-commented)
3. Try modifying values (colors, sizes, timing)
4. Copy concepts into your own project
5. Experiment and break things!

#### Debugging:
- Open browser DevTools (F12)
- Check Console tab for logs
- Inspect elements to see CSS
- Use Network tab to debug issues

---

## 📁 File Structure

```
week1-demos/
├── README.md (this file)
├── demo1-single-card/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── demo2-card-grid/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── demo3-counters-timers/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── demo4-complete/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── assets/
    └── images/ (optional card images)
```

---

## 🎨 Customization

All demos use:
- **Color Scheme:** Purple gradient (easily changeable)
- **Emojis:** For card faces (no image files needed)
- **Responsive:** Works on mobile, tablet, desktop
- **Modern CSS:** Grid, Flexbox, 3D transforms

### To Customize:
1. **Colors:** Change gradient values in CSS
2. **Cards:** Modify the `cards` array in JavaScript
3. **Grid Size:** Change `grid-template-columns` in CSS
4. **Timing:** Adjust transition durations

---

## 💡 Teaching Tips

### Demo 1 Tips:
- Explain `perspective` as "camera distance from 3D space"
- Show what happens without `backface-visibility: hidden`
- Let students try different rotation angles (X, Y, Z)
- Common issue: forgetting `transform-style: preserve-3d`

### Demo 2 Tips:
- Draw the data structure on whiteboard first
- Explain spread operator `[...array]`
- Walk through shuffle algorithm step-by-step
- Show how `forEach` creates each card

### Demo 3 Tips:
- Explain difference between click and reveal
- Show `setInterval` vs `setTimeout`
- Demonstrate timer accuracy (or lack thereof)
- Discuss when to start timer (design decision)

### Demo 4 Tips:
- Show full game flow from start to finish
- Play the game yourself first
- Point out how all pieces work together
- Use as debugging reference for students

---

## 🐛 Common Issues & Solutions

### Issue: Cards won't flip
**Solution:** Check that:
- `onclick` handler is attached
- `flipped` class is toggling
- CSS has `.flipped` styles
- JavaScript `classList.toggle()` is called

### Issue: Grid looks broken
**Solution:** Check that:
- Container has `display: grid`
- `grid-template-columns` is set
- Cards have proper aspect-ratio or height

### Issue: Timer doesn't start
**Solution:** Check that:
- `setInterval` is called
- Start time is recorded
- Timer isn't already running
- Console shows no errors

### Issue: Shuffle not random
**Solution:** Check that:
- Using Fisher-Yates algorithm correctly
- Creating copy of array (not mutating original)
- Using `Math.random()` properly

---

## 📚 Code Concepts Demonstrated

### HTML:
- Semantic structure
- Data attributes (`data-card-id`)
- Event handlers (`onclick`)
- Modal structure

### CSS:
- **Grid Layout:** `display: grid`, `grid-template-columns`
- **Flexbox:** Centering and alignment
- **3D Transforms:** `perspective`, `rotateY`, `preserve-3d`
- **Transitions:** Smooth animations
- **Responsive:** Media queries
- **Gradients:** Linear gradients for backgrounds
- **Box Shadow:** Depth and elevation

### JavaScript:
- **ES6+ Features:** Arrow functions, template literals, spread operator
- **DOM Manipulation:** `querySelector`, `createElement`, `appendChild`
- **Event Handling:** Event listeners, event delegation
- **Array Methods:** `forEach`, `map`, `slice`
- **Timing:** `setInterval`, `setTimeout`, `Date.now()`
- **Classes:** `classList.add/remove/toggle`
- **Data Structures:** Objects, arrays

---

## 🎓 Learning Outcomes

By working through these demos, students will learn:

### Technical Skills:
- CSS 3D transforms and animations
- JavaScript array manipulation
- DOM creation and manipulation
- Event handling and state management
- Timer implementation
- Responsive design with CSS Grid

### Problem-Solving Skills:
- Breaking down complex features into steps
- Debugging using console and DevTools
- Reading and understanding code
- Adapting examples to own projects

### Best Practices:
- Code organization and structure
- Meaningful variable names
- Code comments and documentation
- Separating concerns (HTML/CSS/JS)

---

## 🔗 Related Resources

### From Lecture Plan:
- **MEMORY_GAME_LECTURE_PLAN.md** - Complete teaching guide
- **MEMORY_GAME_QUICK_REFERENCE.md** - Quick lookup during teaching

### External Resources:
- [MDN: CSS Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
- [MDN: CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Fisher-Yates Shuffle](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
- [JavaScript setInterval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)

---

## ✅ Week 1 Milestone Checklist

Use this to verify students have completed Week 1 requirements:

- [ ] **Flippable Card**
  - [ ] Single card flips on click
  - [ ] 3D animation looks smooth
  - [ ] Front and back both visible

- [ ] **Card Grid**
  - [ ] Multiple cards displayed in grid
  - [ ] At least 3x3 layout (9+ cards)
  - [ ] Cards are shuffled randomly
  - [ ] All cards still flippable

- [ ] **Move Counter**
  - [ ] Counter displays on page
  - [ ] Increments when card revealed
  - [ ] Starts at 0

- [ ] **Game Timer**
  - [ ] Timer displays on page
  - [ ] Starts when first card clicked
  - [ ] Updates every second
  - [ ] Format: M:SS or MM:SS

---

## 🎉 Next Steps (Week 2)

After completing Week 1, students will add:
- Database to store card data
- Express API to serve cards
- Backend integration with fetch()
- Complete game logic (matching pairs)
- Win condition

**Preview:** Demo 4 already has matching logic - students can peek ahead!

---

## 📝 Notes for Teaching

### Time Management:
- **Session 1 Total:** 3-4 hours
- Allow time for:
  - Live coding: 60 minutes
  - Student practice: 90 minutes
  - Questions and debugging: 60 minutes
  - Breaks: 30 minutes

### Common Student Questions:
1. "Why use `perspective`?" - Needed for 3D space
2. "Can I use images instead of emojis?" - Yes! Change HTML
3. "How do I change grid size?" - Modify CSS grid-template-columns
4. "Can I add sounds?" - Yes! Use HTML5 Audio (Week 3)
5. "Why Fisher-Yates?" - It's truly random, unlike sort()

### Differentiation:
- **Struggling Students:** Focus on Demo 1-2, provide more support
- **Advanced Students:** Challenge them with Demo 4 early, add features
- **Mixed Abilities:** Pair programming helps balance

---

## 🌟 Success Criteria

Students successfully complete Week 1 when:
- ✅ They can explain how CSS 3D flip works
- ✅ Their cards flip smoothly with animation
- ✅ Grid displays properly on different screen sizes
- ✅ Move counter increments correctly
- ✅ Timer starts and displays formatted time
- ✅ Code is organized and commented
- ✅ Commits pushed to GitHub

---

## 💬 Feedback

These demos are part of the Foundation Project teaching materials.

**For improvements or issues:**
- Review the main `MEMORY_GAME_LECTURE_PLAN.md`
- Check `MEMORY_GAME_QUICK_REFERENCE.md` for teaching tips
- Test demos in different browsers
- Share feedback with fellow instructors

---

**Happy Teaching! 🎓**

These demos are designed to help students build confidence and skills.
Your enthusiasm and support make all the difference!

---

**Version:** 1.0  
**Created:** January 2026  
**For:** HackYourFuture Foundation Project - Week 1  
**Instructor:** Abed Sujan
