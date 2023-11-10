<template>
    <v-app-bar flat style="box-shadow: 1px 3px 4px #b8b8b8;">
        <v-app-bar-title >
            <span  @click="router.push({name:'Home'})"  style="cursor: pointer;font-weight: bold" >Arcade Game</span>
        </v-app-bar-title>
        <template v-slot:append>
            <v-menu v-if="props.showMenu">
                <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
                </template>
                <v-card width="230px" rounded="lg">

                <v-list>
                    <div class="px-4 pt-2">
                        <span>Menu</span>
                      
                    <div class="mt-4 pb-2">
                        <Btn class="w-100" background="#FF6969" edge="#C70039" font-size="12px" v-if="isLogin()" @click="logout">
                            <span style="color: white;">
                                logout
                            </span>
                            </Btn>
                        <Btn class="w-100" background="#427D9D" edge="#164863" font-size="12px" v-if="!isLogin()" @click="goToRegisterPage">
                            <span style="color: white;">
                                Register
                            </span>
                            </Btn>
                            <Btn class="w-100 mt-3" background="#A6CF98" edge="#557C55" font-size="12px" v-if="!isLogin()" @click="goToLoginPage">
                            <span style="color: white;">
                                Login
                            </span>
                            </Btn>
                    </div>
                    </div>
                   
                </v-list>
            </v-card>

            </v-menu>
        </template>
    </v-app-bar>
</template>

<script lang="ts" setup>
import Btn from '@/components/Button3D.vue'
import { logout, goToLoginPage, isLogin, goToRegisterPage } from '@/helper/auth'
import router from '@/router';
const props = defineProps<{showMenu:boolean}>()
</script>
