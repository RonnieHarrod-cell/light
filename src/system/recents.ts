const KEY = "webos:recent-apps";
const MAX = 6;

export function getRecentApps(): string[] {
    try {
        return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
        return [];
    }
}

export function addRecentApp(id: string) {
    const list = getRecentApps().filter(x => x !== id);
    const next = [id, ...list].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
}