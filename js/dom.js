(() => {
  const P = window.PacFanthom;

  P.dom = {
    stage: document.querySelector("#stage"),
    game: document.querySelector("#game"),
    score: document.querySelector("#score"),
    round: document.querySelector("#round"),
    last: document.querySelector("#last"),
    overlay: document.querySelector("#overlay"),
    resultTitle: document.querySelector("#result-title"),
    resultDetail: document.querySelector("#result-detail"),
    pauseButton: document.querySelector("#pause"),
    restartButton: document.querySelector("#restart"),
    padButtons: document.querySelectorAll(".pad-button")
  };
})();
