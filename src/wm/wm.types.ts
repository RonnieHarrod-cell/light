import React from "react";

export type WindowID = string;

export type Rect = {
    x: number;
    y: number;
    w: number;
    h: number;
};

export type SnapMode =
    | "none"
    | "left"
    | "right"
    | "top"
    | "bottom"
    | "maximize"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";

export interface WMWindow {
    id: WindowID;
    title: string;
    rect: Rect;
    restoreRect?: Rect;
    z: number;
    minimized: boolean;
    snap: SnapMode;
    resizable: boolean;
    maximizable: boolean;
    app: React.ReactNode;
}

export interface WMState {
    windows: WMWindow[];
    focusedId: WindowID | null;
    nextZ: number;
}
