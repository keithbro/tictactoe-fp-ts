import styled from "styled-components";
import { Space } from "../types";
import SpaceComponent from "./Space";

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export default function Row({ spaces }: { spaces: Space[] }) {
  return (
    <StyledRow>
      {spaces.map((space) => (
        <SpaceComponent key={space.index} space={space} />
      ))}
    </StyledRow>
  );
}
