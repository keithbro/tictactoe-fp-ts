export enum Player {
  X = "X",
  O = "O",
}

export type Space = Player | undefined;

export type Spaces = [
  Space,
  Space,
  Space,
  Space,
  Space,
  Space,
  Space,
  Space,
  Space
];
