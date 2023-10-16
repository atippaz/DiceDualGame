import App from './App.vue'
import { createApp } from 'vue'
import { registerPlugins } from '@/plugins'
import { initializeContext } from './context'
const app = createApp(App)
initializeContext({})
registerPlugins(app)
app.mount('#app')
