<template>
    <!-- <HelloWorld /> -->
    {{ data }}
    <v-container fluid>
        <v-row no-gutters>
            <v-col cols="1">
                <SideBoard />
            </v-col>
            <v-col cols="5">
                <div>
                    <div class="d-flex align-center">
                        <BoardGame />
                    </div>
                </div>
            </v-col>
            <v-col cols="5">
                <BoardGame />
            </v-col>
            <v-col cols="1">
                <div style="
                        background-color: rgb(240, 240, 240);
                        width: 100%;
                        height: 100%;
                    ">
                    sd
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import BoardGame from '@/components/boardGame/BoardGame.vue'
import SideBoard from '@/components/boardGame/SideBoard.vue'
import { useRoute, useRouter } from 'vue-router'
import { roomApi } from '@/api/index'

const route = useRoute()
const router = useRouter()
const roomId = route.query.roomId
import Socket from '@/api/socket/index'
import { onMounted } from 'vue'
const socket = Socket().socket
const data = ref('')
if (!roomId) {
    router.push('/')
}
onMounted(() => {
    roomApi.getOne(`roomId=${roomId}`).then(e => console.log(e))
})
socket.on('sayhi', (_) => {
    data.value = _
})
</script>
