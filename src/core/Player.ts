import { Mark } from "../types";

export type Player = {
  mark: Mark;
};

export const build = (mark: Mark): Player => ({ mark });
