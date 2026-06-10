(() => {
  const P = window.PacFanthom;

  function resetRound(showStart = false) {
    const parsed = P.parseMap();
    const { state, dom } = P;
    state.map = parsed.clean;
    state.pellets = new Map();
    state.queuedDir = P.dirByName.left;
    state.roundActive = true;
    state.mouthOpen = true;
    state.stepCount = 0;

    state.map.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === ".") {
          state.pellets.set(P.cellKey(x, y), { x, y });
        }
      });
    });

    state.pacman = {
      type: "pacman",
      id: "pacman",
      x: parsed.starts.P.x,
      y: parsed.starts.P.y,
      dir: P.dirByName.left,
      group: null
    };

    state.player = {
      type: "ghost",
      id: "player",
      name: "Spectre bleu",
      color: "var(--player)",
      x: parsed.starts.G.x,
      y: parsed.starts.G.y,
      dir: P.dirByName.left,
      player: true,
      group: null
    };

    state.ghosts = [
      state.player,
      {
        type: "ghost",
        id: "red",
        name: "Rouge",
        color: "var(--red)",
        x: parsed.starts.A.x,
        y: parsed.starts.A.y,
        dir: P.dirByName.right,
        mood: "direct",
        stride: 3,
        phase: 0,
        group: null
      },
      {
        type: "ghost",
        id: "pink",
        name: "Rose",
        color: "var(--pink)",
        x: parsed.starts.B.x,
        y: parsed.starts.B.y,
        dir: P.dirByName.up,
        mood: "ambush",
        stride: 3,
        phase: 1,
        group: null
      },
      {
        type: "ghost",
        id: "orange",
        name: "Orange",
        color: "var(--orange)",
        x: parsed.starts.C.x,
        y: parsed.starts.C.y,
        dir: P.dirByName.down,
        mood: "wander",
        stride: 4,
        phase: 2,
        group: null
      }
    ];

    P.renderBoard();
    P.renderEntities();
    P.updateHud();
    dom.overlay.classList.toggle("visible", showStart);
    if (showStart) {
      dom.resultTitle.textContent = "Chasse ouverte";
      dom.resultDetail.textContent = "Manche " + state.round;
      setTimeout(() => dom.overlay.classList.remove("visible"), 720);
    }
  }

  function moveEntity(entity, dir) {
    if (!dir || !P.isOpen(entity.x + dir.dx, entity.y + dir.dy)) return false;
    entity.x += dir.dx;
    entity.y += dir.dy;
    entity.dir = dir;
    return true;
  }

  function movePlayer() {
    const { state } = P;
    if (moveEntity(state.player, state.queuedDir)) return;
    moveEntity(state.player, state.player.dir);
  }

  function collectPellet() {
    const { state } = P;
    const key = P.cellKey(state.pacman.x, state.pacman.y);
    if (!state.pellets.has(key)) return;
    state.pellets.delete(key);
    P.drawPellets();
    if (state.pellets.size === 0) {
      finishRound("pacman");
    }
  }

  function findCatcher() {
    const { state } = P;
    if (state.player.x === state.pacman.x && state.player.y === state.pacman.y) return state.player;
    return state.ghosts.find((ghost) => !ghost.player && ghost.x === state.pacman.x && ghost.y === state.pacman.y);
  }

  function checkCatch() {
    const catcher = findCatcher();
    if (!catcher) return false;
    finishRound(catcher.player ? "player" : "other", catcher);
    return true;
  }

  function finishRound(result, catcher = null) {
    const { state, dom } = P;
    if (!state.roundActive) return;
    state.roundActive = false;
    if (result === "player") {
      state.lastPoints = 10;
      dom.resultTitle.textContent = "Capture directe";
      dom.resultDetail.textContent = "+10 points";
    } else if (result === "other") {
      state.lastPoints = 5;
      dom.resultTitle.textContent = `${catcher.name} attrape Pacman`;
      dom.resultDetail.textContent = "+5 points";
    } else {
      state.lastPoints = 0;
      dom.resultTitle.textContent = "Pacman nettoie le labyrinthe";
      dom.resultDetail.textContent = "0 point";
    }

    state.score += state.lastPoints;
    state.round += 1;
    P.updateHud();
    dom.overlay.classList.add("visible");
    window.setTimeout(() => {
      dom.overlay.classList.remove("visible");
      resetRound();
    }, 1250);
  }

  function tick() {
    const { state } = P;
    if (!state.roundActive || state.paused) return;
    state.stepCount += 1;
    state.mouthOpen = !state.mouthOpen;
    movePlayer();
    checkCatch();
    if (!state.roundActive) {
      P.updateEntityPositions();
      return;
    }

    moveEntity(state.pacman, P.choosePacmanDir());
    collectPellet();
    checkCatch();
    if (!state.roundActive) {
      P.updateEntityPositions();
      return;
    }

    state.ghosts.filter((ghost) => !ghost.player && shouldMoveRival(ghost)).forEach((ghost) => {
      moveEntity(ghost, P.chooseGhostDir(ghost));
    });
    checkCatch();
    P.updateEntityPositions();
  }

  function shouldMoveRival(ghost) {
    return (P.state.stepCount + ghost.phase) % ghost.stride !== 0;
  }

  Object.assign(P, { resetRound, moveEntity, tick });
})();
