import { Show } from "solid-js";
import { GameClientState, createClient } from "../signals/createClient";
import { Players } from "../components/Players";
import { Ticker } from "../components/Ticker";
import { FlopLayout } from "../components/FlopLayout";
import { useTestData } from "../signals/useTestData";
import { Typewriter, TypewriterClass } from "../components/Typewriter";
import { useParams } from "@solidjs/router";
import useSpotifyPlayer from "../signals/useSpotifyPlayer";

const FLOP_URL_ORIGIN = import.meta.env.VITE_ORIGIN_URL || "flop.party";

export default function Home() {
  const params = useParams<{
    roomCode?: string;
  }>();
  const testState = useTestData();
  const initialState = import.meta.env.MODE === "development" ? testState : {};
  const client = createClient(params.roomCode, initialState);
  const ticker = () => client().ticker;

  useSpotifyPlayer(client().spotifyAccessToken);

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
          {FLOP_URL_ORIGIN}
        </h3>
        <h2 class="text-2xl pt-8 font-normal text-center animate-pulse">
          (tip: create a room on your mobile device and open the link on this
          screen)
        </h2>
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

  function startTypewriter(typewriter: TypewriterClass) {
    typewriter
      .pauseFor(500)
      .typeString(FLOP_URL_ORIGIN)
      .pauseFor(10_000)
      .deleteAll()
      .typeString(`https://${FLOP_URL_ORIGIN}`)
      .pauseFor(5_000)
      .deleteAll()
      .start();
  }
  return (
    <FlopLayout
      cards={cards}
      overlayMessage={overlayMessage}
      roomCode={() => client().roomCode}
    >
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
            <Typewriter autoStart={false} onInit={startTypewriter}>
              {FLOP_URL_ORIGIN}
            </Typewriter>
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
    <FlopLayout
      cards={cards}
      overlayElement={() => (
        <div class="grid w-full h-full relative">
          <div class="grid justify-center items-center gap-4 absolute w-full bottom-0">
            <span class="text-3xl font-semibold text-zinc-50 py-3">
              {currency.format(pot())}
            </span>
          </div>
        </div>
      )}
    >
      <div></div>
      <div class="grid w-full h-full">
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
    <FlopLayout
      cards={cards}
      roomCode={() => client().roomCode}
      overlayElement={() => (
        <Show when={winner()} fallback={<div></div>}>
          <div class="grid justify-center items-center gap-4 absolute w-full top-0">
            <h1 class="text-4xl font-semibold py-6 shadow-sm text-center text-green-50">
              <Typewriter loop={false}>
                {`${winner().name} wins with a ${winner().hand}`}
              </Typewriter>
            </h1>
          </div>
        </Show>
      )}
    >
      <div></div>
      <div class="grid w-full h-full">
        <Players players={players} completed={completed} />
      </div>
    </FlopLayout>
  );
}
