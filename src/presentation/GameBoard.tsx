import React from 'react';
import type { GameState, Position, Piece } from '../domain/model';
import { getMovableCells } from '../domain/service';
import { PieceView } from './PieceView';

interface GameBoardProps {
  gameState: GameState;
  onCellClick: (position: Position) => void;
  onPieceClick: (piece: Piece) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  onCellClick,
  onPieceClick,
}) => {
  const handleCellClick = (row: number, col: number) => {
    onCellClick([row, col]);
  };

  const handlePieceClick = (piece: Piece) => {
    onPieceClick(piece);
  };

  const movableCells = gameState.selectedPiece
    ? getMovableCells(
        gameState.selectedPiece.piece,
        gameState.selectedPiece.from,
        gameState.board,
        gameState.currentPlayer
      )
    : [];

  return (
    <div className="w-full max-w-[600px] mx-auto">
      <div className="grid grid-cols-9 gap-0.5 bg-gray-200 p-0.5 rounded-lg dark:bg-gray-800">
        {gameState.board.map((row, rowIndex) => (
          row.map((cell, colIndex) => {
            const position: Position = [rowIndex, colIndex];
            const isMovable = movableCells.some(
              ([r, c]) => r === rowIndex && c === colIndex
            );
            const isSelected = gameState.selectedPiece?.from[0] === rowIndex &&
              gameState.selectedPiece?.from[1] === colIndex;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  aspect-square flex items-center justify-center
                  overflow-hidden p-0
                  ${isMovable ? 'bg-green-100 dark:bg-green-900' : 'bg-white dark:bg-gray-900'}
                  ${isSelected ? 'ring-2 ring-blue-500' : ''}
                  cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700
                `}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCellClick(rowIndex, colIndex);
                    }}
                  >
                    <PieceView
                      piece={cell}
                      position={position}
                      isSelected={isSelected}
                      onClick={cell.owner === gameState.currentPlayer ? handlePieceClick : undefined}
                    />
                  </div>
                )}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
};