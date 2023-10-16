<template>xoGame</template>

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
