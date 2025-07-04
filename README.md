# Tic-Tac-Toe

A classic Tic-Tac-Toe game implementation featuring an AI opponent powered by the Minimax algorithm. This project was developed to explore and implement the complexities of game theory and artificial intelligence in a familiar setting.

## Features

*   Classic 3x3 Tic-Tac-Toe gameplay.
*   Play against an AI opponent.
*   Multiple AI difficulty levels (to be implemented/detailed).
*   2 Player mode.
*   AI can make the first move.
*   Clear visual interface.

## How to Play

1.  The game is played on a 3x3 grid.
2.  The human player is typically assigned 'X' and the AI player 'O'.
3.  Players take turns placing their marks in empty squares on the grid.
4.  The first player to get 3 of their marks in a row (up, down, across, or diagonally) is the winner.
5.  When all 9 squares are full, the game is over. If no player has 3 marks in a row, the game ends in a tie.

## AI Opponent - The Minimax Algorithm

The hardeset AI opponent in this game utilizes the **Minimax algorithm** to determine its optimal move. Minimax is a decision-making algorithm commonly used in two-player turn-based games.

*   **How it works:** The algorithm explores all possible game states from the current position down to the terminal states (win, loss, or draw).
*   It assigns a score to each terminal state (e.g., +1 for AI win, -1 for player win, 0 for a draw).
*   Working backward from these terminal states, it chooses moves that maximize its own score (assuming the opponent plays optimally to minimize the AI's score).
*   This recursive approach allows the AI to "look ahead" and make strategic decisions to either win or force a draw if a win is not possible.

## Key Folders and Files

- **`src/js/components/`**: JavaScript modules for UI and game interactions.
- **`src/js/constants/`**: Project-wide constants.
- **`src/js/services/`**: Core game logic and data management.
- **`src/js/main.js`**: Entry point for initializing the game.
- **`src/css/global.css`**: Main stylesheet for the game.

## Technologies Used

*   **JavaScript (ES6+):** For game logic, interactions, and data management.
*   **Bootstrap:**
*   **HTML5:**
*   **CSS3:**

## Future Enhancements

*   Enhanced visual transactions and animations.

## Screenshots

### Main Game Screen
![Main Game Screen](screenshots/1-initial.png)

### Alert
![Alert](screenshots/2-alert.png)

### Game Over
![Game Over](screenshots/3-game-over.png)

## Demo
https://mght00.github.io/tic-tac-toe/

## Acknowledgements

*  This project was inspired by the desire to understand and implement fundamental AI algorithms. I learned all about minimax and other minimax-related game logic from the following websites:
  *  https://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-1-introduction/
  
  * https://www.geeksforgeeks.org/finding-optimal-move-in-tic-tac-toe-using-minimax-algorithm-in-game-theory/

*   This project benefited greatly from the assistance of AI tools. I would like to extend my thanks to both Gemini and ChatGPTfor their creative suggestions, problem-solving capabilities, and code refinement. Their contributions were instrumental in making this project what it is today.
