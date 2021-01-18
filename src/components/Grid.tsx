import { chunk } from "lodash";
import React, { useContext } from "react";
import styled from "styled-components";
import { GameContext } from "../GameContext";
import Row from "./Row";

const Container = styled.div`
  margin-top: 200px;
`;

export default function Grid() {
  const { spaces } = useContext(GameContext)!;
  const rows = chunk(spaces, 3);

  return (
    <Container>
      {rows.map((row, index) => (
        <Row key={index} spaces={row} />
      ))}
    </Container>
  );
}
