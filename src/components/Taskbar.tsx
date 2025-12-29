import { AppWindow } from "../types";

export default function Taskbar({
    windows,
    toggleMinimize
}: {
    windows: AppWindow[];
    toggleMinimize: (id: string) => void;
}) {
    return (
        <div className="taskbar">
            {windows.map(w => (
                <div key={w.id} className="task-item" onClick={() => toggleMinimize(w.id)}>
                    {w.title}
                </div>
            ))}
        </div>
    );
}
