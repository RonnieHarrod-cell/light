export interface AppWindow {
    id: string;
    title: string;
    component: JSX.Element;
    minimized: boolean;
    zIndex: number;
    x: number;
    y: number;
}