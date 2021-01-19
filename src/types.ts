export enum Mark {
  X = "X",
  O = "O",
}

export type Space = Mark | undefined;

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

export type Player = {
  mark: Mark;
};
