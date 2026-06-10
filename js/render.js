(() => {
  const P = window.PacFanthom;

  function svgEl(tag, attrs = {}) {
    const el = document.createElementNS(P.SVG_NS, tag);
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, value);
    }
    return el;
  }

  function renderBoard() {
    const { state, dom } = P;
    dom.game.replaceChildren();
    dom.game.setAttribute("viewBox", `0 0 ${P.rawMap[0].length * P.TILE} ${P.rawMap.length * P.TILE}`);

    const bg = svgEl("rect", {
      width: P.rawMap[0].length * P.TILE,
      height: P.rawMap.length * P.TILE,
      rx: 8,
      fill: "var(--maze)"
    });
    dom.game.append(bg);

    const wallLayer = svgEl("g");
    state.pelletLayer = svgEl("g");
    state.entityLayer = svgEl("g");

    state.map.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === "#") {
          wallLayer.append(svgEl("rect", {
            class: "wall",
            x: x * P.TILE + 1.5,
            y: y * P.TILE + 1.5,
            width: P.TILE - 3,
            height: P.TILE - 3,
            rx: 5
          }));
        }
      });
    });

    dom.game.append(wallLayer, state.pelletLayer, state.entityLayer);
    drawPellets();
  }

  function drawPellets() {
    const { state } = P;
    state.pelletLayer.replaceChildren();
    for (const pellet of state.pellets.values()) {
      const power = (pellet.x === 1 && pellet.y === 1)
        || (pellet.x === P.rawMap[0].length - 2 && pellet.y === 1)
        || (pellet.x === 1 && pellet.y === P.rawMap.length - 2)
        || (pellet.x === P.rawMap[0].length - 2 && pellet.y === P.rawMap.length - 2);

      state.pelletLayer.append(svgEl("circle", {
        class: power ? "power-pellet" : "pellet",
        cx: pellet.x * P.TILE + P.TILE / 2,
        cy: pellet.y * P.TILE + P.TILE / 2,
        r: power ? 4.2 : 2.45
      }));
    }
  }

  function renderEntities() {
    const { state } = P;
    state.entityLayer.replaceChildren();
    state.pacman.group = makePacman();
    state.entityLayer.append(state.pacman.group);
    state.ghosts.forEach((ghost) => {
      ghost.group = makeGhost(ghost);
      state.entityLayer.append(ghost.group);
    });
    updateEntityPositions();
  }

  function makeGhost(ghost) {
    const group = svgEl("g", { class: "entity" });
    if (ghost.player) {
      group.append(svgEl("circle", {
        class: "player-ring",
        cx: P.TILE / 2,
        cy: P.TILE / 2,
        r: 11.3
      }));
    }

    group.append(svgEl("path", {
      class: "ghost-body",
      fill: ghost.color,
      d: "M5 20V11.2C5 5.9 8.8 2.6 12 2.6s7 3.3 7 8.6V20l-3-2.7L13.7 20 12 18.2 10.3 20 8 17.3 5 20Z"
    }));

    group.append(svgEl("circle", { class: "ghost-eye", cx: 9, cy: 10.4, r: 3 }));
    group.append(svgEl("circle", { class: "ghost-eye", cx: 15, cy: 10.4, r: 3 }));
    group.append(svgEl("circle", { class: "ghost-pupil", cx: 10, cy: 10.8, r: 1.25 }));
    group.append(svgEl("circle", { class: "ghost-pupil", cx: 16, cy: 10.8, r: 1.25 }));

    if (ghost.player) {
      group.append(svgEl("path", {
        class: "crown",
        d: "M7 5.6 9.2 1.7 12 5.2 14.8 1.7 17 5.6v2.5H7Z"
      }));
    }

    return group;
  }

  function makePacman() {
    const group = svgEl("g", { class: "entity" });
    group.append(svgEl("path", { class: "pacman" }));
    group.append(svgEl("circle", { cx: 12, cy: 6.4, r: 1.25, fill: "#2b1e00" }));
    return group;
  }

  function pacmanPath(dir, open) {
    const mouth = open ? Math.PI / 5.1 : Math.PI / 14;
    const angleByDir = {
      right: 0,
      down: Math.PI / 2,
      left: Math.PI,
      up: -Math.PI / 2
    };
    const facing = angleByDir[dir.name];
    const start = facing + mouth;
    const end = facing + Math.PI * 2 - mouth;
    const r = 9.4;
    const cx = P.TILE / 2;
    const cy = P.TILE / 2;
    const sx = cx + Math.cos(start) * r;
    const sy = cy + Math.sin(start) * r;
    const ex = cx + Math.cos(end) * r;
    const ey = cy + Math.sin(end) * r;
    return `M ${cx} ${cy} L ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 1 1 ${ex.toFixed(2)} ${ey.toFixed(2)} Z`;
  }

  function updateEntityPositions() {
    const { state } = P;
    const all = [state.pacman, ...state.ghosts];
    all.forEach((entity) => {
      entity.group.setAttribute("transform", `translate(${entity.x * P.TILE}, ${entity.y * P.TILE})`);
    });
    state.pacman.group.querySelector(".pacman").setAttribute("d", pacmanPath(state.pacman.dir, state.mouthOpen));
  }

  function updateHud() {
    const { state, dom } = P;
    dom.score.textContent = state.score;
    dom.round.textContent = state.round;
    dom.last.textContent = state.lastPoints > 0 ? `+${state.lastPoints}` : "0";
  }

  Object.assign(P, { svgEl, renderBoard, drawPellets, renderEntities, updateEntityPositions, updateHud });
})();
