<template>
    <div class="w-100 h-100" style="position: relative">
        <div class="w-100 h-100 d-flex justify-center align-center">
            <div style="width: 400px">
                <div class="w-100 mb-5">
                    <Btn class="w-100" @click="router.push({ name: 'XoLobby' })">
                        Xo Game
                    </Btn>
                </div>
                <div class="w-100">
                    <Btn class="w-100" disabled>DiceDual Game</Btn>
                </div>
            </div>
        </div>
        <div style="position: absolute; bottom: 0; right: 10px">
            {{ userId ? 'UserID:' + userId : 'Guess' }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import Btn from '@/components/Button3D.vue'
import { useRouter } from 'vue-router'
import { getContext } from '@/context'
import { contextPluginSymbol } from '@/plugins/context'
const { userId } = getContext().inject(contextPluginSymbol)

const router = useRouter()
</script>
