import {
  restoreDefaults,
  updateGameBoardState,
  getStartingPlayer,
  setStartingPlayer,
  getCurrentPlayer,
  setCurrentPlayer,
  getGameBoard,
  isGameOverState,
  setGameOverState,
  getWinner,
  setWinner,
  isGameInProgressState,
  setGameInProgressState,
  getOpponentLevel,
  getPlayerXScore,
  setPlayerXScore,
  getPlayerOScore,
  setPlayerOScore
} from "../services/globalDataManager.js";
import { selectors } from "../services/selectors.js";
import { PLAYERS, INTERACTIONS, WIN_LINE_DIRECTIONS } from "../constants/appConstants.js";
import { CSS_CLASS_NAMES} from "../constants/cssClassNames.js";
import { checkWinCondition } from "../utils/boardUtils.js";
import { addHighlight, removeHighlight, makeRestartButtonFilled, makeRestartButtonOutlined, removeWinningLineStyles, removePlayerMarkStyles, blackoutScreen, unBlackoutScreen, updateScoreOnScreen, showWinnerOnScreen, displayCurrentPlayer, highlightCurrentPlayer } from "../utils/domHelpers.js";
/**
 * Manages all game interactions on the Tic-Tac-Toe board.
 * This includes handling player moves, AI turns, win/draw conditions, and game resets.
 * @param {function} getAILevel0Move - Function to get a move for AI level 0.
 * @param {function} getAILevel1Move - Function to get a move for AI level 1.
 * @param {function} getAILevel2Move - Function to get a move for AI level 2.
 * @returns {object} An object containing `initializeGameInteraction` and `resetGameBoard` functions.
 */
