import { Accessor, Index, Show, createEffect, createSignal } from "solid-js";
import {
  CompletedGame,
  GameClientState,
  apiURL,
} from "../signals/createClient";
import { currency } from "../pages/home";
import { Card } from "./Card";
import { PlayerName } from "./PlayerName";

export function Players({
  players,
  completed,
}: {
  players: () => GameClientState["players"];
  completed?: () => CompletedGame;
}) {
  const [activePlayer, setActivePlayer] = createSignal<{
    idx: number;
    countdown: number | null;
  } | null>(null);

  const playerCountdown = (turnExpiresDt: number | null) => {
    if (!turnExpiresDt) return null;
    const now = Date.now();
    const expires = new Date(turnExpiresDt).getTime();
    const diff = expires - now;
    return diff > 0 ? Math.ceil(diff / 1000) : null;
  };

  createEffect((interval?: number) => {
    if (interval) {
      clearInterval(interval);
    }

    const p = players();
    const activePlayers = p.filter((p) => p.turnExpiresDt !== null);
    const active = activePlayers.sort(
      (a, b) => b.turnExpiresDt! - a.turnExpiresDt!
    )[0];
    if (!active) {
      setActivePlayer(null);
      return;
    }
    return setInterval(() => {
      setActivePlayer({
        idx: p.findIndex((p) => p.turnExpiresDt === active.turnExpiresDt),
        countdown: playerCountdown(active.turnExpiresDt),
      });
    }, 1000);
  });

  return (
    <div
      class="grid justify-center items-center gap-8 auto-cols-fr grid-flow-col px-12 relative"
      data-component-name="Players"
    >
      <Index each={players()}>
        {(player, index) => (
          <div
            class="grid grid-rows-[auto,1fr,auto] justify-center relative"
            classList={{
              "gap-2": !!completed?.(),
              "gap-4": !completed?.(),
            }}
          >
            <div
              class="grid justify-center items-center transform transition-all duration-300 ease-in-out"
              classList={{
                "translate-y-0": !player().folded,
                "translate-y-24 opacity-50": player().folded,
              }}
            >
              <span class="text-2xl font-semibold text-teal-300 text-center">
                {currency.format(player().balance)}
              </span>
            </div>
            <div class="grid justify-center items-center h-full [perspective:120px] [perspective-origin:bottom]">
              <div
                classList={{
                  "grid justify-center gap-4 relative h-full rounded-full bg-zinc-900 transform [transform-origin:bottom] transition duration-300 ease-in-out":
                    true,
                  "ring-4 ring-zinc-600": index !== activePlayer()?.idx,
                  "ring-8 ring-teal-100": index === activePlayer()?.idx,
                  "shadow-xs shadow-transparent translate-y-0":
                    !player().folded,
                  "shadow-xl shadow-black opacity-30 translate-y-8 [transform:rotateX(35deg)]":
                    player().folded,
                }}
                data-index={index}
              >
                <PlayerImage player={player} />
              </div>
            </div>
            <div class="absolute grid justify-center items-center gap-4 w-full h-8 bottom-4">
              <Show when={index === activePlayer()?.idx}>
                <span
                  class="text-xl font-semibold text-center absolute -bottom-16 w-full xl:text-2xl"
                  classList={{
                    "text-white": activePlayer()!.countdown > 5,
                    "text-red-400 animate-pulse":
                      activePlayer()!.countdown <= 5,
                  }}
                >
                  {activePlayer()?.countdown}
                </span>
              </Show>
            </div>
            <Show when={completed?.() && !player().folded}>
              <div class="grid justify-center items-center gap-4 mt-2 grid-cols-2 max-w-36 place-self-center">
                {completed().playerCards[index]?.map((card, idx) => (
                  <Show when={card}>
                    <Card
                      suite={card[0]}
                      value={card[1]}
                      key={idx}
                      variant="small"
                    />
                  </Show>
                ))}
              </div>
            </Show>
            <PlayerName
              name={() => player().name}
              width="calc(6vw + 6vh)"
              intervalMs={4000}
            />
          </div>
        )}
      </Index>
    </div>
  );
}

function PlayerImage({
  player,
}: {
  player: Accessor<GameClientState["players"][number]>;
}) {
  return (
    <div class="relative overflow-hidden rounded-full w-[calc(6vw+6vh)] h-[calc(6vw+6vh)]">
      <img
        src={constructPhotoUrl(player().photo)}
        alt={player().name}
        class="absolute top-0 left-0 w-full h-full object-cover"
      />
      <Show when={player().colorHue || player().colorHue === 0}>
        <div
          class="absolute top-0 left-0 w-full h-full mix-blend-multiply"
          style={{
            "background-color": `hwb(${
              player().colorHue % 360
            }deg 20% 40% / 80%)`,
          }}
        ></div>
      </Show>
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-zinc-900/80 to-transparent"></div>
    </div>
  );
}

function constructPhotoUrl(photo: string | null) {
  if (!photo) {
    return "/empty-profile.jpg";
  }
  const apiUrl = apiURL();
  return `${apiUrl}/v1/${photo}`;
}
