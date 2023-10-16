<template>
    <div style="text-align: center">
        <v-text-field label="User Name" v-model="username"></v-text-field>
        <v-text-field label="Password" v-model="password"></v-text-field>
        <v-btn @click="login">login</v-btn>
    </div>
</template>

<script lang="ts" setup>
import { login as loginApi } from '@/helper/auth'
import { ref } from 'vue'
const password = ref('')
const username = ref('')

function login() {
    loginApi(username.value, password.value)
}
</script>
