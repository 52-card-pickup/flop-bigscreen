import { For, Show, createEffect, createSignal } from "solid-js";
import { CompletedGame, GameClientState } from "../signals/createClient";
import { currency } from "../pages/home";

export function Players({
    players,
    completed,
}: {
    players: () => GameClientState["players"];
    completed?: CompletedGame;
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
        return diff > 0 ? Math.round(diff / 1000) : null;
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
            class="grid justify-center items-center gap-8 auto-cols-fr grid-flow-col px-12"
            data-component-name="Players"
        >
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
                        <Show when={completed}>
                            <div class="grid justify-center items-center gap-4 grid-cols-2 max-w-36 place-self-center">
                                {completed.playerCards[index()].map((card, idx) => (
                                    <img
                                        src={`/cards/${card[0]}_${card[1]}.svg`}
                                        alt={`${card[1]} of ${card[0]}`}
                                        data-key={idx}
                                        class="w-16"
                                    />
                                ))}
                            </div>
                        </Show>
                        <span class="text-2xl font-bold text-zinc-300 text-center">
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
    );
}
