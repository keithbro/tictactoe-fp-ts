import React, { useState } from "react";
import styled from "styled-components";
import Grid from "./components/Grid";
import { GameContext } from "./GameContext";
import { Player, Spaces, Mark } from "./types";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Info = styled.div`
  margin: 10px;
`;

class SpaceAlreadyOccupiedError extends Error {}

type TakeTurnResult = {
  spaces: Spaces;
  nextPlayer?: Player;
};

const playerOne: Player = { mark: Mark.X };
const playerTwo: Player = { mark: Mark.O };

const markSpace = (
  index: number,
  spaces: Spaces,
  currentPlayer: Player
): E.Either<SpaceAlreadyOccupiedError, Spaces> => {
  const space = spaces[index];
  if (space)
    return E.left(
      new SpaceAlreadyOccupiedError(`Space ${index} already occupied!`)
    );

  spaces[index] = currentPlayer.mark;

  return E.right(spaces);
};

const checkForWinner = (spaces: Spaces): O.Option<Player> => {
  console.log({ spaces });
  return O.none;
};

const takeTurn = (
  index: number,
  spaces: Spaces,
  currentPlayer: Player
): E.Either<Error, TakeTurnResult> => {
  const result = markSpace(index, spaces, currentPlayer);

  if (E.isLeft(result)) return E.left(result.left);

  const { right: newSpaces } = result;

  const winner = checkForWinner(newSpaces);
  if (O.isSome(winner)) return E.right({ spaces: newSpaces });

  const nextPlayer =
    currentPlayer.mark === playerOne.mark ? playerTwo : playerOne;

  return E.right({ spaces: result.right, nextPlayer });
};

function App() {
  const [spaces, setSpaces] = useState<Spaces>(
    new Array(9).fill(undefined) as Spaces
  );

  const [currentPlayer, setCurrentPlayer] = useState<Player>(playerOne);

  const setSpace = (index: number) => {
    const result = takeTurn(index, spaces, currentPlayer);

    if (E.isLeft(result)) {
      console.warn(result.left.message);
      return;
    }

    setSpaces(result.right.spaces);

    if (result.right.nextPlayer) setCurrentPlayer(result.right.nextPlayer);
  };

  return (
    <Container>
      <GameContext.Provider value={{ spaces, setSpace }}>
        <Grid />
        <Info>Player Turn: {currentPlayer.mark}</Info>
      </GameContext.Provider>
    </Container>
  );
}

export default App;
