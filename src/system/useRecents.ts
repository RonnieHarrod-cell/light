import { useEffect, useState } from "react";
import { getRecentApps, addRecentApp } from "./recents";

export function useRecents() {
    const [recents, setRecents] = useState<string[]>([]);

    useEffect(() => {
        setRecents(getRecentApps());
    }, []);

    function record(id: string) {
        addRecentApp(id);
        setRecents(getRecentApps());
    }

    return { recents, record };
}
