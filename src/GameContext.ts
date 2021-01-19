import { createContext } from "react";
import { Spaces } from "./core/Board";

type ContextProps = {
  takeTurn: (index: number) => void;
  spaces: Spaces;
};

export const GameContext = createContext<ContextProps | undefined>(undefined);
