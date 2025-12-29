import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { WindowManager } from "./wm/WindowManager";
import "./index.css";

ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
).render(
    <React.StrictMode>
        <WindowManager>
            <App />
        </WindowManager>
    </React.StrictMode>
);
