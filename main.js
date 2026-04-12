// CONSTANTS

const WELCOME_MESSAGE = "Welcome to Internalize! Press EDIT to add a passage. Then use the bar below to show/hide parts of the passage to help you memorize it!";

// GETTING UI ELEMENTS

const editButton = document.getElementById("edit-btn");
const saveButton = document.getElementById("save-btn");
const passageTextarea = document.getElementById("passage-textarea");
const filterButtonGroup = document.getElementById("filter-btn-group");
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
      filterButtonGroup.classList.add('hidden');
    } else {
      editButton.classList.remove("hidden");
      saveButton.classList.add("hidden");
      passageTextarea.readOnly = true;
      filterButtonGroup.classList.remove('hidden');
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

// SERVICE WORKER

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register("/service-worker.js");
      console.log("Service Worker registered:", reg.scope);
    } catch (err) {
      console.error("Service Worker registration failed:", err);
    }
  });
}

function handleSharedInput() {
  const params = new URLSearchParams(window.location.search);
  const incomingSharedText = params.get("text");

  if (incomingSharedText) {
    setState({ 
      fullPassage: incomingSharedText,
      isEditing: false,
      viewFilter: "full"
     });

    // Clean URL so refresh doesn't re-trigger
    window.history.replaceState({}, "", "/");
  }
}

handleSharedInput();

// INITIAL MOUNT

// Call setState on itself to trigger initial state effects and UI updates
setState({ ...state });