export default function Desktop({ openApp }: { openApp: (name: string) => void }) {
    return (
        <div className="desktop">
            <div className="icon" onClick={() => openApp("Notes")}>📝 Notes</div>
            <div className="icon" onClick={() => openApp("Terminal")}>💻 Terminal</div>
        </div>
    );
}
