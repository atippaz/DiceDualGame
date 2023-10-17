<template>
    <v-app-bar flat>
        <v-app-bar-title>
            <p style="font-weight: bold">Arcade Game</p>
        </v-app-bar-title>
        <template v-slot:append>
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
                </template>

                <v-list>
                    <v-list-item v-if="isLogin()" @click="logout">
                        <v-list-item-title> logout </v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="!isLogin()" @click="goToRegisterPage">
                        <v-list-item-title> Register </v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="!isLogin()" @click="goToLoginPage">
                        <v-list-item-title> Login </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </template>
    </v-app-bar>
</template>

<script lang="ts" setup>
import { logout, goToLoginPage, isLogin, goToRegisterPage } from '@/helper/auth'
</script>
