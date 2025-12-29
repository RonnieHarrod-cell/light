import { useWindowManager } from "../wm/WindowContext";
import { Window } from "../windows/Window";
import Taskbar from "../system/TaskBar";

export default function Desktop() {
    const { state } = useWindowManager();

    return (
        <div className="desktop">
            {state.windows.map(win => (
                <Window key={win.id} win={win} />
            ))}

            <Taskbar />
        </div>
    );
}
