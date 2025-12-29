import { useRef } from "react";
import { WMWindow, Rect } from "../wm/wm.types";
import { useWindowManager } from "../wm/WindowContext";

const TITLEBAR_HEIGHT = 32;

export function Window({ win }: { win: WMWindow }) {
    const { dispatch, state } = useWindowManager();
    const dragOffset = useRef({ x: 0, y: 0 });
    const isDragging = useRef(false);

    if (win.minimized) return null;

    /* ---------------- Drag ---------------- */

    function onMouseDownTitle(e: React.MouseEvent) {
        e.preventDefault();

        dispatch({ type: "FOCUS_WINDOW", id: win.id });

        isDragging.current = true;
        dragOffset.current = {
            x: e.clientX - win.rect.x,
            y: e.clientY - win.rect.y
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    }

    function onMouseMove(e: MouseEvent) {
        if (!isDragging.current) return;

        const rect: Rect = {
            ...win.rect,
            x: e.clientX - dragOffset.current.x,
            y: e.clientY - dragOffset.current.y
        };

        dispatch({
            type: "MOVE_WINDOW",
            id: win.id,
            rect
        });
    }

    function onMouseUp() {
        isDragging.current = false;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
    }

    /* ---------------- Controls ---------------- */

    function close() {
        dispatch({ type: "CLOSE_WINDOW", id: win.id });
    }

    function minimize() {
        dispatch({ type: "MINIMIZE_WINDOW", id: win.id });
    }

    function toggleMaximize() {
        if (win.snap === "maximize") {
            dispatch({ type: "RESTORE_WINDOW", id: win.id });
        } else {
            dispatch({
                type: "MAXIMIZE_WINDOW",
                id: win.id,
                rect: {
                    x: 0,
                    y: 0,
                    w: window.innerWidth,
                    h: window.innerHeight - 44
                }
            });
        }
    }

    function onDoubleClickTitle() {
        if (!win.maximizable) return;
        toggleMaximize();
    }

    /* ---------------- Render ---------------- */

    return (
        <div
            className={`wm-window ${state.focusedId === win.id ? "focused" : ""}`}
            style={{
                transform: `translate(${win.rect.x}px, ${win.rect.y}px)`,
                width: win.rect.w,
                height: win.rect.h,
                zIndex: win.z
            }}
            onMouseDown={() =>
                dispatch({ type: "FOCUS_WINDOW", id: win.id })
            }
        >
            {/* Title Bar */}
            <div
                className="wm-titlebar"
                onMouseDown={onMouseDownTitle}
                onDoubleClick={onDoubleClickTitle}
                style={{ height: TITLEBAR_HEIGHT }}
            >
                <span className="wm-title">{win.title}</span>

                <div className="wm-controls">
                    <button onClick={minimize}>─</button>
                    {win.maximizable && (
                        <button onClick={toggleMaximize}>▢</button>
                    )}
                    <button onClick={close}>✕</button>
                </div>
            </div>

            {/* Content */}
            <div
                className="wm-content"
                style={{ height: `calc(100% - ${TITLEBAR_HEIGHT}px)` }}
            >
                {win.app}
            </div>
        </div>
    );
}
