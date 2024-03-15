import { CardSuite, CardValue } from "../signals/createClient";

export function Card({
    suite,
    value,
    key,
}: {
    suite: CardSuite;
    value: CardValue;
    key?: number;
}) {
    return (
        <img
            src={`/cards/${suite}_${value}.svg`}
            alt={`${value} of ${suite}`}
            data-key={key}
        />
    );
}
