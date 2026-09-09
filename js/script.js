const MIN_BOARD_SIZE = 3;
const MAX_BOARD_SIZE = 10;
const DEFAULT_BOARD_SIZE = 3;

const EMPTY = 0;
const MAX_SCORE = 1000;

const MOVE_WEIGHT = 0.60;
const TIME_WEIGHT = 0.40;

const gameState = {
    status: "menu",
    size: DEFAULT_BOARD_SIZE,
    board: [],
    moves: 0,
    score: MAX_SCORE,
    startTime: null,
    elapsedTime: 0,
    timer: null
};

const screens = {
    menu: document.getElementById("menu-screen"),
    rules: document.getElementById("rules-screen"),
    game: document.getElementById("game-screen")
};

const boardSizeSelect = document.getElementById("board-size");
const startButton = document.getElementById("start-button");
const rulesButton = document.getElementById("rules-button");
const backToMenuFromRules = document.getElementById("back-to-menu-from-rules");

const boardSizeLabel = document.getElementById("board-size-label");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const movesElement = document.getElementById("moves");
const boardElement = document.getElementById("game-board");
const messageElement = document.getElementById("message");
const restartButton = document.getElementById("restart-button");
const giveUpButton = document.getElementById("give-up-button");
const backToMenuFromGame = document.getElementById("back-to-menu-from-game");


/* =========================================================
   NAVEGAÇÃO ENTRE TELAS
   ========================================================= */

function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove("active");
    });

    screens[screenName].classList.add("active");
}


/* =========================================================
   INÍCIO DO JOGO
   ========================================================= */

function startGame() {
    const selectedSize = Number(boardSizeSelect.value);

    if (
        !Number.isInteger(selectedSize) ||
        selectedSize < MIN_BOARD_SIZE ||
        selectedSize > MAX_BOARD_SIZE
    ) {
        return;
    }

    stopTimer();

    gameState.status = "playing";
    gameState.size = selectedSize;
    gameState.board = createSolvedBoard(selectedSize);
    gameState.moves = 0;
    gameState.score = MAX_SCORE;
    gameState.elapsedTime = 0;
    gameState.startTime = Date.now();

    shuffleBoard();

    boardSizeLabel.textContent = `${selectedSize} × ${selectedSize}`;

    messageElement.textContent =
        "Organize as peças para vencer.";

    updateGameInfo();
    renderBoard();

    boardElement.classList.remove("solved");

    showScreen("game");

    setGameState("normal");
    startTimer();
}


/* =========================================================
   CRIAÇÃO DO TABULEIRO
   ========================================================= */

function createSolvedBoard(size) {
    const totalCells = size * size;
    const board = [];

    for (let value = 1; value < totalCells; value++) {
        board.push(value);
    }

    board.push(EMPTY);

    return board;
}


/* =========================================================
   EMBARALHAMENTO
   ========================================================= */

function shuffleBoard() {
    const shuffleMoves =
        Math.max(30, gameState.size * gameState.size * 15);

    let previousEmptyPosition = -1;

    for (let i = 0; i < shuffleMoves; i++) {
        const possibleMoves = getPossibleMoves();

        const filteredMoves = possibleMoves.filter(
            position => position !== previousEmptyPosition
        );

        const candidates =
            filteredMoves.length > 0
                ? filteredMoves
                : possibleMoves;

        const selectedPosition =
            candidates[
                Math.floor(Math.random() * candidates.length)
                ];

        previousEmptyPosition =
            gameState.board.indexOf(EMPTY);

        executeMove(selectedPosition, false);
    }

    // Garante que o jogo não comece já resolvido.
    if (isBoardSolved()) {
        shuffleBoard();
    }
}


/* =========================================================
   MOVIMENTOS POSSÍVEIS
   ========================================================= */

function getPossibleMoves() {
    const size = gameState.size;
    const emptyPosition = gameState.board.indexOf(EMPTY);

    const emptyRow = Math.floor(emptyPosition / size);
    const emptyColumn = emptyPosition % size;

    const possibleMoves = [];

    // Peças da mesma linha
    for (let column = 0; column < size; column++) {
        const position = emptyRow * size + column;

        if (position !== emptyPosition) {
            possibleMoves.push(position);
        }
    }

    // Peças da mesma coluna
    for (let row = 0; row < size; row++) {
        const position = row * size + emptyColumn;

        if (position !== emptyPosition) {
            possibleMoves.push(position);
        }
    }

    return possibleMoves;
}


