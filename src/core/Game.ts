import * as Board from "./Board";
import * as Player from "./Player";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { Mark } from "../types";
import { pipe } from "fp-ts/lib/function";

export type Game = {
  board: Board.Board;
  currentPlayer?: Player.Player;
  playerOne: Player.Player;
  playerTwo: Player.Player;
  winner?: Player.Player;
};

export const build = (): Game => {
  const playerOne = Player.build(Mark.X);
  const playerTwo = Player.build(Mark.O);
  const board = Board.build();

  return {
    currentPlayer: playerOne,
    playerOne,
    playerTwo,
    board,
  };
};

export const takeTurn = (game: Game, index: number): E.Either<Error, Game> => {
  if (!game.currentPlayer) throw new Error();
  return pipe(
    index,
    Board.markSpace(game.board, game.currentPlayer), // returns new board
    E.map(setupNewTurn(game))
  );
};

const getNextPlayer = (game: Game): O.Option<Player.Player> => {
  if (!game.currentPlayer) return O.none;

  const { spaces } = game.board;

  if (!spaces.map((s) => s.mark).includes(undefined)) return O.none;

  return O.some(
    game.currentPlayer.mark === Mark.X ? game.playerTwo : game.playerOne
  );
};

const setupNewTurn = (game: Game) => (board: Board.Board): Game => {
  const winner = Board.checkForWinner(board);
  console.log({ winner });
  if (O.isSome(winner))
    return {
      ...game,
      currentPlayer: undefined,
      board,
      winner: O.toUndefined(winner),
    };

  const nextPlayer = getNextPlayer(game);

  return {
    ...game,
    currentPlayer: O.toUndefined(nextPlayer),
    board,
    winner: undefined,
  };
};
