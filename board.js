const make_death_color = (ctx) => () => (ctx.fillStyle = "#000");

const make_live_color = (ctx) => () => (ctx.fillStyle = "#FFF");

const make_cell = (board, canvas, ctx) => {
  const [cols, rows, _] = board;
  const width = canvas.width / cols;
  const height = canvas.height / rows;
  const live_color = make_live_color(ctx);
  const death_color = make_death_color(ctx);

  return (value, [x, y]) => {
    value? live_color(): death_color();
    const canvas_x = x * width;
    const canvas_y = y * height;
    ctx.fillRect(canvas_x, canvas_y, width, height);
  };
};

const make_plot_game = (board, canvas) => {
  const ctx = canvas.getContext('2d');
  const plot_cell = make_cell(board, canvas, ctx);
  const [cols, rows, _] = board;
  const coords = R.unnest(R.map(x => R.map(y => [x, y], R.range(0, rows)), R.range(0, cols)));

  return (board) => R.map(([x, y]) => {
    const value = access(board, [x, y]);
    plot_cell(value, [x, y]);
  }, coords);
};