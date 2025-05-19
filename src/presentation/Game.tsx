import React, { useState } from 'react';
import type { GameState, Position, Piece, PieceType } from '../domain/model';
import { createInitialGameState, placePiece, movePiece } from '../domain/service';
import { Player, GameMode } from '../domain/model';
import { GameBoard } from './GameBoard';
import { PlayerHand } from './PlayerHand';

export const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [selectedPieceType, setSelectedPieceType] = useState<PieceType | null>(null);

  // Record<PieceType, number> → PieceType[] 変換関数
  const handToArray = (hand: Record<PieceType, number>): PieceType[] =>
    Object.entries(hand).flatMap(([type, count]) => Array(count).fill(type as PieceType));

  const handleCellClick = (position: Position) => {
    if (gameState.winner) return;

    if (gameState.mode === GameMode.Place && selectedPieceType) {
      const result = placePiece(
        selectedPieceType,
        position,
        gameState.currentPlayer,
        gameState
      );
      if (result.success && result.newState) {
        setGameState(result.newState);
        setSelectedPieceType(null);
      }
    } else if (gameState.mode === GameMode.Move && gameState.selectedPiece) {
      const result = movePiece(
        gameState.selectedPiece.from,
        position,
        gameState
      );
      if (result.success && result.newState) {
        setGameState({
          ...result.newState,
          selectedPiece: undefined,
        });
      }
    }
  };

  // pieceクリック時にpositionも渡すためのラッパー
  const handlePieceClick = (piece: Piece) => {
    if (gameState.winner) return;
    if (piece.owner !== gameState.currentPlayer) return;
    // 盤面上のpieceの位置を探す
    const found = gameState.board.flatMap((row, rowIdx) =>
      row.map((cell, colIdx) => (cell === piece ? [rowIdx, colIdx] as Position : null))
    ).find(pos => pos !== null);
    if (!found) return;
    setGameState({
      ...gameState,
      mode: GameMode.Move,
      selectedPiece: { from: found, piece },
    });
  };

  const handlePieceSelect = (type: PieceType) => {
    if (gameState.winner) return;
    if (selectedPieceType === type) {
      setSelectedPieceType(null);
      setGameState({
        ...gameState,
        mode: GameMode.Place,
        selectedPiece: undefined,
      });
    } else {
      setSelectedPieceType(type);
      setGameState({
        ...gameState,
        mode: GameMode.Place,
        selectedPiece: undefined,
      });
    }
  };

  const handleReset = () => {
    setGameState(createInitialGameState());
    setSelectedPieceType(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">将棋五目並べ</h1>
        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold">現在のターン: </span>
            <span className={gameState.currentPlayer === Player.Player1 ? 'text-red-600' : 'text-blue-600'}>
              {gameState.currentPlayer === Player.Player1 ? 'プレイヤー1' : 'プレイヤー2'}
            </span>
          </div>
          <div>
            <span className="font-bold">モード: </span>
            <span>{gameState.mode === GameMode.Place ? '配置' : '移動'}</span>
          </div>
        </div>
      </div>

      {/* デスクトップ表示 */}
      <div className="hidden md:grid grid-cols-3 gap-4">
        <PlayerHand
          player={Player.Player1}
          pieces={handToArray(gameState.playerHands[Player.Player1])}
          onPieceSelect={handlePieceSelect}
          isCurrentPlayer={gameState.currentPlayer === Player.Player1}
          selectedPieceType={selectedPieceType}
        />
        <div className="col-span-1">
          <GameBoard
            gameState={gameState}
            onCellClick={handleCellClick}
            onPieceClick={handlePieceClick}
          />
        </div>
        <PlayerHand
          player={Player.Player2}
          pieces={handToArray(gameState.playerHands[Player.Player2])}
          onPieceSelect={handlePieceSelect}
          isCurrentPlayer={gameState.currentPlayer === Player.Player2}
          selectedPieceType={selectedPieceType}
        />
      </div>

      {/* モバイル表示 */}
      <div className="md:hidden">
        <div className="mb-4">
          <GameBoard
            gameState={gameState}
            onCellClick={handleCellClick}
            onPieceClick={handlePieceClick}
          />
        </div>
        <PlayerHand
          player={gameState.currentPlayer}
          pieces={handToArray(gameState.playerHands[gameState.currentPlayer])}
          onPieceSelect={handlePieceSelect}
          isCurrentPlayer={true}
          selectedPieceType={selectedPieceType}
        />
      </div>

      {gameState.winner && (
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold mb-2">
            {gameState.winner === Player.Player1 ? 'プレイヤー1' : 'プレイヤー2'}の勝利！
          </h2>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            新しいゲームを始める
          </button>
        </div>
      )}
    </div>
  );
}; 