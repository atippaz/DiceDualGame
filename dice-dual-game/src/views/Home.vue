<template>
    <v-text-field v-model="roomName"></v-text-field>
<v-btn @click="createRoom"> create room</v-btn>
<v-text-field v-model="roomid"></v-text-field>

<v-btn @click="goToDiceRoom">join game</v-btn>

</template>

<script lang="ts" setup>
import { ref } from 'vue'
import BoardGame from '@/components/boardGame/BoardGame.vue'
import SideBoard from '@/components/boardGame/SideBoard.vue'
import {roomApi} from '@/api/index'
import { useRouter } from 'vue-router';

import Socket from '@/api/socket/index'
const router = useRouter()

const socket = Socket().socket
const data = ref('')
const roomName = ref('')
const roomid = ref('')
socket.on('sayhi', (_) => {
    data.value = _
})
function createRoom(){
    roomApi.getAll().then(e=>console.log(e))
}
function goToDiceRoom(){
    if(roomid.value.trim() === '')return alert('please enter room id')
    router.push({name:'DiceRoom',query:{roomId:roomid.value}})
}
</script>
