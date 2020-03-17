window.onload = () => {
  const canvas = document.getElementById("board");
  const [rows, cols] = [120, 120];
  let [board, game] = make_game(rows, cols);
  const plot_game = make_plot_game(board, canvas);

  plot_game(board);
  setInterval(() => {
    plot_game(game());
  }, 500);
};