import { useState } from "react";
import Desktop from "./components/Desktop";
import Window from "./components/Window";
import Taskbar from "./components/Taskbar";
import Notes from "./apps/Notes";
import Terminal from "./apps/Terminal";
import { AppWindow } from "./types";

export default function App() {
    const [windows, setWindows] = useState<AppWindow[]>([]);
    const [zTop, setZTop] = useState(1);

    const openApp = (name: string) => {
        const id = crypto.randomUUID();

        const component =
            name === "Notes" ? <Notes /> : name === "Terminal" ? <Terminal /> : null;

        setWindows([
            ...windows,
            {
                id,
                title: name,
                component: component!,
                minimized: false,
                zIndex: zTop,
                x: 100,
                y: 100
            }
        ]);

        setZTop(zTop + 1);
    };

    const closeApp = (id: string) =>
        setWindows(windows.filter(w => w.id !== id));

    const minimizeApp = (id: string) =>
        setWindows(
            windows.map(w =>
                w.id === id ? { ...w, minimized: !w.minimized } : w
            )
        );

    const focusApp = (id: string) =>
        setWindows(
            windows.map(w =>
                w.id === id ? { ...w, zIndex: zTop } : w
            )
        ) || setZTop(zTop + 1);

    return (
        <>
            <Desktop openApp={openApp} />

            {windows
                .filter(w => !w.minimized)
                .map(w => (
                    <Window
                        key={w.id}
                        app={w}
                        onClose={() => closeApp(w.id)}
                        onMinimize={() => minimizeApp(w.id)}
                        onFocus={() => focusApp(w.id)}
                    />
                ))}

            <Taskbar windows={windows} toggleMinimize={minimizeApp} />
        </>
    );
}
