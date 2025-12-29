import { useState } from "react";
import { useWindowManager } from "../wm/WindowContext";
import { APPS } from "../apps/registry";
import StartButton from "./StartButton";
import AppLauncher from "./AppLauncher";
import { usePins } from "./usePins";

export default function Taskbar() {
    const { state, dispatch } = useWindowManager();
    const { pins } = usePins();
    const [open, setOpen] = useState(false);

    const runningIds = state.windows.map(w => w.id);

    // Order: pinned first, then running but not pinned
    const taskbarIds = [
        ...pins,
        ...runningIds.filter(id => !pins.includes(id))
    ];

    function activate(appId: string) {
        const win = state.windows.find(w => w.id === appId);

        if (win) {
            dispatch({ type: "FOCUS_WINDOW", id: appId });
            return;
        }

        const app = APPS.find(a => a.id === appId);
        if (!app) return;

        dispatch({
            type: "OPEN_WINDOW",
            window: {
                id: app.id,
                title: app.title,
                rect: {
                    x: 100,
                    y: 80,
                    w: app.width,
                    h: app.height
                },
                z: 0,
                minimized: false,
                snap: "none",
                resizable: true,
                maximizable: true,
                app: app.component
            }
        });
    }

    return (
        <>
            <div className="taskbar">
                <StartButton onClick={() => setOpen(v => !v)} />

                {taskbarIds.map(id => {
                    const app = APPS.find(a => a.id === id);
                    const win = state.windows.find(w => w.id === id);

                    if (!app) return null;

                    return (
                        <button
                            key={id}
                            className={`taskbar-item ${state.focusedId === id && win && !win.minimized
                                ? "active"
                                : ""
                                }`}
                            onClick={() => activate(id)}
                        >
                            {app.icon ?? "🗔"}
                        </button>
                    );
                })}
            </div>

            <AppLauncher open={open} onClose={() => setOpen(false)} />
        </>
    );
}
