import { globals } from "../services/globals.js";
import { restoreDefaults, updateGameBoardState } from "../services/globalDataManager.js";
import { selectors } from "../services/selectors.js";
import { PLAYERS, INTERACTIONS } from "../constants/appConstants.js";
import { CSS_CLASS_NAMES } from "../constants/cssClassNames.js";
import { generateRandomNumber } from "../utils/mathHelpers.js";
import { getEmptySquares, checkWinCondition, constructVirtualGameBoard } from "../utils/boardUtils.js"; 
import { addHighlight, removeHighlight, makeRestartButtonFilled, makeRestartButtonOutlined, removeWinningLineStyles } from "../utils/domHelpers.js";

export function interactionManager() {
  const _matchingID = INTERACTIONS.SQUARES_GENERAL_ID;
  const { PLAYER_X, PLAYER_O } = PLAYERS;

  function _fillSquare(targetElement, player) {
    targetElement.textContent = player;
  }

  function _isSquareFilled(targetElement) {
    return targetElement.textContent !== "";
  }

  function _disableBoardInteractions() {
    if (selectors.TTTBoard) {
      selectors.TTTBoard.classList.add(CSS_CLASS_NAMES.BOARD_DISABLED);
    }
  }

  function _enableBoardInteractions() {
    if (selectors.TTTBoard) {
      selectors.TTTBoard.classList.remove(CSS_CLASS_NAMES.BOARD_DISABLED);
    }
  }

  function _flipPlayer() {
    globals.appState.currentPlayer = globals.appState.currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
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

  function _areAllSquaresFilled() {
    const squaresNodeList = document.querySelectorAll(_matchingID);
    for (const square of squaresNodeList) {
      if (square.textContent === "") {
        return false;
      }
    }
    return true;
  }

  function _resetGameBoard() {
    restoreDefaults(); // reset global's appState

    selectors.gameInfo.textContent = PLAYERS.INITIAL_MESSAGE;
    
    const squaresNodeList = document.querySelectorAll(_matchingID);
    squaresNodeList.forEach(square => {
      square.textContent = "";
      removeWinningLineStyles(square);
    });

    selectors.playerXButton.classList.remove(CSS_CLASS_NAMES.HIGHLIGHT);
    selectors.playerOButton.classList.remove(CSS_CLASS_NAMES.HIGHLIGHT);

    makeRestartButtonOutlined();
    _enableBoardInteractions(); 
  }

  function _findRandomEmptySquare() {
    let targetElement;
    do {
      const row = generateRandomNumber(0, 2); 
      const col = generateRandomNumber(0, 2); 
      targetElement = document.getElementById(`${INTERACTIONS.SQUARES_ID_INITIAL}${row}-${col}`);
    } while (_isSquareFilled(targetElement)); // loop as long as the square is filled
    return targetElement;
  }

  function _strikeThroughCells(winningCombinationDetails) {
    if (!winningCombinationDetails || !winningCombinationDetails.key || !winningCombinationDetails.indices) {
      console.error("Invalid winningCombinationDetails for strikeThroughCells:", winningCombinationDetails);
      return;
    }

    const { key, indices } = winningCombinationDetails;
    let cssClass;

    if (key.startsWith("row")) {
      cssClass = CSS_CLASS_NAMES.WIN_ROW;
    } else if (key.startsWith("col")) {
      cssClass = CSS_CLASS_NAMES.WIN_COLUMN;
    } else if (key === "diag1") {
      cssClass = CSS_CLASS_NAMES.WIN_DIAGONAL_MAIN;
    } else if (key === "diag2") {
      cssClass = CSS_CLASS_NAMES.WIN_DIAGONAL_SECONDARY;
    } else {
      console.error("Unknown winning combination key:", key);
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

  function _handleWin(winningPlayer, winningCombinationDetails) {
    console.info(`Player ${winningPlayer} wins!`);
    globals.appState.gameOver = true;
    globals.appState.winner = winningPlayer;
    selectors.gameInfo.textContent = `${winningPlayer} ${INTERACTIONS.PLAYER_WIN}`;
    _strikeThroughCells(winningCombinationDetails);
    _disableBoardInteractions();
    makeRestartButtonFilled();
  }

  function _handleDraw() { 
    console.info("Game is a draw!");
    _disableBoardInteractions();
    globals.appState.gameOver = true;
    globals.appState.winner = PLAYERS.PLAYER_DRAW;
    selectors.gameInfo.textContent = INTERACTIONS.PLAYER_DRAW;
    makeRestartButtonFilled();
  }

  function _updateGameBoardState(targetElement, player) {
    // data-row and data-col are 0-indexed strings, parse them to integers.
    const row = parseInt(targetElement.dataset.row, 10);
    const col = parseInt(targetElement.dataset.col, 10);
    
    globals.appState.gameBoard[row][col] = player;
  }

  function _getAILevel0Move() {
    return _findRandomEmptySquare();
  }

  function _getAILevel1Move() {
    const emptySquares = getEmptySquares(globals.appState.gameBoard); // Gets array of [row, col] which are 0-indexed
    const aiPlayer = globals.appState.currentPlayer;
    const opponentPlayer = aiPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;

    // 1. Check if AI can win in the next move
    for (const squareCoords of emptySquares) {
      const [row, col] = squareCoords; // 0-indexed row and col
      const virtualGameBoard = constructVirtualGameBoard(globals.appState.gameBoard, row, col, aiPlayer);
      const winningCombinationDetails = checkWinCondition(aiPlayer, virtualGameBoard);
      
      if (winningCombinationDetails) {
        console.warn(`AI Level 1: Found winning move at [${row}, ${col}]`);
        return document.getElementById(`${INTERACTIONS.SQUARES_ID_INITIAL}${row}-${col}`);
      }
    }

    // 2. Check if opponent can win in the next move, and block them
    for (const squareCoords of emptySquares) {
      const [row, col] = squareCoords; // 0-indexed row and col
      // Simulate opponent making a move in this empty square
      const virtualGameBoard = constructVirtualGameBoard(globals.appState.gameBoard, row, col, opponentPlayer);
      const opponentWinningCombination = checkWinCondition(opponentPlayer, virtualGameBoard);

      if (opponentWinningCombination) {
        console.warn(`AI Level 1: Blocking opponent's winning move at [${row}, ${col}]`);
        // AI should play in this square to block
        return document.getElementById(`${INTERACTIONS.SQUARES_ID_INITIAL}${row}-${col}`);
      }
    }

    // 3. Fallback: If no immediate winning move for AI and no immediate blocking move needed,
    // pick a random empty square.
    console.warn("AI Level 1: No immediate winning move. Picking a random empty square.");
    if (emptySquares.length > 0) {
      return _findRandomEmptySquare();
    }

    // Should ideally not be reached if game is not over and emptySquares were found.
    // As a last resort, fall back to level 0 logic if something unexpected happened.
    console.error("AI Level 1: No empty squares available or unexpected issue. Falling back to Level 0 move.");
    return _getAILevel0Move();
  }

  function _getAILevel2Move() {

  }
    
  function _handleAITurn() {
    if (globals.appState.gameOver) return; // Don't proceed if game is over
    _disableBoardInteractions();
    setTimeout(() => {
        _playAI();
      }, INTERACTIONS.AI_THINKING_TIME_MS);
  }

  function _playAI() {
    _enableBoardInteractions();
    let targetElement;

    switch (globals.appState.opponentLevel) {
      case 0:
        targetElement = _getAILevel0Move();
        break;
      case 1:
        targetElement = _getAILevel1Move();
        break;
      case 2: 
        // Minimax will be here.
        console.warn("AI Level 2 (Minimax) not yet implemented. AI will not move.");
        // For now, AI Level 2 will do nothing, or you could make it fall back to a simpler AI.
        // Re-enable interactions if AI isn't going to move.
        _enableBoardInteractions(); 
        return; 
      default:
        console.error("Unknown AI opponent level:", globals.appState.opponentLevel, "AI will not move.");
        _enableBoardInteractions();
        return;
    }

    if (!targetElement) {
      console.error("AI failed to select a square. Target element is undefined. Re-enabling board.");
      _enableBoardInteractions();
      return;
    }

    const aiPlayer = globals.appState.currentPlayer; // AI is the current player here
    _fillSquare(targetElement, aiPlayer);
    _updateGameBoardState(targetElement, aiPlayer);

    // Check for win using the AI's move
    const winningBoardCombination = checkWinCondition(aiPlayer, globals.appState.gameBoard);
    
    if (winningBoardCombination) {
      _handleWin(aiPlayer, winningBoardCombination);
      return;
    }
    
    if (_areAllSquaresFilled()) {
      _handleDraw(); 
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
    _updateGameBoardState(targetElement, playerMakingMove);

    // Check for win using the player's move
    const winningBoardCombination = checkWinCondition(playerMakingMove, globals.appState.gameBoard);

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
        _highlightCurrentPlayer();
      }
    });
  }

  function _addRestartButtonListener() {
    selectors.restartButton.addEventListener("click", () => {
      _resetGameBoard();
    });
  }
  
  function initializeGameInteraction() {
    _addSquareListeners();
    _addRestartButtonListener();
    _resetGameBoard();
    _highlightCurrentPlayer();
  }

  return {
    initializeGameInteraction,
  }
}