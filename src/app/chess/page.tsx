"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Chess, Square, PieceSymbol, Color } from "chess.js";
import { getBestAIMove, AIDifficulty } from "@/utils/chessAI";
import { WaspButton } from "@/components/ui/wasp-button";
import { soundFX } from "@/utils/soundFX";

// Unicode Chess Piece Symbols
const PIECE_UNICODE: Record<string, string> = {
  w_p: "♙",
  w_n: "♘",
  w_b: "♗",
  w_r: "♖",
  w_q: "♕",
  w_k: "♔",
  b_p: "♟",
  b_n: "♞",
  b_b: "♝",
  b_r: "♜",
  b_q: "♛",
  b_k: "♚",
};

// Helper: Calculate intermediate squares along a straight or diagonal path
function getPathSquares(from: Square, to: Square): Square[] {
  const fromCol = from.charCodeAt(0) - 97;
  const fromRow = parseInt(from[1]);
  const toCol = to.charCodeAt(0) - 97;
  const toRow = parseInt(to[1]);

  const dCol = Math.sign(toCol - fromCol);
  const dRow = Math.sign(toRow - fromRow);

  // Check if straight or diagonal move
  if (
    Math.abs(toCol - fromCol) === 0 ||
    Math.abs(toRow - fromRow) === 0 ||
    Math.abs(toCol - fromCol) === Math.abs(toRow - fromRow)
  ) {
    const intermediate: Square[] = [];
    let curCol = fromCol + dCol;
    let curRow = fromRow + dRow;
    while (curCol !== toCol || curRow !== toRow) {
      const sq = `${String.fromCharCode(97 + curCol)}${curRow}` as Square;
      intermediate.push(sq);
      curCol += dCol;
      curRow += dRow;
    }
    return intermediate;
  }
  return [];
}

