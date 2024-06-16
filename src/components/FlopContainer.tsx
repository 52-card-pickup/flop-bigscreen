import { children } from "solid-js";

export function FlopContainer(props) {
  const safeChildren = children(() => props.children);

  return (
    <div
      class="grid justify-center items-center gap-4 relative"
      data-component-name="FlopContainer"
    >
      <h1 class="absolute left-8 bottom-6 text-3xl font-bold shadow-sm text-center select-none xl:text-5xl">
        flop.
      </h1>
      {safeChildren()}
    </div>
  );
}
