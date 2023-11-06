<template>
    <v-app>
        <default-bar />
        <v-main class="h-100">
            <div style="background-color: rgb(217, 217, 217)" class="h-100">
                <default-view />
            </div>
        </v-main>
    </v-app>
</template>

<script lang="ts" setup>
import DefaultBar from './AppBar.vue'
import DefaultView from './View.vue'
</script>
