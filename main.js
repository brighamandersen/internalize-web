const viewer = document.getElementById("viewer");
    const editor = document.getElementById("editor");
    const input = document.getElementById("input");
    const output = document.getElementById("output");
    const editToggle = document.getElementById("editToggle");
    const controls = document.getElementById("controls");
    const container = editor.querySelector(".container");

    const buttonGroup = {
      full: document.getElementById("view-mode-btn-full"),
      hints: document.getElementById("view-mode-btn-hints"),
      blanks: document.getElementById("view-mode-btn-blanks"),
    };

    let viewMode = "full";
    let isEditing = false;

    /* ---------- PERSISTENT STORAGE ---------- */

    function savePassageInLocalStorage() {
      localStorage.setItem("internalize_passage", input.value);
    }

    function loadPassageFromLocalStorage() {
      input.value = localStorage.getItem("internalize_passage") || "Welcome! Press EDIT to begin adding a passage to internalize.";
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
      return passage.split(/\b/).map(part => {
        if (/^\w+$/.test(part)) {
          return part.length <= 1 ? part : part[0] + "_".repeat(part.length - 1);
        }
        return part;
      }).join("");
    }

    function getPassageBlanksMask(passage) {
      return passage.replace(/[^\s]/g, "_");
    }

    function setEditing(state) {
      isEditing = state;

      if (isEditing) {
        viewer.classList.remove("active");
        editor.classList.add("active");
        editToggle.textContent = "SAVE CHANGES";
        input.focus();

        viewMode = "full";
        render();
      } else {
        if (!input.value) {
          alert("Cannot have empty passage.");
          return;
        }

        editor.classList.remove("active");
        viewer.classList.add("active");
        editToggle.textContent = "EDIT";

        render();
      }
    }

    function handleEditPassageClick() {
      viewer.classList.remove("active");
      editor.classList.add("active");
      editToggle.textContent = "SAVE CHANGES";

      viewMode = "full";
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
      editToggle.textContent = "EDIT";

      render();
    }

    editToggle.addEventListener("click", () => {
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
      if (viewMode === "hints") result = getPassageHintsMask(passage);
      if (viewMode === "blanks") result = getPassageBlanksMask(passage);

      output.textContent = result;

      if (!isEditing) {
        Object.values(buttonGroup).forEach(b => b.classList.remove("active"));
        buttonGroup[viewMode].classList.add("active");
      }

      savePassageInLocalStorage();
    }

    function handleViewModeButtonClick(newMode) {
      viewMode = newMode;
      render();
    }

    input.addEventListener("input", render);

    loadPassageFromLocalStorage();