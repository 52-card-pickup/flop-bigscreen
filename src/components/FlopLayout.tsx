import { Accessor, For, JSX, Show, children } from "solid-js";
import { CardSuite, CardValue } from "../signals/createClient";
import { CardTable } from "./CardTable";
import { FlopContainer } from "./FlopContainer";
import { memo } from "solid-js/web";

export function FlopLayout(props: {
  cards: () => [CardSuite, CardValue][];
  overlayMessage?: Accessor<string | string[]>;
  overlayElement?: Accessor<JSX.Element>;
  children: [JSX.Element, JSX.Element];
}) {
  const safeChildren = children(() => props.children);
  const sections = () => safeChildren.toArray();

  return (
    <FlopContainer>
      <div class="grid justify-center items-center gap-0 grid-cols-[1fr,14fr,1fr] grid-rows-[1fr,4fr,5fr] w-screen h-screen">
        <div class="grid justify-center items-center gap-4 bg-zinc-800/0 rounded-lg w-full h-full"></div>
        <div class="grid justify-center items-center gap-4 h-full">
          {sections()[0]}
        </div>
        <div class="grid justify-center items-center gap-4 bg-zinc-800/0 rounded-lg w-full h-full"></div>

        <div class="grid justify-center items-center gap-4 bg-zinc-800/0 rounded-lg w-full h-full"></div>
        <div class="grid relative">
          <CardTable cards={props.cards} variant="large" />
          <OverlayMessage message={props.overlayMessage} />
          <Show when={props.overlayElement}>{props.overlayElement()}</Show>
        </div>
        <div class="grid justify-center items-center gap-4 bg-zinc-800/0 rounded-lg w-full h-full"></div>

        <div class="grid justify-center items-center gap-4 bg-zinc-800/0 rounded-lg w-full h-full"></div>
        <div class="grid justify-center items-center gap-4">
          {sections()[1]}
        </div>
        <div class="grid justify-center items-center gap-4 bg-zinc-800/0 rounded-lg w-full h-full"></div>
      </div>
    </FlopContainer>
  );
}

function OverlayMessage(props: { message?: Accessor<string | string[]> }) {
  const overlayMessageLines = memo(() => {
    const message = props.message?.();
    if (!message) return null;
    const [header, ...subHeaders] = Array.isArray(message)
      ? message
      : message.split("\n");
    return header
      ? {
          header,
          subHeaders,
        }
      : null;
  }, true);

  if (!overlayMessageLines()) return null;

  return (
    <div class="absolute inset-0 flex items-center justify-center flex-col gap-1 mt-16 text-center">
      <h1 class="text-4xl font-semibold text-zinc-50/75 bg-zinc-900/40 px-8 py-6 rounded-2xl">
        {overlayMessageLines().header}
      </h1>
      <For each={overlayMessageLines().subHeaders}>
        {(subHeader) => (
          <h2 class="text-3xl font-semibold text-zinc-50/50 bg-zinc-900/40 px-6 py-4 rounded-lg">
            {subHeader}
          </h2>
        )}
      </For>
    </div>
  );
}
