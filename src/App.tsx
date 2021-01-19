import React, { useState } from "react";
import styled from "styled-components";
import Grid from "./components/Grid";
import { GameContext } from "./GameContext";
import { Player, Spaces, Mark } from "./types";
import { left, right, Either, isRight } from "fp-ts/lib/Either";

const Container = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`;

class SpaceAlreadyOccupiedError extends Error {}

type MarkSpaceResult = {
  spaces: Spaces;
  nextPlayer: Player;
};

const playerOne: Player = { mark: Mark.X };
const playerTwo: Player = { mark: Mark.O };

const markSpace = (
  index: number,
  spaces: Spaces,
  currentPlayer: Player
): Either<Error, MarkSpaceResult> => {
  const space = spaces[index];
  if (space) return left(new SpaceAlreadyOccupiedError());

  const nextPlayer =
    currentPlayer.mark === playerOne.mark ? playerTwo : playerOne;

  spaces[index] = currentPlayer.mark;

  return right({ spaces, nextPlayer });
};

function App() {
  const [spaces, setSpaces] = useState<Spaces>(
    new Array(9).fill(undefined) as Spaces
  );

  const [currentPlayer, setCurrentPlayer] = useState<Player>(playerOne);

  const setSpace = (index: number) => {
    const result = markSpace(index, spaces, currentPlayer);

    if (isRight(result)) {
      setSpaces(result.right.spaces);
      setCurrentPlayer(result.right.nextPlayer);
    }
  };

  return (
    <Container>
      <GameContext.Provider value={{ spaces, setSpace }}>
        <Grid />
      </GameContext.Provider>
    </Container>
  );
}

export default App;
