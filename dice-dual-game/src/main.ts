import App from './App.vue'
import type { InjectionKey } from 'vue'
import { createApp } from 'vue'
import { registerPlugins } from '@/plugins'
import { initializeContext, getContext } from './context'
const app = createApp(App)
initializeContext({
    app,
    inject<T>(key: InjectionKey<T>): T {
        return app._context.provides[key as any]
    },
    router: null
})
getContext().router = registerPlugins(app).router
console.debug('top level provides', app._context.provides)
app.mount('#app')
