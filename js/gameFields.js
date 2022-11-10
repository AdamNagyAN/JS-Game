const easy = [
  ["empty", "empty", "empty", 1, "empty", "empty", "empty"],
  ["empty", 0, "empty", "empty", "empty", 2, "empty"],
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  [-1, "empty", "empty", -1, "empty", "empty", -1],
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  ["empty", 0, "empty", "empty", "empty", 2, "empty"],
  ["empty", "empty", "empty", 3, "empty", "empty", "empty"],
];

const medium = [
  ["empty", "empty", 0, "empty", -1, "empty", "empty"],
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  [-1, "empty", -1, "empty", 3, "empty", -1],
  ["empty", "empty", "empty", 1, "empty", "empty", "empty"],
  [2, "empty", -1, "empty", -1, "empty", -1],
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  ["empty", "empty", -1, "empty", 2, "empty", "empty"],
];

const hard = [
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
    value: easy,
  },
  {
    label: "Közepes",
    value: medium,
  },
  {
    label: "Nehéz",
    value: hard,
  },
];

export default gameFields;
