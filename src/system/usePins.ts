import { useEffect, useState } from "react";
import { getPinnedApps, setPinnedApps } from "./pins";

export function usePins() {
    const [pins, setPins] = useState<string[]>([]);

    useEffect(() => {
        setPins(getPinnedApps());
    }, []);

    function pin(id: string) {
        if (pins.includes(id)) return;
        const next = [...pins, id];
        setPins(next);
        setPinnedApps(next);
    }

    function unpin(id: string) {
        const next = pins.filter(p => p !== id);
        setPins(next);
        setPinnedApps(next);
    }

    return { pins, pin, unpin };
}