import { useEffect, useMemo, useRef, useState } from "react";
import { APPS } from "../apps/registry";
import { useWindowManager } from "../wm/WindowContext";
import { WMWindow } from "../wm/wm.types";
import { usePins } from "./usePins";
import { useRecents } from "./useRecents";

export default function AppLauncher({
    open,
    onClose
}: {
    open: boolean;
    onClose: () => void;
}) {
    const { dispatch, state } = useWindowManager();
    const { pins, pin, unpin } = usePins();
    const { recents, record } = useRecents();

    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    /* ---------------- Lifecycle ---------------- */

    useEffect(() => {
        if (open) {
            setQuery("");
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    }, [open]);

    /* ---------------- Search ---------------- */

    const filteredApps = useMemo(() => {
        return APPS.filter(app =>
            app.title.toLowerCase().includes(query.toLowerCase())
        );
    }, [query]);

    /* ---------------- Launch Logic ---------------- */

    function launch(appId: string) {
        const app = APPS.find(a => a.id === appId);
        if (!app) return;

        // record recent launch
        record(app.id);

        // if already running, just focus
        const existing = state.windows.find(w => w.id === app.id);
        if (existing) {
            dispatch({ type: "FOCUS_WINDOW", id: existing.id });
            onClose();
            return;
        }

        const win: WMWindow = {
            id: app.id,
            title: app.title,
            rect: {
                x: 100 + Math.random() * 80,
                y: 80 + Math.random() * 80,
                w: app.width,
                h: app.height
            },
            z: 0,
            minimized: false,
            snap: "none",
            resizable: true,
            maximizable: true,
            app: app.component
        };

        dispatch({ type: "OPEN_WINDOW", window: win });
        onClose();
    }

    /* ---------------- Keyboard ---------------- */

    function onKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Escape") {
            onClose();
        }
        if (e.key === "Enter" && filteredApps.length > 0) {
            launch(filteredApps[0].id);
        }
    }

    if (!open) return null;

    /* ---------------- Render ---------------- */

    return (
        <div className="app-launcher" onClick={onClose}>
            <div
                className="app-launcher-panel"
                onClick={e => e.stopPropagation()}
                onKeyDown={onKeyDown}
            >
                {/* Search */}
                <input
                    ref={inputRef}
                    className="app-search"
                    placeholder="Search apps…"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />

                {/* Recent Apps */}
                {query === "" && recents.length > 0 && (
                    <>
                        <h4 className="launcher-section">Recent</h4>
                        <div className="app-grid">
                            {recents.map(id => {
                                const app = APPS.find(a => a.id === id);
                                if (!app) return null;

                                return (
                                    <button
                                        key={id}
                                        className="app-tile"
                                        onClick={() => launch(id)}
                                        onContextMenu={e => {
                                            e.preventDefault();
                                            pins.includes(id) ? unpin(id) : pin(id);
                                        }}
                                    >
                                        <div className="app-icon">
                                            {app.icon ?? "🗔"}
                                        </div>
                                        <span>{app.title}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* All / Filtered Apps */}
                <h4 className="launcher-section">
                    {query ? "Results" : "All Apps"}
                </h4>

                <div className="app-grid">
                    {filteredApps.length === 0 && (
                        <div className="no-results">No apps found</div>
                    )}

                    {filteredApps.map(app => (
                        <button
                            key={app.id}
                            className="app-tile"
                            onClick={() => launch(app.id)}
                            onContextMenu={e => {
                                e.preventDefault();
                                pins.includes(app.id)
                                    ? unpin(app.id)
                                    : pin(app.id);
                            }}
                        >
                            <div className="app-icon">{app.icon ?? "🗔"}</div>
                            <span>{app.title}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
