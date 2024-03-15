import { createEffect, createSignal } from "solid-js";

export type GameClientState = {
    state: "offline" | "idle" | "waiting" | "playing" | "complete";
    players: {
        name: string;
        balance: number;
        turnExpiresDt: number | null;
    }[];
    pot: number;
    cards: [CardSuite, CardValue][];
    completed: CompletedGame | null;
    lastUpdate: number;
};

export type CompletedGame = {
    winnerIdx: number;
    winningHand: string;
    playerCards: [[CardSuite, CardValue], [CardSuite, CardValue]][];
};

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

export function createClient() {
    const url = import.meta.env.VITE_API_URL as string;
    const [state, setState] = createSignal<GameClientState>(
        {
            state: "idle",
            players: [],
            pot: 0,
            cards: [],
            completed: null,
            lastUpdate: 0,
        },
        { name: "game-client", equals: (a, b) => a.lastUpdate === b.lastUpdate }
    );

    createEffect((cleanup: () => void) => {
        if (cleanup) cleanup();
        const abortController = new AbortController();
        let timeout: number;
        let data: GameClientState | null = null;

        async function get() {
            const requestUrl = data?.lastUpdate
                ? `${url}?since=${data.lastUpdate}`
                : url;
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
