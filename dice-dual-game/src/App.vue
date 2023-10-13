<template>
    <router-view />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import api from './api/baseFetch'
const hi = ref('2')
onMounted(async () => {
    await api()
        .get<string>('')
        ?.then((x) => {
            hi.value = x.data
        })
})
</script>
