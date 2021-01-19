import { useContext } from "react";
import styled from "styled-components";
import { GameContext } from "../GameContext";
import { Space } from "../types";

const Box = styled.div`
  align-items: center;
  border: 1px solid black;
  display: flex;
  height: 50px;
  justify-content: center;
  user-select: none;
  width: 50px;
`;

export default function SpaceComponent({
  space,
  index,
}: {
  space: Space;
  index: number;
}) {
  const { setSpace } = useContext(GameContext)!;

  const handleClick = () => setSpace(index);

  return <Box onClick={handleClick}>{space}</Box>;
}