/* =========================================================
   RENDERIZAÇÃO DO TABULEIRO
   ========================================================= */

function renderBoard() {
    const size = gameState.size;

    boardElement.innerHTML = "";

    boardElement.style.setProperty(
        "--board-size",
        size
    );

    gameState.board.forEach((value, position) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "piece";

        button.dataset.position = position;

        button.setAttribute(
            "aria-label",
            value === EMPTY
                ? "Espaço vazio"
                : `Peça ${value}`
        );

        if (value === EMPTY) {
            button.classList.add("piece--empty");
            button.disabled = true;
        } else {
            button.textContent = value;

            button.addEventListener(
                "click",
                () => handleCellClick(position)
            );
        }

        boardElement.appendChild(button);
    });
}


/* =========================================================
   CLIQUE EM UMA PEÇA
   ========================================================= */

function handleCellClick(position) {
    if (gameState.status !== "playing") {
        return;
    }

    if (!isValidMove(position)) {
        messageElement.textContent =
            "Movimento inválido: escolha uma peça da mesma linha ou coluna do espaço vazio.";

        return;
    }

    executeMove(position, true);

    renderBoard();
    updateGameInfo();

    if (isBoardSolved()) {
        finishGame();
    } else {
        messageElement.textContent =
            "Continue organizando as peças.";
    }
}


/* =========================================================
   VALIDAÇÃO DO MOVIMENTO
   ========================================================= */

function isValidMove(position) {
    const size = gameState.size;

    const emptyPosition =
        gameState.board.indexOf(EMPTY);

    const row = Math.floor(position / size);
    const column = position % size;

    const emptyRow =
        Math.floor(emptyPosition / size);

    const emptyColumn =
        emptyPosition % size;

    return (
        row === emptyRow ||
        column === emptyColumn
    );
}


/* =========================================================
   EXECUÇÃO DO MOVIMENTO
   ========================================================= */

function executeMove(position, countMove = true) {
    const size = gameState.size;

    const emptyPosition =
        gameState.board.indexOf(EMPTY);

    const row = Math.floor(position / size);
    const column = position % size;

    const emptyRow =
        Math.floor(emptyPosition / size);

    const emptyColumn =
        emptyPosition % size;


    /*
     * MOVIMENTO HORIZONTAL
     */

    if (row === emptyRow) {

        // Peça está à esquerda do espaço vazio
        if (column < emptyColumn) {

            for (
                let current = emptyPosition;
                current > position;
                current--
            ) {
                gameState.board[current] =
                    gameState.board[current - 1];
            }

        }

        // Peça está à direita do espaço vazio
        else if (column > emptyColumn) {

            for (
                let current = emptyPosition;
                current < position;
                current++
            ) {
                gameState.board[current] =
                    gameState.board[current + 1];
            }
        }
    }


    /*
     * MOVIMENTO VERTICAL
     */

    else if (column === emptyColumn) {

        // Peça está acima do espaço vazio
        if (row < emptyRow) {

            for (
                let current = emptyPosition;
                current > position;
                current -= size
            ) {
                gameState.board[current] =
                    gameState.board[current - size];
            }

        }

        // Peça está abaixo do espaço vazio
        else if (row > emptyRow) {

            for (
                let current = emptyPosition;
                current < position;
                current += size
            ) {
                gameState.board[current] =
                    gameState.board[current + size];
            }
        }

    } else {
        return false;
    }


    // A posição escolhida passa a ser o espaço vazio.
    gameState.board[position] = EMPTY;

    if (countMove) {
        gameState.moves++;
    }

    return true;
}


/* =========================================================
   VERIFICAÇÃO DE VITÓRIA
   ========================================================= */

function isBoardSolved() {
    const totalCells =
        gameState.size * gameState.size;

    for (
        let position = 0;
        position < totalCells - 1;
        position++
    ) {
        if (
            gameState.board[position] !==
            position + 1
        ) {
            return false;
        }
    }

    return (
        gameState.board[totalCells - 1] === EMPTY
    );
}


/* =========================================================
   SISTEMA DE PONTUAÇÃO
   ========================================================= */

