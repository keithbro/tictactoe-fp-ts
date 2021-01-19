import * as A from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { eqString } from "fp-ts/lib/Eq";

import { Player } from "./Player";
import * as Space from "./Space";
import { Mark } from "../types";

export type Spaces = [
  Space.Space,
  Space.Space,
  Space.Space,
  Space.Space,
  Space.Space,
  Space.Space,
  Space.Space,
  Space.Space,
  Space.Space
];

export type Board = {
  spaces: Spaces;
};

export const build = () => ({
  spaces: A.makeBy(9, () => Space.build()) as Spaces,
});

class SpaceAlreadyOccupiedError extends Error {}

export const markSpace = (board: Board, player: Player) => (
  index: number
): E.Either<Error, Board> =>
  pipe(index, validateUnoccupied(board), E.map(update(board, player)));

const allWinningIndices = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 4, 6],
  [2, 5, 8],
  [3, 4, 5],
  [6, 7, 8],
];

const update = (board: Board, player: Player) => (index: number): Board => {
  return {
    spaces: [
      ...board.spaces.slice(0, index),
      Space.build(player.mark),
      ...board.spaces.slice(index + 1),
    ] as Spaces,
  };
};

export const checkForWinner = (board: Board): O.Option<Player> =>
  pipe(allWinningIndices, A.findFirstMap(checkForWinnerSingle(board)));

const checkMarksForWinner = (marks: Mark[]): O.Option<Player> => {
  if (marksPresent(marks) === 3 && allMarksEqual(marks))
    return O.some({ mark: marks[0] });

  return O.none;
};

const getMarks = (board: Board) =>
  A.filterMap<number, Mark>((i) => O.fromNullable(board.spaces[i].mark));

const marksPresent = (marks: Mark[]): number => marks.length;

const allMarksEqual = (marks: Mark[]): boolean =>
  A.uniq(eqString)(marks).length === 1;

const checkForWinnerSingle = (board: Board) => (
  indicies: number[]
): O.Option<Player> => pipe(indicies, getMarks(board), checkMarksForWinner);

const validateUnoccupied = (board: Board) => (
  index: number
): E.Either<Error, number> => {
  const space = board.spaces[index];

  return space.mark
    ? E.left(new SpaceAlreadyOccupiedError(`Space ${index} already occupied!`))
    : E.right(index);
};
