import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";

import * as Board from "./Board";
import * as Player from "./Player";
import { Mark } from "../types";

export type Game = {
  board: Board.Board;
  currentPlayer: O.Option<Player.Player>;
  playerOne: Player.Player;
  playerTwo: Player.Player;
  winner?: Player.Player;
};

export const build = (): Game => {
  const playerOne = Player.build(Mark.X);
  const playerTwo = Player.build(Mark.O);
  const board = Board.build();

  return {
    currentPlayer: O.some(playerOne),
    playerOne,
    playerTwo,
    board,
  };
};

export const takeTurn = (
  game: Game,
  index: number
): E.Either<Board.SpaceAlreadyOccupiedError, Game> => {
  if (O.isNone(game.currentPlayer)) throw new Error();

  return pipe(
    index,
    Board.markSpace(game.board, game.currentPlayer.value),
    E.map(setupNewTurn(game))
  );
};

const togglePlayer = (game: Game) => (player: Player.Player): Player.Player =>
  player.mark === Mark.X ? game.playerTwo : game.playerOne;

const getNextPlayer = (game: Game): O.Option<Player.Player> =>
  pipe(
    game.currentPlayer,
    O.chain(O.fromPredicate(() => Board.spacesRemain(game.board))),
    O.map(togglePlayer(game))
  );

const setupNewTurn = (game: Game) => (board: Board.Board): Game => {
  return pipe(
    board,
    Board.checkForWinner,
    O.fold<Player.Player, Game>(
      () =>
        pipe(game, getNextPlayer, (nextPlayer) => ({
          ...game,
          board,
          currentPlayer: nextPlayer,
          winner: undefined,
        })),
      (winner) => ({ ...game, board, currentPlayer: O.none, winner })
    )
  );
};
