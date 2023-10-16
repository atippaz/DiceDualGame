<template>
    <div v-if="detail" class="w-100 h-100" style="background-color: rgb(255, 234, 207)">
        <div style="height: 10%;">
            <div>Room Name:{{ detail.roomName }}</div>
            <div>{{ detail }}</div>
        </div>
        <div style="height: 90%;">
            <div class="w-100 h-100 d-flex justify-center align-center">
                <div style="width: 400px; aspect-ratio: 1">
                    <XoMainBoard />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount } from 'vue'
import { xoGameApi } from '@/api/index'
import { useRouter, useRoute } from 'vue-router'
import XoMainBoard from '@/components/xoGame/MainBoard.vue'

import Socket from '@/api/socket/index'
const router = useRouter()
const rout = useRoute()
const roomId = ref(rout.query.roomId)
const socket = Socket().socket
const detail = ref();
(async () => { await initial() })()
function initial() {
    if (roomId.value !== null && roomId.value !== '') {
        xoGameApi
            .getOne(roomId.value as string)
            .then((e) => {
                console.log(e)
                if (e.statusCode === 404) {
                    router.push({ name: 'XoLobby' })
                } else {
                    detail.value = e.data
                }
            })
            .catch((e) => {
                console.log(e)
            })
    }
}
onBeforeUnmount(() => {
    alert('want 2 leave ?')
})

// socket.on('sayhi', (mes) => {
//     data.value = mes
// })
</script>
