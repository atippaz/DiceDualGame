import Api from '../baseFetch'
const api = Api()
const controller = 'gameRoom'
const roomApi = () => {
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
export default roomApi
