import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { IconBuildPlugin } from "./plugins/buildIcons";

export default defineConfig({
	plugins: [
		uni(), 
		IconBuildPlugin()],
	optimizeDeps: {
		exclude: ['sard-uniapp'],
	},
	css: {
		preprocessorOptions: {
			scss: {
				silenceDeprecations: ['import', 'legacy-js-api']
			},
		},
	},
});