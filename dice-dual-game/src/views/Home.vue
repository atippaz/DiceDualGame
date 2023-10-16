<template>
    <div class="w-100 h-100 d-flex justify-center align-center">
        <div style="width: 300px">
            <div class="w-100 mb-2">
                <v-btn class="w-100" @click="router.push({ name: 'XoLobby' })">
                    Xo Game
                </v-btn>
            </div>
            <div class="w-100">
                <v-btn class="w-100" disabled>DiceDual Game</v-btn>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
