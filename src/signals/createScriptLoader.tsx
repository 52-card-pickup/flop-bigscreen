import { createEffect, createSignal } from "solid-js";

export function createScriptLoader(src_urls: string[]) {
    const [loaded, setLoaded] = createSignal(false);
    createEffect(() => {
        let loaded = 0;

        for (const src of src_urls) {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                loaded++;
                if (loaded !== src_urls.length) return;
                setTimeout(() => {
                    setLoaded(true);
                    console.log(`Scripts loaded, count: ${loaded}`);
                }, 250);
            };
            script.onerror = () => {
                console.error("Failed to load script", src);
            };
            document.head.appendChild(script);
        }
    });

    return { loaded };
}
