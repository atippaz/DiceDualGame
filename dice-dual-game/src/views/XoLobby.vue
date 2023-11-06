<template>
    <div class="mx-6">
        <div class="d-flex justify-end px-4">
            <Btn background="hsl(69, 100%, 60%)" edge="hsl(69, 77%, 36%)" @click="dialogCreate = true"> create room</Btn>
        </div>
        <v-container fluid>
            <v-row>
                <v-col>
                    <div class="mb-2 ml-1">xo Room List</div>
                    <v-data-table :headers="headers" :items="xoRoomList" item-value="name" class="elevation-1">
                        <template v-slot:item.started="{ item }">
                            <div>
                                {{ item.started ? 'starting' : 'waiting' }}
                            </div>
                        </template>
                        <template v-slot:bottom> </template>
                        <template v-slot:item.actions="{ item }" style="padding: 12px;">
                            <Btn edge="hsl(128, 72%, 23%)" width="12" height="7"  font-size="12px" background="hsl(128, 100%, 57%)" v-if="item.canJoin" @click="joinRoom(item.roomId)">Join Room</Btn>
                            <Btn edge="hsl(128, 72%, 23%)" width="12" height="7"  font-size="12px" background="hsl(128, 100%, 57%)" v-if="item.canView" @click="viewRoom(item.roomId)">View Room</Btn>
                            <Btn edge="hsl(128, 72%, 23%)" width="12" height="7"  font-size="12px" background="hsl(128, 100%, 57%)" v-if="item.canResume" @click="resume(item.roomId)">resume</Btn>
                        </template>
                    </v-data-table>
                </v-col>
                <v-col>
                    <div class="mb-2 ml-1">Current Room</div>
                    <v-data-table :headers="headers" :items="currentRoom" item-value="name" class="elevation-1">
                        <template v-slot:bottom> </template>
                        <template v-slot:item.started="{ item }">
                            <div>
                                {{ item.started ? 'starting' : 'waiting' }}
                            </div>
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <Btn edge="hsl(128, 72%, 23%)" width="12" height="7"  font-size="12px" background="hsl(128, 100%, 57%)" v-if="item.canJoin" @click="joinRoom(item.roomId)">Join Room</Btn>
                            <Btn edge="hsl(128, 72%, 23%)" width="12" height="7"  font-size="12px" background="hsl(128, 100%, 57%)" v-if="item.canView" @click="viewRoom(item.roomId)">View Room</Btn>
                            <Btn edge="hsl(128, 72%, 23%)" width="12" height="7"  font-size="12px" background="hsl(128, 100%, 57%)" v-if="item.canResume" @click="resume(item.roomId)">resume</Btn>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-container>
        <v-dialog v-model="dialogCreate" persistent width="500">
            <v-card>
                <v-card-title>Create Room</v-card-title>
                <v-card-text>
                    <v-text-field v-model="roomName" label="room name"></v-text-field>
                    <v-text-field v-model="boardSize" type="number" label="board size game"></v-text-field>
                    <div class="d-flex justify-end">
                        <p class="text-mute">
                            Esp32 State:{{
                                mqqtIsOnline ? 'online' : 'offline'
                            }}
                        </p>
                    </div>
                    <v-switch v-if="mqqtIsOnline" label="Esp32 Setting" v-model="useEsp32" :disabled="!canUseEsp32"
                        hide-details></v-switch>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="closeDialogCreate" color="error">
                        close</v-btn>

                    <v-btn @click="createRoom" color="success"> create</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts" setup>
import Btn from '@/components/Button3D.vue'
import { ref, onBeforeUnmount } from 'vue'
import { getContext } from '@/context'
import { contextPluginSymbol } from '@/plugins/context'

const _context = getContext()
const context = _context.inject(contextPluginSymbol)!
const playerId = context.userId.value
const useEsp32 = ref(false)
const canUseEsp32 = ref(true)
import { xoGameApi } from '@/api/index'
import { useRouter } from 'vue-router'
import MqqtSocket from '@/api/socket/mqqt'
import { watch } from 'vue'
watch(
    () => useEsp32.value,
    (newValue) => {
        if (newValue) {
            mqqt.useMqqt(playerId)
        } else {
            mqqt.unUseMqqt()
        }
    }
)
const router = useRouter()
const dialogCreate = ref(false)
const boardSize = ref(3)
// const socket = Socket().socket
const mqqt = MqqtSocket(handleMqqtState)
mqqt.connect()
const data = ref('')
const roomName = ref('')
const roomid = ref('')
const xoRoomList = ref([])
const currentRoom = ref([])
const mqqtIsOnline = ref(false)
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
    { title: 'status', key: 'started', sortable: false },

    { title: '', key: 'actions', sortable: false },
])
let timer: any = null
const statemqqt: any = ref(5555)
function handleMqqtState(

    playerOwner: string | null,
    isOnline: boolean
) {
    statemqqt.value = {

        playerOwner: playerOwner,
        isOnline: isOnline
    }
    canUseEsp32.value =
        playerOwner === null ? isOnline : playerOwner === playerId && isOnline

    mqqtIsOnline.value = isOnline
}
function initDataRoom() {
    xoGameApi.getAll().then((res) => {
        if (res && res.statusCode === 200) {
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
        if (res && res.statusCode === 200) {
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
    if (timer === null) {
        timer = setInterval(initDataRoom, 1000 * 60 * 5)
    }
}
// socket.on('sayhi', (mes) => {
//     data.value = mes
// })

function viewRoom(id: string) {
    router.push({ name: 'XoRoom', query: { roomId: id } })
}

function createRoom() {
    if (roomName.value.trim() === '') {
        roomName.value = ''
        alert('please enter room Name')
        return
    }
    xoGameApi.createRoom(roomName.value, boardSize.value).then((e) => {
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
            router.push({ name: 'XoRoom', query: { roomId: id } })
        } else {
            if (e.statusCode === 403) {
                alert('room full')
                initDataRoom()
            } else if (e.statusCode === 404) {
                alert('error not found')
            }
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
                    resume(id)
                }
            })
        }
    })
}
function closeDialogCreate() {
    dialogCreate.value = false
    roomName.value = ''
}
initDataRoom()
onBeforeUnmount(() => {
    clearInterval(timer)
})
</script>
<style lang="scss" scoped>
// .v-table:deep(.v-data-table__tr){
// padding: 12px 0px;
// }
</style>
