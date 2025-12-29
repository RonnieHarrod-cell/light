import { useWindowManager } from "../wm/WindowContext";

export default function Taskbar() {
    const { state, dispatch } = useWindowManager();

    return (
        <div className="taskbar">
            {state.windows.map(win => (
                <button
                    key={win.id}
                    className={`taskbar-item ${state.focusedId === win.id && !win.minimized
                            ? "active"
                            : ""
                        }`}
                    onClick={() =>
                        dispatch({ type: "FOCUS_WINDOW", id: win.id })
                    }
                >
                    {win.title}
                </button>
            ))}
        </div>
    );
}