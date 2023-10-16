import { type Plugin, type InjectionKey, ref, computed } from 'vue'
export type PluginInstance = ReturnType<typeof $context>
export const contextPluginSymbol: InjectionKey<PluginInstance> =
    Symbol('$context')

function $context() {
    const _token = ref('')
    const _userId = ref('')
    function updateToken(token: string) {
        _token.value = token
    }
    function updateUserId(userId: string) {
        _userId.value = userId
    }
    return {
        token: computed(() => _token.value),
        userId: computed(() => _userId.value),
        updateUserId,
        updateToken,
    }
}

const plugin: Plugin = {
    install: (app, options) => {
        const sample = $context()
        app.provide(contextPluginSymbol, sample)
    },
}
export default plugin
