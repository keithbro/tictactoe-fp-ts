import React, { useContext } from "react";
import styled from "styled-components";
import { GameContext } from "../GameContext";
import SpaceComponent from "./Space";

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  margin-top: 100px;
`;

export default function Grid() {
  const { spaces } = useContext(GameContext)!;

  return (
    <StyledGrid>
      {spaces.map((space, index) => (
        <SpaceComponent key={index} space={space} index={index} />
      ))}
    </StyledGrid>
  );
}
