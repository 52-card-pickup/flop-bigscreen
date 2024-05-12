import { For, Show } from "solid-js";
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
  const slots = () =>
    cards()
      .concat([
        ["hearts", "ace"],
        ["hearts", "king"],
        ["hearts", "queen"],
        ["hearts", "jack"],
        ["hearts", "10"],
      ])
      .slice(0, 5);
  return (
    <div class="grid w-full h-full" data-component-name="CardTable">
      <div
        class={cn(
          "grid grid-cols-5 items-center gap-4 bg-green-950 ring-8 ring-[#002811] shadow-lg min-h-fit min-w-fit",
          variant === "small" ? "rounded-[0.5rem]" : "px-24 py-16 rounded-full"
        )}
      >
        <For each={slots()}>
          {([suite, value], index) => (
            <div class="flex justify-center items-center aspect-[5/7]">
              <Show
                when={cards().length > index()}
                fallback={<EmptyCardSlot />}
              >
                <Card suite={suite} value={value} />
              </Show>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

function EmptyCardSlot() {
  return (
    <div class="bg-green-950 w-full h-full rounded-md shadow-[inset_0_8px_6px_2px_rgba(0,0,0,0.15)] border-2 border-black/5" />
  );
}
