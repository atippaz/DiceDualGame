import Api from '../baseFetch'
const api = Api()
const controller = 'xoGame'
const xoGameApi = () => {
    return {
        getAll: () => {
            return api.get(`${controller}/getAll`)!
        },
        getOne: (roomId: string) => {
            return api.get(`${controller}/getRoomId`, roomId)!
        },
        createRoom: (roomName: string) => {
            return api.post(`${controller}/createRoom`, {
                roomName,
            })!
        },
        hasRoom: (roomId: string) => {
            return api.post(`${controller}/hasRoom`, {
                roomId,
            })!
        },
        joinRoom: (roomId: string, playerName: string) => {
            return api.post(`${controller}/joinRoom`, {
                roomId,
                playerName,
            })!
        },
    }
}
export default xoGameApi
