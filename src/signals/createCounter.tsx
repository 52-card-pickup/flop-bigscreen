import { Accessor, createSignal, onCleanup } from "solid-js";

export function createCounter(
  from: Accessor<number>,
  to: Accessor<number>,
  delay = 1000
) {
  let timer: number;
  const [count, setCount] = createSignal(from());

  function start() {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      setCount((prev) => {
        if (prev < to()) {
          start();
          return prev + 1;
        }
        return prev;
      });
    }, delay);
  }

  onCleanup(() => clearTimeout(timer));

  return [count, start] as const;
}
