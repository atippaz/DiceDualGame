import { v4 as uuidv4 } from 'uuid'

export default (socket, store) => {
    return {
        onGetAll: (req, res) => {
            try {
                res.status(200).json(store.state.room)
            } catch (er) {
                console.log(er)
            }
        },
        createNewRoom: (req, res) => {
            const idRoom = uuidv4()
            const playerId = uuidv4()
            const {playerName,roomName} = req.body 
            if (store.services.room.createNewRoom(idRoom, roomName)) {
                if (store.services.room.joinRoom(idRoom,playerId,playerName)) {
                    res.status(200).json({roomId:idRoom,playerId:playerId})
                }
            }
        },
        joinRoom: (req, res) => {
            const {roomId,playerName} = req.body 
            const playerId = uuidv4()
            if (store.services.room.joinRoom(roomId,playerId,playerName)) {
                res.status(200).json({roomId:roomId,playerId:playerId})
            }
        },
    }
}
