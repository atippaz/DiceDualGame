<template>
    <div class="w-100 h-100" style="position: relative">
        <div class="w-100 h-100 d-flex justify-center align-center">
            <div style="width: 300px">
                <div class="w-100 mb-2">
                    <v-btn
                        class="w-100"
                        @click="router.push({ name: 'XoLobby' })"
                    >
                        Xo Game
                    </v-btn>
                </div>
                <div class="w-100">
                    <v-btn class="w-100" disabled>DiceDual Game</v-btn>
                </div>
            </div>
        </div>
        <div style="position: absolute; bottom: 0; right: -25px">
            {{ userId ? 'UserID:' + userId : 'Guess' }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { getContext } from '@/context'
import { contextPluginSymbol } from '@/plugins/context'
const { userId } = getContext().inject(contextPluginSymbol)

const router = useRouter()
</script>
