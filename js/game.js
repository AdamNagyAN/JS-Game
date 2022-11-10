import { hideAll, saveFinishedGame, saveGame, showDescription } from "./utils.js";
import { winModal, gameZone, modalReset, modalBack, table, timerText, save, back } from "./selectors.js";

let timer;
let validCells = [];

const setWinModal = (show) => {
  if (show === true) {
    winModal.childNodes[1].classList.add("show");
    winModal.childNodes[1].classList.remove("hide");
    winModal.childNodes[1].style = "display: block;";
  } else {
    winModal.childNodes[1].classList.remove("show");
    winModal.childNodes[1].classList.add("hide");
    winModal.childNodes[1].style = "";
  }
};

const renderTimer = (startTime) => {
  timerText.innerHTML = new Date(new Date() - startTime).toLocaleTimeString().split(":").slice(1, 3).join(":");
};

const checkField = (matrix, i, j, row, col, errors) => {
  if (matrix[i][j] !== "lamp") {
    matrix[i][j] = "light";
  }
  if (matrix[i][j] === "lamp") {
    errors.push([i, j]);
    errors.push([row, col]);
  }
};

const isValidCell = (matrix, row, col, validCells, errors) => {
  let maxAround = matrix[row][col] ?? -1;
  if (maxAround === -1) return;
  let around = 0;
  if (row + 1 < matrix.length && matrix[row + 1][col] == "lamp") around++;
  if (row - 1 >= 0 && matrix[row - 1][col] == "lamp") around++;
  if (col + 1 < matrix.length && matrix[row][col + 1] == "lamp") around++;
  if (col - 1 >= 0 && matrix[row][col - 1] == "lamp") around++;
  if (around > maxAround) {
    if (row + 1 < matrix.length && matrix[row + 1][col] == "lamp") errors.push([row + 1, col]);
    if (row - 1 >= 0 && matrix[row - 1][col] == "lamp") errors.push([row - 1, col]);
    if (col + 1 < matrix.length && matrix[row][col + 1] == "lamp") errors.push([row, col + 1]);
    if (col - 1 >= 0 && matrix[row][col - 1] == "lamp") errors.push([row, col - 1]);
  }
  if (around === maxAround) {
    validCells.push([row, col]);
  }
};

const fillWithLight = (matrix, row, col, errors) => {
  for (let i = row - 1; i >= 0; i--) {
    let j = col;
    if (typeof matrix[i][j] === "number") break;
    checkField(matrix, i, j, row, col, errors);
  }
  for (let i = row + 1; i < matrix.length; i++) {
    let j = col;
    if (typeof matrix[i][j] === "number") break;
    checkField(matrix, i, j, row, col, errors);
  }
  for (let j = col - 1; j >= 0; j--) {
    let i = row;
    if (typeof matrix[i][j] === "number") break;
    checkField(matrix, i, j, row, col, errors);
  }
  for (let j = col + 1; j < matrix.length; j++) {
    let i = row;
    if (typeof matrix[i][j] === "number") break;
    checkField(matrix, i, j, row, col, errors);
  }
};

const checkForWin = (matrix, errors) => {
  if (errors.length !== 0) {
    return false;
  }

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[i][j] === "empty") {
        return false;
      }
    }
  }

  return true;
};

const resetGame = (matrix, errors, validCells, playerName, gameName) => {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[i][j] === "light" || matrix[i][j] === "lamp") {
        matrix[i][j] = "empty";
      }
    }
  }
  renderMatrix(matrix, errors, validCells, playerName, gameName);
};

const renderMatrix = (matrix, errors, validCells, playerName, gameName) => {
  errors = [];
  validCells = [];
  if (table) {
    table.innerHTML = "";
  }
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[i][j] === "light") {
        matrix[i][j] = "empty";
      }
      if (typeof matrix[i][j] == "number") {
        isValidCell(matrix, i, j, validCells, errors);
      }
    }
  }
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[i][j] === "lamp") {
        fillWithLight(matrix, i, j, errors);
      }
    }
  }

  for (let i = 0; i < matrix.length; i++) {
    let row = table.insertRow();
    for (let j = 0; j < matrix.length; j++) {
      let cell = row.insertCell();
      cell.classList.add("bg-light");
      const isError = !!errors.find((it) => it[0] === i && it[1] === j);
      const isValid = !!validCells.find((it) => it[0] === i && it[1] === j);
      if (isValid) {
        cell.classList.add("text-success");
      }
      if (isError) {
        cell.classList.remove("bg-light");
        cell.classList.add("bg-danger");
      }
      if (typeof matrix[i][j] === "number") {
        cell.classList.add("bg-black");
        cell.innerHTML = matrix[i][j] !== -1 ? matrix[i][j] : "";
      }
      if (matrix[i][j] === "lamp") {
        cell.innerHTML = '<img src="./assets/lamp.png" width="400px" height="150px">';
        cell.classList.remove("bg-light");
        cell.classList.add("bg-warning");
      }
      if (matrix[i][j] === "light") {
        cell.classList.remove("bg-light");
        cell.classList.add("bg-warning");
      }
      cell.setAttribute("indexi", i);
      cell.setAttribute("indexj", j);
      cell.addEventListener("click", (e) => fieldClickEvent(e, matrix, errors, validCells, playerName, gameName));
    }
  }

  if (checkForWin(matrix, errors)) {
    setWinModal(true);
    saveFinishedGame(playerName, gameName, timerText.innerHTML);
  }
};

const fieldClickEvent = (event, matrix, errors, validCells, playerName, gameName) => {
  let i = Number(event.target.getAttribute("indexi"));
  let j = Number(event.target.getAttribute("indexj"));
  if (matrix[i][j] === "empty" || matrix[i][j] === "light") {
    matrix[i][j] = "lamp";
    fillWithLight(matrix, i, j, errors);
    renderMatrix(matrix, errors, validCells, playerName, gameName);
    return;
  }
  if (matrix[i][j] === "lamp") {
    matrix[i][j] = "empty";
    renderMatrix(matrix, errors, validCells, playerName, gameName);
    return;
  }
};

const game = (matrixShallCopy, gameName = "unknown", playerName, startTimeStr) => {
  hideAll();
  clearInterval(timer);
  const startTime = new Date();
  timer = setInterval(() => renderTimer(startTime), 1000);
  // Deep copy of the matrix, 'cause we dont want to modify the gameFields
  let matrix = JSON.parse(JSON.stringify(matrixShallCopy));
  gameZone.classList.remove("d-none");
  let errors = [];
  let validCells = [];

  modalReset.addEventListener("click", () => {
    resetGame(matrix, errors, validCells, playerName, gameName);
    setWinModal(false);
  });
  reset.addEventListener("click", () => resetGame(matrix, errors, validCells, playerName, gameName));
  modalBack.addEventListener("click", () => {
    showDescription();
    setWinModal(false);
  });
  back.addEventListener("click", () => {
    showDescription();
  });

  save.addEventListener("click", () => saveGame(playerName, gameName, matrix, timerText.innerHTML));

  renderMatrix(matrix, errors, validCells, playerName, gameName);
};

export default game;
