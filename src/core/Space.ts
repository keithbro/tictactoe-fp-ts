import { Mark } from "../types";

export type Space = {
  mark?: Mark;
};

export const build = (mark?: Mark): Space => ({ mark });
