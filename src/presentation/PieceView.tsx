import React from 'react';
import type { Piece, Position } from '../domain/model';
import { Player } from '../domain/model';

type PieceViewProps = {
  piece: Piece;
  position: Position;
  isSelected: boolean;
  onClick?: (piece: Piece, position: Position) => void;
};

export const PieceView: React.FC<PieceViewProps> = ({ piece, position, isSelected, onClick }) => (
  <div
    className={`
      w-full h-full flex items-center justify-center
      text-lg font-bold
      ${piece.owner === Player.Player1
        ? 'bg-red-500 text-white'
        : 'bg-blue-500 text-white'
      }
      ${isSelected ? 'ring-2 ring-yellow-400' : ''}
      shadow-md
      ${piece.owner === Player.Player2 ? 'rotate-180' : ''}
    `}
    onClick={onClick ? (e) => {
      e.stopPropagation();
      onClick(piece, position);
    } : undefined}
  >
    {piece.type}
  </div>
); 