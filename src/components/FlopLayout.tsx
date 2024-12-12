import { Accessor, For, JSX, Show, children } from "solid-js";
import { CardSuite, CardValue } from "../signals/createClient";
import { CardTable } from "./CardTable";
import { FlopContainer } from "./FlopContainer";
import { memo } from "solid-js/web";

export function FlopLayout(props: {
  cards: () => [CardSuite, CardValue][];
  pairCode?: Accessor<string>;
  roomCode?: Accessor<string>;
  overlayMessage?: Accessor<string | string[]>;
  overlayElement?: Accessor<JSX.Element>;
  children: [JSX.Element, JSX.Element];
}) {
  const safeChildren = children(() => props.children);
  const sections = () => safeChildren.toArray();

  return (
    <FlopContainer>
      <div class="grid justify-center items-center gap-0 grid-cols-[1fr,14fr,1fr] grid-rows-[1fr,4fr,5fr] w-screen h-screen">
        <div class="grid justify-center items-center gap-4 bg-zinc-800/0 rounded-lg"></div>
        <div class="grid justify-center items-center gap-4">
          {sections()[0]}
        </div>
        <div class="grid justify-center items-center gap-4 bg-zinc-800/0 rounded-lg"></div>

        <div class="grid justify-center items-center gap-4 bg-zinc-800/0 rounded-lg"></div>
        <div class="grid relative">
          <CardTable cards={props.cards} variant="large" />
          <OverlayMessage message={props.overlayMessage} />
          <Show when={props.overlayElement}>{props.overlayElement()}</Show>
        </div>
        <div class="grid justify-center items-center gap-4 bg-zinc-800/0 rounded-lg"></div>

        <div class="grid justify-center items-center gap-4 bg-zinc-800/0 rounded-lg"></div>
        <div class="grid justify-center items-center gap-4">
          {sections()[1]}
        </div>
        <div class="grid justify-center items-center gap-4 bg-zinc-800/0 rounded-lg"></div>
      </div>
      <Show when={props.roomCode}>
        <RoomCode roomCode={props.roomCode} />
      </Show>
      <Show when={props.pairCode}>
        <PairCode pairCode={props.pairCode} />
      </Show>
    </FlopContainer>
  );
}

function RoomCode(props: { roomCode: Accessor<string> }) {
  return (
    <div class="absolute top-6 left-6 grid justify-center items-center gap-3">
      <span class="text-3xl font-normal uppercase opacity-80 text-center">
        Join the room:
      </span>
      <span class="text-5xl font-semibold text-center bg-zinc-900/40 px-4 rounded-lg">
        {props.roomCode()}
      </span>
    </div>
  );
}

function PairCode(props: { pairCode: Accessor<string> }) {
  function TipBadge() {
    return (
      <span class="absolute top-0 right-0 w-8 h-8 transform translate-x-1/2 -translate-y-1/2">
        <span class="absolute w-8 h-8 bg-watercourse-900 rounded-md transform rotate-45" />
        <span class="absolute w-8 h-8 bg-watercourse-800 rounded-md transform rotate-45 animate-pulse" />
        <span class="absolute w-8 h-8 flex justify-center items-center">
          <span class="text-xs font-semibold uppercase text-watercourse-200">
            Tip
          </span>
        </span>
      </span>
    );
  }

  return (
    <div class="absolute top-10 right-10 grid justify-center items-center gap-3 bg-zinc-950 rounded-2xl border-4 border-watercourse-950 shadow-md shadow-black/30 opacity-95">
      <span class="grid justify-center items-center">
        <TipBadge />
        <p class="text-xl font-medium text-center text-watercourse-100 max-w-[20ch] py-2 px-4 bg-watercourse-950">
          Tap{" "}
          <span class="text-watercourse-50 text-nowrap">
            'Link with TV code'
          </span>{" "}
          on your phone
        </p>
        <span class="grid justify-center items-center gap-1 py-2 px-4">
          <h3 class="text-xl font-medium text-center text-watercourse-50/70">
            TV CODE
          </h3>
          <span class="text-4xl font-semibold text-center text-watercourse-50 rounded-lg">
            {props.pairCode()}
          </span>
        </span>
      </span>
    </div>
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
