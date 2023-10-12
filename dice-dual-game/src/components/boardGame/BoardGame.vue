<template>
    <div class="w-100">
        <v-container class="aspect-ratio">
            <v-row
                v-for="i in data"
                style="background-color: rgb(0, 62, 62)"
                no-gutters
            >
                <v-col cols="4" v-for="j in i">
                    <div class="ma-1">
                        <div
                            class="d-flex aspect-ratio align-center justify-center rounded-xl"
                            style="background-color: aquamarine"
                        >
                            <p style="font-size: 4em">
                                {{ j }}
                            </p>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<script lang="ts" setup>
const data = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]
</script>
<style lang="scss" scoped>
.aspect-ratio {
    aspect-ratio: 1;
    width: 100%;
}
</style>
