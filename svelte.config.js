import vercel from '@sveltejs/adapter-vercel';
import { preprocessMeltUI, sequence } from '@melt-ui/pp';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: vercel(),
		files: {
			routes: 'src/pages'
		},
		alias: {
			'$assets': './src/assets',
			'$components': './src/components',
			'$database': './src/database'
		}
	},
	preprocess: sequence([
		preprocessMeltUI()
	])
};

export default config;
