import { useContext } from "react";
import styled from "styled-components";
import { GameContext } from "../GameContext";
import { Space } from "../types";

const Box = styled.div`
  border: 1px solid black;
  width: 50px;
  height: 50px;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function SpaceComponent({ space }: { space: Space }) {
  const { setSpace } = useContext(GameContext)!;

  const handleClick = () => setSpace(space.index);

  return <Box onClick={handleClick}>{space.mark}</Box>;
}