function calculateScore() {
    const size = gameState.size;

    /*
     * Referências normalizadas pelo tamanho do tabuleiro.
     */
    const referenceMoves = size * size;
    const referenceTime = size * size * 10;

    const extraMoves = Math.max(
        0,
        gameState.moves - referenceMoves
    );

    const extraTime = Math.max(
        0,
        gameState.elapsedTime - referenceTime
    );

    const movementRange =
        referenceMoves * 4;

    const timeRange =
        referenceTime * 4;


    /*
     * Eficiência de movimentos:
     * 60% da pontuação.
     */
    const movementEfficiency = Math.max(
        0,
        1 - extraMoves / movementRange
    );


    /*
     * Eficiência de tempo:
     * 40% da pontuação.
     */
    const timeEfficiency = Math.max(
        0,
        1 - extraTime / timeRange
    );


    /*
     * Combinação final:
     *
     * 60% movimentos
     * 40% tempo
     */
    const efficiency =
        movementEfficiency * MOVE_WEIGHT +
        timeEfficiency * TIME_WEIGHT;


    return Math.max(
        1,
        Math.min(
            MAX_SCORE,
            Math.round(MAX_SCORE * efficiency)
        )
    );
}


/* =========================================================
   FINALIZAÇÃO DO JOGO
   ========================================================= */

function finishGame() {
    gameState.elapsedTime =
        getElapsedTime();

    gameState.score =
        calculateScore();

    gameState.status = "won";

    stopTimer();

    renderBoard();
    updateGameInfo();

    boardElement.classList.add("solved");

    messageElement.textContent =
        `Parabéns! Você venceu em ` +
        `${gameState.moves} movimentos e ` +
        `${formatTime(gameState.elapsedTime)}. ` +
        `Pontuação final: ${gameState.score}.`;

    setGameState("win");
}


/* =========================================================
   ATUALIZAÇÃO DAS INFORMAÇÕES
   ========================================================= */

function updateGameInfo() {
    scoreElement.textContent =
        gameState.score;

    timerElement.textContent =
        formatTime(gameState.elapsedTime);

    movesElement.textContent =
        gameState.moves;
}


/* =========================================================
   CRONÔMETRO
   ========================================================= */

function startTimer() {
    stopTimer();

    gameState.timer = setInterval(() => {

        if (gameState.status !== "playing") {
            return;
        }

        gameState.elapsedTime =
            getElapsedTime();

        timerElement.textContent =
            formatTime(gameState.elapsedTime);

    }, 1000);
}


function stopTimer() {
    if (gameState.timer !== null) {

        clearInterval(gameState.timer);

        gameState.timer = null;
    }
}


function getElapsedTime() {
    if (gameState.startTime === null) {
        return 0;
    }

    return Math.floor(
        (Date.now() - gameState.startTime) / 1000
    );
}


function formatTime(totalSeconds) {
    const minutes =
        Math.floor(totalSeconds / 60);

    const seconds =
        totalSeconds % 60;

    return (
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`
    );
}


/* =========================================================
   VOLTAR AO MENU
   ========================================================= */

function returnToMenu() {
    stopTimer();

    gameState.status = "menu";
    gameState.startTime = null;
    gameState.elapsedTime = 0;

    boardElement.classList.remove("solved");

    showScreen("menu");
}


/* =========================================================
   EVENTOS DOS BOTÕES
   ========================================================= */

startButton.addEventListener(
    "click",
    startGame
);


rulesButton.addEventListener(
    "click",
    () => {
        showScreen("rules");
    }
);


backToMenuFromRules.addEventListener(
    "click",
    () => {
        showScreen("menu");
    }
);


restartButton.addEventListener(
    "click",
    startGame
);


giveUpButton.addEventListener(
    "click",
    returnToMenu
);


backToMenuFromGame.addEventListener(
    "click",
    returnToMenu
);

/* =========================================================
   APLICAÇÃO DOS TEMAS
   ========================================================= */
function applyTheme() {
    const selectedTheme = gameThemeSelect.value;

    document.body.classList.remove(
        "theme-default",
        "theme-1",
        "theme-2",
        "theme-3"
    );

    document.body.classList.add(`theme-${selectedTheme}`);
}


/* =========================================================
   MUDAR ESTADOS DO JOGO
   ========================================================= */

function setGameState(state) {
    document.body.classList.remove(
        "game-state-normal",
        "game-state-win",
        "game-state-give-up"
    );

    document.body.classList.add(`game-state-${state}`);
}


/* =========================================================
   ESTADO INICIAL
   ========================================================= */

showScreen("menu");