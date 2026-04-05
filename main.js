// CONSTANTS

const WELCOME_MESSAGE = "Welcome to Internalize! Press EDIT to add a passage. Then use the bar below to show/hide parts of the passage to help you memorize it!";

// GETTING UI ELEMENTS

const editButton = document.getElementById("edit-btn");
const saveButton = document.getElementById("save-btn");
const passageTextarea = document.getElementById("passage-textarea");
const filterButtonGroupContainer = document.getElementById("filter-btn-group-container");
const filterButtonFull = document.getElementById("filter-btn-full");
const filterButtonHints = document.getElementById("filter-btn-hints");
const filterButtonBlanks = document.getElementById("filter-btn-blanks");

// STATE

let state = {
  isEditing: false,
  fullPassage: localStorage.getItem("fullPassage") || WELCOME_MESSAGE,
  viewFilter: "full",
  // Derived state
  hintsPassage: "",
  blanksPassage: "",
};

function setState(stateUpdates) {
  Object.assign(state, stateUpdates);
  runStateEffects(stateUpdates);
  updateUI(stateUpdates);
}

function runStateEffects(stateUpdates) {
  // Save full passage
  if ("fullPassage" in stateUpdates) {
    localStorage.setItem("fullPassage", stateUpdates.fullPassage);

    state.hintsPassage = getPassageHintsMask(stateUpdates.fullPassage);
    state.blanksPassage = getPassageBlanksMask(stateUpdates.fullPassage);
  }
}

// RENDERING

function updateUI(stateUpdates) {
  if ("isEditing" in stateUpdates) {
    if (state.isEditing) {
      saveButton.classList.remove("hidden");
      editButton.classList.add("hidden");
      passageTextarea.readOnly = false;
      filterButtonGroupContainer.classList.add('hidden');
    } else {
      editButton.classList.remove("hidden");
      saveButton.classList.add("hidden");
      passageTextarea.readOnly = true;
      filterButtonGroupContainer.classList.remove('hidden');
    }
  }
  
  if ("viewFilter" in stateUpdates) {
    if (state.viewFilter === "full") {
      passageTextarea.value = state.fullPassage;
    } else if (state.viewFilter === "hints") {
      passageTextarea.value = state.hintsPassage;
    } else if (state.viewFilter === "blanks") {
      passageTextarea.value = state.blanksPassage;
    }

    filterButtonFull.classList.toggle("active", state.viewFilter === "full");
    filterButtonHints.classList.toggle("active", state.viewFilter === "hints");
    filterButtonBlanks.classList.toggle("active", state.viewFilter === "blanks");
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
  setState({
    isEditing: true,
    viewFilter: "full"
  });
});

saveButton.addEventListener("click", () => {
  setState({ 
    isEditing: false,
    fullPassage: passageTextarea.value
  });
})

filterButtonFull.addEventListener("click", () => {
  setState({ viewFilter: "full" });
});
filterButtonHints.addEventListener("click", () => {
  setState({ viewFilter: "hints" });
});
filterButtonBlanks.addEventListener("click", () => {
  setState({ viewFilter: "blanks" });
});

// INITIAL MOUNT

// Call setState on itself to trigger initial state effects and UI updates
setState(state);