<template>
    <div v-if="detail" class="ma-8">
        <div class="w-100 h-100">
            <div>
                <div style="height: 10%">
                    <div>Room Name : {{ dataDetail.roomName }}</div>

                    <v-container fluid>
                        <v-row>
                            <v-col class="d-flex justify-start">
                                {{ myData?.player }}</v-col
                            >
                            <v-col class="d-flex justify-center">
                                <span style="color: rgb(118, 0, 0)"> V </span>
                                <span style="color: rgb(29, 0, 125)"> S </span>
                            </v-col>
                            <v-col class="d-flex justify-end">
                                {{
                                    enemyData
                                        ? enemyData.player
                                        : 'waiting . . . '
                                }}
                            </v-col>
                        </v-row>
                    </v-container>
                    <div
                        v-if="
                            boardGameData != null && boardGameData && yourPlayer
                        "
                    >
                        <div v-if="gameResultLabel === ''">
                            {{
                                boardGameData?.roundPlayerId === playerId
                                    ? 'Your Turn'
                                    : 'Enemy Turn'
                            }}
                        </div>

                        your symbol is :
                        {{
                            boardGameData.dataSymbol.find(
                                (e) => e.playerId === playerId
                            )!.symbol
                        }}
                    </div>
                    <div v-else-if="boardGameData != null && boardGameData">
                        <span v-for="dataplayer in boardGameData.dataSymbol">
                            player : {{ dataplayer.playerName }} use :
                            {{ dataplayer.symbol }}
                        </span>
                    </div>
                    {{ gameResultLabel }} <br>
                    {{ timeOutLabel }}
                </div>
                <div style="height: 90%">
                    <div class="w-100 h-100 mt-4">
                        <div class="d-flex">
                            <div>
                                <Btn
                                    v-if="!hideStartGameBtn"
                                    background="#A6CF98"
                                    edge="#557C55"
                                    font-size="12px"
                                    :disabled="!dataDetail.canStart"
                                    @click="startGame"
                                    >startGame</Btn
                                >
                            </div>
                            <v-spacer></v-spacer>
                            <div class="d-flex justify-end">
                                <Btn
                                    @click="showSlider = !showSlider"
                                    font-size="12px"
                                    >{{
                                        showSlider
                                            ? 'close slider'
                                            : 'open slider'
                                    }}</Btn
                                >
                            </div>
                        </div>

                        <v-slider
                            v-if="showSlider"
                            v-model="boardsize"
                            min="300"
                            max="2000"
                            label="boardsize"
                            thumb-label
                            class="mt-4"
                        ></v-slider>
                        <div class="d-flex justify-center align-center">
                            <div
                                :style="`width: ${boardsize}px; aspect-ratio: 1`"
                            >
                                <XoMainBoard
                                    :boardState="boardState"
                                    :canMove="
                                        boardGameData?.canMove &&
                                        boardGameData.roundPlayerId === playerId
                                    "
                                    @move="move"
                                    :isController="isController"
                                    :currentPosition="currentPosition"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Btn from '@/components/Button3D.vue'
import { ref, onBeforeUnmount, computed } from 'vue'
import { xoGameApi } from '@/api/index'
import { useRouter, useRoute } from 'vue-router'
import XoMainBoard from '@/components/xoGame/MainBoard.vue'
import { RoomGameData, BoardGameData } from '@/interface/socket'
import Socket from '@/api/socket/xoGame'
import { getContext } from '@/context'
import { contextPluginSymbol } from '@/plugins/context'
const boardsize = ref(450)
const router = useRouter()
const rout = useRoute()
const roomId = ref(rout.query.roomId)
const boardGameData = ref<BoardGameData>()
const boardState = ref()
const timeOutLabel = ref('')
const gameResultLabel = ref('')
const showSlider = ref(false)
const socket = Socket(
    callBackJoin,
    callBackRoomData,
    callBackGetBoardGameData,
    callBackUpdateBoardCell,
    callBackUpdateRoundPlayer,
    callBackGameOver,
    callBackCanNotMove,
    callbackControllGame
)
const yourPlayer = ref(true)
const currentPosition = ref([1, 1])
const isController = ref(false)
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
    hideStartGameBtn.value = true
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
function handleKeyPress(event: KeyboardEvent) {
    if (
        event.key === 'w' ||
        event.key === 'a' ||
        event.key === 's' ||
        event.key === 'd' ||
        event.key === ' '
    ) {
        callbackControllGame(event.key)
    }
}
function callbackControllGame(direction: string) {
    if (direction === 'w' && currentPosition.value[0] >= 1) {
        isController.value = true
        currentPosition.value = [
            currentPosition.value[0] - 1,
            currentPosition.value[1],
        ]
    } else if (direction === 's' && currentPosition.value[0] <= 1) {
        isController.value = true
        currentPosition.value = [
            currentPosition.value[0] + 1,
            currentPosition.value[1],
        ]
    } else if (direction === 'd' && currentPosition.value[1] <= 1) {
        isController.value = true
        currentPosition.value = [
            currentPosition.value[0],
            currentPosition.value[1] + 1,
        ]
    } else if (direction === 'a' && currentPosition.value[1] >= 1) {
        isController.value = true
        currentPosition.value = [
            currentPosition.value[0],
            currentPosition.value[1] - 1,
        ]
    } else if (direction === 'enter' || direction === ' ') {
        if (
            boardGameData.value !== null &&
            boardGameData.value!.canMove &&
            boardGameData.value!.roundPlayerId === playerId
        ) {
            move({
                col: currentPosition.value[1],
                row: currentPosition.value[0],
            })
        }
    }
}
function move(target: { row: string | number; col: string | number }) {
    socket.move(roomId.value as string, target)
    currentPosition.value = [1, 1]
    isController.value = false
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
                    hideStartGameBtn.value = detail.value.owner !== playerId
                    if (detail.value.started) {
                        hideStartGameBtn.value = true
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
document.addEventListener('keydown', handleKeyPress)
onBeforeUnmount(() => {
    socket.leaveRoom(roomId.value as string)
    document.removeEventListener('keydown', handleKeyPress)
})
</script>
<style scoped lang="scss">
:deep(.v-slider__label) {
    font-size: 12px;
}
</style>
