import { WMState } from "./wm.types";
import { WMAction } from "./wm.actions";

export const initialWMState: WMState = {
    windows: [],
    focusedId: null,
    nextZ: 1
};

export function wmReducer(state: WMState, action: WMAction): WMState {
    switch (action.type) {
        case "OPEN_WINDOW":
            return {
                ...state,
                windows: [
                    ...state.windows,
                    { ...action.window, z: state.nextZ }
                ],
                focusedId: action.window.id,
                nextZ: state.nextZ + 1
            };

        case "CLOSE_WINDOW":
            return {
                ...state,
                windows: state.windows.filter(w => w.id !== action.id),
                focusedId:
                    state.focusedId === action.id ? null : state.focusedId
            };

        case "FOCUS_WINDOW":
            return {
                ...state,
                windows: state.windows.map(w =>
                    w.id === action.id
                        ? { ...w, z: state.nextZ, minimized: false }
                        : w
                ),
                focusedId: action.id,
                nextZ: state.nextZ + 1
            };

        case "MOVE_WINDOW":
            return {
                ...state,
                windows: state.windows.map(w =>
                    w.id === action.id
                        ? { ...w, rect: action.rect, snap: "none" }
                        : w
                )
            };

        case "RESIZE_WINDOW":
            return {
                ...state,
                windows: state.windows.map(w =>
                    w.id === action.id
                        ? { ...w, rect: action.rect }
                        : w
                )
            };

        case "SNAP_WINDOW":
            return {
                ...state,
                windows: state.windows.map(w =>
                    w.id === action.id
                        ? {
                            ...w,
                            restoreRect: w.snap === "none" ? w.rect : w.restoreRect,
                            rect: action.rect,
                            snap: action.snap
                        }
                        : w
                )
            };

        case "MAXIMIZE_WINDOW":
            return {
                ...state,
                windows: state.windows.map(w =>
                    w.id === action.id
                        ? {
                            ...w,
                            restoreRect: w.rect,
                            rect: action.rect,
                            snap: "maximize"
                        }
                        : w
                )
            };

        case "RESTORE_WINDOW":
            return {
                ...state,
                windows: state.windows.map(w =>
                    w.id === action.id && w.restoreRect
                        ? {
                            ...w,
                            rect: w.restoreRect,
                            restoreRect: undefined,
                            snap: "none"
                        }
                        : w
                )
            };

        case "MINIMIZE_WINDOW":
            return {
                ...state,
                windows: state.windows.map(w =>
                    w.id === action.id ? { ...w, minimized: true } : w
                )
            };

        default:
            return state;
    }
}
