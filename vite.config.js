import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import icons from 'unplugin-icons/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';

export default defineConfig({
	plugins: [
		sveltekit(),
		icons({
			compiler: 'svelte',
			customCollections: {
				custom: FileSystemIconLoader(
					'./src/assets/images/'
				)
			}
		})
	]
});
