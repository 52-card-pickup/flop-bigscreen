import { createSignal, createEffect, onCleanup } from 'solid-js';
import { createScriptLoader } from './createScriptLoader';

const spotifyScript = "https://sdk.scdn.co/spotify-player.js";

interface SpotifyPlayer {
    connect: () => void;
    disconnect: () => void;
    _options: { getOAuthToken: (cb: (token: string) => void) => void };
}

const useSpotifyPlayer = (accessToken?: string) => {
    const { loaded } = createScriptLoader([spotifyScript]);
    const [player, setPlayer] = createSignal<SpotifyPlayer>(null);

    createEffect(() => {
        if (!loaded()) return;
        if (!accessToken) return;

        // Initialize Spotify Player if not already created
        if (!player()) {
            // @ts-expect-error
            window.onSpotifyWebPlaybackSDKReady = () => {
                // @ts-expect-error
                const spotifyPlayer = new window.Spotify.Player({
                    name: 'Flop Poker',
                    getOAuthToken: cb => { cb(accessToken); },
                    volume: 0.5
                });
                console.log('Spotify Player initialized with '
                    + accessToken
                );
                setPlayer(spotifyPlayer);
                spotifyPlayer.connect();
            };
        } else {
            // Update the getOAuthToken function if accessToken changes
            player()._options.getOAuthToken = cb => cb(accessToken);
            player().connect();
        }

        // Cleanup on unmount
        onCleanup(() => {
            if (player()) {
                player().disconnect();
                setPlayer(null);
            }
        });
    });
};

export default useSpotifyPlayer;
