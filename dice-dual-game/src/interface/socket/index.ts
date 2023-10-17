export interface RoomGameData {
    started: boolean
    roomId: string
    roomName: string
    gameType: number
    players: Player[]
    maxPlayer: number
    owner: string
    canStart: boolean
}
export interface Player {
    player: string
    playerId: string
}
