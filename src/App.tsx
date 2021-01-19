import React, { useState } from "react";
import styled from "styled-components";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import { uniq } from "lodash";

import Grid from "./components/Grid";
import { GameContext } from "./GameContext";
import { Spaces, Player } from "./types";
import { findMap } from "./util";

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Info = styled.div`
  align-items: center;
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

class SpaceAlreadyOccupiedError extends Error {}

type TakeTurnResult = {
  nextPlayer?: Player;
  spaces: Spaces;
  winner?: Player;
};

interface IValidateUnoccupied {
  (index: number): E.Either<SpaceAlreadyOccupiedError, number>;
}

interface IUpdateSpaces {
  (index: number): Spaces;
}

interface IMarkSpace {
  (index: number): E.Either<SpaceAlreadyOccupiedError, Spaces>;
}

interface IGetStatus {
  (spaces: Spaces): { nextPlayer?: Player; spaces: Spaces; winner?: Player };
}

const validateUnoccupied = (spaces: Spaces): IValidateUnoccupied => (
  index: number
) => {
  const space = spaces[index];

  return space
    ? E.left(new SpaceAlreadyOccupiedError(`Space ${index} already occupied!`))
    : E.right(index);
};

const updateSpaces = (spaces: Spaces, currentPlayer: Player): IUpdateSpaces => (
  index: number
) => {
  return [
    ...spaces.slice(0, index),
    currentPlayer,
    ...spaces.slice(index + 1),
  ] as Spaces;
};

const checkForWinner = (allSpaces: Spaces): O.Option<Player> => {
  const allWinningIndices = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 7],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8],
  ];

  const winner = findMap(allWinningIndices, (indicies) => {
    const spaces = indicies.map((i) => allSpaces[i]);
    if (spaces.includes(undefined)) return;

    const uniqueSpaces = uniq(spaces) as Player[];
    if (uniqueSpaces.length === 1) return uniqueSpaces[0];
  });

  return O.fromNullable(winner);
};

const markSpace = (spaces: Spaces, currentPlayer: Player): IMarkSpace => (
  index: number
) =>
  pipe(
    index,
    validateUnoccupied(spaces),
    E.map(updateSpaces(spaces, currentPlayer))
  );

const getNextPlayer = (
  currentPlayer: Player,
  spaces: Spaces
): O.Option<Player> => {
  if (!spaces.includes(undefined)) return O.none;

  return O.some(currentPlayer === Player.X ? Player.O : Player.X);
};

const getStatus = (currentPlayer: Player): IGetStatus => (spaces: Spaces) => {
  const winner = checkForWinner(spaces);
  if (O.isSome(winner))
    return { nextPlayer: undefined, spaces, winner: O.toUndefined(winner) };

  const nextPlayer = getNextPlayer(currentPlayer, spaces);
  return { nextPlayer: O.toUndefined(nextPlayer), spaces, winner: undefined };
};

const takeTurn = (
  index: number,
  spaces: Spaces,
  currentPlayer: Player
): E.Either<Error, TakeTurnResult> =>
  pipe(
    index,
    markSpace(spaces, currentPlayer),
    E.map(getStatus(currentPlayer))
  );

const emptySpaces = new Array(9).fill(undefined) as Spaces;

function App() {
  const [spaces, setSpaces] = useState<Spaces>(emptySpaces);

  const [currentPlayer, setCurrentPlayer] = useState<Player | undefined>(
    Player.X
  );
  const [winner, setWinner] = useState<Player | undefined>();

  const restart = () => {
    setCurrentPlayer(Player.X);
    setSpaces(emptySpaces);
    setWinner(undefined);
  };

  const setSpace = (index: number) => {
    if (!currentPlayer) return;

    const result = takeTurn(index, spaces, currentPlayer);

    if (E.isLeft(result)) {
      console.warn(result.left.message);
      return;
    }

    setCurrentPlayer(result.right.nextPlayer);
    setSpaces(result.right.spaces);
    setWinner(result.right.winner);
  };

  return (
    <Container>
      <GameContext.Provider value={{ spaces, setSpace }}>
        <Grid />
        <Info>
          {currentPlayer && `Player Turn: ${currentPlayer}`}
          {winner && `Winner: ${winner}`}
          <div>
            <button onClick={restart}>Restart</button>
          </div>
        </Info>
      </GameContext.Provider>
    </Container>
  );
}

export default App;
