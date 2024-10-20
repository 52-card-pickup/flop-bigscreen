import { createSignal, onCleanup } from "solid-js";

export type GameClientState = {
  state: "offline" | "idle" | "waiting" | "playing" | "complete";
  players: {
    name: string;
    balance: number;
    emoji: string | null;
    folded: boolean;
    photo: string | null;
    colorHue?: number | null;
    turnExpiresDt: number | null;
  }[];
  pot: number;
  cards: [CardSuite, CardValue][];
  ticker: string | null;
  roomCode: string | null;
  pairScreenCode: string | null;
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

export function createClient(
  roomCode?: string,
  defaultState: Partial<GameClientState> = {}
) {
  const query = new URLSearchParams(window.location.search);
  const url = import.meta.env.VITE_API_URL as string;

  const [state, setState] = createSignal<GameClientState>(
    {
      state: "idle",
      players: [],
      pot: 0,
      cards: [],
      ticker: null,
      roomCode: null,
      pairScreenCode: null,
      completed: null,
      lastUpdate: 0,
      ...defaultState,
    },
    { name: "game-client", equals: (a, b) => a.lastUpdate === b.lastUpdate }
  );

  let abortController = new AbortController();
  let timeout: number;
  let maxWaitMs: number = 1000;
  let data: GameClientState | null = null;

  async function get() {
    const requestUrl = data?.lastUpdate
      ? `${url}?timeout=15000&since=${data.lastUpdate}`
      : url;

    const before = Date.now();
    data = await fetch(requestUrl, {
      headers: roomCode ? [["room-code", roomCode]] : [],
      signal: abortController.signal,
    })
      .then((res) => (res.ok ? res.json() : Promise.reject<null>(res)))
      .catch((e) => {
        if (e instanceof Error && e.name === "AbortError") {
          return null;
        }

        setState((prev) => ({ ...prev, state: "offline" }));
        maxWaitMs = Math.min(30000, maxWaitMs * 2);
        console.error(
          `Failed to fetch game state, retrying in ${maxWaitMs}ms`,
          e
        );
        return null;
      });

    if (data?.state === "idle") {
      if (!data.pairScreenCode) {
        console.log("Room state is idle, stopping polling");
        setState(data);
        return;
      }
      roomCode = data.roomCode ?? undefined;

      if (data.roomCode) {
        const lastState = state();
        setState({ ...lastState, lastUpdate: 0 });
      }
    }

    if (data && data.lastUpdate > state().lastUpdate) {
      maxWaitMs = 1000;
      setState(data);
    }
    const elapsed = Date.now() - before;
    timeout = setTimeout(get, Math.max(0, maxWaitMs - elapsed));
  }

  function cancel() {
    if (timeout) {
      clearTimeout(timeout);
    }
    abortController.abort();
  }

  function reset() {
    cancel();
    timeout = 0;
    abortController = new AbortController();
    maxWaitMs = 1000;
    get();
  }

  function onVisibilityChange() {
    if (document.hidden) {
      cancel();
      return;
    }
    console.log("Document is now visible, refetching game state");
    reset();
  }

  if (!query.get("offline")) {
    get();
  }

  document.addEventListener("visibilitychange", onVisibilityChange);

  onCleanup(() => {
    cancel();
    document.removeEventListener("visibilitychange", onVisibilityChange);
  });

  return () => state();
}
