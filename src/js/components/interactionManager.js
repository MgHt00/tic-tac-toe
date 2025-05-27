import { selectors } from "../services/selectors.js";
import { globals } from "../services/globals.js";
import { PLAYERS, INTERACTIONS } from "../constants/appConstants.js";
import { CSS_CLASS_NAMES } from "../constants/cssClassNames.js";
import { generateRandomNumber } from "../utils/mathHelpers.js";
import { addHighlight, removeHighlight, makeRestartButtonFilled, makeRestartButtonOutlined, removeWinningLineStyles } from "../utils/domHelpers.js";

export function interactionManager(restoreDefaults) {
  const _matchingID = INTERACTIONS.SQUARES_GENERAL_ID;
  const { PLAYER_X, PLAYER_O } = PLAYERS;

  function _fillSquare(targetElement, player) {
    targetElement.textContent = player;
  }

  function _isSquareFilled(targetElement) {
    return targetElement.textContent !== "";
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

  function _updateGameBoardState(targetElement, player) {
    // data-row and data-col are 0-indexed strings, parse them to integers.
    const row = parseInt(targetElement.dataset.row, 10);
    const col = parseInt(targetElement.dataset.col, 10);
    
    globals.appState.gameBoard[row][col] = player;
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
      const row = generateRandomNumber(1, 3);
      const col = generateRandomNumber(1, 3);
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
      // Convert flat index (0-8) to DOM row and column (1-3)
      const domRow = Math.floor(index / 3) + 1;
      const domCol = (index % 3) + 1;
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

  const _winningCombinationsByBoard = {
    row1: [0, 1, 2],
    row2: [3, 4, 5],
    row3: [6, 7, 8],
    col1: [0, 3, 6],
    col2: [1, 4, 7],
    col3: [2, 5, 8],
    diag1: [0, 4, 8],
    diag2: [2, 4, 6],
  };

  function _checkWinConditionByBoard(currentPlayer, flatGameBoard) {
    const _flatGameBoard = globals.appState.gameBoard.flat();
    for (const key in _winningCombinationsByBoard) {
      const indices = _winningCombinationsByBoard[key];
      if (indices.every(index => _flatGameBoard[index] === currentPlayer)) {
        return { key, indices }; // Return key and indices for strike-through
      }
    }
    return false; // No win after checking all combinations
  }

  function _getEmptySquaresByBoard() {
    const _flatGameBoard = globals.appState.gameBoard.flat();
    let emptySquares = [];
    _flatGameBoard.forEach((cell, index) => {
      if (cell === null) {
        emptySquares.push(index);
      }
    });
    return emptySquares;
  }

  function _getAILevel0Move() {
    return _findRandomEmptySquare();
  }

  function _getAILevel1Move() {
    const emptySquares = _getEmptySquaresByBoard();
    console.info(emptySquares);
  }
    
  function _handleAITurn() {
    if (globals.appState.gameOver) return; // Don't proceed if game is over
    _disableBoardInteractions();
    setTimeout(() => {
        _playAI();
      }, 1000);
  }

  function _playAI() {
    _enableBoardInteractions();
    let targetElement;

    switch (globals.appState.opponentLevel) {
      case 0:
        targetElement = _getAILevel0Move();
        break;
      case 1:
        // Smarter AI will be here.
        targetElement = _getAILevel1Move();
        break;
      case 2: 
        // Minimax will be here.
      default:
        break;
    }

    /*const aiPlayer = globals.appState.currentPlayer; // AI is the current player here
    _fillSquare(targetElement, aiPlayer);
    _updateGameBoardState(targetElement, aiPlayer);

    // Check for win using the AI's move
    const winningBoardCombination = _checkWinConditionByBoard(aiPlayer);
    
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
    _highlightCurrentPlayer();*/
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
    const winningBoardCombination = _checkWinConditionByBoard(playerMakingMove);

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