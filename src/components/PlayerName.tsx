import { Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export function PlayerName({
  name,
  width = "96px",
  intervalMs = 2000,
}: {
  name: Accessor<string>;
  width?: string;
  intervalMs?: number;
}) {
  const [el, setEl] = createSignal<HTMLDivElement | null>(null);

  const interval = intervalMs / 1000;
  const propWidthPx = width;
  let scrollState: "ellipsis" | "scrollStart" | "scrollEnd" = "ellipsis";
  let scrollInterval: number | null = null;
  const dbgName = name().toLowerCase();

  createEffect(() => {
    if (!el()) return;
    const container = el();
    container.style.width = propWidthPx;

    const span = container.querySelector("span")!;
    span.style.transform = "translateX(0)";

    span.style.width = "auto";
    const containerWidth = container.clientWidth;
    const textWidth = span.scrollWidth;

    const scrollTo = containerWidth - textWidth;

    if (dbgName.includes("[debug]")) {
      console.log({ containerWidth, textWidth, scrollTo });
    }
    if (textWidth <= containerWidth) {
      span.style.position = "relative";
      return;
    }

    scrollInterval = setInterval(() => {
      const nextState = nextScrollState(scrollState);
      switch (nextState) {
        case "ellipsis":
          span.style.transform = "translateX(0)";
          span.style.transitionDelay = "0s";
          span.style.transitionDuration = `${interval}s`;
          span.style.width = propWidthPx;
          span.style.textOverflow = "ellipsis";
          break;
        case "scrollStart":
          span.style.transform = `translateX(${scrollTo}px)`;
          span.style.transitionDelay = "0s";
          span.style.transitionDuration = `${Math.min(
            Math.abs(scrollTo) / 50,
            interval
          )}s`;
          span.style.width = "auto";
          span.style.textOverflow = "unset";
          break;
        case "scrollEnd":
          span.style.transform = "translateX(0)";
          span.style.transitionDelay = `${(3 * interval) / 4}s`;
          span.style.transitionDuration = `${interval / 4}s`;
          span.style.width = "auto";
          span.style.textOverflow = "unset";
          break;
      }

      scrollState = nextState;
    }, interval * 1000);

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
      scrollInterval = null;
    };
  });

  onCleanup(() => {
    if (scrollInterval) clearInterval(scrollInterval);
    scrollInterval = null;
  });

  return (
    <div
      class="grid justify-center items-center gap-4 relative h-8 overflow-hidden group"
      ref={setEl}
      title="Player Name"
    >
      <span
        class="text-2xl font-semibold text-zinc-300 text-center h-8 overflow-hidden
                    block absolute text-nowrap
                    translate translate-x-0 transition-transform ease-linear
                    group-hover:w-auto group-hover:translate-x-[calc(96px-100%)]"
      >
        {name()}
      </span>
    </div>
  );
}

function nextScrollState(state: "ellipsis" | "scrollStart" | "scrollEnd") {
  switch (state) {
    case "ellipsis":
      return "scrollStart";
    case "scrollStart":
      return "scrollEnd";
    case "scrollEnd":
      return "ellipsis";
  }
}
