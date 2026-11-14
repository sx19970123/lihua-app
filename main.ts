import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
import App from './App.uvue'

export function createApp() {
	const app = createSSRApp(App)
	app.use(Pinia.createPinia())
	return {
		app,
		Pinia
	}
}
