import { ReactNode, useReducer } from "react";
import { wmReducer, initialWMState } from "./wm.reducer";
import { WindowManagerContext } from "./WindowContext";

export function WindowManager({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(wmReducer, initialWMState);

    return (
        <WindowManagerContext.Provider value={{ state, dispatch }}>
            {children}
        </WindowManagerContext.Provider>
    );
}