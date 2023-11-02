<template>
    <div
        class="rounded-xl w-100 h-100 pa-4 "
        style="background-color: rgb(112, 112, 112)"
    >
        <div
            class="rounded-xl w-100 h-100 container"
            style="background-color: rgb(211, 211, 211)"
        >
            <div class="box box-child" v-for="(i, indexI) in boardState">
                <div class="container-row d-flex align-center">
                    <div
                        v-for="(j, indexJ) in i"
                        class="box-row box-child-row h-100 w-100"
                    >
                        <div class="ma-1 w-100">
                            <div
                                class="rounded-xl h-100 d-flex align-center pa-6"
                                style="background-color: rgb(244, 244, 244)"
                                :class="{
                                    'current-select':
                                        props.isController &&
                                        props.currentPosition[0] === indexI &&
                                        props.currentPosition[1] === indexJ &&
                                        props.canMove,
                                    'can-move': canMove,
                                    'can-not-move': !canMove,
                                }"
                                @click="move(indexI, indexJ)"
                            >
                                <v-img
                                    v-if="image(j) !== null"
                                    :src="image(j)!"
                                ></v-img>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { defineProps, ref, computed } from 'vue'
import x from '@/assets/icons/x.png'
import o from '@/assets/icons/o.png'
const image = (text: string | null) => {
    return text === 'X' ? x : text === 'O' ? o : null
}
const props = defineProps({
    boardState: Array<Array<null | string>>,
    canMove: Boolean,
    currentPosition: {
        type: Array<Number>,
        required: true,
    },
    isController: {
        type: Boolean,
        required: true,
    },
})
const emits = defineEmits<{
    (e: 'move', target: { row: number | string; col: number | string }): void
}>()
const data = [[null]]
const boardState = computed(() => props.boardState || data)
const canMove = computed(() => props.canMove)
function move(indexI: string | number, indexJ: string | number) {
    if (canMove.value) {
        emits('move', { row: indexI, col: indexJ })
    }
}
</script>
<style lang="scss" scoped>
.aspect-ratio {
    aspect-ratio: 1;
    width: 100%;
}

.container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .box {
        // text-align: center;
        color: white;
        font-family: sans-serif;
        // font-size: 36px;
        // padding: 20px;

        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .box-child {
        flex: 1;
    }
}

.can-move:hover {
    cursor: pointer;
}

.can-not-move:hover {
    cursor: not-allowed;
}

.container-row {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;

    .box-row {
        // text-align: center;
        color: white;
        font-family: sans-serif;
        // font-size: 36px;
        // padding: 20px;

        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .box-child-row {
        flex: 1;
    }
}

.current-select {
    border: 4px solid rgb(255, 136, 0);
}
</style>
