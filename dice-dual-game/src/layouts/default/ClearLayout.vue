<template>
    <v-app class="mx-n10"  style="background-color: rgb(218, 218, 218);">
        <default-bar :show-menu="false"/>

        <default-view />
    </v-app>
</template>

<script lang="ts" setup>
import DefaultView from './View.vue'
import DefaultBar from './AppBar.vue'
</script>
