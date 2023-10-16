import Api from '../baseFetch'
const api = Api()
const controller = 'xoGame'
const xoGameApi = () => {
    return {
        getAll: () => {
            return api.get(controller)!
        },
        getOne: (roomId: string) => {
            return api.get(controller, roomId)!
        },
        createRoom: () => {
            return api.get(controller)!
        },
    }
}
export default xoGameApi
