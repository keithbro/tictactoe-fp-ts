export type Mark = "X" | "O";

export type Space = {
  index: number;
  mark?: Mark;
};

export type Player = {
  mark: Mark;
};
