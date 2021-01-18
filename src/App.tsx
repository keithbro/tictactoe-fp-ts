import React, { useState } from "react";
import styled from "styled-components";
import "./App.css";
import Grid from "./components/Grid";
import { GameContext } from "./GameContext";
import { Player, Space } from "./types";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

function App() {
  const [spaces, setSpaces] = useState<Space[]>([
    { index: 0 },
    { index: 1 },
    { index: 2 },
    { index: 3 },
    { index: 4 },
    { index: 5 },
    { index: 6 },
    { index: 7 },
    { index: 8 },
  ]);
  const players: Player[] = [{ mark: "X" }, { mark: "O" }];
  const [currentPlayer, setCurrentPlayer] = useState<Player>(players[0]);

  const setSpace = (index: number) => {
    const newSpaces = [...spaces];
    newSpaces[index].mark = currentPlayer.mark;

    const nextPlayer =
      currentPlayer.mark === players[0].mark ? players[1] : players[0];

    setSpaces(newSpaces);
    setCurrentPlayer(nextPlayer);
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
