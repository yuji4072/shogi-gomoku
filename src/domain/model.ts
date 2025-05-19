// ゲームの型定義
export enum PieceType {
  Fu = '歩',
  Kin = '金',
  Gin = '銀',
  Kaku = '角',
  Hi = '飛',
  Ou = '王',
  Kyo = '香',
  Kei = '桂',
}

export enum Player {
  Player1 = 'player1',
  Player2 = 'player2',
}

export enum GameMode {
  Place = 'place',
  Move = 'move',
}

export type Direction = [number, number];

export const PIECE_MOVES: Record<PieceType, {
  directions: Direction[];
  isContinuous: boolean;
}> = {
  [PieceType.Fu]: {
    directions: [[-1, 0]],
    isContinuous: false
  },
  [PieceType.Kin]: {
    directions: [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1]],
    isContinuous: false
  },
  [PieceType.Gin]: {
    directions: [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0]],
    isContinuous: false
  },
  [PieceType.Kaku]: {
    directions: [[-1, -1], [-1, 1], [1, -1], [1, 1]],
    isContinuous: true
  },
  [PieceType.Hi]: {
    directions: [[-1, 0], [1, 0], [0, -1], [0, 1]],
    isContinuous: true
  },
  [PieceType.Ou]: {
    directions: [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]],
    isContinuous: false
  },
  [PieceType.Kyo]: {
    directions: [[-1, 0]],
    isContinuous: true
  },
  [PieceType.Kei]: {
    directions: [[-2, -1], [-2, 1]],
    isContinuous: false
  },
};

export type Piece = {
  type: PieceType;
  owner: Player;
};

export type Cell = Piece | null;
export type Position = [number, number];

export const INITIAL_HANDS: Record<Player, Record<PieceType, number>> = {
  [Player.Player1]: {
    [PieceType.Fu]: 9,
    [PieceType.Kin]: 2,
    [PieceType.Gin]: 2,
    [PieceType.Kaku]: 1,
    [PieceType.Hi]: 1,
    [PieceType.Ou]: 1,
    [PieceType.Kyo]: 2,
    [PieceType.Kei]: 2,
  },
  [Player.Player2]: {
    [PieceType.Fu]: 9,
    [PieceType.Kin]: 2,
    [PieceType.Gin]: 2,
    [PieceType.Kaku]: 1,
    [PieceType.Hi]: 1,
    [PieceType.Ou]: 1,
    [PieceType.Kyo]: 2,
    [PieceType.Kei]: 2,
  }
};

export type GameState = {
  board: Cell[][];
  playerHands: Record<Player, Record<PieceType, number>>;
  currentPlayer: Player;
  mode: GameMode;
  selectedPiece?: {
    from: Position;
    piece: Piece;
  };
  winner: Player | null;
};

export type MoveResult = {
  success: boolean;
  message?: string;
  newState?: GameState;
}; 