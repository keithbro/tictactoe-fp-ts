import * as A from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { eqString } from "fp-ts/lib/Eq";

import * as Player from "./Player";
import * as Space from "./Space";
import { Mark } from "../types";

export type Board = {
  spaces: Space.Space[];
};

export const build = () => ({
  spaces: A.makeBy(9, () => Space.build()),
});

export class OutOfBoundsError extends Error {}
export class SpaceAlreadyOccupiedError extends Error {}

export const markSpace = (board: Board, player: Player.Player) => (
  index: number
): E.Either<Error, Board> =>
  pipe(index, validateUnoccupied(board), E.chain(update(board, player)));

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

const update = (board: Board, player: Player.Player) => (
  index: number
): E.Either<Error, Board> =>
  pipe(
    board.spaces,
    A.updateAt(index, Space.build(player.mark)),
    E.fromOption(() => new OutOfBoundsError()),
    E.map((spaces) => ({ spaces }))
  );

export const checkForWinner = (board: Board): O.Option<Player.Player> =>
  pipe(allWinningIndices, A.findFirstMap(checkForWinnerSingle(board)));

export const spacesRemain = (board: Board): boolean =>
  board.spaces.map((s) => s.mark).includes(undefined);

const checkEnoughMarks = O.fromPredicate((marks: Mark[]) => marks.length === 3);

const checkAllMarksEqual = O.fromPredicate((marks: Mark[]) =>
  pipe(marks, A.uniq(eqString), (arr) => arr.length === 1)
);

const checkMarksForWinner = (marks: Mark[]): O.Option<Player.Player> =>
  pipe(
    marks,
    checkEnoughMarks,
    O.chain(checkAllMarksEqual),
    O.chain(A.head),
    O.map(Player.build)
  );

const getMarks = (board: Board) =>
  A.filterMap<number, Mark>((i) => O.fromNullable(board.spaces[i].mark));

const checkForWinnerSingle = (board: Board) => (
  indicies: number[]
): O.Option<Player.Player> =>
  pipe(indicies, getMarks(board), checkMarksForWinner);

const validateUnoccupied = (board: Board) => (
  index: number
): E.Either<Error, number> =>
  pipe(
    index,
    E.fromPredicate(
      (index) => !board.spaces[index].mark,
      () => new SpaceAlreadyOccupiedError(`Space ${index} already occupied!`)
    )
  );
