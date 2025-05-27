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

  function _checkWinConditionByBoard(currentPlayer, gameBoard) {
    //const _flatGameBoard = globals.appState.gameBoard.flat();
    const _flatGameBoard = gameBoard.flat();
    for (const key in _winningCombinationsByBoard) {
      const indices = _winningCombinationsByBoard[key];
      if (indices.every(index => _flatGameBoard[index] === currentPlayer)) {
        return { key, indices }; // Return key and indices for strike-through
      }
    }
    return false; // No win after checking all combinations
  }

  function _getEmptySquaresByBoard() {
    const gameBoard = globals.appState.gameBoard;
    let emptySquares = [];
    gameBoard.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === null) {
          emptySquares.push([rowIndex, colIndex]);
        }
      });
    });
    return emptySquares;
  }

  function _constructVirtualGameBoard(row, col, player) {
    // 1. Deep clone globals.appState.gameBoard
    const virtualGameBoard = globals.appState.gameBoard.map(innerRow => [...innerRow]);

    // 2. Apply the hypothetical move to the virtual board
    virtualGameBoard[row][col] = player;

    return virtualGameBoard;
  }

  function _getAILevel0Move() {
    return _findRandomEmptySquare();
  }

  function _getAILevel1Move() {
    const emptySquares = _getEmptySquaresByBoard(); // Gets array of [row, col] which are 0-indexed
    const aiPlayer = globals.appState.currentPlayer;
    const opponentPlayer = aiPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;

    // 1. Check if AI can win in the next move
    for (const squareCoords of emptySquares) {
      const [row, col] = squareCoords; // 0-indexed row and col
      const virtualGameBoard = _constructVirtualGameBoard(row, col, aiPlayer);
      const winningCombinationDetails = _checkWinConditionByBoard(aiPlayer, virtualGameBoard);
      
      if (winningCombinationDetails) {
        console.warn(`AI Level 1: Found winning move at [${row}, ${col}]`);
        // Convert 0-indexed [row, col] to 1-indexed for DOM ID
        const domRow = row + 1;
        const domCol = col + 1;
        return document.getElementById(`${INTERACTIONS.SQUARES_ID_INITIAL}${domRow}-${domCol}`);
      }
    }

    // 2. Check if opponent can win in the next move, and block them
    for (const squareCoords of emptySquares) {
      const [row, col] = squareCoords; // 0-indexed row and col
      // Simulate opponent making a move in this empty square
      const virtualGameBoard = _constructVirtualGameBoard(row, col, opponentPlayer);
      const opponentWinningCombination = _checkWinConditionByBoard(opponentPlayer, virtualGameBoard);

      if (opponentWinningCombination) {
        console.warn(`AI Level 1: Blocking opponent's winning move at [${row}, ${col}]`);
        // AI should play in this square to block
        const domRow = row + 1;
        const domCol = col + 1;
        return document.getElementById(`${INTERACTIONS.SQUARES_ID_INITIAL}${domRow}-${domCol}`);
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

    const aiPlayer = globals.appState.currentPlayer; // AI is the current player here
    _fillSquare(targetElement, aiPlayer);
    _updateGameBoardState(targetElement, aiPlayer);

    // Check for win using the AI's move
    const winningBoardCombination = _checkWinConditionByBoard(aiPlayer, globals.appState.gameBoard);
    
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
    const winningBoardCombination = _checkWinConditionByBoard(playerMakingMove, globals.appState.gameBoard);

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