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
export interface BoardGameData {
    board: Array<Array<string | null>>
    gameOver: boolean
    roomId: string
    roundPlayerId: string
}
