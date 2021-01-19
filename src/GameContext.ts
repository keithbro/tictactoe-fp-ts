import { createContext } from "react";
import { Space } from "./types";

type ContextProps = {
  setSpace: (index: number) => void;
  spaces: Array<Space>;
};

export const GameContext = createContext<ContextProps | undefined>(undefined);
