<template>
    <div class="h-100 w-100 d-flex justify-center align-center" >
            <div class="pa-10 rounded-xl" style="width: 500px; background-color: rgb(255, 255, 255);">
                <div class="d-flex justify-center" style="font-size: 19px;">Welcome To Arcade Game</div>
                <div class="my-6">

                    <v-text-field label="User Name" v-model="username"></v-text-field>
                    <v-text-field label="Password" v-model="password"></v-text-field>
                </div>
                    <div class="d-flexs">
                        <div style="flex-grow: 1">
                        <a href="register">register</a>
                        </div>
                        <div style="flex-grow: 2"></div>
                        <div style="flex-grow: 1" class="d-flex justify-end">
                            <Btn background="#A6CF98" edge="#557C55" @click="login">login</Btn>
                        </div>
                    </div>
                </div>
    </div>
</template>

<script lang="ts" setup>
import Btn from '@/components/Button3D.vue'

import { login as loginApi } from '@/helper/auth'
import { ref } from 'vue'
const password = ref('')
const username = ref('')

const login = () => loginApi(username.value.trim(), password.value.trim())

</script>
<style scoped lang="scss">
.d-flexs{
    display: flex;
    align-items: stretch;
}
</style>