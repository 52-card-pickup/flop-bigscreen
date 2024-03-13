import { For, Show, createEffect, createSignal } from "solid-js";

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
    turnExpiresDt: number | null;
  }[];
  pot: number;
  cards: [CardSuite, CardValue][];
  lastUpdate: number;
};

function createClient() {
  const url = import.meta.env.VITE_API_URL as string;
  const [state, setState] = createSignal<GameClientState>(
    {
      state: "idle",
      players: [],
      pot: 0,
      cards: [],
      lastUpdate: 0,
    },
    { name: "game-client", equals: (a, b) => a.lastUpdate === b.lastUpdate }
  );

  createEffect((cleanup: () => void
  ) => {
    if (cleanup) cleanup();
    const abortController = new AbortController();
    let timeout: number;
    let data: GameClientState | null = null;

    async function get() {
      const requestUrl = data?.lastUpdate ? `${url}?since=${data.lastUpdate}` : url;
      data = await fetch(requestUrl, {
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

  return () => state();
}

export default function Home() {
  const client = createClient();

  const players = () => client().players;
  const cards = () => client().cards;
  const pot = () => client().pot;

  const [activePlayer, setActivePlayer] = createSignal<{
    idx: number;
    countdown: number | null;
  } | null>(null);

  const playerCountdown = (turnExpiresDt: number | null) => {
    if (!turnExpiresDt) return null;
    const now = Date.now();
    const expires = new Date(turnExpiresDt).getTime();
    const diff = expires - now;
    return diff > 0 ? Math.round(diff / 1000) : null;
  };

  createEffect((interval?: number) => {
    if (interval) {
      clearInterval(interval);
    }

    const players = client().players;
    const activePlayers = players.filter((p) => p.turnExpiresDt !== null);
    const active = activePlayers.sort(
      (a, b) => b.turnExpiresDt! - a.turnExpiresDt!
    )[0];
    if (!active) {
      setActivePlayer(null);
      return;
    }
    return setInterval(() => {
      setActivePlayer({
        idx: players.findIndex(
          (p) => p.turnExpiresDt === active.turnExpiresDt
        ),
        countdown: playerCountdown(active.turnExpiresDt),
      });
    }, 1000);
  });


  return (
    <section class="bg-zinc-900 text-gray-700 p-8 h-screen w-screen">
      <div class="flex flex-col justify-center items-center gap-4">
        <h1 class="text-4xl font-bold my-6 shadow-sm text-center">flop.</h1>
        <div class="grid justify-center items-center">
          <div class="grid grid-cols-5 gap-4 rounded-[4rem] bg-green-950 p-16 ring-8 ring-green-900 shadow-lg min-w-[80vw] min-h-[200px]">
            <For each={cards()}>
              {([suite, value], index) => (
                <Card suite={suite} value={value} key={index()} />
              )}
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
              <div
                classList={{
                  "row-start-1 grid justify-center items-center gap-4 rounded-lg bg-zinc-900 p-6 shadow-lg":
                    true,
                  "ring-4 ring-zinc-600": index() !== activePlayer()?.idx,
                  "ring-8 ring-teal-100": index() === activePlayer()?.idx,
                }}
                data-index={index()}
              >
                <span class="text-3xl font-bold text-zinc-300 text-center">
                  {player.name}
                </span>
                <div class="grid justify-center items-center gap-4 relative">
                  <span class="text-xl font-bold text-teal-300 text-center">
                    {currency.format(player.balance)}
                  </span>

                  <Show when={index() === activePlayer()?.idx}>
                    <span
                      classList={{
                        "text-xl font-bold text-center absolute -bottom-16 w-full":
                          true,
                        "text-white": activePlayer()!.countdown > 5,
                        "text-red-400 animate-pulse":
                          activePlayer()!.countdown <= 5,
                      }}
                    >
                      {activePlayer()?.countdown}
                    </span>
                  </Show>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}

function CardTable({ cards }: { cards: [CardSuite, CardValue][] }) {
  console.log(cards);
  return (
    <div class="grid justify-center items-center">
      <div class="grid grid-cols-5 gap-4 rounded-[2rem] bg-green-950 p-8 ring-8 ring-green-900 shadow-lg">
        <For each={cards}>
          {([suite, value], index) => (
            <Card suite={suite} value={value} key={index()} />
          )}
        </For>
      </div>
    </div>
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

function Card({
  suite,
  value,
  key,
}: {
  suite: CardSuite;
  value: CardValue;
  key?: number;
}) {
  return (
    <img
      src={`/cards/${suite}_${value}.svg`}
      alt={`${value} of ${suite}`}
      data-key={key}
    />
  );
}
