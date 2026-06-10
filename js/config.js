(() => {
  const P = window.PacFanthom = window.PacFanthom || {};
  const SVG_NS = "http://www.w3.org/2000/svg";
  const TILE = 24;
  const TICK_MS = 118;

  const rawMap = [
    "#####################",
    "#.........#.........#",
    "#.###.###.#.###.###.#",
    "#.#.....#...#.....#.#",
    "#.#.###.#####.###.#.#",
    "#.....#...#...#.....#",
    "#####.###.#.###.#####",
    "#.........P.........#",
    "#.###.#.#####.#.###.#",
    "#.....#...#...#.....#",
    "###.#####.#.#####.###",
    "#.....#..ABC..#.....#",
    "#.###.#.#####.#.###.#",
    "#...#.....G.....#...#",
    "#.###.#.#####.#.###.#",
    "#.....#...#...#.....#",
    "###.#####.#.#####.###",
    "#.....#.......#.....#",
    "#.###.#.#####.#.###.#",
    "#.#.....#...#.....#.#",
    "#.###.###.#.###.###.#",
    "#.........#.........#",
    "#####################"
  ];

  const dirs = [
    { name: "left", dx: -1, dy: 0 },
    { name: "right", dx: 1, dy: 0 },
    { name: "up", dx: 0, dy: -1 },
    { name: "down", dx: 0, dy: 1 }
  ];

  const dirByName = Object.fromEntries(dirs.map((dir) => [dir.name, dir]));
  const reverse = { left: "right", right: "left", up: "down", down: "up" };

  Object.assign(P, { SVG_NS, TILE, TICK_MS, rawMap, dirs, dirByName, reverse });
})();
