import { io, type Socket } from 'socket.io-client'
const path = import.meta.env.VITE_API_GAME_SERVER || ''
export default () => {
    const socket: Socket = io(path)
    return {
        socket,
    }
}
