<template>
    <div style="text-align: center">
        <v-text-field label="Your Name" v-model="name"></v-text-field>
        <v-text-field label="User Name" v-model="username"></v-text-field>
        <v-text-field label="Password" v-model="password"></v-text-field>
        <v-btn @click="register(name, username, password)">Register</v-btn>
    </div>
</template>

<script lang="ts" setup>
import { register } from '@/helper/auth'
import { ref } from 'vue'
const password = ref('')
const username = ref('')
const name = ref('')
</script>
