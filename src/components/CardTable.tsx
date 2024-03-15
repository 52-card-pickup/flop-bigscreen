import { For } from "solid-js";
import { CardSuite, CardValue } from "../signals/createClient";
import { Card } from "./Card";

export function CardTable({
    cards,
}: {
    cards: () => [CardSuite, CardValue][];
}) {
    return (
        <div
            class="grid justify-center items-center"
            data-component-name="CardTable"
        >
            <div class="grid grid-cols-5 gap-4 rounded-[4rem] bg-green-950 p-16 ring-8 ring-green-900 shadow-lg min-w-[80vw] min-h-[200px]">
                <For each={cards()}>
                    {([suite, value], index) => (
                        <Card suite={suite} value={value} key={index()} />
                    )}
                </For>
            </div>
        </div>
    );
}
