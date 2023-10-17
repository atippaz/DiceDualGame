<template>
    <div v-if="detail" class="w-100 h-100" style="background-color: rgb(255, 234, 207)">
        <div style="height: 10%">
            <div>Room Name:{{ dataDetail.roomName }}</div>
            {{ myData?.player }} VS {{ enemyData?.player }}
            <div>{{ dataDetail }}</div>
            <v-btn v-if="dataDetail.canStart && !hideStartGameBtn" @click="startGame">startGame</v-btn>
            <div v-if="boardGameData != null && boardGameData">
                {{
                    boardGameData?.roundPlayerId === playerId
                    ? 'Your Turn'
                    : 'Enemy Turn'
                }}

                your sysbol is : {{ boardGameData.dataSymbol.find(e => e.playerId === playerId)!.symbol }}
            </div>
        </div>
        <div style="height: 90%">
            <div class="w-100 h-100 d-flex justify-center align-center">
                <div style="width: 400px; aspect-ratio: 1">
                    <XoMainBoard :boardState="boardState"
                        :canMove="boardGameData?.canMove && boardGameData.roundPlayerId === playerId" />
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
const socket = Socket(callBackJoin, callBackRoomData, callBackGetBoardGameData)
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
    ; (async () => {
        await initial()
    })()
function callBackJoin(mes: string) {
    console.log(mes)
}
function callBackRoomData(data: RoomGameData) {
    detail.value = data
    // console.log(data)
}
function callBackGetBoardGameData(data: any) {
    boardGameData.value = data as BoardGameData
    boardState.value = boardGameData.value?.board
}
function startGame() {
    if (roomId.value !== null && roomId.value !== '') {
        xoGameApi.startGame(roomId.value as string).then((e) => {
            console.log('api call data', e.data)
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
                console.log(e)
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
                            })
                    }
                }
            })
            .catch((e) => {
                console.log(e)
            })
    }
}
// onBeforeUnmount(() => {
//     alert('want 2 leave ?')
// })

// socket.on('sayhi', (mes) => {
//     data.value = mes
// })
</script>
