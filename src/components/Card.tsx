import { CardSuite, CardValue } from "../signals/createClient";

export function Card({
    suite,
    value,
    key,
    variant,
}: {
    suite: CardSuite;
    value: CardValue;
    key?: number;
    variant?: "small" | "large";
}) {

    if (variant === "small") {
        return <span role="img" aria-label="card" class="bg-white px-1 py-2 rounded-sm text-2xl">
            {value}<SuitEmoji suit={suite} />
        </span>;
    }
    return (
        <img
            src={`/cards/${suite}_${value}.svg`}
            alt={`${value} of ${suite}`}
            data-key={key}
        />
    );
}



function SuitEmoji({ suit }: { suit: string }) {
    switch (suit) {
        case "hearts":
            return <span role="img" aria-label="hearts" class="text-red">♥️</span>;
        case "diamonds":
            return <span role="img" aria-label="diamonds">♦️</span>;
        case "clubs":
            return <span role="img" aria-label="clubs" class="text-black">♣️</span>;
        case "spades":
            return <span role="img" aria-label="spades">♠️</span>;
        default:
            return null;
    }
}