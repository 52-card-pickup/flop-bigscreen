import { For } from "solid-js";
import { CardSuite, CardValue } from "../signals/createClient";
import { Card } from "./Card";
import cn from "../utils/cn";

export function CardTable({
    cards,
    variant = "large",
}: {
    cards: () => [CardSuite, CardValue][];
    variant?: "small" | "large";
}) {
    return (
        <div
            class="grid justify-center items-center aspect-[21/9]"
            data-component-name="CardTable"
        >
            <div
                class={cn(
                    "grid grid-cols-5 gap-4 bg-green-950 ring-8 ring-green-900 shadow-lg min-h-fit min-w-fit",
                    variant === "small" ? "rounded-[0.5rem]" : "p-16 rounded-[4rem]"
                )}
            >
                <For each={cards()}>
                    {([suite, value], index) => (
                        <div class="flex justify-center items-center">
                        <Card suite={suite} value={value} />
                        </div>
                    )}
                </For>
            </div>
        </div>
    );
}
