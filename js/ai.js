(() => {
  const P = window.PacFanthom;

  function distanceMap(fromX, fromY) {
    const distances = new Map();
    const queue = [{ x: fromX, y: fromY, d: 0 }];
    distances.set(P.cellKey(fromX, fromY), 0);

    for (let index = 0; index < queue.length; index++) {
      const current = queue[index];
      P.dirs.forEach((dir) => {
        const nx = current.x + dir.dx;
        const ny = current.y + dir.dy;
        const key = P.cellKey(nx, ny);
        if (!P.isOpen(nx, ny) || distances.has(key)) return;
        distances.set(key, current.d + 1);
        queue.push({ x: nx, y: ny, d: current.d + 1 });
      });
    }

    return distances;
  }

  function nearestPelletDistance(x, y) {
    const { state } = P;
    if (state.pellets.size === 0) return 0;
    const distances = distanceMap(x, y);
    let best = Infinity;
    for (const pellet of state.pellets.values()) {
      const distance = distances.get(P.cellKey(pellet.x, pellet.y));
      if (distance !== undefined && distance < best) best = distance;
    }
    return Number.isFinite(best) ? best : 40;
  }

  function nearestGhostDistance(x, y) {
    const distances = distanceMap(x, y);
    let best = Infinity;
    P.state.ghosts.forEach((ghost) => {
      const distance = distances.get(P.cellKey(ghost.x, ghost.y));
      if (distance !== undefined && distance < best) best = distance;
    });
    return Number.isFinite(best) ? best : 40;
  }

  function ghostThreat(x, y) {
    let threat = 0;
    P.state.ghosts.forEach((ghost) => {
      const distance = Math.abs(ghost.x - x) + Math.abs(ghost.y - y);
      if (distance === 0) threat += 120;
      if (distance === 1) threat += 32;
      if (distance === 2) threat += 9;
    });
    return threat;
  }

  function escapeOptions(x, y) {
    return P.dirs.filter((dir) => P.isOpen(x + dir.dx, y + dir.dy) && ghostThreat(x + dir.dx, y + dir.dy) < 32).length;
  }

  function choosePacmanDir() {
    const pacman = P.state.pacman;
    const choices = P.openDirs(pacman, false);
    const fallback = choices.length ? choices : P.openDirs(pacman, true);
    let best = fallback[0] || pacman.dir;
    let bestScore = -Infinity;

    fallback.forEach((dir) => {
      const nx = pacman.x + dir.dx;
      const ny = pacman.y + dir.dy;
      const danger = nearestGhostDistance(nx, ny);
      const food = nearestPelletDistance(nx, ny);
      const keepsGoing = dir.name === pacman.dir.name ? 0.6 : 0;
      const exits = escapeOptions(nx, ny);
      const closePenalty = danger <= 2 ? (3 - danger) * 12 : 0;
      const scoreValue = danger * 3.2 + exits * 2.1 - food * 0.74 + keepsGoing - closePenalty - ghostThreat(nx, ny) + Math.random() * 0.7;
      if (scoreValue > bestScore) {
        best = dir;
        bestScore = scoreValue;
      }
    });

    return best;
  }

  function targetForGhost(ghost) {
    const pacman = P.state.pacman;
    if (ghost.mood === "ambush") {
      const tx = pacman.x + pacman.dir.dx * 3;
      const ty = pacman.y + pacman.dir.dy * 3;
      if (P.isOpen(tx, ty)) return { x: tx, y: ty };
    }

    if (ghost.mood === "wander" && Math.random() < 0.32) {
      const open = [];
      P.state.map.forEach((row, y) => row.forEach((cell, x) => {
        if (cell !== "#") open.push({ x, y });
      }));
      return open[Math.floor(Math.random() * open.length)];
    }

    return { x: pacman.x, y: pacman.y };
  }

  function chooseGhostDir(ghost) {
    const choices = P.openDirs(ghost, false);
    const fallback = choices.length ? choices : P.openDirs(ghost, true);
    const target = targetForGhost(ghost);
    const distances = distanceMap(target.x, target.y);
    let best = fallback[0] || ghost.dir;
    let bestScore = Infinity;

    fallback.forEach((dir) => {
      const nx = ghost.x + dir.dx;
      const ny = ghost.y + dir.dy;
      const distance = distances.get(P.cellKey(nx, ny));
      const hesitation = ghost.player ? 0 : Math.random() * 1.15;
      const scoreValue = (distance ?? 99) + hesitation;
      if (scoreValue < bestScore) {
        best = dir;
        bestScore = scoreValue;
      }
    });

    return best;
  }

  Object.assign(P, { distanceMap, choosePacmanDir, chooseGhostDir });
})();
