import { For, createEffect, createSignal } from "solid-js";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

type GameClientState = {
  state: "offline" | "idle" | "waiting" | "playing" | "complete";
  players: {
    name: string;
    balance: number;
  }[];
  pot: number;
  cards: [CardSuite, CardValue][];
  lastUpdate: number;
};

function createClient() {
  const url = import.meta.env.VITE_API_URL as string;
  const [state, setState] = createSignal<GameClientState>({
    state: "idle",
    players: [],
    pot: 0,
    cards: [],
    lastUpdate: 0,
  });

  createEffect(() => {
    const abortController = new AbortController();
    let timeout: number;

    async function get() {
      const data: GameClientState | null = await fetch(url, {
        signal: abortController.signal,
      })
        .then((res) => (res.ok ? res.json() : Promise.reject<null>(res)))
        .catch(() => {
          setState((prev) => ({ ...prev, state: "offline" }));
          return null;
        });
      if (data && data.lastUpdate > state().lastUpdate) {
        setState(data);
      }
      timeout = setTimeout(get, 1000);
    }

    get();

    return () => {
      if (timeout) clearTimeout(timeout);
      abortController.abort();
    };
  });

  return state;
}

export default function Home() {
  const client = createClient();

  const players = () => client().players;
  const cards = () => client().cards;
  const pot = () => client().pot;

  return (
    <section class="bg-zinc-900 text-gray-700 p-8 h-screen w-screen">
      <div class="grid justify-center items-center gap-4">
        <h1 class="text-4xl font-bold my-6 shadow-sm text-center">flop.</h1>
        <div class="grid justify-center items-center">
          <div class="grid grid-cols-5 gap-4 rounded-[2rem] bg-green-950 p-8 ring-8 ring-green-900 shadow-lg">
            <For each={cards()}>
              {([suite, value], index
              ) => <Card suite={suite} value={value} key={index()} />}
            </For>
          </div>
        </div>
        <div class="grid justify-center items-center gap-4">
          <span class="text-4xl font-bold my-2 text-zinc-50 py-2">
            {currency.format(pot())}
          </span>
          {/* <img class="h-24" src="/savings-pig.apng" alt="Piggy Bank" /> */}
        </div>
        <div class="grid justify-center items-center gap-8 auto-cols-fr grid-flow-col px-12">
          <For each={players()}>
            {(player, index) => (
              <div class="row-start-1 grid justify-center items-center gap-4 rounded-lg bg-zinc-900 p-4 ring-4 ring-zinc-600 shadow-lg"
                data-index={index()}
              >
                <span class="text-3xl font-bold text-zinc-300 text-center">
                  {player.name}
                </span>
                <span class="text-xl font-bold text-teal-300 text-center">
                  {currency.format(player.balance)}
                </span>
              </div>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}

type CardSuite = "hearts" | "diamonds" | "clubs" | "spades";
type CardValue =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "jack"
  | "queen"
  | "king"
  | "ace";

function Card({ suite, value, key }: { suite: CardSuite; value: CardValue; key?: number }) {
  return (
    <img src={`/cards/${suite}_${value}.svg`} alt={`${value} of ${suite}`} data-key={key} />
  );
}