export default function CyberChessPage() {
  const [game, setGame] = useState<Chess>(new Chess());
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w");
  const [difficulty, setDifficulty] = useState<AIDifficulty>("intermediate");
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [hoveredSquare, setHoveredSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<string>("PLAYING");
  const [capturedWhite, setCapturedWhite] = useState<string[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<string[]>([]);

  // Last Move Path Tracking
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);

  // Victory / Board Overlay State
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const [winnerName, setWinnerName] = useState<string>("");
  const [playerName, setPlayerName] = useState<string>("");
  const [isBoardInspecting, setIsBoardInspecting] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("chess_player_name");
      if (savedName) setPlayerName(savedName);
    }
  }, []);

  // Initialize or Reset Game
  const resetGame = (color: "w" | "b" = playerColor, diff: AIDifficulty = difficulty) => {
    soundFX.playClick();
    const newGame = new Chess();
    setGame(newGame);
    setPlayerColor(color);
    setDifficulty(diff);
    setSelectedSquare(null);
    setHoveredSquare(null);
    setPossibleMoves([]);
    setMoveHistory([]);
    setIsThinking(false);
    setGameStatus("PLAYING");
    setCapturedWhite([]);
    setCapturedBlack([]);
    setLastMove(null);
    setShowVictoryModal(false);
    setIsBoardInspecting(false);
    setWinnerName("");

    // If player chooses Black, Bot makes first move as White
    if (color === "b") {
      makeAIMove(newGame, diff, color);
    }
  };

  // Execute Bot AI Move
  const makeAIMove = (currentGame: Chess, diff: AIDifficulty, activePlayerColor: "w" | "b" = playerColor) => {
    setIsThinking(true);
    setTimeout(() => {
      const bestMove = getBestAIMove(currentGame, diff);
      if (bestMove) {
        try {
          const moveResult = currentGame.move(bestMove);
          if (moveResult) {
            updateCapturedPieces(moveResult);
            setMoveHistory((prev) => [...prev, moveResult.san]);
            setLastMove({ from: moveResult.from as Square, to: moveResult.to as Square });
            checkGameStatus(currentGame, activePlayerColor, moveResult);
          }
        } catch {
          // Fallback if move fails
        }
      }
      setIsThinking(false);
    }, 120);
  };

  // Update Captured Pieces Drawer
  const updateCapturedPieces = (moveResult: any) => {
    if (moveResult.captured) {
      const pieceKey = `${moveResult.color === "w" ? "b" : "w"}_${moveResult.captured}`;
      const symbol = PIECE_UNICODE[pieceKey] || moveResult.captured;
      if (moveResult.color === "w") {
        setCapturedBlack((prev) => [...prev, symbol]);
      } else {
        setCapturedWhite((prev) => [...prev, symbol]);
      }
    }
  };

  // Check Checkmate / Stalemate / Draw / Check status with sounds
  const checkGameStatus = (g: Chess, activePlayerColor: "w" | "b" = playerColor, moveResult?: any) => {
    if (g.isCheckmate()) {
      const isPlayerWinner = g.turn() !== activePlayerColor;
      if (isPlayerWinner) {
        soundFX.playVictoryFanfare();
        setWinnerName(`VICTORY! ${playerName.trim() || "YOU"} WON! 🏆👑`);
      } else {
        soundFX.playDefeatSound();
        setWinnerName("CHECKMATE! AI BOT WON THIS MATCH 🤖");
      }
      setShowVictoryModal(true);
      setIsBoardInspecting(false);
      setGameStatus("CHECKMATE!");
    } else if (g.isStalemate()) {
      soundFX.playToggleSound();
      setWinnerName("STALEMATE! DRAW GAME 🤝");
      setShowVictoryModal(true);
      setIsBoardInspecting(false);
      setGameStatus("STALEMATE!");
    } else if (g.isDraw()) {
      soundFX.playToggleSound();
      setWinnerName("DRAW GAME 🤝");
      setShowVictoryModal(true);
      setIsBoardInspecting(false);
      setGameStatus("DRAW!");
    } else if (g.inCheck()) {
      // Urgent high-tech alert sound when in check
      soundFX.playCheckAlert();
      setGameStatus("CHECK! ⚠️");
    } else {
      // Normal move or capture sound
      if (moveResult) {
        if (moveResult.captured) {
          soundFX.playCapture();
        } else {
          soundFX.playMove();
        }
      }
      setGameStatus("PLAYING");
    }
  };

  // Handle Square Selection & Player Moves
  const handleSquareClick = (square: Square) => {
    if (isThinking || game.isGameOver()) return;

    // Check if turn belongs to player
    if (game.turn() !== playerColor) return;

    // If a piece is already selected, try making move
    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setHoveredSquare(null);
        setPossibleMoves([]);
        return;
      }

      // Try making move from selectedSquare to square
      try {
        const moveResult = game.move({
          from: selectedSquare,
          to: square,
          promotion: "q", // Auto-promote to Queen for simplicity
        });

        if (moveResult) {
          updateCapturedPieces(moveResult);
          setMoveHistory((prev) => [...prev, moveResult.san]);
          setLastMove({ from: moveResult.from as Square, to: moveResult.to as Square });
          setSelectedSquare(null);
          setHoveredSquare(null);
          setPossibleMoves([]);
          checkGameStatus(game, playerColor, moveResult);

          // Trigger AI Move if game continues
          if (!game.isGameOver()) {
            makeAIMove(game, difficulty, playerColor);
          }
          return;
        }
      } catch {
        // Move was invalid, fallthrough to select new piece
      }
    }

    // Select new piece if it belongs to current player
    const piece = game.get(square);
    if (piece && piece.color === playerColor) {
      soundFX.playHover();
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setPossibleMoves(moves.map((m) => m.to as Square));
    } else {
      setSelectedSquare(null);
      setHoveredSquare(null);
      setPossibleMoves([]);
    }
  };

  // Undo Last Move Pair (Player + AI move)
  const handleUndo = () => {
    soundFX.playClick();
    if (game.history().length >= 2 && !isThinking) {
      game.undo(); // Undo AI Move
      game.undo(); // Undo Player Move
      setMoveHistory((prev) => prev.slice(0, -2));
      setSelectedSquare(null);
      setHoveredSquare(null);
      setPossibleMoves([]);
      setShowVictoryModal(false);
      setIsBoardInspecting(false);

      // Restore previous last move from history if available
      const hist = game.history({ verbose: true });
      if (hist.length > 0) {
        const prevMove = hist[hist.length - 1];
        setLastMove({ from: prevMove.from as Square, to: prevMove.to as Square });
      } else {
        setLastMove(null);
      }

      checkGameStatus(game, playerColor);
    }
  };

  // Helper to convert Square string to visual percentage coordinates
  const getSquareCenter = (square: Square) => {
    const col = square.charCodeAt(0) - 97; // 0..7 (a..h)
    const row = 8 - parseInt(square[1]); // 0..7 (8..1)
    const visualCol = playerColor === "w" ? col : 7 - col;
    const visualRow = playerColor === "w" ? row : 7 - row;
    return {
      x: (visualCol + 0.5) * 12.5,
      y: (visualRow + 0.5) * 12.5,
    };
  };

  // Calculate intermediate path squares for recently moved piece
  const lastMoveIntermediate = lastMove ? getPathSquares(lastMove.from, lastMove.to) : [];

  // Calculate intermediate path squares for selected piece toward hovered destination
  const previewPathIntermediate =
    selectedSquare && hoveredSquare && possibleMoves.includes(hoveredSquare)
      ? getPathSquares(selectedSquare, hoveredSquare)
      : [];

  // Render 8x8 Chess Board Grid
  const renderBoard = () => {
    const board = game.board();
    const rows = playerColor === "w" ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];
    const cols = playerColor === "w" ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];

    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "min(760px, calc(100vh - 200px))",
          aspectRatio: "1 / 1",
          border: "2px solid #20BEFF",
          boxShadow: "0 0 45px rgba(32, 190, 255, 0.35), 0 25px 60px rgba(0,0,0,0.95)",
          borderRadius: "0px",
          overflow: "hidden",
          userSelect: "none",
        }}
      >
        {/* ── 8x8 Board Grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)",
            gridTemplateRows: "repeat(8, 1fr)",
            width: "100%",
            height: "100%",
          }}
        >
          {rows.map((r) =>
            cols.map((c) => {
              const squareName = `${String.fromCharCode(97 + c)}${8 - r}` as Square;
              const piece = board[r][c];
              const isDarkSquare = (r + c) % 2 === 1;

              // Selection & Highlights
              const isSelected = selectedSquare === squareName;
              const isPossibleMove = possibleMoves.includes(squareName);
              const isHoveredMove = hoveredSquare === squareName;

              // Last Move Highlights (Green Path Highlight)
              const isLastMoveSquare = lastMove && (lastMove.from === squareName || lastMove.to === squareName);
              const isLastMoveIntermediate = lastMoveIntermediate.includes(squareName);

              // Selected Preview Path Highlight
              const isPreviewIntermediate = previewPathIntermediate.includes(squareName);

              // Check Alert Highlight for King
              const isKingInCheck =
                game.inCheck() && piece?.type === "k" && piece.color === game.turn();

              // Piece ownership
              const isPlayerPiece = piece?.color === playerColor;

              // Determine piece glyph
              const pieceKey = piece ? `${piece.color}_${piece.type}` : null;
              const pieceSymbol = pieceKey ? PIECE_UNICODE[pieceKey] : "";

              // Determine Background Color with priority
              let bgColor = isDarkSquare ? "#0A1224" : "#13233D";

              if (isKingInCheck) {
                bgColor = "rgba(239, 68, 68, 0.45)"; // Danger Red
              } else if (isSelected) {
                bgColor = "rgba(32, 190, 255, 0.45)"; // Cyan Active
              } else if (isHoveredMove) {
                bgColor = piece ? "rgba(239, 68, 68, 0.45)" : "rgba(32, 190, 255, 0.35)";
              } else if (isPossibleMove) {
                bgColor = piece
                  ? "rgba(239, 68, 68, 0.25)" // Capture target
                  : isDarkSquare
                  ? "#183354"
                  : "#224773";
              } else if (isLastMoveSquare) {
                bgColor = "rgba(16, 185, 129, 0.35)"; // Neon Green Recent Move
              } else if (isLastMoveIntermediate) {
                bgColor = "rgba(16, 185, 129, 0.18)"; // Neon Green Recent Path
              } else if (isPreviewIntermediate) {
                bgColor = "rgba(32, 190, 255, 0.2)"; // Cyan preview path
              }

              return (
                <div
                  key={squareName}
                  onClick={() => handleSquareClick(squareName)}
                  onMouseEnter={() => {
                    if (isPossibleMove) setHoveredSquare(squareName);
                  }}
                  onMouseLeave={() => {
                    if (hoveredSquare === squareName) setHoveredSquare(null);
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    aspectRatio: "1 / 1",
                    boxSizing: "border-box",
                    backgroundColor: bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: isPossibleMove || (piece && isPlayerPiece) ? "pointer" : "default",
                    position: "relative",
                    fontSize: "clamp(2rem, 5.5vw, 3.8rem)",
                    // BOT PIECES: Neon Crimson (#FF2A5F) vs PLAYER PIECES: Electric Cyan (#00F5FF)
                    color: isPlayerPiece ? "#00F5FF" : "#FF2A5F",
                    userSelect: "none",
                    transition: "all 0.15s ease",
                    textShadow: isPlayerPiece
                      ? "0 0 12px rgba(0, 245, 255, 0.9), 0 0 22px rgba(0, 245, 255, 0.6)"
                      : "0 0 14px rgba(255, 42, 95, 0.95), 0 0 26px rgba(255, 42, 95, 0.75)",
                    border: isLastMoveSquare
                      ? "1.5px solid #10B981"
                      : isKingInCheck
                      ? "2px solid #EF4444"
                      : isSelected
                      ? "2px solid #20BEFF"
                      : "none",
                    boxShadow: isLastMoveSquare
                      ? "inset 0 0 14px rgba(16, 185, 129, 0.65)"
                      : isKingInCheck
                      ? "inset 0 0 20px rgba(239, 68, 68, 0.8)"
                      : "none",
                  }}
                >
                  {/* File & Rank Coordinates on Corner Squares */}
                  {(cols.indexOf(c) === 0 || rows.indexOf(r) === 7) && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "2px",
                        left: "3px",
                        fontSize: "9px",
                        fontFamily: "monospace",
                        color: "rgba(255, 255, 255, 0.35)",
                        fontWeight: 700,
                        pointerEvents: "none",
                      }}
                    >
                      {cols.indexOf(c) === 0 && rows.indexOf(r) === 7
                        ? squareName
                        : cols.indexOf(c) === 0
                        ? squareName[1]
                        : squareName[0]}
                    </div>
                  )}

                  {/* Empty Possible Move Dot Indicator */}
                  {isPossibleMove && !piece && (
                    <div
                      style={{
                        position: "absolute",
                        width: isHoveredMove ? "18px" : "13px",
                        height: isHoveredMove ? "18px" : "13px",
                        borderRadius: "50%",
                        backgroundColor: "#20BEFF",
                        boxShadow: "0 0 14px #20BEFF, 0 0 22px rgba(32, 190, 255, 0.9)",
                        transition: "all 0.15s ease",
                        pointerEvents: "none",
                      }}
                    />
                  )}

                  {/* Capture Target Reticle (When square has opponent piece) */}
                  {isPossibleMove && piece && (
                    <div
                      style={{
                        position: "absolute",
                        inset: "4px",
                        border: "2px dashed #EF4444",
                        borderRadius: "50%",
                        boxShadow: "0 0 14px rgba(239, 68, 68, 0.8), inset 0 0 10px rgba(239, 68, 68, 0.4)",
                        pointerEvents: "none",
                        animation: "pulse 1.5s infinite",
                      }}
                    />
                  )}

                  {/* Intermediate Path Dots for Recent Move */}
                  {isLastMoveIntermediate && !piece && (
                    <div
                      style={{
                        position: "absolute",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#10B981",
                        boxShadow: "0 0 8px #10B981",
                        opacity: 0.8,
                        pointerEvents: "none",
                      }}
                    />
                  )}

                  {/* Chess Piece Symbol */}
                  <span
                    style={{
                      transform: isSelected ? "scale(1.18)" : isHoveredMove ? "scale(1.12)" : "scale(1)",
                      transition: "transform 0.12s ease",
                      filter: piece?.type === "k" && isKingInCheck ? "drop-shadow(0 0 12px #EF4444)" : "none",
                    }}
                  >
                    {pieceSymbol}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* ── SVG Layer for Glowing Green Recent Move Arrow & Cyan Move Path ── */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 20,
          }}
          viewBox="0 0 100 100"
        >
          <defs>
            {/* Green Neon Glow Filter */}
            <filter id="greenNeonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Cyan Neon Glow Filter */}
            <filter id="cyanNeonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Green Arrowhead */}
            <marker
              id="greenArrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="4.5"
              markerHeight="4.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#10B981" />
            </marker>
            {/* Cyan Arrowhead */}
            <marker
              id="cyanArrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="4.5"
              markerHeight="4.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#20BEFF" />
            </marker>
          </defs>

          {/* 1. RECENT MOVE PATH IN GREEN (#10B981) */}
          {lastMove && (() => {
            const start = getSquareCenter(lastMove.from);
            const end = getSquareCenter(lastMove.to);
            return (
              <g key="last-move-path">
                {/* Start Square Pulse Origin */}
                <circle cx={start.x} cy={start.y} r="1.6" fill="#10B981" filter="url(#greenNeonGlow)" />
                {/* Glowing Green Connecting Path */}
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="#10B981"
                  strokeWidth="1.2"
                  strokeDasharray="2.5 1"
                  filter="url(#greenNeonGlow)"
                  markerEnd="url(#greenArrow)"
                />
              </g>
            );
          })()}

          {/* 2. SELECTED PIECE VALID MOVE PATH TRAJECTORY */}
          {selectedSquare && (() => {
            const origin = getSquareCenter(selectedSquare);

            // If user is hovering on a possible destination square, show prominent cyan vector
            if (hoveredSquare && possibleMoves.includes(hoveredSquare)) {
              const dest = getSquareCenter(hoveredSquare);
              return (
                <g key="preview-hovered-path">
                  <circle cx={origin.x} cy={origin.y} r="1.5" fill="#20BEFF" filter="url(#cyanNeonGlow)" />
                  <line
                    x1={origin.x}
                    y1={origin.y}
                    x2={dest.x}
                    y2={dest.y}
                    stroke="#20BEFF"
                    strokeWidth="1.4"
                    strokeDasharray="2 1"
                    filter="url(#cyanNeonGlow)"
                    markerEnd="url(#cyanArrow)"
                  />
                </g>
              );
            }

            // Otherwise, show subtle cyber tracer rays from selected piece to all possible destination squares
            return (
              <g key="preview-all-paths" opacity="0.45">
                {possibleMoves.map((targetSq) => {
                  const dest = getSquareCenter(targetSq);
                  return (
                    <line
                      key={targetSq}
                      x1={origin.x}
                      y1={origin.y}
                      x2={dest.x}
                      y2={dest.y}
                      stroke="#20BEFF"
                      strokeWidth="0.8"
                      strokeDasharray="1.5 1.5"
                    />
                  );
                })}
              </g>
            );
          })()}
        </svg>

        {/* ── WIN / GAME OVER POPUP DIRECTLY ON TOP OF THE BOARD ── */}
        {showVictoryModal && !isBoardInspecting && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 50,
              backgroundColor: "rgba(3, 7, 18, 0.88)",
              backdropFilter: "blur(12px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              textAlign: "center",
              border: winnerName.includes("YOU") ? "2px solid #10B981" : "2px solid #FF2A5F",
              boxShadow: winnerName.includes("YOU")
                ? "0 0 60px rgba(16, 185, 129, 0.5), inset 0 0 35px rgba(16, 185, 129, 0.2)"
                : "0 0 60px rgba(255, 42, 95, 0.5), inset 0 0 35px rgba(255, 42, 95, 0.2)",
              animation: "fadeIn 0.25s ease-out",
            }}
          >
            {/* Sci-Fi Corner Accents */}
            <div style={{ position: "absolute", top: "8px", left: "8px", width: "16px", height: "16px", borderTop: "2px solid #20BEFF", borderLeft: "2px solid #20BEFF" }} />
            <div style={{ position: "absolute", top: "8px", right: "8px", width: "16px", height: "16px", borderTop: "2px solid #20BEFF", borderRight: "2px solid #20BEFF" }} />
            <div style={{ position: "absolute", bottom: "8px", left: "8px", width: "16px", height: "16px", borderBottom: "2px solid #20BEFF", borderLeft: "2px solid #20BEFF" }} />
            <div style={{ position: "absolute", bottom: "8px", right: "8px", width: "16px", height: "16px", borderBottom: "2px solid #20BEFF", borderRight: "2px solid #20BEFF" }} />

            {/* Glowing Trophy / Robot Icon */}
            <div
              style={{
                fontSize: "clamp(3rem, 7vw, 4.5rem)",
                marginBottom: "10px",
                filter: winnerName.includes("YOU")
                  ? "drop-shadow(0 0 20px #10B981)"
                  : "drop-shadow(0 0 20px #FF2A5F)",
              }}
            >
              {winnerName.includes("YOU") ? "🏆" : winnerName.includes("STALEMATE") ? "🤝" : "🤖"}
            </div>

            {/* Winner Main Title */}
            <h2
              className="font-chakra"
              style={{
                fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
                fontWeight: 900,
                color: winnerName.includes("YOU") ? "#10B981" : winnerName.includes("STALEMATE") ? "#FACC15" : "#FF2A5F",
                letterSpacing: "0.06em",
                margin: "0 0 10px 0",
                textTransform: "uppercase",
                textShadow: winnerName.includes("YOU")
                  ? "0 0 20px rgba(16, 185, 129, 0.8)"
                  : "0 0 20px rgba(255, 42, 95, 0.8)",
              }}
            >
              {winnerName}
            </h2>

            <p
              style={{
                color: "var(--text-secondary, #E2E8F0)",
                fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
                lineHeight: 1.5,
                maxWidth: "400px",
                margin: "0 0 18px 0",
              }}
            >
              {winnerName.includes("YOU")
                ? "Outstanding tactical play! You defeated Jaydeep's AI Chess Bot!"
                : winnerName.includes("STALEMATE")
                ? "A tactical stalemate! Both players fought to a draw."
                : "Good effort! The AI caught an advantage. Re-strategize and challenge again!"}
            </p>

            {/* Match Quick Summary Card */}
            <div
              style={{
                backgroundColor: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "8px 16px",
                display: "flex",
                gap: "20px",
                marginBottom: "20px",
                fontSize: "11px",
                fontFamily: "monospace",
                color: "#94A3B8",
              }}
            >
              <div>
                MOVES: <strong style={{ color: "#ffffff" }}>{Math.ceil(moveHistory.length / 2)}</strong>
              </div>
              <div>
                DIFFICULTY: <strong style={{ color: "#20BEFF" }}>{difficulty.toUpperCase()}</strong>
              </div>
              <div>
                SIDE: <strong style={{ color: playerColor === "w" ? "#00F5FF" : "#FF2A5F" }}>{playerColor === "w" ? "WHITE" : "BLACK"}</strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
              <WaspButton
                onClick={() => resetGame(playerColor, difficulty)}
                variant="light"
                paddingX={20}
                paddingY={10}
                fontSize={11}
                cutTopLeft={6}
                cutBottomRight={6}
              >
                PLAY AGAIN ♟️
              </WaspButton>

              <WaspButton
                onClick={() => setIsBoardInspecting(true)}
                variant="dark"
                paddingX={16}
                paddingY={10}
                fontSize={11}
                cutTopLeft={6}
                cutBottomRight={6}
              >
                INSPECT BOARD 🔍
              </WaspButton>
            </div>
          </div>
        )}

        {/* Floating "Show Result" button when inspecting board */}
        {showVictoryModal && isBoardInspecting && (
          <button
            onClick={() => setIsBoardInspecting(false)}
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              zIndex: 60,
              backgroundColor: "rgba(7, 13, 25, 0.9)",
              border: "1.5px solid #20BEFF",
              color: "#20BEFF",
              padding: "6px 12px",
              fontSize: "11px",
              fontWeight: 800,
              cursor: "pointer",
              letterSpacing: "0.08em",
              boxShadow: "0 0 15px rgba(32, 190, 255, 0.4)",
            }}
          >
            SHOW WIN RESULT 🏆
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary, #030712)",
        color: "var(--text-primary, #ffffff)",
        position: "relative",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* ── Background Cyber Matrix Grid ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(var(--grid-line, rgba(255,255,255,0.05)) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line, rgba(255,255,255,0.05)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Top Header Navigation ── */}
      <header
        style={{
          position: "relative",
          zIndex: 20,
          backgroundColor: "var(--bg-card, #070D19)",
          borderBottom: "1.5px solid #20BEFF",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <WaspButton
            href="/"
            variant="outline"
            paddingX={12}
            paddingY={6}
            fontSize={11}
            cutTopLeft={6}
            cutBottomRight={6}
          >
            ← PORTFOLIO
          </WaspButton>

          <span
            className="font-pixel"
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "var(--text-primary, #ffffff)",
              letterSpacing: "0.1em",
            }}
          >
            CYBER CHESS ARENA vs AI BOT
          </span>
        </div>

        {/* Game Status Banner with Check / Checkmate visual state */}
        <div
          style={{
            fontSize: "12px",
            fontWeight: 800,
            color: gameStatus.includes("CHECKMATE")
              ? "#EF4444"
              : gameStatus.includes("CHECK")
              ? "#FACC15"
              : "#20BEFF",
            backgroundColor: gameStatus.includes("CHECKMATE")
              ? "rgba(239, 68, 68, 0.15)"
              : gameStatus.includes("CHECK")
              ? "rgba(250, 204, 21, 0.15)"
              : "rgba(32, 190, 255, 0.1)",
            padding: "6px 16px",
            border: gameStatus.includes("CHECKMATE")
              ? "1px solid #EF4444"
              : gameStatus.includes("CHECK")
              ? "1px solid #FACC15"
              : "1px solid #20BEFF",
            borderRadius: "0px",
            letterSpacing: "0.08em",
            boxShadow: gameStatus.includes("CHECK") ? "0 0 15px rgba(250, 204, 21, 0.4)" : "none",
          }}
        >
          {isThinking ? "🤖 AI BOT THINKING..." : gameStatus}
        </div>
      </header>

      {/* ── Main Viewport Content ── */}
      <main
        style={{
          position: "relative",
          zIndex: 10,
          flex: 1,
          padding: "16px 24px 28px 24px",
          display: "grid",
          gridTemplateColumns: "minmax(320px, 1.35fr) minmax(280px, 1fr)",
          gap: "24px",
          alignItems: "center",
          maxWidth: "1360px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* Left Side: Opponent Info + Clean 8x8 Board + Player Info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            gap: "10px",
          }}
        >
          {/* Top Opponent HUD Bar: AI Bot (Crimson Pieces) */}
          <div
            style={{
              width: "100%",
              maxWidth: "min(760px, calc(100vh - 200px))",
              backgroundColor: "rgba(7, 13, 25, 0.75)",
              border: "1px solid rgba(255, 42, 95, 0.5)",
              padding: "8px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 0 15px rgba(255, 42, 95, 0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "16px" }}>🤖</span>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 800, color: "#FF2A5F", letterSpacing: "0.05em" }}>
                  AI BOT ({difficulty.toUpperCase()})
                </div>
                <div style={{ fontSize: "10px", color: "#94A3B8" }}>
                  COLOR: <strong style={{ color: "#FF2A5F" }}>NEON CRIMSON ♟</strong>
                </div>
              </div>
            </div>

            {/* Captured Pieces by AI */}
            <div style={{ display: "flex", gap: "4px", fontSize: "16px", color: "#00F5FF" }}>
              {capturedWhite.length > 0 ? (
                capturedWhite.map((p, i) => <span key={i}>{p}</span>)
              ) : (
                <span style={{ fontSize: "10px", color: "#64748B" }}>No captures</span>
              )}
            </div>
          </div>

          {/* Render Board with Green Last Move Path & Target Moves & Win Popup */}
          {renderBoard()}

          {/* Bottom Player HUD Bar: You (Electric Cyan Pieces) */}
          <div
            style={{
              width: "100%",
              maxWidth: "min(760px, calc(100vh - 200px))",
              backgroundColor: "rgba(7, 13, 25, 0.75)",
              border: "1px solid rgba(0, 245, 255, 0.5)",
              padding: "8px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 0 15px rgba(0, 245, 255, 0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "16px" }}>👤</span>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 800, color: "#00F5FF", letterSpacing: "0.05em" }}>
                  {playerName.trim() || "PLAYER"} (YOU)
                </div>
                <div style={{ fontSize: "10px", color: "#94A3B8" }}>
                  COLOR: <strong style={{ color: "#00F5FF" }}>ELECTRIC CYAN ♙</strong>
                </div>
              </div>
            </div>

            {/* Captured Pieces by Player */}
            <div style={{ display: "flex", gap: "4px", fontSize: "16px", color: "#FF2A5F" }}>
              {capturedBlack.length > 0 ? (
                capturedBlack.map((p, i) => <span key={i}>{p}</span>)
              ) : (
                <span style={{ fontSize: "10px", color: "#64748B" }}>No captures</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Game Settings, Player Identity, Bot Difficulty & Move Log ── */}
        <div
          style={{
            backgroundColor: "var(--bg-card, #070D19)",
            border: "1.5px solid #20BEFF",
            borderRadius: "0px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            height: "100%",
            maxHeight: "min(780px, calc(100vh - 140px))",
            boxShadow: "0 0 25px rgba(32, 190, 255, 0.15)",
            position: "relative",
          }}
        >
          {/* Sci-Fi Brackets */}
          <div style={{ position: "absolute", top: "4px", left: "4px", width: "8px", height: "8px", borderTop: "1.5px solid #20BEFF", borderLeft: "1.5px solid #20BEFF", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "4px", right: "4px", width: "8px", height: "8px", borderTop: "1.5px solid #20BEFF", borderRight: "1.5px solid #20BEFF", pointerEvents: "none" }} />

          {/* Player Identity Card */}
          <div style={{ backgroundColor: "rgba(0, 0, 0, 0.4)", border: "1px solid #20BEFF", padding: "10px 12px", borderRadius: "0px" }}>
            <div className="font-pixel" style={{ fontSize: "10px", color: "#20BEFF", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "6px", textTransform: "uppercase" }}>
              // PLAYER NAME (OPTIONAL)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="text"
                placeholder="Enter your name..."
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                  if (typeof window !== "undefined") {
                    localStorage.setItem("chess_player_name", e.target.value);
                  }
                }}
                suppressHydrationWarning
                style={{
                  flex: 1,
                  backgroundColor: "#030712",
                  border: "1px solid rgba(32, 190, 255, 0.5)",
                  color: "#ffffff",
                  padding: "6px 10px",
                  fontSize: "12px",
                  fontFamily: "Inter, sans-serif",
                  outline: "none",
                  borderRadius: "0px",
                }}
              />
            </div>
            <div style={{ marginTop: "6px", fontSize: "11px", color: "var(--text-muted, #9CA3AF)", display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
              <span>YOU: <strong style={{ color: "#00F5FF" }}>{playerName.trim() || "Player"}</strong></span>
              <span>BOT: <strong style={{ color: "#FF2A5F" }}>{difficulty.toUpperCase()} 🤖</strong></span>
            </div>
          </div>

          {/* AI Difficulty Selector */}
          <div>
            <div
              className="font-pixel"
              style={{
                fontSize: "10px",
                color: "#20BEFF",
                fontWeight: 700,
                letterSpacing: "0.12em",
                marginBottom: "6px",
                textTransform: "uppercase",
              }}
            >
              // AI BOT DIFFICULTY
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              {[
                { id: "novice", label: "L1: NOVICE" },
                { id: "intermediate", label: "L2: TACTICAL" },
                { id: "advanced", label: "L3: NEURAL" },
                { id: "grandmaster", label: "L4: GRANDMASTER" },
              ].map((diff) => (
                <WaspButton
                  key={diff.id}
                  onClick={() => resetGame(playerColor, diff.id as any)}
                  variant={difficulty === diff.id ? "light" : "dark"}
                  paddingX={10}
                  paddingY={5}
                  fontSize={10}
                  cutTopLeft={4}
                  cutBottomRight={4}
                >
                  {diff.label}
                </WaspButton>
              ))}
            </div>
          </div>

          {/* Side Selector */}
          <div>
            <div
              className="font-pixel"
              style={{
                fontSize: "10px",
                color: "#20BEFF",
                fontWeight: 700,
                letterSpacing: "0.12em",
                marginBottom: "6px",
                textTransform: "uppercase",
              }}
            >
              // CHOOSE YOUR SIDE
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <WaspButton
                onClick={() => resetGame("w", difficulty)}
                variant={playerColor === "w" ? "light" : "dark"}
                paddingX={14}
                paddingY={6}
                fontSize={10}
                cutTopLeft={4}
                cutBottomRight={4}
              >
                PLAY WHITE ♔
              </WaspButton>
              <WaspButton
                onClick={() => resetGame("b", difficulty)}
                variant={playerColor === "b" ? "light" : "dark"}
                paddingX={14}
                paddingY={6}
                fontSize={10}
                cutTopLeft={4}
                cutBottomRight={4}
              >
                PLAY BLACK ♚
              </WaspButton>
            </div>
          </div>

          {/* Move Log History */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "120px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <span
                className="font-pixel"
                style={{
                  fontSize: "10px",
                  color: "#20BEFF",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                // PGN MOVE LOG ({moveHistory.length})
              </span>
              {lastMove && (
                <span style={{ fontSize: "10px", color: "#10B981", fontWeight: 700 }}>
                  LAST: {lastMove.from} → {lastMove.to}
                </span>
              )}
            </div>
            <div
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                border: "1px solid #20BEFF",
                padding: "8px",
                overflowY: "auto",
                fontFamily: "monospace",
                fontSize: "0.82rem",
                color: "#38BDF8",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "3px 10px",
              }}
            >
              {moveHistory.length === 0 ? (
                <span style={{ color: "var(--text-muted, #71717A)" }}>No moves played yet...</span>
              ) : (
                moveHistory.map((m, idx) => (
                  <div key={idx} style={{ color: idx === moveHistory.length - 1 ? "#10B981" : "#38BDF8" }}>
                    {idx % 2 === 0 ? `${Math.floor(idx / 2) + 1}. ` : ""}{m}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom Action Controls */}
          <div style={{ display: "flex", gap: "8px" }}>
            <WaspButton
              onClick={() => resetGame(playerColor, difficulty)}
              variant="light"
              paddingX={14}
              paddingY={8}
              fontSize={10}
              cutTopLeft={6}
              cutBottomRight={6}
            >
              NEW GAME 🔄
            </WaspButton>

            <WaspButton
              onClick={handleUndo}
              variant="dark"
              paddingX={12}
              paddingY={8}
              fontSize={10}
              cutTopLeft={6}
              cutBottomRight={6}
            >
              UNDO MOVE ↩
            </WaspButton>
          </div>
        </div>
      </main>
    </div>
  );
}
