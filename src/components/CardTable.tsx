import { Index, Show, createEffect } from "solid-js";
import { CardSuite, CardValue } from "../signals/createClient";
import { FlipCard } from "./Card";
import cn from "../utils/cn";
import { Transition } from "solid-transition-group";
import { createCounter } from "../signals/createCounter";

export function CardTable({
  cards,
  variant = "large",
}: {
  cards: () => [CardSuite, CardValue][];
  variant?: "small" | "large";
}) {
  const cardCount = () => cards().length;
  const [flippedCount, startFlipping] = createCounter(() => 0, cardCount, 200);
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

  createEffect(() => {
    let _ = cardCount();
    startFlipping();
  });

  return (
    <div
      class="grid w-11/12 h-full place-self-center"
      data-component-name="CardTable"
    >
      <div
        class={cn(
          "grid grid-cols-5 gap-4 bg-green-950 ring-8 ring-green-900 shadow-lg min-h-fit min-w-fit",
          variant === "small"
            ? "rounded-[0.5rem]"
            : "px-24 py-16 xl:px-32 xl:py-24 rounded-full"
        )}
      >
        <Index
          each={slots().map(
            ([suite, value], index) =>
              [suite, value, index >= flippedCount()] as const
          )}
        >
          {(item, index) => (
            <div class="aspect-[5/7] relative h-full">
              <div class="absolute w-full h-full">
                <EmptyCardSlot />
              </div>
              <Transition
                enterActiveClass="transform transition duration-500 ease-in-out"
                enterClass="translate-y-[-200px] opacity-0"
                enterToClass="translate-y-0 opacity-100"
                exitActiveClass="transform transition duration-500 ease-in-out"
                exitClass="translate-y-0 opacity-100"
                exitToClass="translate-y-[-200px] opacity-0"
              >
                <Show when={cards().length > index}>
                  <div class="absolute w-full h-full z-10">
                    <FlipCard
                      suite={item()[0]}
                      value={item()[1]}
                      flipped={() => item()[2]}
                    />
                  </div>
                </Show>
              </Transition>
            </div>
          )}
        </Index>
      </div>
    </div>
  );
}

function EmptyCardSlot() {
  return (
    <div class="bg-green-950 w-full h-full rounded-md shadow-[inset_0_8px_6px_2px_rgba(0,0,0,0.15)] border-2 border-black/5" />
  );
}
