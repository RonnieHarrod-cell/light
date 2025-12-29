import { useState } from "react";

export default function Notes() {
    const [text, setText] = useState("");

    return (
        <textarea
            style={{ width: "100%", height: "100%", background: "#020617", color: "white" }}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Write notes here..."
        />
    );
}