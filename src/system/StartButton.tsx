export default function StartButton({
    onClick
}: {
    onClick: () => void;
}) {
    return (
        <button className="start-button" onClick={onClick}>
            ⊞
        </button>
    );
}