const gridContainer = document.getElementById("grid-container");
const restartButton = document.getElementById("restart-button");

let gridSize = 5;  // 5x5 grid
let totalMines = 5;
let grid = [];
let revealedCells = 0;
let gameOver = false;

function startGame() {
    gameOver = false;
    revealedCells = 0;
    grid = [];
    gridContainer.innerHTML = ""; // Clear previous grid

    // Create a grid
    for (let i = 0; i < gridSize; i++) {
        grid[i] = [];
        for (let j = 0; j < gridSize; j++) {
            grid[i][j] = {
                isMine: false,
                isRevealed: false,
                surroundingMines: 0,
            };
            // Create the cell
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.setAttribute("data-x", i);
            cell.setAttribute("data-y", j);
            cell.addEventListener("click", handleCellClick);
            gridContainer.appendChild(cell);
        }
    }

    // Place mines randomly
    placeMines();

    // Calculate surrounding mines for each cell
    calculateSurroundingMines();
}

function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < totalMines) {
        const x = Math.floor(Math.random() * gridSize);
        const y = Math.floor(Math.random() * gridSize);

        if (!grid[x][y].isMine) {
            grid[x][y].isMine = true;
            minesPlaced++;
        }
    }
}

function calculateSurroundingMines() {
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            if (grid[x][y].isMine) continue;

            let mineCount = 0;
            // Check all 8 surrounding cells
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (x + i >= 0 && x + i < gridSize && y + j >= 0 && y + j < gridSize) {
                        if (grid[x + i][y + j].isMine) {
                            mineCount++;
                        }
                    }
                }
            }
            grid[x][y].surroundingMines = mineCount;
        }
    }
}

function handleCellClick(event) {
    if (gameOver) return;

    const x = parseInt(event.target.getAttribute("data-x"));
    const y = parseInt(event.target.getAttribute("data-y"));
    const cell = grid[x][y];

    if (cell.isRevealed) return;

    cell.isRevealed = true;
    revealedCells++;
    event.target.classList.add("revealed");

    if (cell.isMine) {
        event.target.classList.add("mine");
        alert("Game Over! You hit a mine.");
        gameOver = true;
        revealAllCells();
    } else {
        if (cell.surroundingMines > 0) {
            event.target.textContent = cell.surroundingMines;
        }
        if (revealedCells === gridSize * gridSize - totalMines) {
            alert("You Win! All non-mine cells revealed.");
            gameOver = true;
        }
    }
}

function revealAllCells() {
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            const cell = grid[x][y];
            const gridCell = gridContainer.children[x * gridSize + y];

            if (cell.isMine) {
                gridCell.classList.add("mine");
            } else if (cell.surroundingMines > 0) {
                gridCell.textContent = cell.surroundingMines;
            }
            gridCell.classList.add("revealed");
        }
    }
}

// Start the game when the page loads
startGame();