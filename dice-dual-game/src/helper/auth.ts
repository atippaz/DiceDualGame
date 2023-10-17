import router from '@/router/index'
import { getContext } from '@/context'
import _accountApi from '../api/account/index'
import { contextPluginSymbol } from '@/plugins/context'
import jwt_decode from 'jwt-decode'
const context = getContext().inject(contextPluginSymbol)
const accountApi = _accountApi()
function setToken(token: string) {
    localStorage.setItem('userToken', token)
}
function logout(): void {
    localStorage.removeItem('userToken')
    router.push({ name: 'Home' })
    context?.syncToken()
}

function login(username: string, password: string) {
    accountApi.login(username, password).then((e) => {
        if (e.statusCode === 200) {
            const token = e.data.token as string
            setToken(token)
            const decoded = jwt_decode(token) as any
            console.log(context)
            console.log(token)
            console.log(decoded)

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
function register(name: string, username: string, password: string) {
    accountApi.register(username, name, password).then((e) => {
        if (e.statusCode === 201) {
            const token = e.data.token as string
            setToken(token)
            const decoded = jwt_decode(token) as any
            context?.updateToken(token)
            context?.updateUserId(decoded.userId)
            router.push({ name: 'Home' })
        }
    })
}
function goToLoginPage() {
    router.push({ name: 'Login' })
}
function goToRegisterPage() {
    router.push({ name: 'Register' })
}
export {
    setToken,
    goToLoginPage,
    isLogin,
    login,
    logout,
    goToRegisterPage,
    register,
}
