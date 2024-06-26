import { createSignal, onCleanup } from "solid-js";

export type GameClientState = {
  state: "offline" | "idle" | "waiting" | "playing" | "complete";
  players: {
    name: string;
    balance: number;
    folded: boolean;
    photo: string | null;
    colorHue?: number | null;
    turnExpiresDt: number | null;
  }[];
  pot: number;
  cards: [CardSuite, CardValue][];
  ticker: string | null;
  completed: CompletedGame | null;
  lastUpdate: number;
};

export type CompletedGame = {
  winnerName: string | null;
  winningHand: string | null;
  playerCards: (PlayerHand | null)[];
};

type PlayerHand = [[CardSuite, CardValue], [CardSuite, CardValue]];

export type CardSuite = "hearts" | "diamonds" | "clubs" | "spades";
export type CardValue =
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

/**
 * Returns the base URL of the API.
 * @returns {string} The base URL of the API. Example: `https://flop.party/api`
 */
export function apiURL() {
  const url = import.meta.env.VITE_API_URL as string;
  // take url path segments up to /api
  const segments = url.split("/");
  for (let i = 0; i < segments.length; i++) {
    if (segments[i] === "api") {
      return segments.slice(0, i + 1).join("/");
    }
  }
  throw new Error("Invalid API URL");
}

export function createClient(defaultState: Partial<GameClientState> = {}) {
  const query = new URLSearchParams(window.location.search);
  const url = import.meta.env.VITE_API_URL as string;

  const [state, setState] = createSignal<GameClientState>(
    {
      state: "idle",
      players: [],
      pot: 0,
      cards: [],
      ticker: null,
      completed: null,
      lastUpdate: 0,
      ...defaultState,
    },
    { name: "game-client", equals: (a, b) => a.lastUpdate === b.lastUpdate }
  );

  const abortController = new AbortController();
  let timeout: number;
  let maxWaitMs: number = 1000;
  let data: GameClientState | null = null;

  async function get() {
    const requestUrl = data?.lastUpdate
      ? `${url}?timeout=15000&since=${data.lastUpdate}`
      : url;

    const before = Date.now();
    data = await fetch(requestUrl, {
      signal: abortController.signal,
    })
      .then((res) => (res.ok ? res.json() : Promise.reject<null>(res)))
      .catch(() => {
        setState((prev) => ({ ...prev, state: "offline" }));
        maxWaitMs = Math.min(30000, maxWaitMs * 2);
        console.error(`Failed to fetch game state, retrying in ${maxWaitMs}ms`);
        return null;
      });

    if (data && data.lastUpdate > state().lastUpdate) {
      maxWaitMs = 1000;
      setState(data);
    }
    const elapsed = Date.now() - before;
    timeout = setTimeout(get, Math.max(0, maxWaitMs - elapsed));
  }

  if (!query.get("offline")) {
    get();
  }

  onCleanup(() => {
    if (timeout) clearTimeout(timeout);
    abortController.abort();
  });

  return () => state();
}
