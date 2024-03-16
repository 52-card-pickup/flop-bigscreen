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
        return <span role="img" aria-label="card" class="bg-white px-1 py-2 rounded-sm text-2xl w-fit justify-self-center font-medium">
            <ValueCharacter value={value} /><SuitEmoji suit={suite} />
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
            return <span role="img" aria-label="hearts" class="text-[#ff0000]">♥️</span>;
        case "diamonds":
            return <span role="img" aria-label="diamonds" class="text-[#ff0000]">♦️</span>;
        case "clubs":
            return <span role="img" aria-label="clubs" class="text-black">♣️</span>;
        case "spades":
            return <span role="img" aria-label="spades" class="text-black">♠️</span>;
        default:
            return null;
    }
}

function ValueCharacter({ value }: { value: CardValue }) {
    switch (value) {
        case "ace":
            return "A";
        case "king":
            return "K";
        case "queen":
            return "Q";
        case "jack":
            return "J";
        default:
            return value;
    }
}