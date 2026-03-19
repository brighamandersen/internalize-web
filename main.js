const viewer = document.getElementById("viewer");
const editor = document.getElementById("editor");
const input = document.getElementById("input");
const output = document.getElementById("output");
const editSaveButton = document.getElementById("editSaveButton");
const viewFilterBottomBar = document.getElementById("viewFilterBottomBar");
const container = editor.querySelector(".container");

const filterButtonFull = document.getElementById("filterButtonFull");
const filterButtonHints = document.getElementById("filterButtonHints");
const filterButtonBlanks = document.getElementById("filterButtonBlanks");

let viewFilter = "full";
let isEditing = false;

/* ---------- PERSISTENT STORAGE ---------- */

function savePassageInLocalStorage() {
  localStorage.setItem("internalize_passage", input.value);
}

function loadPassageFromLocalStorage() {
  input.value =
    localStorage.getItem("internalize_passage") ||
    "Welcome! Press EDIT to begin adding a passage to internalize.";
  render();
}

/* ---------- FULLSCREEN DOUBLE TAP ---------- */

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// Desktop
document.addEventListener("dblclick", toggleFullscreen);

// Mobile
let lastTouchTime = 0;
document.addEventListener("touchend", (e) => {
  const now = Date.now();
  if (now - lastTouchTime < 300) {
    // Double-tap detected
    toggleFullscreen();
    lastTouchTime = 0; // Reset
  } else {
    lastTouchTime = now;
  }
});

/* ---------- FULLSCREEN DOUBLE TAP ---------- */

/* END – Double tap to enter/exit fullscreen */

function getPassageHintsMask(passage) {
  return passage
    .split(/\b/)
    .map((part) => {
      if (/^\w+$/.test(part)) {
        return part.length <= 1 ? part : part[0] + "_".repeat(part.length - 1);
      }
      return part;
    })
    .join("");
}

function getPassageBlanksMask(passage) {
  return passage.replace(/[^\s]/g, "_");
}

function handleEditPassageClick() {
  viewer.classList.remove("active");
  editor.classList.add("active");
  editSaveButton.textContent = "Save";

  viewFilter = "full";
  render();

  input.focus();
}

function handleSavePassageClick() {
  if (!input.value) {
    alert("Cannot have empty passage.");
    return;
  }

  editor.classList.remove("active");
  viewer.classList.add("active");
  editSaveButton.textContent = "Edit";

  render();
}

editSaveButton.addEventListener("click", () => {
  isEditing = !isEditing;

  if (isEditing) {
    handleEditPassageClick();
  } else {
    handleSavePassageClick();
  }
});

function render() {
  const passage = input.value;
  let result = passage;
  if (viewFilter === "hints") result = getPassageHintsMask(passage);
  if (viewFilter === "blanks") result = getPassageBlanksMask(passage);

  output.textContent = result;

  if (!isEditing) {
    updateActiveFilterButton();
  }

  savePassageInLocalStorage();
}

function updateActiveFilterButton() {
  filterButtonFull.classList.toggle("active", viewFilter === "full");
  filterButtonHints.classList.toggle("active", viewFilter === "hints");
  filterButtonBlanks.classList.toggle("active", viewFilter === "blanks");
}

input.addEventListener("input", render);

filterButtonFull.addEventListener("click", () => {
  viewFilter = "full";
  render();
});
filterButtonHints.addEventListener("click", () => {
  viewFilter = "hints";
  render();
});
filterButtonBlanks.addEventListener("click", () => {
  viewFilter = "blanks";
  render();
});

loadPassageFromLocalStorage();
