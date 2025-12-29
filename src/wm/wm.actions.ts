import { Rect, SnapMode, WMWindow, WindowID } from "./wm.types";

export type WMAction =
    | { type: "OPEN_WINDOW"; window: WMWindow }
    | { type: "CLOSE_WINDOW"; id: WindowID }
    | { type: "FOCUS_WINDOW"; id: WindowID }
    | { type: "MOVE_WINDOW"; id: WindowID; rect: Rect }
    | { type: "RESIZE_WINDOW"; id: WindowID; rect: Rect }
    | { type: "SNAP_WINDOW"; id: WindowID; snap: SnapMode; rect: Rect }
    | { type: "MAXIMIZE_WINDOW"; id: WindowID; rect: Rect }
    | { type: "RESTORE_WINDOW"; id: WindowID }
    | { type: "MINIMIZE_WINDOW"; id: WindowID };