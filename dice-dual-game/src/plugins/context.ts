import { type Plugin, type InjectionKey, ref, computed } from 'vue'
export type PluginInstance = ReturnType<typeof $context>
export const contextPluginSymbol: InjectionKey<PluginInstance> =
    Symbol('$context')
import jwt_decode from 'jwt-decode'

function $context() {
    const _token = ref<string | null>('')
    const _userId = ref('')
    function updateToken(token: string) {
        if (
            token.trim() === undefined ||
            token.trim() === null ||
            token.trim() === 'undefined' ||
            token.trim() === 'null' ||
            token.trim() === ''
        ) {
            localStorage.removeItem('userToken')
            alert('token null')
            return
        }
        _token.value = token
    }
    function updateUserId(userId: string) {
        _userId.value = userId
    }
    function syncToken() {
        try {
            _token.value = localStorage.getItem('userToken') || ''
            _userId.value =
                _token.value === '' || _token.value === null
                    ? ''
                    : (jwt_decode(_token.value) as any).userId
        } catch (er) {
            console.log(er)
            alert('token error')
            localStorage.removeItem('userToken')
        }
    }
    syncToken()
    return {
        token: computed(
            () => _token.value || (localStorage.getItem('userToken') ?? '')
        ),
        userId: computed(() => _userId.value),
        updateUserId,
        updateToken,
        syncToken,
    }
}

const plugin: Plugin = {
    install: (app, options) => {
        const sample = $context()
        app.provide(contextPluginSymbol, sample)
    },
}
export default plugin
