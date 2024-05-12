import { Show } from "solid-js";
import { GameClientState, createClient } from "../signals/createClient";
import { Players } from "../components/Players";
import { Ticker } from "../components/Ticker";
import { FlopLayout } from "../components/FlopLayout";
import { useTestData } from "../signals/useTestData";

export default function Home() {
  const testState = useTestData();
  const initialState = import.meta.env.MODE === "development" ? testState : {};
  const client = createClient(initialState);
  const ticker = () => client().ticker;
  return (
    <section
      class="bg-zinc-900 text-gray-700 grid justify-center h-screen w-screen overflow-auto"
      data-component-name="Home"
    >
      <Show when={client().state === "idle"}>
        <Idle client={client} />
      </Show>
      <Show when={client().state === "waiting"}>
        <Waiting client={client} />
      </Show>
      <Show when={client().state === "playing"}>
        <RoundOverview client={client} />
      </Show>
      <Show when={client().state === "complete"}>
        <RoundComplete client={client} />
      </Show>
      <Ticker ticker={ticker} />
    </section>
  );
}

function Idle({ client }: { client: () => GameClientState }) {
  return (
    <FlopLayout cards={() => []}>
      <div></div>
      <div>
        <p class="text-base text-center xl:text-3xl xl:pb-4">
          Grab your friends and join the game!
        </p>
        <h3 class="text-2xl font-bold shadow-sm text-center text-zinc-50 xl:text-5xl">
          flop.party
        </h3>
      </div>
    </FlopLayout>
  );
}

function Waiting({ client }: { client: () => GameClientState }) {
  const players = () => client().players;
  const cards = () => [];
  const overlayMessage = () =>
    players().length
      ? [
          "Waiting for more players to join...",
          `${players().length} players joined`,
        ]
      : "Waiting for players to join...";
  return (
    <FlopLayout cards={cards} overlayMessage={overlayMessage}>
      <div></div>
      <div>
        <Show when={players().length > 0}>
          <Players players={players} />
        </Show>
        <Show when={players().length === 0}>
          <p class="text-base text-center xl:text-3xl xl:pb-4">
            Grab your friends and join the game!
          </p>
          <h3 class="text-2xl font-bold shadow-sm text-center text-zinc-50 xl:text-5xl">
            flop.party
          </h3>
        </Show>
      </div>
    </FlopLayout>
  );
}

export const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

function RoundOverview({ client }: { client: () => GameClientState }) {
  const players = () => client().players;
  const cards = () => client().cards;
  const pot = () => client().pot;

  return (
    <FlopLayout cards={cards}>
      <div></div>
      <div class="grid w-full h-full relative">
        <div class="grid justify-center items-center gap-4 absolute w-full -top-12">
          <span class="text-4xl font-bold mb-2 text-zinc-50 pb-2">
            {currency.format(pot())}
          </span>
        </div>
        <Players players={players} />
      </div>
    </FlopLayout>
  );
}

function RoundComplete({ client }: { client: () => GameClientState }) {
  const players = () => client().players;
  const completed = () => client().completed;
  const cards = () => client().cards;

  const winner = () => {
    const state = completed();
    if (!state || !state.winnerName || !state.winningHand) return null;
    return {
      name: state.winnerName,
      hand: state.winningHand,
    };
  };

  return (
    <FlopLayout cards={cards}>
      <Show when={winner()} fallback={<div></div>}>
        <div class="grid justify-center items-center gap-4 place-self-end">
          <h1 class="text-3xl font-bold my-0 pb-4 shadow-sm text-center text-zinc-300">
            {`${winner().name} wins with a ${winner().hand}`}
          </h1>
        </div>
      </Show>
      <div class="grid w-full h-full">
        <Players players={players} completed={completed} />
      </div>
    </FlopLayout>
  );
}
