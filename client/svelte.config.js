import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import { resolve } from 'path';

const config = {
  kit: {
    adapter: adapter(),
    target: '#svelte',
    vite: {
      resolve: {
        alias: {
          $components: resolve('./src/components'),
          $stores: resolve('./src/stores'),
          $utils: resolve('./src/utils'),
        },
      },
      build: {
        // SvelteKit and Electron require assets to be inline for packaging
        assetsInlineLimit: 0,
      },
    },
  },
  preprocess: preprocess(),
};

export default config;
