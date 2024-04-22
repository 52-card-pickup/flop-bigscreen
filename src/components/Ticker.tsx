import { For, Show, createEffect, createSignal, onCleanup } from "solid-js";

export function Ticker({ ticker }: { ticker: () => string | null }) {
  const [now, setNow] = createSignal(Date.now());

  const timer = setInterval(() => setNow(Date.now()), 1000);
  onCleanup(() => clearInterval(timer));

  const splitTickerHeader = (line: string) => {
    const [_, now, size] = line.split("\x00");
    return { now: parseInt(now), size: parseInt(size) };
  };
  const splitTickerItems = (line: string) => {
    const [header, payload] = line.split("\x00");
    const [seqIndex, startOffsetMs, duration] = header.split("|");
    return {
      seqIndex: parseInt(seqIndex),
      startOffsetMs: parseInt(startOffsetMs),
      duration: parseInt(duration),
      payload,
    };
  };
  const parsed = () => {
    const rawTicker = ticker();
    if (!rawTicker)
      return {
        header: {
          now: Date.now(),
          size: 0,
        },
        items: [],
      };
    const [headerLine, ...lines] = rawTicker.split("\n");
    const header = splitTickerHeader(headerLine);
    const items = lines.map(splitTickerItems);
    return { header, items };
  };
  const items = () => parsed().items;

  createEffect(() => {
    now();
    const ticker = parsed();
    console.log(ticker);
  });

  return (
    <div
      class="fixed bottom-4 right-4 grid justify-center items-center gap-2"
      data-component-name="Ticker"
    >
      <For each={items()}>
        {({ seqIndex, startOffsetMs, duration, payload }) => (
          <Show
            when={
              now() - parsed().header.now >= startOffsetMs &&
              now() - parsed().header.now < startOffsetMs + duration
            }
          >
            <div
              class="grid justify-start items-center bg-zinc-900/40 px-2"
              data-index={seqIndex}
            >
              <span class="text-xl font-light text-zinc-50/60">{payload}</span>
            </div>
          </Show>
        )}
      </For>
    </div>
  );
}
