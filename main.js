// CONSTANTS

const LOCAL_STORAGE_PASSAGE_KEY = "internalize_passage";

// GETTING UI ELEMENTS

const editSaveButton = document.getElementById("editSaveButton");
const passageTextarea = document.getElementById("passageTextarea");
const filterButtonGroupContainer = document.getElementById("filterButtonGroupContainer");
const filterButtonFull = document.getElementById("filterButtonFull");
const filterButtonHints = document.getElementById("filterButtonHints");
const filterButtonBlanks = document.getElementById("filterButtonBlanks");

// INITIAL MOUNT SETUP

let viewFilter = "full";
let isEditing = false;
let fullPassage = localStorage.getItem(LOCAL_STORAGE_PASSAGE_KEY) || "";
passageTextarea.value = fullPassage;

// STATE VARIABLE SETTERS

function setFullPassage(newFullPassage) {
  fullPassage = newFullPassage;
  
  passageTextarea.value = fullPassage;
  localStorage.setItem(LOCAL_STORAGE_PASSAGE_KEY, fullPassage);
}

function setViewFilter(newViewFilter) {
  viewFilter = newViewFilter;

  // Rerender filter buttons with filter change
  filterButtonFull.classList.toggle("active", viewFilter === "full");
  filterButtonHints.classList.toggle("active", viewFilter === "hints");
  filterButtonBlanks.classList.toggle("active", viewFilter === "blanks");

  // Re-render passage with mask
  if (viewFilter === "full") {
    passageTextarea.value = fullPassage;
  } else if (viewFilter === "hints") {
    passageTextarea.value = getPassageHintsMask(fullPassage);
  } else if (viewFilter === "blanks" ) {
    passageTextarea.value = getPassageBlanksMask(fullPassage);
  }
}

// FULLSCREEN DOUBLE TAP

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

// MASK HELPERS

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

// ONCLICK FUNCTIONS / LISTENERS

function handleEditPassageClick() {
  passageTextarea.readOnly = false; 
  editSaveButton.textContent = "Save";

  filterButtonGroupContainer.classList.remove('visible');
  setViewFilter("full");

  passageTextarea.focus();
}

function handleSavePassageClick() {
  console.log('here');

  setFullPassage(passageTextarea.value);

  passageTextarea.readOnly = true; 
  editSaveButton.textContent = "Edit";
  filterButtonGroupContainer.classList.add('visible');
}

editSaveButton.addEventListener("click", () => {
  isEditing = !isEditing;

  if (isEditing) {
    handleEditPassageClick();
  } else {
    handleSavePassageClick();
  }
});

filterButtonFull.addEventListener("click", () => {
  setViewFilter("full");
});
filterButtonHints.addEventListener("click", () => {
  setViewFilter("hints");
});
filterButtonBlanks.addEventListener("click", () => {
  setViewFilter("blanks");
});

// loadPassageFromLocalStorage();
