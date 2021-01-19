import React, { useState } from "react";
import styled from "styled-components";
import * as E from "fp-ts/lib/Either";

import Grid from "./components/Grid";
import { GameContext } from "./GameContext";
import * as Game from "./core/Game";
import { pipe } from "fp-ts/lib/pipeable";

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

function App() {
  const [game, setGame] = useState(() => Game.build());
  const restart = () => setGame(Game.build());

  const takeTurn = (index: number) => {
    if (!game.currentPlayer) return;

    pipe(
      index,
      (i) => Game.takeTurn(game, i),
      E.fold(({ message }) => console.warn(message), setGame)
    );
  };

  return (
    <Container>
      <GameContext.Provider value={{ spaces: game.board.spaces, takeTurn }}>
        <Grid />
        <Info>
          {game.currentPlayer && `Player Turn: ${game.currentPlayer.mark}`}
          {game.winner && `Winner: ${game.winner.mark}`}
          <div>
            <button onClick={restart}>Restart</button>
          </div>
        </Info>
      </GameContext.Provider>
    </Container>
  );
}

export default App;
