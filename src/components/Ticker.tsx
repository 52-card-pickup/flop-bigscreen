import { For, Show, createEffect, createSignal, onCleanup } from "solid-js";
import { Transition } from "solid-transition-group";

type TickerHeader = {
  now: number;
  size: number;
};

type TickerItem = {
  seqIndex: number;
  startOffsetMs: number;
  duration: number;
  payload: string;
};

export function Ticker({ ticker }: { ticker: () => string | null }) {
  const [now, setNow] = createSignal(Date.now());

  const timer = setInterval(() => setNow(Date.now()), 1000);
  onCleanup(() => clearInterval(timer));

  const parsed = () => {
    const rawTicker = ticker();
    return parseTicker(rawTicker);
  };
  const items = () => parsed().items;
  const sinceMs = () => now() - parsed().header.now;

  return (
    <div
      class="fixed bottom-4 right-4 grid justify-center items-center gap-2"
      data-component-name="Ticker"
    >
      <For each={items()}>
        {({ seqIndex, startOffsetMs, duration, payload }) => (
          <Transition
            enterActiveClass="transition-opacity duration-100"
            enterClass="opacity-0"
            enterToClass="opacity-100"
            exitActiveClass="transition-opacity duration-1000"
            exitClass="opacity-100"
            exitToClass="opacity-0"
          >
            <Show
              when={
                sinceMs() >= startOffsetMs &&
                sinceMs() < startOffsetMs + duration
              }
            >
              <div
                class="grid justify-end items-center bg-zinc-900/40 px-2"
                data-index={seqIndex}
              >
                <span class="text-xl font-light text-zinc-50/60">
                  {payload}
                </span>
              </div>
            </Show>
          </Transition>
        )}
      </For>
    </div>
  );
}

function parseTicker(input: string): {
  header: TickerHeader;
  items: TickerItem[];
} {
  function splitTickerHeader(line: string) {
    const [_, now, size] = line.split("\x00");
    return { now: parseInt(now), size: parseInt(size) };
  }
  function splitTickerItems(line: string) {
    const [header, payload] = line.split("\x00");
    const [seqIndex, startOffsetMs, duration] = header.split("|");
    return {
      seqIndex: parseInt(seqIndex),
      startOffsetMs: parseInt(startOffsetMs),
      duration: parseInt(duration),
      payload,
    };
  }

  if (!input) {
    return {
      header: {
        now: Date.now(),
        size: 0,
      },
      items: [],
    };
  }
  const [headerLine, ...lines] = input.split("\n");
  const header = splitTickerHeader(headerLine);
  const items = lines.map(splitTickerItems);
  return { header, items };
}
