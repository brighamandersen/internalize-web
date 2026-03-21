// CONSTANTS

const LOCAL_STORAGE_PASSAGE_KEY = "internalize_passage";

// GETTING UI ELEMENTS

const editButton = document.getElementById("edit-btn");
const saveButton = document.getElementById("save-btn");
const passageTextarea = document.getElementById("passage-textarea");
const filterButtonGroupContainer = document.getElementById("filter-btn-group-container");
const filterButtonFull = document.getElementById("filter-btn-full");
const filterButtonHints = document.getElementById("filter-btn-hints");
const filterButtonBlanks = document.getElementById("filter-btn-blanks");

let state = {
  isEditing: false,
  fullPassage: localStorage.getItem(LOCAL_STORAGE_PASSAGE_KEY) || "",
  viewFilter: "full"
  // Derived state
  // hintsPassage: "",
  // blanksPassage: "",
};

// function initState() {
//   const savedPassage = localStorage.getItem(LOCAL_STORAGE_PASSAGE_KEY) || "";

//   if (savedPassage) {
//     state.fullPassage = savedPassage;

//     // compute derived values once
//     state.hintsPassage = getPassageHintsMask(savedPassage);
//     state.blanksPassage = getPassageBlanksMask(savedPassage);
//   }
// }

// function setState(stateUpdates) {
//   Object.assign(state, stateUpdates);

//   // Save full passage
//   if ("fullPassage" in stateUpdates) {
//     localStorage.setItem(LOCAL_STORAGE_PASSAGE_KEY, stateUpdates.fullPassage);
//   }

//   updateUI();
// }

// function setIsEditing(newIsEditing) {
//   if (isEditing === newIsEditing) return;
//   isEditing = newIsEditing;
  
//   if (isEditing) {
//     setState({ viewFilter: "full" })
//     passageTextarea.focus();
//   }
  
//   syncEditSaveButtonUI();
//   syncPassageContentUI();
//   updateFilterButtonsUI();
// }



// function setFullPassage(newFullPassage) {
//   if (fullPassage === newFullPassage) return;
//   fullPassage = newFullPassage;
  
//   localStorage.setItem(LOCAL_STORAGE_PASSAGE_KEY, fullPassage);
//   syncPassageContentUI();
// }


// function setViewFilter(newViewFilter) {
//   if (viewFilter === newViewFilter) return;
//   state.viewFilter = newViewFilter;

//   syncFilterButtonsUI();
//   syncPassageContentUI();
// }


// RENDER UPDATERS

function updateUI() {
  // edit save buttons
  if (state.isEditing) {
    saveButton.classList.remove("hidden");
    editButton.classList.add("hidden");
  } else {
    editButton.classList.remove("hidden");
    saveButton.classList.add("hidden");
  }

  // passage

  passageTextarea.readOnly = !state.isEditing;

  if (state.viewFilter === "full") {
    passageTextarea.value = state.fullPassage;
  } else if (state.viewFilter === "hints") {
    passageTextarea.value = getPassageHintsMask(state.fullPassage);
  } else if (state.viewFilter === "blanks") {
    passageTextarea.value = getPassageBlanksMask(state.fullPassage);
  }

  
  // filter buttons

  if (state.isEditing) {
    filterButtonGroupContainer.classList.add('hidden');
  } else {
    filterButtonGroupContainer.classList.remove('hidden');
  }

  filterButtonFull.classList.toggle("active", state.viewFilter === "full");
  filterButtonHints.classList.toggle("active", state.viewFilter === "hints");
  filterButtonBlanks.classList.toggle("active", state.viewFilter === "blanks");
}

// FULLSCREEN DOUBLE TAP

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

document.addEventListener("dblclick", toggleFullscreen); // Desktop

let lastTouchTime = 0;
document.addEventListener("touchend", (e) => {
  const now = Date.now();
  if (now - lastTouchTime < 300) { // Mobile double tap
    toggleFullscreen();
    lastTouchTime = 0;
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

// CLICK EVENT LISTENERS

editButton.addEventListener("click", () => {
  state.isEditing = true;
  state.viewFilter = "full";
  updateUI();
  // editButton.classList.add("hidden");
  // saveButton.classList.remove("hidden");

  // filterButtonGroupContainer.classList.add('hidden');
  // isEditing = !state.isEditing;

  // viewFilter = "full";

  // passageTextarea.readOnly = false; 

  // filterButtonGroupContainer.classList.remove('visible');

  // passageTextarea.focus();
});

saveButton.addEventListener("click", () => {
  state.isEditing = false;
  
  // state.fullPassage = passageTextarea.value;
  localStorage.setItem(LOCAL_STORAGE_PASSAGE_KEY, state.fullPassage);

  updateUI();

  // saveButton.classList.add("hidden");
  // editButton.classList.remove("hidden");

  // filterButtonGroupContainer.classList.remove('hidden');
  // setFullPassage(passageTextarea.value);

  // passageTextarea.readOnly = true; 
  // editSaveButton.textContent = "Edit";
  // filterButtonGroupContainer.classList.add('visible');
})

filterButtonFull.addEventListener("click", () => {
  state.viewFilter = "full";
  // filterButtonFull.classList.toggle("active", state.viewFilter === "full");
  // filterButtonHints.classList.toggle("active", state.viewFilter === "hints");
  // filterButtonBlanks.classList.toggle("active", state.viewFilter === "blanks");
  // syncFilterButtonsUI();
  // syncPassageContentUI();
  updateUI();
});
filterButtonHints.addEventListener("click", () => {
  state.viewFilter = "hints";
  //  filterButtonFull.classList.toggle("active", state.viewFilter === "full");
  // filterButtonHints.classList.toggle("active", state.viewFilter === "hints");
  // filterButtonBlanks.classList.toggle("active", state.viewFilter === "blanks");
  // syncFilterButtonsUI();
  // syncPassageContentUI();
  updateUI();
});
filterButtonBlanks.addEventListener("click", () => {
  state.viewFilter = "blanks";
  // syncFilterButtonsUI();
  // syncPassageContentUI();
  updateUI();
});

// Initial Mount

updateUI();

// syncEditSaveButtonUI();
// syncPassageContentUI();
// syncFilterButtonsUI();
