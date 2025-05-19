import React from 'react';
import type { GameState, Position, Piece } from '../domain/model';
import { getMovableCells } from '../domain/service';
import { PieceView } from './PieceView';

type GameBoardProps = {
  gameState: GameState;
  onCellClick: (position: Position) => void;
  onPieceClick: (piece: Piece, position: Position) => void;
};

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  onCellClick,
  onPieceClick,
}) => {
  const { board, selectedPiece } = gameState;
  let movableCells: Position[] = [];
  if (selectedPiece) {
    const piece = board[selectedPiece.from[0]][selectedPiece.from[1]];
    if (piece) {
      movableCells = getMovableCells(piece, selectedPiece.from, board, gameState.currentPlayer);
    }
  }

  return (
    <div className="grid grid-cols-9 gap-0 border-2 border-gray-800 bg-white">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const position: Position = [rowIndex, colIndex];
          const isMovable = movableCells.some(
            ([r, c]) => r === rowIndex && c === colIndex
          );
          const isSelected = Boolean(
            gameState.mode === 'move' &&
            selectedPiece &&
            selectedPiece.from[0] === rowIndex &&
            selectedPiece.from[1] === colIndex &&
            cell &&
            cell.owner === gameState.currentPlayer &&
            cell.type === selectedPiece.piece.type
          );

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                aspect-square flex items-center justify-center
                border border-gray-400 cursor-pointer
                ${isMovable ? 'bg-green-200' : ''}
                ${isSelected ? 'bg-blue-200' : ''}
                ${(rowIndex + colIndex) % 2 === 0 ? 'bg-amber-50' : 'bg-amber-100'}
              `}
              onClick={() => onCellClick(position)}
            >
              {cell && (
                <PieceView
                  piece={cell}
                  position={position}
                  isSelected={isSelected}
                  onClick={cell.owner === gameState.currentPlayer ? onPieceClick : undefined}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};