import React, { useState, useEffect } from "react";

export default function SuperTicTacToe() {
  const [boards, setBoards] = useState(() => Array.from({ length: 9 }, () => Array(9).fill(null)));
  const [smallWinners, setSmallWinners] = useState(() => Array(9).fill(null));
  const [current, setCurrent] = useState("X");
  const [activeBoard, setActiveBoard] = useState(null);
  const [overallWinner, setOverallWinner] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    computeOverallWinner();
  }, [smallWinners]);

  function winnerOf(cells) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let [a, b, c] of lines) {
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) return cells[a];
    }
    if (cells.every(Boolean)) return "T";
    return null;
  }

  function computeOverallWinner() {
    const board = smallWinners.map((w) => (w === "T" ? null : w));
    const w = winnerOf(board);
    if (w) {
      setOverallWinner(w);
    } else if (smallWinners.every((s) => s !== null)) {
      setOverallWinner("T");
    } else {
      setOverallWinner(null);
    }
  }

  function handleCellClick(bIdx, cIdx) {
    if (overallWinner) return;
    if (activeBoard !== null && activeBoard !== bIdx) return;
    if (smallWinners[bIdx]) return;
    if (boards[bIdx][cIdx]) return;

    const nextBoards = boards.map((b) => b.slice());
    nextBoards[bIdx][cIdx] = current;

    const nextSmallWinners = smallWinners.slice();
    const w = winnerOf(nextBoards[bIdx]);
    if (w) nextSmallWinners[bIdx] = w;

    const nextActive = nextSmallWinners[cIdx] ? null : cIdx;

    setBoards(nextBoards);
    setSmallWinners(nextSmallWinners);
    setActiveBoard(nextActive);
    setHistory((h) => [...h, { bIdx, cIdx, player: current }]);
    setCurrent((p) => (p === "X" ? "O" : "X"));
  }

  function resetGame() {
    setBoards(Array.from({ length: 9 }, () => Array(9).fill(null)));
    setSmallWinners(Array(9).fill(null));
    setCurrent("X");
    setActiveBoard(null);
    setOverallWinner(null);
    setHistory([]);
  }

  function SmallBoard({ idx, board, winner, isActive }) {
    return (
      <div
        className="small-board relative rounded-lg border-2 border-gray-800 flex flex-col justify-center items-center"
        style={{
          background: "var(--panel-mid)",
          boxShadow: isActive ? "0 0 0 4px rgba(255,165,0,0.08)" : "none",
          aspectRatio: "1 / 1",
        }}
      >
        {winner && (
          <div
            className="winner-overlay absolute inset-0 flex items-center justify-center rounded-lg"
            style={{
              background: winner === "T" ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.6)",
              zIndex: 5,
            }}
          >
            {winner === "T" ? (
              <div className="text-xs text-gray-200">TIE</div>
            ) : (
              <Symbol type={winner} size={36} />
            )}
          </div>
        )}

        <div className="grid grid-cols-3 gap-1 w-full h-full p-1">
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleCellClick(idx, i)}
              className="cell flex items-center justify-center rounded-sm focus:outline-none transition-transform active:scale-95"
              style={{
                background: "var(--panel-dark)",
                aspectRatio: "1 / 1",
              }}
            >
              {cell ? <Symbol type={cell} size={28} /> : null}
            </button>
          ))}
        </div>
      </div>
    );
  }

  function Symbol({ type, size = 28 }) {
    if (type === "X") {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <path
            d="M4.5 4.5L19.5 19.5M19.5 4.5L4.5 19.5"
            stroke="#FF3535"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="8" stroke="#FFA500" strokeWidth="2.5" fill="none" />
      </svg>
    );
  }

  function renderBoardGrid() {
    return (
      <div className="big-board grid grid-cols-3 gap-3 p-3" style={{ width: 720, maxWidth: "100%" }}>
        {boards.map((b, i) => (
          <SmallBoard key={i} idx={i} board={b} winner={smallWinners[i]} isActive={activeBoard === null ? !smallWinners[i] : activeBoard === i} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: "var(--bg)",
        color: "#e5e5e5",
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      }}
    >
      <style>{`
        :root{
          --bg: #000000;
          --panel-dark: #252525;
          --panel-mid: #404040;
        }
        .small-board .cell{ border: 1px solid rgba(255,255,255,0.03); }
        .small-board .winner-overlay{ backdrop-filter: blur(2px); }
      `}</style>

      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Super Tic Tac Toe</h1>
            <div className="text-sm text-gray-300">Play on the 3×3 boards. Win small boards to win the game.</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="player-indicator flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "var(--panel-dark)" }}>
              <div className="text-xs text-gray-300">Current</div>
              <div className="flex items-center gap-2">
                <Symbol type={current} size={20} />
                <div className="text-sm font-medium">{current === "X" ? "❌ (Red)" : "⭕ (Orange)"}</div>
              </div>
            </div>

            <button onClick={resetGame} className="px-3 py-2 rounded-lg" style={{ background: "var(--panel-mid)" }}>
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 flex items-center justify-center">
            {renderBoardGrid()}
          </div>

          <div className="md:col-span-1">
            <div className="p-4 rounded-lg" style={{ background: "var(--panel-mid)" }}>
              <h2 className="text-lg font-semibold mb-2">Game Info</h2>
              <div className="text-sm mb-2">Active board: {activeBoard === null ? "Any" : activeBoard}</div>
              <div className="text-sm mb-2">Overall winner: {overallWinner ? (overallWinner === "T" ? "TIE" : overallWinner) : "-"}</div>

              <div className="mt-3">
                <h3 className="text-sm font-medium mb-1">Small boards</h3>
                <div className="grid grid-cols-3 gap-1">
                  {smallWinners.map((s, i) => (
                    <div key={i} className="text-xs p-1 rounded" style={{ background: "var(--panel-dark)" }}>
                      {i}: {s ? (s === "T" ? "TIE" : s) : "-"}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium mb-1">How to play</h3>
                <ol className="list-decimal list-inside text-sm text-gray-200">
                  <li>Players alternate placing marks inside a small 3×3 board.</li>
                  <li>Your move sends the opponent to the corresponding small board (by cell index).</li>
                  <li>If that small board is finished, the opponent may play anywhere.</li>
                  <li>Win three small boards in a row to win the game.</li>
                </ol>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-lg" style={{ background: "var(--panel-dark)" }}>
              <h3 className="text-sm font-medium mb-2">History</h3>
              <div className="max-h-40 overflow-auto text-xs">
                {history.length === 0 ? (
                  <div className="text-gray-300">No moves yet</div>
                ) : (
                  history
                    .slice()
                    .reverse()
                    .map((h, i) => (
                      <div key={i} className="mb-1">
                        {h.player} → board {h.bIdx} cell {h.cIdx}
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-400">Made with ❤️ • Colors and emoji-like symbols as requested.</div>
      </div>
    </div>
  );
}
