# 💣 Minesweeper

A browser-based Minesweeper game built with vanilla HTML, CSS, and JavaScript. This was one of my earlier projects, made in 2022, and I've kept it in my portfolio as a honest marker of where I started — before React, TypeScript, or any frameworks entered the picture.

## 🚀 Getting Started

No build step or dependencies required. Just open `minesweeper.html` in a browser and play.

## 🎮 How To Play

1. Click any tile to begin. The timer starts on your first interaction.
2. Tiles reveal one of three things: a **mine** 💣, a **blank tile**, or a **number**.
3. A numbered tile tells you how many mines are in the 8 tiles surrounding it — use these to deduce where the mines are hiding.
4. If you suspect a tile hides a mine, **right-click** (or long press on mobile) to plant a flag 🚩. You have a limited number of flags equal to the mine count, so use them wisely.
5. Once a numbered tile has the correct number of flags next to it, you can **click it** to automatically reveal all its unflagged neighbours — handy for clearing safe areas quickly.
6. **Uncover all non-mine tiles** to win. Hit a mine and it's game over.
7. Press the emoji button at the top to restart at any time. A new grid size is randomly selected each game.

## ✨ Features

- **Four grid sizes** — Small (8×8), Medium (11×11), Large (14×14), and Huge (17×17), chosen at random each game
- **Emoji face button** that reacts as you play: 🙂 idle, 😯 on click, 😎 on win, 🙁 on loss
- **Flag counter** showing remaining flags, and a live **timer** that starts on first click
- **Chord clicking** — click a revealed number to clear surrounding tiles when the right flags are in place
- **Win/loss overlay** with a click-to-dismiss result screen
- **Help panel** with in-game instructions, which pauses the timer while open
- **Responsive scaling** — the board scales to fit the viewport

## 🛠 Built With

- HTML5
- CSS3 (Grid layout, Flexbox)
- Vanilla JavaScript (ES6)

## 📝 Notes

This project was written in 2022 as part of teaching myself front-end development from scratch, and the code reflects that honestly — `var` declarations, global state, and a few rough edges that come with learning in public. Some polish items that were on the original to-do list (tile reveal transitions, keyboard arrow-key navigation, ARIA labels on the top bar) remain unimplemented. I've left those as-is rather than retrofitting them — this is a snapshot, not a rewrite.

Bugs identified later and patched in a 2025 review:
- `checkBombRange` had a parenthesis mismatch causing incorrect mine counts on the last row
- Incorrectly flagged tiles were not highlighted on loss due to a hidden-element ordering issue
- A chord-click loss did not trigger the proper end-game overlay (used `alert` instead)
- `getBombInfo` was a 1,700-line hardcoded array — replaced with a 3-line `Array.from` call
- The help panel now correctly pauses and resumes the timer
