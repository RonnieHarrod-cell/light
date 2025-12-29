import { createContext, useContext } from "react";
import { WMAction } from "./wm.actions";
import { WMState } from "./wm.types";

export const WindowManagerContext = createContext<{
    state: WMState,
    dispatch: React.Dispatch<WMAction>;
} | null>(null);

export function useWindowManager() {
    const ctx = useContext(WindowManagerContext);
    if (!ctx) {
        throw new Error("useWindowManager must be used inside WindowManager");
    }
    return ctx;
}