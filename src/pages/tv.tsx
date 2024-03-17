import { For, Show } from "solid-js";
import Home from "./home";
import { useCastReceiver } from "../signals/useCastReceiver";


export default function TV() {
    const { loadingText } = useCastReceiver();

    return (
        <>
            <Show when={!loadingText()}>
                <Show when={import.meta.env.DEV}>
                    <div class="bg-yellow-500 h-5 w-full fixed top-0 left-0 z-50 grid justify-center items-center">
                        <h1 class="text-xs font-bold text-black">Chromecast Connected</h1>
                    </div>
                </Show>

                {/* Render game as usual */}
                <Home />
            </Show>
            <Show when={loadingText()}>
                <div class="grid h-screen w-screen bg-black text-white justify-center items-center p-8">
                    <div class="bg-zinc-900 p-8 rounded-lg grid justify-center items-center gap-4">
                        <For each={loadingText()}>
                            {(line) => (
                                <h1 class="text-2xl font-bold shadow-sm text-center animate-pulse text-zinc-50">
                                    {line}
                                </h1>
                            )}
                        </For>
                    </div>
                </div>
            </Show>
        </>
    );
}


