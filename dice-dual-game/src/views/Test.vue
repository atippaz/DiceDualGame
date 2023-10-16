<template>
    <div style="text-align: center; border: 1px solid black">
        MQTT Test
        <v-btn @click="openLight" color="primary">red team round</v-btn>
        <v-btn @click="closeLight" color="warning">green team round</v-btn>
    </div>
</template>

<script lang="ts" setup>
import { mqqtApi } from '@/api/index'

function openLight() {
    mqqtApi.openLight()
}
function closeLight() {
    mqqtApi.closeLight()
}
</script>
