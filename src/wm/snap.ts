export function getSnapMode(
    x: number,
    y: number,
    screen: Rect
): SnapMode {
    const EDGE = 32;

    if (y <= EDGE) return "maximize";
    if (x <= EDGE) return "left";
    if (x + 1 >= screen.w - EDGE) return "right";

    return "none";
}
