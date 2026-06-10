(() => {
  const P = window.PacFanthom;

  function parseMap() {
    const starts = {};
    const clean = P.rawMap.map((row, y) => row.split("").map((cell, x) => {
      if ("PGABC".includes(cell)) {
        starts[cell] = { x, y };
        return " ";
      }
      return cell;
    }));

    return { clean, starts };
  }

  function cellKey(x, y) {
    return `${x},${y}`;
  }

  function isWall(x, y) {
    const map = P.state.map;
    return y < 0 || y >= map.length || x < 0 || x >= map[0].length || map[y][x] === "#";
  }

  function isOpen(x, y) {
    return !isWall(x, y);
  }

  function openDirs(entity, keepReverse = true) {
    return P.dirs.filter((dir) => {
      const blockedReverse = !keepReverse && entity.dir && P.reverse[entity.dir.name] === dir.name;
      return !blockedReverse && isOpen(entity.x + dir.dx, entity.y + dir.dy);
    });
  }

  Object.assign(P, { parseMap, cellKey, isWall, isOpen, openDirs });
})();
