(() => {
  const P = window.PacFanthom;

  P.bindInput();
  P.resetRound(true);
  P.focusStage();
  P.state.tickTimer = window.setInterval(P.tick, P.TICK_MS);
})();
