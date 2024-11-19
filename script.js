const cells = document.querySelectorAll("[data-cell]");
const board = document.querySelector(".board");
const menu = document.querySelector(".menu");
const messageBox = document.querySelector(".message");
const winnerMessage = document.getElementById("winnerMessage");

let currentPlayer = "X";
let gameMode = "friend"; // Default mode
let boardState = Array(9).fill(null);

// Fungsi untuk memulai game
function startGame(mode) {
  gameMode = mode;
  menu.classList.add("hidden");
  board.classList.remove("hidden");
}

// Fungsi untuk restart game
function restartGame() {
  currentPlayer = "X";
  boardState.fill(null);
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("taken");
  });
  messageBox.classList.add("hidden");
  board.classList.remove("hidden");
}

// Fungsi untuk mengecek pemenang
function checkWinner() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return boardState[a];
    }
  }

  return boardState.includes(null) ? null : "Draw";
}

// Fungsi untuk langkah AI
function aiMove() {
  const emptyCells = boardState
    .map((value, index) => (value === null ? index : null))
    .filter((value) => value !== null);

  if (emptyCells.length === 0) return; // Jika tidak ada kotak kosong, keluar

  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  boardState[randomIndex] = "O";
  cells[randomIndex].textContent = "O";
  cells[randomIndex].classList.add("taken");

  // Periksa apakah AI menang
  const winner = checkWinner();
  if (winner) {
    board.classList.add("hidden");
    messageBox.classList.remove("hidden");
    winnerMessage.textContent =
      winner === "Draw" ? "It's a Draw!" : `Player ${winner} Wins!`;
  }
}

// Fungsi untuk menangani klik pada sel
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (!cell.classList.contains("taken")) {
      boardState[index] = currentPlayer;
      cell.textContent = currentPlayer;
      cell.classList.add("taken");

      const winner = checkWinner();
      if (winner) {
        board.classList.add("hidden");
        messageBox.classList.remove("hidden");
        winnerMessage.textContent =
          winner === "Draw" ? "It's a Draw!" : `Player ${winner} Wins!`;
        return;
      }

      currentPlayer = currentPlayer === "X" ? "O" : "X";

      // AI memilih langkah setelah giliran pemain selesai
      if (gameMode === "ai" && currentPlayer === "O") {
        setTimeout(() => {
          aiMove();
          currentPlayer = "X"; // Kembalikan giliran ke pemain
        }, 500); // Tambahkan sedikit penundaan untuk realisme
      }
    }
  });
});