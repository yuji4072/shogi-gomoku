import React from 'react';
import type { Piece, PieceType } from '../domain/model';
import { Player } from '../domain/model';
import { PieceView } from './PieceView';

interface PlayerHandProps {
  player: Player;
  pieces: PieceType[];
  onPieceSelect: (pieceType: PieceType) => void;
  isCurrentPlayer: boolean;
  selectedPieceType?: PieceType | null;
}

export const PlayerHand: React.FC<PlayerHandProps> = ({
  player,
  pieces,
  onPieceSelect,
  isCurrentPlayer,
  selectedPieceType,
}) => {
  const pieceCounts = pieces.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<PieceType, number>);

  return (
    <div className={`
        p-4 rounded-lg
      ${player === Player.Player1 ? 'bg-red-50 dark:bg-red-900' : 'bg-blue-50 dark:bg-blue-900'}
      ${isCurrentPlayer ? 'ring-2 ring-green-500' : ''}
      dark:text-white
    `}>
      <h2 className="text-lg font-bold mb-2">
        {player === Player.Player1 ? 'プレイヤー1' : 'プレイヤー2'}の駒
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Object.entries(pieceCounts).map(([type, count]) => (
          <div
            key={type}
            className={`
              flex items-center gap-2 p-2 rounded
              ${isCurrentPlayer ? 'cursor-pointer hover:bg-white dark:hover:bg-gray-700' : 'opacity-50'}
              ${selectedPieceType === type ? 'ring-2 ring-yellow-400' : ''}
            `}
            onClick={() => isCurrentPlayer && onPieceSelect(type as PieceType)}
          >
            <div className="w-8 h-8">
              <PieceView
                piece={{
                  type: type as PieceType,
                  owner: player,
                }}
                position={[0, 0]}
                isSelected={selectedPieceType === type}
              />
            </div>
            <span className="text-sm">× {count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}; 