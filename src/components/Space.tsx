import { useContext } from "react";
import styled from "styled-components";
import { Space } from "../core/Space";
import { GameContext } from "../GameContext";

type BoxProps = {
  available: boolean;
};

const Box = styled.div<BoxProps>`
  align-items: center;
  border: 1px solid black;
  display: flex;
  height: 50px;
  justify-content: center;
  user-select: none;
  width: 50px;

  &:hover {
    background-color: ${(props) =>
      props.available ? "lightblue" : "transparent"};
  }
`;

export default function SpaceComponent({
  space,
  index,
}: {
  space: Space;
  index: number;
}) {
  const { takeTurn } = useContext(GameContext)!;

  const handleClick = () => takeTurn(index);

  return (
    <Box onClick={handleClick} available={!space.mark}>
      {space.mark}
    </Box>
  );
}
