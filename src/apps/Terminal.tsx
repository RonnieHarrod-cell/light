import { useState } from "react";

export default function Terminal() {
    const [output, setOutput] = useState<string[]>([]);
    const [input, setInput] = useState("");

    const run = () => {
        setOutput([...output, "> " + input]);
        setInput("");
    };

    return (
        <div style={{ fontFamily: "monospace" }}>
            {output.map((l, i) => (
                <div key={i}>{l}</div>
            ))}

            <input
                style={{ width: "100%", background: "black", color: "white" }}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && run()}
            />
        </div>
    );
}
