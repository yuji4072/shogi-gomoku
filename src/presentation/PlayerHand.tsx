import React from 'react';
import type { PieceType, Player } from '../domain/model';
import { Player as PlayerEnum } from '../domain/model';

type PlayerHandProps = {
  player: Player;
  pieces: Record<PieceType, number>;
  onPieceSelect: (type: PieceType) => void;
  isCurrentPlayer: boolean;
};

export const PlayerHand: React.FC<PlayerHandProps> = ({
  player,
  pieces,
  onPieceSelect,
  isCurrentPlayer,
}) => {
  return (
    <div
      className={`
        p-4 rounded-lg
        ${player === PlayerEnum.Player1 ? 'bg-red-50' : 'bg-blue-50'}
        ${isCurrentPlayer ? 'ring-2 ring-yellow-500' : ''}
      `}
    >
      <h3 className="text-lg font-bold mb-2">
        {player === PlayerEnum.Player1 ? 'プレイヤー1' : 'プレイヤー2'}
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(pieces).map(([type, count]) => (
          <button
            key={type}
            onClick={() => onPieceSelect(type as PieceType)}
            disabled={count === 0 || !isCurrentPlayer}
            className={`
              p-2 rounded
              ${count === 0 ? 'opacity-50' : ''}
              ${isCurrentPlayer ? 'hover:bg-yellow-100' : ''}
              ${player === PlayerEnum.Player1 ? 'text-red-600' : 'text-blue-600'}
            `}
          >
            <div className="text-lg font-bold">{type}</div>
            <div className="text-sm">残り: {count}</div>
          </button>
        ))}
      </div>
    </div>
  );
}; 