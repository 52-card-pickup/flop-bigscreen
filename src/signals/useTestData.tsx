import { GameClientState } from "./createClient";

export function useTestData(): Partial<GameClientState> {
  const TEST_DATA: Record<
    "idle" | "waiting" | "playing" | "complete",
    Partial<GameClientState>
  > = {
    idle: {
      state: "idle",
      players: [],
    },
    waiting: {
      state: "waiting",
      players: [
        {
          name: "Alice",
          balance: 1000,
          folded: false,
          photo: null,
          turnExpiresDt: null,
        },
        {
          name: "Bob",
          balance: 1000,
          folded: false,
          photo: null,
          turnExpiresDt: null,
        },
        {
          name: "Charlie",
          balance: 1000,
          folded: false,
          photo: null,
          turnExpiresDt: null,
        },
        {
          name: "David",
          balance: 1000,
          folded: false,
          photo: null,
          turnExpiresDt: null,
        },
      ],
    },
    playing: {
      state: "playing",
      players: [
        {
          name: "Alice",
          balance: 1000,
          folded: false,
          photo: null,
          turnExpiresDt: null,
        },
        {
          name: "Bob",
          balance: 1000,
          folded: false,
          photo: null,
          turnExpiresDt: null,
        },
        {
          name: "Charlie",
          balance: 1000,
          folded: false,
          photo: null,
          turnExpiresDt: null,
        },
        {
          name: "David",
          balance: 1000,
          folded: false,
          photo: null,
          turnExpiresDt: null,
        },
      ],
      pot: 100,
      cards: [
        ["hearts", "ace"],
        ["hearts", "king"],
        ["hearts", "queen"],
        ["hearts", "jack"],
        ["hearts", "10"],
      ],
    },
    complete: {
      state: "complete",
      players: [
        {
          name: "Bob",
          balance: 1255,
          folded: false,
          photo: null,
          turnExpiresDt: null,
        },
        {
          name: "Ann",
          balance: 745,
          folded: false,
          photo: null,
          turnExpiresDt: null,
        },
      ],
      pot: 0,
      cards: [
        ["spades", "2"],
        ["hearts", "2"],
        ["diamonds", "7"],
        ["diamonds", "5"],
        ["hearts", "6"],
      ],
      completed: {
        winnerName: "Bob",
        winningHand: "Two Pair",
        playerCards: [
          [
            ["clubs", "6"],
            ["clubs", "5"],
          ],
          [
            ["clubs", "king"],
            ["spades", "queen"],
          ],
        ],
      },
    },
  };
  const query = new URLSearchParams(window.location.search);
  switch (query.get("state")) {
    case "idle":
      return TEST_DATA.idle;
    case "waiting":
      return TEST_DATA.waiting;
    case "playing":
      return TEST_DATA.playing;
    case "complete":
      return TEST_DATA.complete;
    default:
      return TEST_DATA.idle;
  }
}
