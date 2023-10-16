<template>
    <v-container
        fluid
        class="w-100 h-100"
        style="background-color: rgb(255, 234, 207)"
    >
        <v-row>
            <div>
                <div>Room Name:{{ detail.roomName }}</div>
                <div>{{ detail }}</div>
            </div>
        </v-row>
        <v-row class="w-100 h-100 d-flex justify-center align-center">
            <div style="width: 400px; aspect-ratio: 1">
                <XoMainBoard />
            </div>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { xoGameApi, mqqtApi } from '@/api/index'
import { useRouter, useRoute } from 'vue-router'
import XoMainBoard from '@/components/xoGame/MainBoard.vue'

import Socket from '@/api/socket/index'
const router = useRouter()
const rout = useRoute()
const roomId = ref(rout.query.roomId)
const socket = Socket().socket
const detail = ref()
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
initial()
// socket.on('sayhi', (mes) => {
//     data.value = mes
// })
</script>
