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
    return (
        <img
            src={`/cards/${suite}_${value}.svg`}
            alt={`${value} of ${suite}`}
            data-key={key}
            class={variant === "small" ? "" : ""}
        />
    );
}
