import { selectors } from "../services/selectors.js";
import { globals } from "../services/globals.js";
import { PLAYERS, INTERACTIONS } from "../constants/appConstants.js";
import { CSS_CLASS_NAMES } from "../constants/cssClassNames.js";
import { generateRandomNumber } from "../utils/mathHelpers.js";
import { addHighlight, removeHighlight } from "../utils/domHelpers.js";

export function interactionManager() {
  const _matchingID = INTERACTIONS.SQUARES_GENERAL_ID;
  const { PLAYER_X, PLAYER_O } = PLAYERS;

  function _isSquareFilled(targetElement) {
    return globals.appState.filledSquares.includes(targetElement.id.replace(INTERACTIONS.SQUARES_ID_INITIAL, "")); 
  }

  function _fillSquare(targetElement, player) {
    targetElement.textContent = player;
  }

  function _markSquareAsFilled(targetElement) {
    globals.appState.filledSquares.push(targetElement.id.replace(INTERACTIONS.SQUARES_ID_INITIAL, "")); 
    console.info(globals.appState.currentPlayer, globals.appState.filledSquares);
  }

  function _displayCurrentPlayer(){
    selectors.gameInfo.textContent = `${globals.appState.currentPlayer} ${INTERACTIONS.PLAYER_TURN}`;
  }

  function _highlightCurrentPlayer() {
    const currentPlayerButton = globals.appState.currentPlayer === PLAYER_X ? selectors.playerXButton : selectors.playerOButton;
    const otherPlayerButton = globals.appState.currentPlayer === PLAYER_X ? selectors.playerOButton : selectors.playerXButton;

    removeHighlight(otherPlayerButton);
    addHighlight(currentPlayerButton);
  }

  function _flipPlayer() {
    globals.appState.currentPlayer = globals.appState.currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
  }

  function _areAllSquaresFilled() {
    console.info("_areAllSquaresFilled()");
    return globals.appState.filledSquares.length === INTERACTIONS.TOTAL_SQUARES;
  }

  function _findRandomEmptySquare() {
    let targetElement;
    do {
      const row = generateRandomNumber(1, 3);
      const col = generateRandomNumber(1, 3);
      targetElement = document.getElementById(`${INTERACTIONS.SQUARES_ID_INITIAL}${row}-${col}`);
    } while (_isSquareFilled(targetElement)); // loop as long as the square is filled
    return targetElement;
  }

  const _winningCombinations = [
    // Rows
    { combinationType: "row-1", cells: ["1-1", "1-2", "1-3"], cssClass: CSS_CLASS_NAMES.WIN_ROW },
    { combinationType: "row-2", cells: ["2-1", "2-2", "2-3"], cssClass: CSS_CLASS_NAMES.WIN_ROW },
    { combinationType: "row-3", cells: ["3-1", "3-2", "3-3"], cssClass: CSS_CLASS_NAMES.WIN_ROW },
    // Columns
    { combinationType: "col-1", cells: ["1-1", "2-1", "3-1"], cssClass: CSS_CLASS_NAMES.WIN_COLUMN },
    { combinationType: "col-2", cells: ["1-2", "2-2", "3-2"], cssClass: CSS_CLASS_NAMES.WIN_COLUMN },
    { combinationType: "col-3", cells: ["1-3", "2-3", "3-3"], cssClass: CSS_CLASS_NAMES.WIN_COLUMN },
    // Diagonals
    { combinationType: "diag-1", cells: ["1-1", "2-2", "3-3"], cssClass: CSS_CLASS_NAMES.WIN_DIAGONAL_MAIN }, // Top-left to bottom-right
    { combinationType: "diag-2", cells: ["1-3", "2-2", "3-1"], cssClass: CSS_CLASS_NAMES.WIN_DIAGONAL_SECONDARY }, // Top-right to bottom-left
  ];

  function _strikeThroughCells(winningCombo) {
    // Guard clause if no winning combo is passed or if it's malformed
    if (!winningCombo || !winningCombo.cssClass || !winningCombo.cells || winningCombo.cells.length === 0) {
      if (winningCombo) { // Log error only if winningCombo exists but is malformed
        console.error(
          `Cannot apply strike-through: winningCombo is malformed or missing essential properties. Type: ${winningCombo.combinationType || 'unknown'}`,
          winningCombo
        );
      }
      return;
    }

    const { cssClass, cells } = winningCombo;

    cells.forEach(cellId => {
      // It's good practice to ensure cellId is a string if there's any doubt, though here it should be.
      if (typeof cellId === 'string') {
          const cellElement = document.getElementById(`${INTERACTIONS.SQUARES_ID_INITIAL}${cellId}`);
          if (cellElement) {
            cellElement.classList.add(cssClass);
          }
        }
      });
    }

  function _checkWinCondition(currentPlayer) {
    for (const combo of _winningCombinations) {
      const [a, b, c] = combo.cells;
      const squareA = document.getElementById(`${INTERACTIONS.SQUARES_ID_INITIAL}${a}`);
      const squareB = document.getElementById(`${INTERACTIONS.SQUARES_ID_INITIAL}${b}`);
      const squareC = document.getElementById(`${INTERACTIONS.SQUARES_ID_INITIAL}${c}`);

      if (squareA && squareB && squareC && // Ensure elements exist
          squareA.textContent === currentPlayer &&
          squareB.textContent === currentPlayer &&
          squareC.textContent === currentPlayer) {
        return combo; // Return the winning combination object { combinationType: "...", cells: [...] }
      }
    }
    return null; // No win
  }

  function _handleWin(winningPlayer, winningCombo) {
    console.info(`Player ${winningPlayer} wins!`);
    globals.appState.gameOver = true;
    globals.appState.winner = winningPlayer;
    selectors.gameInfo.textContent = `${winningPlayer} ${INTERACTIONS.PLAYER_WIN}`;
    _strikeThroughCells(winningCombo);
    // Consider disabling board interactions here or by checking globals.appState.gameOver in listeners
  }

  function _handleDraw() { // Specifically for draws
    console.info("Game is a draw!");
    globals.appState.gameOver = true;
    globals.appState.winner = PLAYERS.PLAYER_DRAW;
    selectors.gameInfo.textContent = INTERACTIONS.PLAYER_DRAW;
  }

  function _handleAITurn() {
    if (globals.appState.gameOver) return; // Don't proceed if game is over
    setTimeout(() => {
        _playAI();
      }, 1000);
  }

  function _playAI() {
    let targetElement;

    switch (globals.appState.opponentLevel) {
      case 0:
        targetElement = _findRandomEmptySquare();
        break;
      case 1:
        // Smarter AI will be here.
        break;
      case 2: 
        // Minimax will be here.
      default:
        break;
    }

    const aiPlayer = globals.appState.currentPlayer; // AI is the current player here
    _fillSquare(targetElement, aiPlayer);
    _markSquareAsFilled(targetElement);

    const winningComboAI = _checkWinCondition(aiPlayer);
    if (winningComboAI) {
      _handleWin(aiPlayer, winningComboAI);
      return;
    }

    if (_areAllSquaresFilled()) {
      _handleDraw(); // Draw
      return;
    }

    _flipPlayer(); // Switch back to human player
    _displayCurrentPlayer();
    _highlightCurrentPlayer();
  }

  function _handleSquareClick(targetElement) {
    if (globals.appState.gameOver) {
      console.info("Game is already over.");
      return;
    }

    if (_isSquareFilled(targetElement)) {
      console.info("Square is already filled");
      return; 
    }

    const playerMakingMove = globals.appState.currentPlayer;
    _fillSquare(targetElement, playerMakingMove);
    _markSquareAsFilled(targetElement);

    const winningComboPlayer = _checkWinCondition(playerMakingMove);
    if (winningComboPlayer) {
      _handleWin(playerMakingMove, winningComboPlayer);
      return;
    }

    if (_areAllSquaresFilled()) {
      _handleDraw(); // Draw
      return;
    }

    // Prepare for AI turn
    _flipPlayer();
    _displayCurrentPlayer();
    _highlightCurrentPlayer();

    _handleAITurn();
  }


  function _addSquareListeners() {
    const gameBoard = selectors.TTTBoard;

    gameBoard.addEventListener("mouseover", (event) => {
      if(event.target.matches(_matchingID) && !globals.appState.gameOver && !_isSquareFilled(event.target)) { // Only highlight if game not over and square not filled
        addHighlight(event.target);
      }
    });

    gameBoard.addEventListener("mouseout", (event) => {
      if(event.target.matches(_matchingID)) {
        removeHighlight(event.target);
      }
    });

    gameBoard.addEventListener("click", (event) => {
      if(event.target.matches(_matchingID)) {
        _handleSquareClick(event.target);
      }
    });
  }
  
  function initializeGameInteraction() {
    _addSquareListeners();
    // You might want to call _displayCurrentPlayer() and _highlightCurrentPlayer() here
    // if the game starts immediately without a "start game" button,
    // or after globals.appState is reset for a new game.
    _displayCurrentPlayer();
    _highlightCurrentPlayer();
  }

  return {
    initializeGameInteraction,
  }
}