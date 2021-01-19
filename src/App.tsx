import React, { useState } from "react";
import styled from "styled-components";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";

import Grid from "./components/Grid";
import { GameContext } from "./GameContext";
import * as Game from "./core/Game";
import { Player } from "./core/Player";

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

const infoString = (player: O.Option<Player>, prefix: string) =>
  pipe(
    player,
    O.fold(
      () => null,
      ({ mark }) => `${prefix}: ${mark}`
    )
  );

function App() {
  const [game, setGame] = useState(() => Game.build());
  const restart = () => setGame(Game.build());

  const takeTurn = (index: number) => {
    if (O.isNone(game.currentPlayer)) return;

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
          {infoString(game.currentPlayer, `Player Turn`)}
          {infoString(game.winner, `Winner`)}
          <div>
            <button onClick={restart}>Restart</button>
          </div>
        </Info>
      </GameContext.Provider>
    </Container>
  );
}

export default App;
