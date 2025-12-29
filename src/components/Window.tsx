import { useEffect, useRef, useState } from "react";
import { AppWindow } from "../types";

const GRID_SIZE = 20;

export default function Window({
    app,
    onClose,
    onMinimize,
    onFocus
}: {
    app: AppWindow;
    onClose: () => void;
    onMinimize: () => void;
    onFocus: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);

    const [pos, setPos] = useState({ x: app.x, y: app.y });
    const [size, setSize] = useState({ w: 350, h: 260 });

    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(false);

    const [maximized, setMaximized] = useState(false);

    const previousState = useRef({
        x: app.x,
        y: app.y,
        w: 350,
        h: 260
    });

    const dragOffset = useRef({ x: 0, y: 0 });
    const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

    const handleFocus = () => onFocus();

    // ---------- DRAG ----------
    const startDrag = (e: React.MouseEvent) => {
        if (maximized) return; // cannot drag maximized window

        setDragging(true);
        dragOffset.current = {
            x: e.clientX - pos.x,
            y: e.clientY - pos.y
        };
    };

    // ---------- RESIZE ----------
    const startResize = (e: React.MouseEvent) => {
        if (maximized) return; // cannot resize maximized window

        e.stopPropagation();
        setResizing(true);

        resizeStart.current = {
            x: e.clientX,
            y: e.clientY,
            w: size.w,
            h: size.h
        };
    };

    const onMouseMove = (e: MouseEvent) => {
        if (dragging) {
            setPos({
                x: e.clientX - dragOffset.current.x,
                y: e.clientY - dragOffset.current.y
            });
        }

        if (resizing) {
            setSize({
                w: Math.max(
                    220,
                    resizeStart.current.w + (e.clientX - resizeStart.current.x)
                ),
                h: Math.max(
                    120,
                    resizeStart.current.h + (e.clientY - resizeStart.current.y)
                )
            });
        }
    };

    const snap = (v: number) => Math.round(v / GRID_SIZE) * GRID_SIZE;

    const stopActions = () => {
        if (dragging) {
            setPos(p => ({
                x: snap(p.x),
                y: snap(p.y)
            }));
        }

        setDragging(false);
        setResizing(false);
    };

    useEffect(() => {
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", stopActions);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", stopActions);
        };
    });

    // ---------- MAXIMIZE ----------
    const toggleMaximize = () => {
        if (!maximized) {
            // save current state
            previousState.current = {
                x: pos.x,
                y: pos.y,
                w: size.w,
                h: size.h
            };

            setPos({ x: 0, y: 0 });
            setSize({
                w: window.innerWidth,
                h: window.innerHeight - 40 // leave space if taskbar
            });
            setMaximized(true);
        } else {
            // restore
            setPos({
                x: previousState.current.x,
                y: previousState.current.y
            });
            setSize({
                w: previousState.current.w,
                h: previousState.current.h
            });
            setMaximized(false);
        }
    };

    return (
        <div
            ref={ref}
            className="window"
            onMouseDown={handleFocus}
            style={{
                top: pos.y,
                left: pos.x,
                width: size.w,
                height: size.h,
                zIndex: app.zIndex
            }}
        >
            <div className="window-header" onMouseDown={startDrag} onDoubleClick={toggleMaximize}>
                <span>{app.title}</span>

                <div>
                    <button onClick={onMinimize}>—</button>
                    <button onClick={toggleMaximize}>
                        {maximized ? "🗗" : "🗖"}
                    </button>
                    <button onClick={onClose}>×</button>
                </div>
            </div>

            <div className="window-body" style={{ height: size.h - 35 }}>
                {app.component}
            </div>

            {!maximized && (
                <div className="resize-handle" onMouseDown={startResize} />
            )}
        </div>
    );
}
