const DEATH = _ => 0;
const LIVE = _ => 1;

const survive = R.cond([
  [([cell, n]) => cell === 1 && (n === 2 || n == 3), LIVE],
  [(cell, n) => cell === 0 && n == 3, LIVE],
  [R.T, DEATH]
]);

const random_cell = R.pipe(
  Math.random,
  R.ifElse(R.gte(0.5))(LIVE)(DEATH)
);

const board = R.pipe(
  (width, height) => ([width, height, Array(width * height)]),
  ([width, height, data]) => ([width, height, R.map(random_cell, data)])
);

const access = ([width, height, data], [x, y]) => {
  if (x < 0)       return access([width, height, data], [width - 1, y]);
  if (x >= width)  return access([width, height, data], [0, y]);
  if (y < 0)       return access([width, height, data], [x, height - 1]);
  if (y >= height) return access([width, height, data], [x, 0]);
  return data[x + y * width];
};

const neighboards = R.pipe(
  (board, [x, y]) => ([(acc, [x, y]) => acc + access(board, [x, y]), [x, y]]),
  ([f, [x, y]]) => R.reduce(f, 0, [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x + 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1]
  ])
);

const next_state = ([width, height, data]) => R.pipe(
    _ => x => R.map(y => [x, y], R.range(0, height)),
    R.map(R.__, R.range(0, width)),
    R.unnest,
    R.map(point => ([neighboards([width, height, data], point), point])),
    R.map(([n, point]) => survive([access([width, height, data], point), n])),
    data => ([width, height, data])
)();

const make_game = (width, height) => {
  let b = board(width, height);
  return [b, _ => (b = next_state(b))];
};
