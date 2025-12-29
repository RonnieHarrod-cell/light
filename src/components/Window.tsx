import { useEffect, useRef, useState } from "react";
import { AppWindow } from "../types";

const GRID_SIZE = 20;
const SNAP_THRESHOLD = 30;

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
    const [pos, setPos] = useState({ x: app.x, y: app.y });
    const [size, setSize] = useState({ w: 350, h: 260 });

    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(false);
    const [maximized, setMaximized] = useState(false);

    const [snapPreview, setSnapPreview] = useState<
        null | "left" | "right" | "top"
    >(null);

    const previousState = useRef({
        x: app.x,
        y: app.y,
        w: 350,
        h: 260
    });

    const dragOffset = useRef({ x: 0, y: 0 });
    const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

    const handleFocus = () => onFocus();

    // ------------- DRAG -----------------
    const startDrag = (e: React.MouseEvent) => {
        if (maximized) return;

        setDragging(true);
        dragOffset.current = {
            x: e.clientX - pos.x,
            y: e.clientY - pos.y
        };
    };

    // ------------- RESIZE -----------------
    const startResize = (e: React.MouseEvent) => {
        if (maximized) return;

        e.stopPropagation();
        setResizing(true);

        resizeStart.current = {
            x: e.clientX,
            y: e.clientY,
            w: size.w,
            h: size.h
        };
    };

    const snap = (v: number) => Math.round(v / GRID_SIZE) * GRID_SIZE;

    // ------------- DRAG MOVE -----------------
    const onMouseMove = (e: MouseEvent) => {
        if (dragging) {
            const newX = e.clientX - dragOffset.current.x;
            const newY = e.clientY - dragOffset.current.y;

            setPos({ x: newX, y: newY });

            // detect snap preview
            if (e.clientX < SNAP_THRESHOLD) setSnapPreview("left");
            else if (window.innerWidth - e.clientX < SNAP_THRESHOLD)
                setSnapPreview("right");
            else if (e.clientY < SNAP_THRESHOLD) setSnapPreview("top");
            else setSnapPreview(null);
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

    // ------------- APPLY SNAP -----------------
    const stopActions = () => {
        if (dragging) {
            if (snapPreview === "left") {
                saveState();
                setPos({ x: 0, y: 0 });
                setSize({ w: window.innerWidth / 2, h: window.innerHeight });
                setMaximized(false);
            } else if (snapPreview === "right") {
                saveState();
                setPos({ x: window.innerWidth / 2, y: 0 });
                setSize({ w: window.innerWidth / 2, h: window.innerHeight });
                setMaximized(false);
            } else if (snapPreview === "top") {
                toggleMaximize();
            } else {
                setPos(p => ({
                    x: snap(p.x),
                    y: snap(p.y)
                }));
            }
        }

        setDragging(false);
        setResizing(false);
        setSnapPreview(null);
    };

    useEffect(() => {
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", stopActions);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", stopActions);
        };
    });

    // -------- SAVE CURRENT GEOMETRY --------
    const saveState = () => {
        previousState.current = {
            x: pos.x,
            y: pos.y,
            w: size.w,
            h: size.h
        };
    };

    // -------- MAXIMIZE TOGGLE --------
    const toggleMaximize = () => {
        if (!maximized) {
            saveState();
            setPos({ x: 0, y: 0 });
            setSize({
                w: window.innerWidth,
                h: window.innerHeight
            });
            setMaximized(true);
        } else {
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
            className={`window
                ${dragging ? "dragging" : ""}
                ${maximized ? "maximized" : ""}    
                ${snapPreview ? "snap-preview" : ""}
            `}
            onMouseDown={handleFocus}
            style={{
                top: pos.y,
                left: pos.x,
                width: size.w,
                height: size.h,
                zIndex: app.zIndex,
                outline:
                    snapPreview === "left" ||
                        snapPreview === "right" ||
                        snapPreview === "top"
                        ? "2px solid rgba(255,255,255,.25)"
                        : "none"
            }}
        >
            <div
                className="window-header"
                onMouseDown={startDrag}
                onDoubleClick={toggleMaximize}
            >
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
