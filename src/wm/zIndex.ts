export function bringToFront(state: WMState, id: string): WMState {
    return {
        ...state,
        windows: state.windows.map(w =>
            w.id === id ? { ...w, z: state.nextZ } : w
        ),
        nextZ: state.nextZ + 1,
        focusedId: id
    };
}
