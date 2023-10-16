<template>
    {{ data }}
    <v-container>
        <v-row>
            <v-col>
                <div>xo Room List</div>
            </v-col>
            <v-col>
                <div>
                    <v-text-field v-model="roomName"></v-text-field>
                    <v-btn @click="createRoom"> create room</v-btn>
                    <v-text-field v-model="roomid"></v-text-field>
                    <v-btn @click="goToDiceRoom">join game</v-btn>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { xoGameApi, mqqtApi } from '@/api/index'
import { useRouter } from 'vue-router'

import Socket from '@/api/socket/index'
const router = useRouter()

const socket = Socket().socket
const data = ref('')
const roomName = ref('')
const roomid = ref('')
socket.on('sayhi', (mes) => {
    data.value = mes
})
function createRoom() {
    xoGameApi.getAll().then((e) => console.log(e))
}
function goToDiceRoom() {
    if (roomid.value.trim() === '') return alert('please enter room id')
    router.push({ name: 'DiceRoom', query: { roomId: roomid.value } })
}
</script>
