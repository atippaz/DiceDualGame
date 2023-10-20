<template>
    <div
        v-if="detail"
        class="w-100 h-100"
        style="background-color: rgb(255, 234, 207)"
    >
        <div style="height: 10%">
            <div>Room Name:{{ dataDetail.roomName }}</div>
            {{ myData?.player }} VS {{ enemyData?.player }}
            <div>{{ dataDetail }}</div>
            <v-btn
                v-if="dataDetail.canStart && !hideStartGameBtn"
                @click="startGame"
                >startGame</v-btn
            >
            <div v-if="boardGameData != null && boardGameData && yourPlayer">
                {{
                    boardGameData?.roundPlayerId === playerId
                        ? 'Your Turn'
                        : 'Enemy Turn'
                }}

                your symbol is :
                {{
                    boardGameData.dataSymbol.find(
                        (e) => e.playerId === playerId
                    )!.symbol
                }}
                {{ gameResultLabel }}
                {{ timeOutLabel }}
            </div>
            <div v-else-if="boardGameData != null && boardGameData">
                <span v-for="dataplayer in boardGameData.dataSymbol">
                    player : {{ dataplayer.playerName }} use :
                    {{ dataplayer.symbol }}
                </span>
            </div>
            {{ gameResultLabel }}
            {{ timeOutLabel }}
        </div>
        <div style="height: 90%">
            <div class="w-100 h-100 d-flex justify-center align-center">
                <div style="width: 400px; aspect-ratio: 1">
                    <XoMainBoard
                        :boardState="boardState"
                        :canMove="
                            boardGameData?.canMove &&
                            boardGameData.roundPlayerId === playerId
                        "
                        @move="move"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount, computed } from 'vue'
import { xoGameApi } from '@/api/index'
import { useRouter, useRoute } from 'vue-router'
import XoMainBoard from '@/components/xoGame/MainBoard.vue'
import { RoomGameData, BoardGameData } from '@/interface/socket'
import Socket from '@/api/socket/xoGame'
import { getContext } from '@/context'
import { contextPluginSymbol } from '@/plugins/context'
const router = useRouter()
const rout = useRoute()
const roomId = ref(rout.query.roomId)
const boardGameData = ref<BoardGameData>()
const boardState = ref()
const timeOutLabel = ref('')
const gameResultLabel = ref('')
const socket = Socket(
    callBackJoin,
    callBackRoomData,
    callBackGetBoardGameData,
    callBackUpdateBoardCell,
    callBackUpdateRoundPlayer,
    callBackGameOver,
    callBackCanNotMove
)
const yourPlayer = ref(true)
const hideStartGameBtn = ref(false)
const playerId = getContext().inject(contextPluginSymbol)!.userId.value
const myData = computed(
    () => detail.value?.players.filter((e) => e.playerId === playerId)[0]
)
const enemyData = computed(
    () =>
        detail.value?.players.filter(
            (e) =>
                e.playerId !==
                getContext().inject(contextPluginSymbol)!.userId.value
        )[0]
)
const dataDetail = computed(() => {
    return {
        roomName: detail.value?.roomName,
        started: detail.value?.started,
        canStart: detail.value?.canStart,
    }
})
const detail = ref<RoomGameData>()
;(async () => {
    await initial()
})()
function callBackJoin(mes: string) {
    console.log(mes)
}
function callBackRoomData(data: RoomGameData) {
    detail.value = data
    // console.log(data)
}
function callBackUpdateBoardCell(data: {
    target: { row: number | string; col: number | string }
    value: string
}) {
    boardState.value[data.target.row][data.target.col] = data.value
}
function callBackCanNotMove(data: any) {
    alert('cannot move nah !\nwhy you can move this')
}
function callBackGetBoardGameData(data: any) {
    // alert('get data')

    boardGameData.value = data as BoardGameData
    boardState.value = boardGameData.value?.board
    if (!boardGameData.value.dataSymbol.some((e) => e.playerId === playerId)) {
        yourPlayer.value = false
    }
}
function callBackGameOver(data: any) {
    if (yourPlayer.value) {
        if (data.isDraw) {
            gameResultLabel.value = 'DRAW'
        } else {
            const winnerPlayer = data.playerId
            const gameWinResult = winnerPlayer === playerId
            gameResultLabel.value = gameWinResult ? 'You Win' : 'You Lose'
        }
    } else {
        if (data.isDraw) {
            gameResultLabel.value = 'DRAW'
        } else {
            const winnerPlayer = data.playerId
            const win = boardGameData.value?.dataSymbol.find(
                (e) => e.playerId === winnerPlayer
            )?.playerName
            gameResultLabel.value = `${win} Win`
        }
    }
    let countdown = 30
    const timer = setInterval(() => {
        timeOutLabel.value = `Leave room in ${countdown} s`
        countdown--
        if (countdown <= 0) {
            router.push({ name: 'XoLobby' })
            clearTimeout(timer)
        }
    }, 1000)
}
function callBackUpdateRoundPlayer(_playerId: string) {
    // alert('round')

    const newData = JSON.parse(JSON.stringify(boardGameData.value))
    newData.roundPlayerId = _playerId
    newData.canMove = _playerId === playerId
    boardGameData.value = newData
}
function move(target: { row: string | number; col: string | number }) {
    socket.move(roomId.value as string, target)
}
function startGame() {
    if (roomId.value !== null && roomId.value !== '') {
        xoGameApi.startGame(roomId.value as string).then((e) => {
            if (e.statusCode === 200) {
                hideStartGameBtn.value = true
                boardGameData.value = e.data
                boardState.value = boardGameData.value?.board
                socket.callAllUserGetBoardGameData(roomId.value as string)
            }
        })
    }
    // alert('start')
}
function initial() {
    if (roomId.value !== null && roomId.value !== '') {
        xoGameApi
            .getOne(roomId.value as string)
            .then((e) => {
                if (e.statusCode === 404) {
                    router.push({ name: 'XoLobby' })
                } else {
                    detail.value = e.data as RoomGameData
                    socket.join(roomId.value as string, detail.value.started)
                    if (detail.value.started) {
                        xoGameApi
                            .getBoardGameData(roomId.value as string)
                            .then((e) => {
                                boardGameData.value = e.data as BoardGameData
                                boardState.value = boardGameData.value?.board
                                if (
                                    !boardGameData.value.dataSymbol.some(
                                        (e) => e.playerId === playerId
                                    )
                                ) {
                                    yourPlayer.value = false
                                }
                            })
                    }
                }
            })
            .catch((e) => {
                router.push({ name: 'XoLobby' })
            })
    }
}
onBeforeUnmount(() => {
    socket.leaveRoom(roomId.value as string)
})
</script>
