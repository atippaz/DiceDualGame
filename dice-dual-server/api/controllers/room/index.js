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
            console.log(store.services.room)
            const idRoom = uuidv4()
            if (store.services.room.createNewRoom(idRoom, req.body.roomName)) {
                res.status(200).json(true)
            }
        },
    }
}
