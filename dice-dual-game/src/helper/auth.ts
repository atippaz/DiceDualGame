import router from '@/router/index'
import { inject } from 'vue'
import _accountApi from '../api/account/index'
import { contextPluginSymbol } from '@/plugins/context'
import VueJwtDecode from 'vue-jwt-decode'
const context = inject(contextPluginSymbol)
const accountApi = _accountApi()
function setToken(token: string) {
    localStorage.setItem('userToken', token)
}
function logout(): void {
    localStorage.removeItem('userToken')
    router.push({ name: 'Home' })
}
function login(username: string, password: string) {
    accountApi.login(username, password).then((e) => {
        if (e.statusCode === 200) {
            const token = e.data.token
            setToken(token)
            const decoded = VueJwtDecode.decode(token)
            context?.updateToken(token)
            context?.updateUserId(decoded.userId)
            router.push({ name: 'Home' })
            console.log('go home nah')
        }
    })
}
function isLogin() {
    return localStorage.getItem('userToken') === '' ||
        !localStorage.getItem('userToken')
        ? false
        : true
}
function goToLoginPage() {
    logout()
    router.push({ name: 'Login' })
}
export { setToken, goToLoginPage, isLogin, login, logout }
