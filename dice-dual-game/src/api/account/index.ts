import Api from '../baseFetch'
const api = Api()
const controller = 'account'
const accountApi = () => {
    return {
        register: (username: string, name: string, password: string) => {
            return api.post(`${controller}/register`, {
                name,
                username,
                password,
            })!
        },
        login: (username: string, password: string) => {
            return api.post(`${controller}/login`, {
                username,
                password,
            })!
        },
    }
}
export default accountApi
