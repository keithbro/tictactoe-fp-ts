import { createContext } from "react";
import { Space } from "./core/Space";

type ContextProps = {
  takeTurn: (index: number) => void;
  spaces: Space[];
};

export const GameContext = createContext<ContextProps | undefined>(undefined);
