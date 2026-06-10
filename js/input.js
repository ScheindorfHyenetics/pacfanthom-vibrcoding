(() => {
  const P = window.PacFanthom;

  function focusStage() {
    P.dom.stage.focus({ preventScroll: true });
  }

  function setDirection(name) {
    if (!P.dirByName[name]) return;
    focusStage();
    P.state.queuedDir = P.dirByName[name];
  }

  function directionFromEvent(event) {
    const key = String(event.key || "").toLowerCase();
    const codeMap = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down",
      KeyA: "left",
      KeyD: "right",
      KeyW: "up",
      KeyS: "down",
      KeyQ: "left",
      KeyZ: "up"
    };
    const keyMap = {
      arrowleft: "left",
      arrowright: "right",
      arrowup: "up",
      arrowdown: "down",
      a: "left",
      d: "right",
      w: "up",
      s: "down",
      q: "left",
      z: "up"
    };
    return codeMap[event.code] || keyMap[key];
  }

  function setPaused(value) {
    const { state, dom } = P;
    state.paused = value;
    dom.pauseButton.setAttribute("aria-label", state.paused ? "Reprendre" : "Pause");
    dom.pauseButton.innerHTML = state.paused
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7Z"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14"/></svg>';
  }

  function bindInput() {
    const { dom, state } = P;
    document.addEventListener("keydown", (event) => {
      const direction = directionFromEvent(event);
      if (direction) {
        event.preventDefault();
        setDirection(direction);
      } else if (event.key === " ") {
        event.preventDefault();
        setPaused(!state.paused);
      }
    }, { capture: true });

    dom.padButtons.forEach((button) => {
      button.addEventListener("pointerdown", () => setDirection(button.dataset.dir));
    });

    dom.stage.addEventListener("pointerdown", focusStage);
    dom.pauseButton.addEventListener("click", () => setPaused(!state.paused));
    dom.restartButton.addEventListener("click", () => {
      state.lastPoints = 0;
      P.resetRound(true);
      P.updateHud();
    });
  }

  Object.assign(P, { focusStage, setDirection, directionFromEvent, setPaused, bindInput });
})();
