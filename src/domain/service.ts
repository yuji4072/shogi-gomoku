import type { Piece, Cell, Position, GameState, MoveResult } from './model';
import { PieceType, Player, GameMode, PIECE_MOVES, INITIAL_HANDS } from './model';

const BOARD_SIZE = 9;
const VICTORY_LENGTH = 5;

export const createInitialBoard = (): Cell[][] => {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
};

export const createInitialGameState = (): GameState => ({
  board: createInitialBoard(),
  playerHands: JSON.parse(JSON.stringify(INITIAL_HANDS)),
  currentPlayer: Player.Player1,
  mode: GameMode.Place,
  winner: null
});

export const getMovableCells = (piece: Piece, from: Position, board: Cell[][], currentPlayer: Player): Position[] => {
  const [row, col] = from;
  const movableCells: Position[] = [];
  const moveRule = PIECE_MOVES[piece.type];
  const directionMultiplier = piece.owner === Player.Player2 ? -1 : 1;

  moveRule.directions.forEach(([dr, dc]) => {
    const adjustedDr = dr * directionMultiplier;
    let newRow = row + adjustedDr;
    let newCol = col + dc;

    if (moveRule.isContinuous) {
      while (isValidPosition(newRow, newCol)) {
        const targetCell = board[newRow][newCol];
        if (!targetCell) {
          movableCells.push([newRow, newCol]);
        } else if (targetCell.owner !== currentPlayer) {
          movableCells.push([newRow, newCol]);
          break;
        } else {
          break;
        }
        newRow += adjustedDr;
        newCol += dc;
      }
    } else {
      if (isValidPosition(newRow, newCol)) {
        const targetCell = board[newRow][newCol];
        if (!targetCell || targetCell.owner !== currentPlayer) {
          movableCells.push([newRow, newCol]);
        }
      }
    }
  });
  return movableCells;
};

const isValidPosition = (row: number, col: number): boolean => {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
};

export const placePiece = (
  type: PieceType,
  position: Position,
  player: Player,
  gameState: GameState
): MoveResult => {
  const [row, col] = position;
  const newState = { ...gameState };
  if (newState.playerHands[player][type] <= 0) {
    return { success: false, message: '手持ちの駒がありません' };
  }
  if (newState.board[row][col]) {
    return { success: false, message: 'その位置には駒を置けません' };
  }
  newState.board[row][col] = { type, owner: player };
  newState.playerHands[player][type]--;
  if (checkVictory(newState.board, player)) {
    newState.winner = player;
  } else {
    newState.currentPlayer = player === Player.Player1 ? Player.Player2 : Player.Player1;
  }
  return { success: true, newState };
};

export const movePiece = (
  from: Position,
  to: Position,
  gameState: GameState
): MoveResult => {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;
  const newState = { ...gameState };
  const piece = newState.board[fromRow][fromCol];
  if (!piece || piece.owner !== newState.currentPlayer) {
    return { success: false, message: '無効な移動です' };
  }
  const movableCells = getMovableCells(piece, from, newState.board, newState.currentPlayer);
  if (!movableCells.some(([r, c]) => r === toRow && c === toCol)) {
    return { success: false, message: 'その位置には移動できません' };
  }
  const targetCell = newState.board[toRow][toCol];
  if (targetCell && targetCell.owner !== newState.currentPlayer) {
    // 取った駒は再利用できないため、ここでは何もしない
  }
  newState.board[toRow][toCol] = piece;
  newState.board[fromRow][fromCol] = null;
  if (checkVictory(newState.board, newState.currentPlayer)) {
    newState.winner = newState.currentPlayer;
  } else {
    newState.currentPlayer = newState.currentPlayer === Player.Player1 ? Player.Player2 : Player.Player1;
  }
  return { success: true, newState };
};

export const checkVictory = (board: Cell[][], player: Player): boolean => {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col <= BOARD_SIZE - VICTORY_LENGTH; col++) {
      if (checkLine(board, row, col, 0, 1, player)) return true;
    }
  }
  for (let row = 0; row <= BOARD_SIZE - VICTORY_LENGTH; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (checkLine(board, row, col, 1, 0, player)) return true;
    }
  }
  for (let row = 0; row <= BOARD_SIZE - VICTORY_LENGTH; row++) {
    for (let col = 0; col <= BOARD_SIZE - VICTORY_LENGTH; col++) {
      if (checkLine(board, row, col, 1, 1, player)) return true;
      if (checkLine(board, row, col + VICTORY_LENGTH - 1, 1, -1, player)) return true;
    }
  }
  return false;
};

const checkLine = (
  board: Cell[][],
  startRow: number,
  startCol: number,
  rowDelta: number,
  colDelta: number,
  player: Player
): boolean => {
  for (let i = 0; i < VICTORY_LENGTH; i++) {
    const row = startRow + i * rowDelta;
    const col = startCol + i * colDelta;
    const piece = board[row][col];
    if (!piece || piece.owner !== player) return false;
  }
  return true;
}; 