import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		name: 'Obsidium',
		environment: 'happy-dom',
		globals: true,
		coverage: {
			provider: 'v8',
			reporter: 'html',
			enabled: false
		}
	}
});
