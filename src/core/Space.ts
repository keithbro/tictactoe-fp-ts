import * as O from "fp-ts/lib/Option";
import { Mark } from "../types";

export type Space = {
  mark: O.Option<Mark>;
};

export const build = (mark?: Mark): Space => ({ mark: O.fromNullable(mark) });
