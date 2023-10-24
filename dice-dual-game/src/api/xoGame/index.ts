import Api from '../baseFetch'
const api = Api()
const controller = 'xoGame'
const xoGameApi = () => {
    return {
        getAll: () => {
            return api.get(`${controller}/getAll`)!
        },
        getCurrentRoom: () => {
            return api.get(`${controller}/getCurrentRoom`)!
        },
        getOne: (roomId: string) => {
            return api.get(`${controller}/getRoomId`, roomId)!
        },
        createRoom: (roomName: string, boardSize = 3) => {
            return api.post(`${controller}/createRoom`, {
                roomName,
                boardSize: parseInt(boardSize.toString()),
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
        resumeGame: (roomId: string) => {
            return api.post(`${controller}/resumeGame`, {
                roomId,
            })!
        },
        startGame(roomId: string) {
            return api.post(`${controller}/startGame`, {
                roomId,
            })!
        },
        getBoardGameData(roomId: string) {
            return api.get(`${controller}/getBoardGameById`, roomId)!
        },
        exitRoom(roomId: string) {
            return api.post(`${controller}/exitRoom`, roomId)!
        },
        deleteRoom(roomId: string) {
            return api.post(`${controller}/deleteRoom`, roomId)!
        },
    }
}
export default xoGameApi
