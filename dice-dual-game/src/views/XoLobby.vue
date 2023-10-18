<template>
    {{ data }}
    <v-container>
        <v-row>
            <v-col>
                <div>xo Room List</div>
                <v-data-table
                    :headers="headers"
                    :items="xoRoomList"
                    item-value="name"
                    class="elevation-1"
                >
                    <template v-slot:bottom> </template>
                    <template v-slot:item.actions="{ item }">
                        <v-btn
                            v-if="item.canJoin"
                            @click="joinRoom(item.roomId)"
                            >Join Room</v-btn
                        >
                        <v-btn
                            v-if="item.canView"
                            @click="viewRoom(item.roomId)"
                            >View Room</v-btn
                        >
                        <v-btn
                            v-if="item.canResume"
                            @click="resume(item.roomId)"
                            >resume
                        </v-btn>
                    </template>
                </v-data-table>

                <div>current Room</div>
                <v-data-table
                    :headers="headers"
                    :items="currentRoom"
                    item-value="name"
                    class="elevation-1"
                >
                    <template v-slot:bottom> </template>
                    <template v-slot:item.actions="{ item }">
                        <v-btn
                            v-if="item.canJoin"
                            @click="joinRoom(item.roomId)"
                            >Join Room</v-btn
                        >
                        <v-btn
                            v-if="item.canView"
                            @click="viewRoom(item.roomId)"
                            >View Room</v-btn
                        >
                        <v-btn
                            v-if="item.canResume"
                            @click="resume(item.roomId)"
                            >resume
                        </v-btn>
                    </template>
                </v-data-table>
            </v-col>
            <v-col>
                <div>
                    <v-text-field v-model="roomName"></v-text-field>
                    <v-btn @click="createRoom"> create room</v-btn>
                    <v-text-field v-model="roomid"></v-text-field>
                    <v-btn @click="joinRoom(roomid)">join game</v-btn>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount } from 'vue'
import { getContext } from '@/context'
import { contextPluginSymbol } from '@/plugins/context'

const _context = getContext()
const context = _context.inject(contextPluginSymbol)

import { xoGameApi, mqqtApi } from '@/api/index'
import { useRouter } from 'vue-router'
import Socket from '@/api/socket/index'
import { time } from 'console'
const router = useRouter()

const socket = Socket().socket
const data = ref('')
const roomName = ref('')
const roomid = ref('')
const xoRoomList = ref([])
const currentRoom = ref([])
const headers = ref([
    {
        title: 'RoomName',
        // align: 'start',
        // sortable: false,
        key: 'roomName',
    },
    {
        title: 'Player',
        // align: 'start',
        // sortable: false,
        key: 'player',
    },
    { title: '', key: 'actions', sortable: false },
])
let timer: any = null
function initDataRoom() {
    xoGameApi.getAll().then((res) => {
        if (res.statusCode === 200) {
            const xoData = (res.data as []).map((e: any) => {
                return {
                    roomName: e.roomName,
                    player: `${e.players.length}/${e.maxPlayer}`,
                    roomId: e.roomId,
                    canJoin: e.canJoin,
                    canView: e.canView,
                    canResume: e.canResume,
                    started: e.started,
                }
            })
            xoRoomList.value = xoData as []
        }
    })
    xoGameApi.getCurrentRoom().then((res) => {
        if (res.statusCode === 200) {
            const xoData = (res.data as []).map((e: any) => {
                return {
                    roomName: e.roomName,
                    player: `${e.players.length}/${e.maxPlayer}`,
                    roomId: e.roomId,
                    canJoin: e.canJoin,
                    canView: e.canView,
                    canResume: e.canResume,
                    started: e.started,
                }
            })
            currentRoom.value = xoData as []
        }
    })
    console.log('get Data')
    if (timer === null) {
        timer = setInterval(initDataRoom, 1000 * 60 * 5)
    }
}
socket.on('sayhi', (mes) => {
    data.value = mes
})

function viewRoom(id: string) {
    router.push({ name: 'XoRoom', query: { roomId: id } })
}

function createRoom() {
    if (roomName.value.trim() === '') {
        roomName.value = ''
        alert('please enter room Name')
        return
    }
    xoGameApi.createRoom(roomName.value).then((e) => {
        console.log(e)
        if (e.statusCode === 200) {
            router.push({ name: 'XoRoom', query: { roomId: e.data.roomId } })
        } else if (e.statusCode === 403) {
            alert("can't create room \nyou have room right?")
        }
    })
}
function resume(id: string) {
    xoGameApi.resumeGame(id).then((e) => {
        if (e.data) {
            xoGameApi.joinRoom(id, 'testId').then((e) => {
                if (e.statusCode === 200) {
                    router.push({ name: 'XoRoom', query: { roomId: id } })
                } else if (e.statusCode === 403) {
                    alert('room full')
                } else if (e.statusCode === 404) {
                    alert('error not found')
                }
            })
        }
    })
}
function joinRoom(id: string) {
    if (id.trim() === '') return alert('please enter room id')
    xoGameApi.hasRoom(id).then((e) => {
        if (e.data) {
            xoGameApi.joinRoom(id, 'testId').then((e) => {
                if (e.statusCode === 200) {
                    router.push({ name: 'XoRoom', query: { roomId: id } })
                } else if (e.statusCode === 403) {
                    alert('room full')
                }
            })
        }
    })
}
initDataRoom()
onBeforeUnmount(() => {
    clearInterval(timer)
})
</script>
