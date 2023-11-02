<template>
    <div class="h-100 w-100 d-flex justify-center align-center" >
        
            <div class="pa-10 rounded-xl" style="width: 500px; background-color: rgb(255, 255, 255);">
                <div class="d-flex justify-center">Welcome To Arcade Game</div>
                <div class="my-6">

                    <v-text-field label="User Name" v-model="username"></v-text-field>
                    <v-text-field label="Password" v-model="password"></v-text-field>
                </div>
                    <div class="d-flex">
                        <a href="register">register</a>

                        <v-spacer></v-spacer>
                        <v-btn @click="login">login</v-btn>

                    </div>
                   
                </div>

            <!-- <v-container>
                <v-row>
                <v-col></v-col>
                <v-col> </v-col>
                <v-col></v-col>
                
            </v-row>
            
        </v-container> -->
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
