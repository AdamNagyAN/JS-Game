const gameZone = document.querySelector("#game");const winModal = document.querySelector("#win");
const modalReset = document.querySelector("#modal-reset");
const modalBack = document.querySelector("#modal-back");
const description = document.querySelector("#description");
const startGame = document.querySelector("#start-game");

const continueBtnContainer = document.querySelector("#continue-btn-container");
const gameSelect = document.querySelector("#game-select");
const table = document.querySelector("table");
const reset = document.querySelector("#reset");
const back = document.querySelector("#back");
const save = document.querySelector("#save");

const a = [
  ["empty", "empty", "empty", 1, "empty", "empty", "empty"],
  ["empty", 0, "empty", "empty", "empty", 2, "empty"],
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  [-1, "empty", "empty", -1, "empty", "empty", -1],
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  ["empty", 0, "empty", "empty", "empty", 2, "empty"],
  ["empty", "empty", "empty", 3, "empty", "empty", "empty"],
];

const b = [
  ["empty", "empty", 0, "empty", -1, "empty", "empty"],
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  [-1, "empty", -1, "empty", 3, "empty", -1],
  ["empty", "empty", "empty", 1, "empty", "empty", "empty"],
  [2, "empty", -1, "empty", -1, "empty", -1],
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  ["empty", "empty", -1, "empty", 2, "empty", "empty"],
];

const c = [
  ["empty", -1, "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  ["empty", "empty", "empty", "empty", "empty", 3, "empty", 2, "empty", -1],
  ["empty", 0, -1, "empty", "empty", "empty", "empty", -1, "empty", "empty"],
  ["empty", "empty", "empty", "empty", -1, "empty", "empty", "empty", "empty", "empty"],
  ["empty", 1, "empty", "empty", -1, 1, -1, "empty", "empty", "empty"],
  ["empty", "empty", "empty", -1, -1, -1, "empty", "empty", 3, "empty"],
  ["empty", "empty", "empty", "empty", "empty", -1, "empty", "empty", "empty", "empty"],
  ["empty", "empty", 1, "empty", "empty", "empty", "empty", 0, -1, "empty"],
  [3, "empty", -1, "empty", 0, "empty", "empty", "empty", "empty", "empty"],
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", 0, "empty"],
];

const gameFields = [
  {
    label: "Könnyű",
    value: a,
  },
  {
    label: "Közepes",
    value: b,
  },
  {
    label: "Nehéz",
    value: c,
  },
];

const hideAll = () => {
  description.classList.add("d-none");
  gameZone.classList.add("d-none");
};

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

const loadGame = () => {
  return JSON.parse(localStorage.getItem("prevGame"));
};

const game = (matrixShallCopy) => {
  hideAll();
  // Deep copy of the matrix, 'cause we dont want to modify the gameFields
  matrix = JSON.parse(JSON.stringify(matrixShallCopy));
  gameZone.classList.remove("d-none");
  let errors = [];

  modalReset.addEventListener("click", () => {
    resetGame();
    setWinModal(false);
  });
  reset.addEventListener("click", () => resetGame());
  modalBack.addEventListener("click", () => {
    showDescription();
    setWinModal(false);
  });
  back.addEventListener("click", () => {
    showDescription();
  });

  const resetGame = () => {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        if (matrix[i][j] === "light" || matrix[i][j] === "lamp") {
          matrix[i][j] = "empty";
        }
      }
    }
    renderMatrix(matrix);
  };

  const isValidCell = (row, col) => {
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
  };

  const renderMatrix = () => {
    errors = [];
    if (table) {
      table.innerHTML = "";
    }
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        if (matrix[i][j] === "light") {
          matrix[i][j] = "empty";
        }
        if (typeof matrix[i][j] == "number") {
          isValidCell(i, j, errors);
        }
      }
    }
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        if (matrix[i][j] === "lamp") {
          fillWithLight(i, j, errors);
        }
      }
    }

    for (let i = 0; i < matrix.length; i++) {
      let row = table.insertRow();
      for (let j = 0; j < matrix.length; j++) {
        let cell = row.insertCell();
        cell.classList.add("bg-light");
        const isError = !!errors.find((it) => it[0] === i && it[1] === j);
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
        cell.addEventListener("click", (e) => fieldClickEvent(e));
      }
    }

    if (checkForWin()) {
      setWinModal(true);
    }
  };

  const checkField = (i, j, row, col) => {
    console.log({ i, j });
    if (matrix[i][j] !== "lamp") {
      matrix[i][j] = "light";
    }
    if (matrix[i][j] === "lamp") {
      errors.push([i, j]);
      errors.push([row, col]);
    }
  };

  const checkForWin = () => {
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

  const saveGame = () => {
    localStorage.setItem("prevGame", JSON.stringify(matrix));
  };

  save.addEventListener("click", () => saveGame());

  const fillWithLight = (row, col) => {
    for (let i = row - 1; i >= 0; i--) {
      let j = col;
      if (typeof matrix[i][j] === "number") break;
      checkField(i, j, row, col);
    }
    for (let i = row + 1; i < matrix.length; i++) {
      let j = col;
      if (typeof matrix[i][j] === "number") break;
      checkField(i, j, row, col);
    }
    for (let j = col - 1; j >= 0; j--) {
      let i = row;
      if (typeof matrix[i][j] === "number") break;
      checkField(i, j, row, col);
    }
    for (let j = col + 1; j < matrix.length; j++) {
      let i = row;
      if (typeof matrix[i][j] === "number") break;
      checkField(i, j, row, col);
    }
  };

  const fieldClickEvent = (event) => {
    let i = Number(event.target.getAttribute("indexi"));
    let j = Number(event.target.getAttribute("indexj"));
    console.log(matrix[i][j]);
    if (matrix[i][j] === "empty" || matrix[i][j] === "light") {
      matrix[i][j] = "lamp";
      fillWithLight(i, j, true);
      renderMatrix();
      return;
    }
    if (matrix[i][j] === "lamp") {
      matrix[i][j] = "empty";
      renderMatrix();
      return;
    }
  };

  renderMatrix();
};

const showDescription = () => {
  Array.from(gameSelect.childNodes)
    ?.filter((it) => it.tagName === "OPTION")
    .forEach((it, index) => {
      if (index !== 0) {
        it.remove();
      }
    });
  gameFields.forEach((it, index) => {
    let option = document.createElement("option");
    option.innerHTML = it.label;
    option.value = index;
    gameSelect.add(option);
  });

  if (loadGame()) {
    continueBtnContainer.innerHTML = "";
    const btn = document.createElement("button");
    btn.classList.add("btn", "btn-success");
    btn.innerHTML = "Előző játék folytatása";
    btn.addEventListener("click", () => game(loadGame()));
    continueBtnContainer.appendChild(btn);
  }

  hideAll();
  description.classList.remove("d-none");

  startGame.addEventListener("click", () => {
    if (gameSelect.selectedIndex < 1) return;
    game(gameFields[gameSelect.selectedIndex - 1].value);
  });
};

showDescription();