export function interactionManager(getAILevel0Move, getAILevel1Move, getAILevel2Move) {
  const _matchingID = INTERACTIONS.SQUARES_GENERAL_ID;
  const { PLAYER_X, PLAYER_O } = PLAYERS;

  // Fills a square with the player's mark and applies appropriate styling.
  function _fillAndDecorateSquare(targetElement, player) {
    targetElement.textContent = player;
    const cssClass = player === PLAYER_X ? CSS_CLASS_NAMES.PLAYER_X_COLOR : CSS_CLASS_NAMES.PLAYER_O_COLOR;
    targetElement.classList.add(cssClass);
  }

  // Checks if a given square element is already filled with a player's mark.
  function _isSquareFilled(targetElement) {
    return targetElement.textContent !== "";
  }

  // Disables interactions with the Tic-Tac-Toe board.
  function _disableBoardInteractions() {
    if (selectors.TTTBoard) {
      selectors.TTTBoard.classList.add(CSS_CLASS_NAMES.BOARD_DISABLED);
    }
  }

  // Enables interactions with the Tic-Tac-Toe board.
  function _enableBoardInteractions() {
    if (selectors.TTTBoard) {
      selectors.TTTBoard.classList.remove(CSS_CLASS_NAMES.BOARD_DISABLED);
    }
  }

  // Switches the current player.
  function _flipPlayer() {
    const newPlayer = getCurrentPlayer() === PLAYER_X ? PLAYER_O : PLAYER_X;
    setCurrentPlayer(newPlayer);
  }

  // Checks if all squares on the board are filled.
  function _areAllSquaresFilled() {
    const squaresNodeList = document.querySelectorAll(_matchingID);
    for (const square of squaresNodeList) {
      if (square.textContent === "") {
        return false;
      }
    }
    return true;
  }
 
  /**
   * Resets the game board to its initial state.
   * @param {object} options - Options for the reset.
   * @param {boolean} [options.resetScore=false] - Whether to reset player scores.
   * @param {boolean} [options.resetStartingPlayer=false] - Whether to reset the starting player to default.
   */
  function resetGameBoard({ resetScore = false, resetStartingPlayer = false }) {
    blackoutScreen();
    restoreDefaults({ resetScore, resetStartingPlayer });

    selectors.gameInfo.textContent = PLAYERS.INITIAL_MESSAGE;
    
    const squaresNodeList = document.querySelectorAll(_matchingID);
    squaresNodeList.forEach(square => {
      square.textContent = "";
      removeWinningLineStyles(square);
      removePlayerMarkStyles(square);
    });

    selectors.playerXButton.classList.remove(CSS_CLASS_NAMES.HIGHLIGHT);
    selectors.playerOButton.classList.remove(CSS_CLASS_NAMES.HIGHLIGHT);

    makeRestartButtonOutlined();
    _enableBoardInteractions(); 

    setTimeout(() => {
      unBlackoutScreen();
    }, INTERACTIONS.GAME_RESET_TIME_MS);
    
    console.warn("Game board reset.");
  }

  /**
   * Applies styling to indicate the winning line on the board.
   * @param {object} winningCombinationDetails - Details of the winning combination, including key and indices.
   * @param {string} winningPlayer - The player who won (PLAYER_X or PLAYER_O).
   */
  function _strikeThroughCells(winningCombinationDetails, winningPlayer) {
    if (!winningCombinationDetails || !winningCombinationDetails.key || !winningCombinationDetails.indices) {
      console.error("Invalid winningCombinationDetails for strikeThroughCells:", winningCombinationDetails);
      return;
    }

    const { key, indices } = winningCombinationDetails;
    let baseWinType; // Will be "ROW", "COLUMN", "DIAGONAL_MAIN", or "DIAGONAL_SECONDARY"

    if (key.startsWith("row")) {
      baseWinType = WIN_LINE_DIRECTIONS.ROW;
    } else if (key.startsWith("col")) {
      baseWinType = WIN_LINE_DIRECTIONS.COLUMN;
    } else if (key === "diag1") {
      baseWinType = WIN_LINE_DIRECTIONS.DIAGONAL_MAIN;
    } else if (key === "diag2") {
      baseWinType = WIN_LINE_DIRECTIONS.DIAGONAL_SECONDARY;
    } else {
      console.error("Unknown winning combination key:", key);
      return;
    }

    // Construct the key for CSS_CLASS_NAMES, e.g., "X_WIN_ROW" or "O_WIN_DIAGONAL_MAIN"
    const cssClassKey = `${winningPlayer}_WIN_${baseWinType}`;
    const cssClass = CSS_CLASS_NAMES[cssClassKey];

    if (!cssClass) {
      console.error(`CSS class not found for key: ${cssClassKey}. Ensure PLAYERS constants ('${PLAYER_X}', '${PLAYER_O}') align with CSS_CLASS_NAMES prefixes.`);
      return;
    }

    indices.forEach(index => {
      const domRow = Math.floor(index / 3); // Result is 0, 1, or 2
      const domCol = (index % 3);      // Result is 0, 1, or 2
      const cellId = `${INTERACTIONS.SQUARES_ID_INITIAL}${domRow}-${domCol}`; 
      const cellElement = document.getElementById(cellId);

      if (cellElement) {
        cellElement.classList.add(cssClass);
      } else {
        console.error(`Cell element not found for ID: ${cellId}`);
      }
    });
  }

  // Increments the score for the winning player.
  function _accumulateScore(winningPlayer) {
    if (winningPlayer === PLAYER_X) {
      setPlayerXScore(getPlayerXScore() + 1);
    }
    if (winningPlayer === PLAYER_O) {
      setPlayerOScore(getPlayerOScore() + 1);
    }
  }

  /**
   * Handles the game win scenario.
   * @param {string} winningPlayer - The player who won.
   * @param {object} winningCombinationDetails - Details of the winning line.
   */
  function _handleWin(winningPlayer, winningCombinationDetails) {
    console.info(`Player ${winningPlayer} wins!`);
    setGameOverState(true);
    setWinner(winningPlayer);
    _accumulateScore(winningPlayer);
    updateScoreOnScreen(getPlayerXScore(), getPlayerOScore());
    showWinnerOnScreen(winningPlayer);
    _strikeThroughCells(winningCombinationDetails, winningPlayer);
    _disableBoardInteractions();
    makeRestartButtonFilled();
  }

  // Handles the game draw scenario.
  function _handleDraw() { 
    console.info("Game is a draw!");
    _disableBoardInteractions();
    setGameOverState(true);
    setWinner(PLAYERS.PLAYER_DRAW);
    selectors.gameInfo.textContent = INTERACTIONS.PLAYER_DRAW;
    makeRestartButtonFilled();
  }

  // Handles UI updates and enables board for 2-player mode turns.
  function _handle2PlayerMode() {
    _enableBoardInteractions();
    displayCurrentPlayer(getCurrentPlayer());
    highlightCurrentPlayer(getCurrentPlayer());
  }
    
  // Manages the AI's turn, including thinking time and invoking the AI move logic.
  function _handleAITurn() {
    if (isGameOverState()) return; // Don't proceed if game is over
    _disableBoardInteractions();
    
    if (getOpponentLevel() === 3) {
      _handle2PlayerMode();
      return;
    }
    setTimeout(() => {
      _playAI();
    }, INTERACTIONS.AI_THINKING_TIME_MS);
    
    setGameInProgressState(true);
  }

  // Executes the AI's move based on the selected difficulty level.
  function _playAI() {
    _enableBoardInteractions();
    let moveCoordinates; // Will be {row, col} or null
    const aiPlayerSymbol = getCurrentPlayer();
    const opponentPlayerSymbol = aiPlayerSymbol === PLAYER_X ? PLAYER_O : PLAYER_X;

    switch (getOpponentLevel()) {
      case 0:
        moveCoordinates = getAILevel0Move(getGameBoard());
        break;
      case 1:
        moveCoordinates = getAILevel1Move(getGameBoard(), aiPlayerSymbol, opponentPlayerSymbol);
        break;
      case 2:
        moveCoordinates = getAILevel2Move(getGameBoard(), aiPlayerSymbol, opponentPlayerSymbol);
        break; 
      default:
        console.error("Unknown AI opponent level:", getOpponentLevel(), "AI will not move.");
        _enableBoardInteractions();
        return;
    }

    if (!moveCoordinates) {
      console.error("AI failed to select a move (no coordinates returned). Re-enabling board.");
      _enableBoardInteractions();
      return;
    }

    const targetElementId = `${INTERACTIONS.SQUARES_ID_INITIAL}${moveCoordinates.row}-${moveCoordinates.col}`;
    const targetElement = document.getElementById(targetElementId);

    _fillAndDecorateSquare(targetElement, aiPlayerSymbol);
    updateGameBoardState(targetElement, aiPlayerSymbol);

    // Check for win using the AI's move
    const winningBoardCombination = checkWinCondition(getGameBoard(), aiPlayerSymbol);
    
    if (winningBoardCombination) {
      _handleWin(aiPlayerSymbol, winningBoardCombination);
      return;
    }
    
    if (_areAllSquaresFilled()) {
      _handleDraw(); 
      return;
    }

    _flipPlayer(); // Switch back to human player
    displayCurrentPlayer(getCurrentPlayer());
    highlightCurrentPlayer(getCurrentPlayer());
  }

  // Handles a click event on a square of the Tic-Tac-Toe board.
  function _handleSquareClick(targetElement) {
    if (isGameOverState()) {
      console.info("Game is already over.");
      return;
    }

    if (_isSquareFilled(targetElement)) {
      console.info("Square is already filled");
      return; 
    }

    const playerMakingMove = getCurrentPlayer();

    setGameInProgressState(true);

    _fillAndDecorateSquare(targetElement, playerMakingMove);
    updateGameBoardState(targetElement, playerMakingMove);

    // Check for win using the player's move    
    const winningBoardCombination = checkWinCondition(getGameBoard(), playerMakingMove);

    if (winningBoardCombination) {
      _handleWin(playerMakingMove, winningBoardCombination); 
      return;
    }

    if (_areAllSquaresFilled()) {
      _handleDraw(); 
      return;
    }

    // Prepare for AI turn
    _flipPlayer();
    displayCurrentPlayer(getCurrentPlayer());
    highlightCurrentPlayer(getCurrentPlayer());

    _handleAITurn();
  }
  
  // Adds event listeners to the squares on the Tic-Tac-Toe board for mouseover, mouseout, and click events.
  function _addSquareListeners() {
    const gameBoard = selectors.TTTBoard;

    gameBoard.addEventListener("mouseover", (event) => {
      if(event.target.matches(_matchingID) && !isGameOverState() && !_isSquareFilled(event.target)) { // Only highlight if game not over and square not filled
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
        highlightCurrentPlayer(getCurrentPlayer());
      }
    });
  }
  
  // Initializes the game interactions, sets up event listeners, and handles the initial game state.
  function initializeGameInteraction() {
    _addSquareListeners();
    // Ensure currentPlayer is aligned with the startingPlayer state.
    // This is especially important on initial load or if resetGameBoard wasn't just called.
    setCurrentPlayer(getStartingPlayer()); 

    displayCurrentPlayer(getCurrentPlayer()); 
    highlightCurrentPlayer(getCurrentPlayer()); 
    // If the current player is O (AI) and it's not 2-player mode, AI makes the first move.
    if (getCurrentPlayer() === PLAYER_O && getOpponentLevel() < 3) { 
      _handleAITurn();
    }
  }

  return {
    initializeGameInteraction,
    resetGameBoard,
  }
}