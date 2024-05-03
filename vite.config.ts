import { defineConfig, loadEnv } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig(({ command, mode }) => {
    /*@ts-ignore*/
    const env = loadEnv(mode, process.cwd(), '')

    return ({
        plugins: [
            /*
            Uncomment the following line to enable solid-devtools.
            For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
            */
            // devtools(),
            solidPlugin(),
        ],
        server: {
            port: 3000,
            proxy: {
                '/api': 'http://127.0.0.1:5005',
                '/play': 'http://127.0.0.1:10000',
            }
        },
        build: {
            target: 'esnext',
        },
        base: env.VITE_BASE_URL || '/',
    });
});
