import {
  description,
  gameZone,
  gameSelect,
  leaderboard,
  continueBtnContainer,
  startGame,
  playerNameField,
} from "./selectors.js";
import gameFields from "./gameFields.js";
import game from "./game.js";

const LEADERBOARD_STORAGE_KEY = "loaderBoard";

export const hideAll = () => {
  description.classList.add("d-none");
  gameZone.classList.add("d-none");
  leaderboard.classList.add("d-none");
};

export const saveGame = (playerName, gameName, gameState, passedTime) => {
  localStorage.setItem("prevGame", JSON.stringify({ playerName, gameName, gameState, passedTime }));
};

export const loadGame = () => {
  return JSON.parse(localStorage.getItem("prevGame"));
};

export const saveFinishedGame = (playerName, gameName, completeTime) => {
  let prevGames = JSON.parse(localStorage.getItem(LEADERBOARD_STORAGE_KEY)) ?? [];
  let newData = [
    ...prevGames,
    {
      playerName,
      gameName,
      completeTime,
    },
  ];
  localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(newData));
};

export const loadLeaderboard = () => {
  return JSON.parse(localStorage.getItem("loaderBoard")) ?? [];
};

const renderLeaderboardTable = () => {
  let tableBody = leaderboard.querySelector("table tbody");
  tableBody.innerHTML = "";
  let leaderboardItems = loadLeaderboard();
  leaderboardItems.forEach((item) => {
    let row = document.createElement("tr");
    let nameField = document.createElement("td");
    nameField.innerHTML = item.playerName;
    row.appendChild(nameField);
    let gameField = document.createElement("td");
    gameField.innerHTML = item.gameName;
    row.appendChild(gameField);
    let timeField = document.createElement("td");
    timeField.innerHTML = item.completeTime;
    row.appendChild(timeField);
    tableBody.appendChild(row);
  });
};

const clearGameOptions = () => {
  Array.from(gameSelect.childNodes)
    ?.filter((it) => it.tagName === "OPTION")
    .forEach((it, index) => {
      if (index !== 0) {
        it.remove();
      }
    });
};

const renderGameOptions = (gameFields) => {
  gameFields.forEach((it, index) => {
    let option = document.createElement("option");
    option.innerHTML = it.label;
    option.value = index;
    gameSelect.add(option);
  });
};

export const showDescription = () => {
  clearGameOptions();
  renderGameOptions(gameFields);

  playerNameField.classList.remove("is-invalid");

  if (loadGame()) {
    continueBtnContainer.innerHTML = "";
    let btn = document.createElement("button");
    btn.classList.add("btn", "btn-success");
    btn.innerHTML = "Előző játék folytatása";
    let savedGame = loadGame();
    btn.addEventListener("click", () =>
      game(savedGame.gameState, savedGame.gameName, savedGame.playerName, savedGame.passedTime)
    );
    let text = document.createElement("p");
    text.innerHTML = savedGame.playerName;
    continueBtnContainer.appendChild(text);
    continueBtnContainer.appendChild(btn);
  }

  hideAll();
  description.classList.remove("d-none");
  leaderboard.classList.remove("d-none");
  renderLeaderboardTable();

  startGame.addEventListener("click", () => {
    if (!playerNameField.value) {
      playerNameField.classList.add("is-invalid");
      return;
    }
    if (gameSelect.selectedIndex < 1) return;
    game(
      gameFields[gameSelect.selectedIndex - 1].value,
      gameFields[gameSelect.selectedIndex - 1].label,
      playerNameField.value
    );
  });
};
