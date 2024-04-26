import { Show } from "solid-js";
import { GameClientState, createClient } from "../signals/createClient";
import { Players } from "../components/Players";
import { CardTable } from "../components/CardTable";
import { FlopContainer } from "../components/FlopContainer";
import { Ticker } from "../components/Ticker";

export default function Home() {
  const client = createClient();
  const ticker = () => client().ticker;
  return (
    <section
      class="bg-zinc-900 text-gray-700 p-8 flex justify-center h-screen w-screen overflow-auto"
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
  const players = () => client().players;
  return (
    <FlopContainer>
      <div class="grid justify-center items-center gap-4 h-96">
        <h1 class="text-xl font-normal my-6 shadow-sm text-center animate-pulse text-zinc-50">
          Connecting to game server...
        </h1>
      </div>
      <Players players={players} />
    </FlopContainer>
  );
}

function Waiting({ client }: { client: () => GameClientState }) {
  const players = () => client().players;
  return (
    <FlopContainer>
      <div class="grid justify-center items-center gap-4 h-96">
        <Show when={players().length === 0}>
          <h1 class="text-4xl font-bold my-6 shadow-sm text-center animate-pulse text-zinc-50">
            Waiting for players to join...
          </h1>
        </Show>
        <Show when={players().length === 1}>
          <h1 class="text-4xl font-bold my-6 shadow-sm text-center animate-pulse text-zinc-50">
            {players().length} player has joined.
          </h1>
          <h2 class="text-2xl font-bold my-0 p-0 shadow-sm text-center text-zinc-300">
            Waiting for more players...
          </h2>
        </Show>
        <Show when={players().length > 1}>
          <h1 class="text-4xl font-bold my-6 shadow-sm text-center text-zinc-50">
            {players().length} players have joined.
          </h1>
          <h2 class="text-2xl font-bold my-0 p-0 shadow-sm text-center text-zinc-300">
            Tap "Start Game" to begin.
          </h2>
        </Show>
      </div>
      <Players players={players} />
    </FlopContainer>
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
    <FlopContainer>
      <CardTable cards={cards} />
      <div class="grid justify-center items-center gap-4">
        <span class="text-4xl font-bold my-2 text-zinc-50 py-2">
          {currency.format(pot())}
        </span>
      </div>
      <Players players={players} />
    </FlopContainer>
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
    <FlopContainer>
      <div class="grid justify-center items-center gap-8 place-self-center mb-4">
        <Show when={winner()}>
          <h1 class="text-4xl font-bold my-0 p-0 shadow-sm text-center text-zinc-300">
            {`${winner().name} wins with a ${winner().hand}`}
          </h1>
        </Show>
        <div class="grid justify-center items-center gap-4 w-2/3 justify-self-center">
          <CardTable cards={cards} variant="small" />
        </div>
      </div>
      <Players players={players} completed={completed()} />
    </FlopContainer>
  );
}
