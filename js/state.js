(() => {
  const P = window.PacFanthom;

  P.state = {
    map: null,
    pellets: null,
    pelletLayer: null,
    entityLayer: null,
    pacman: null,
    player: null,
    ghosts: null,
    score: 0,
    round: 1,
    lastPoints: 0,
    queuedDir: P.dirByName.left,
    tickTimer: 0,
    roundActive: true,
    paused: false,
    mouthOpen: true,
    stepCount: 0
  };
})();
