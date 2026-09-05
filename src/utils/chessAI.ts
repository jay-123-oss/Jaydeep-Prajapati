import { Chess, Square, Move } from "chess.js";

export type AIDifficulty = "novice" | "intermediate" | "advanced" | "grandmaster";

// Standard Piece Values
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece-Square Positional Heatmaps (Flipped for Black / White perspective)
const PAWN_TABLE: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 27, 27, 10, 5, 5],
  [0, 0, 0, 25, 25, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -25, -25, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const KNIGHT_TABLE: number[][] = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
];

const BISHOP_TABLE: number[][] = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
];

const ROOK_TABLE: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0],
];

const QUEEN_TABLE: number[][] = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20],
];

const KING_TABLE: number[][] = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20],
];

// Evaluate Board Position (Positive score favors White, Negative favors Black)
function evaluateBoard(game: Chess): number {
  let totalEvaluation = 0;
  const board = game.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        const val = PIECE_VALUES[piece.type] || 0;
        let posVal = 0;

        const tableRow = piece.color === "w" ? r : 7 - r;

        switch (piece.type) {
          case "p":
            posVal = PAWN_TABLE[tableRow][c];
            break;
          case "n":
            posVal = KNIGHT_TABLE[tableRow][c];
            break;
          case "b":
            posVal = BISHOP_TABLE[tableRow][c];
            break;
          case "r":
            posVal = ROOK_TABLE[tableRow][c];
            break;
          case "q":
            posVal = QUEEN_TABLE[tableRow][c];
            break;
          case "k":
            posVal = KING_TABLE[tableRow][c];
            break;
        }

        const score = val + posVal;
        totalEvaluation += piece.color === "w" ? score : -score;
      }
    }
  }

  return totalEvaluation;
}

// Move Ordering Helper: Prioritize captures ('x') and checks ('+') for faster Alpha-Beta cutoffs
function getOrderedMoves(game: Chess): string[] {
  const moves = game.moves();
  return moves.sort((a, b) => {
    const scoreA = (a.includes("x") ? 10 : 0) + (a.includes("+") ? 5 : 0);
    const scoreB = (b.includes("x") ? 10 : 0) + (b.includes("+") ? 5 : 0);
    return scoreB - scoreA;
  });
}

// Minimax Algorithm with Alpha-Beta Pruning & Move Ordering
function minimax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }

  const moves = getOrderedMoves(game);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evalVal = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evalVal);
      alpha = Math.max(alpha, evalVal);
      if (beta <= alpha) break; // Beta Cutoff
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evalVal = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evalVal);
      beta = Math.min(beta, evalVal);
      if (beta <= alpha) break; // Alpha Cutoff
    }
    return minEval;
  }
}

// Main Function to calculate best AI Move based on Difficulty Level
export function getBestAIMove(game: Chess, difficulty: AIDifficulty): string | null {
  const moves = getOrderedMoves(game);
  if (moves.length === 0) return null;

  // Level 1: Novice Bot (Random with 60% preference for captures)
  if (difficulty === "novice") {
    const captureMoves = moves.filter((m) => m.includes("x"));
    if (captureMoves.length > 0 && Math.random() < 0.6) {
      return captureMoves[Math.floor(Math.random() * captureMoves.length)];
    }
    return moves[Math.floor(Math.random() * moves.length)];
  }

  // Optimized Depths for Instant Real-Time Response (<50ms)
  const depth = difficulty === "intermediate" ? 1 : difficulty === "advanced" ? 2 : 3;
  const isMaximizing = game.turn() === "w";

  let bestMove: string = moves[0];
  let bestValue = isMaximizing ? -Infinity : Infinity;

  for (const move of moves) {
    game.move(move);
    const boardVal = minimax(game, depth - 1, -Infinity, Infinity, !isMaximizing);
    game.undo();

    if (isMaximizing) {
      if (boardVal > bestValue) {
        bestValue = boardVal;
        bestMove = move;
      }
    } else {
      if (boardVal < bestValue) {
        bestValue = boardVal;
        bestMove = move;
      }
    }
  }

  return bestMove;
}
