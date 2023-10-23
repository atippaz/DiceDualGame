/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import router from '../router'
import context from './context'
// Types
import type { App } from 'vue'

export function registerPlugins(app: App) {
    app.use(vuetify)
    app.use(context)
    app.use(router)
    return {
        router,
        vuetify,
        context
    }
}
