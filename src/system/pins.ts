const KEY = "webos:pinned-apps";

export function getPinnedApps(): string[] {
    try {
        return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
        return [];
    }
}

export function setPinnedApps(ids: string[]) {
    localStorage.setItem(KEY, JSON.stringify(ids));
}