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

    const dragOffset = useRef({ x: 0, y: 0 });
    const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

    const handleFocus = () => onFocus();

    // ---------- DRAG ----------
    const startDrag = (e: React.MouseEvent) => {
        setDragging(true);
        dragOffset.current = {
            x: e.clientX - pos.x,
            y: e.clientY - pos.y
        };
    };

    // ---------- RESIZE ----------
    const startResize = (e: React.MouseEvent) => {
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
                w: Math.max(220, resizeStart.current.w + (e.clientX - resizeStart.current.x)),
                h: Math.max(120, resizeStart.current.h + (e.clientY - resizeStart.current.y))
            });
        }
    };

    const snap = (value: number) =>
        Math.round(value / GRID_SIZE) * GRID_SIZE;

    const stopActions = () => {
        if (dragging) {
            // SNAP TO GRID HERE
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
            <div className="window-header" onMouseDown={startDrag}>
                <span>{app.title}</span>
                <div>
                    <button onClick={onMinimize}>—</button>
                    <button onClick={onClose}>×</button>
                </div>
            </div>

            <div className="window-body" style={{ height: size.h - 35 }}>
                {app.component}
            </div>

            <div className="resize-handle" onMouseDown={startResize} />
        </div>
    );
}
