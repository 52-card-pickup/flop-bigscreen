import { For, Index, Show, createEffect, createSignal } from "solid-js";
import { CardSuite, CardValue } from "../signals/createClient";
import { Card, CardBackFace, FlipCard } from "./Card";
import cn from "../utils/cn";
import { Transition } from "solid-transition-group";

export function CardTable({
  cards,
  variant = "large",
}: {
  cards: () => [CardSuite, CardValue][];
  variant?: "small" | "large";
}) {
  const [flippedCount, setFlippedCount] = createSignal(0);

  createEffect(() => {
    if (cards().length > flippedCount()) {
      delayedFlip();
    }
  });

  let timer: number;

  function delayedFlip() {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      console.log("flipping card ", flippedCount());
      const flipped = setFlippedCount((prev) => prev + 1);
      if (cards().length > flipped) {
        delayedFlip();
      }
    }, 1000);
  }

  const cardsWithFlipped = () => {
    const flipped = flippedCount();
    return cards().map((card, index) => {
      return [card, index < flipped] as const;
    });
  };

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
        <Index each={cardsWithFlipped()}>
          {(item, index) => (
            <div class="flex justify-center items-center relative h-full">
              <Transition
                enterActiveClass="transition duration-300 ease-in-out"
                enterClass="transform translate-x-[20px] opacity-0"
                enterToClass="transform translate-x-0 opacity-100"
                exitActiveClass="transition duration-300 ease-in-out"
                exitClass="transform translate-x-0 opacity-100"
                exitToClass="transform translate-x-[20px] opacity-0"
              >
                <Show when={cardsWithFlipped()[index ? index - 1 : 0][1]}>
                  <FlipCard
                    suite={item()[0][0]}
                    value={item()[0][1]}
                    flipped={() => !item()[1]}
                  />
                </Show>
              </Transition>
            </div>
          )}
        </Index>
      </div>
    </div>
  );
}
