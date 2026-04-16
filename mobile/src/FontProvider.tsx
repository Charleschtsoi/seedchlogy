import { createContext, useContext, type ReactNode } from "react";
import { useAppFonts } from "./fonts";

const Ctx = createContext(false);

export function FontProvider({ children }: { children: ReactNode }) {
  const loaded = useAppFonts();
  return <Ctx.Provider value={loaded}>{children}</Ctx.Provider>;
}

export function useFontsLoaded() {
  return useContext(Ctx);
}
