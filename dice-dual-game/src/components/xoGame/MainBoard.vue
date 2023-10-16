<template>
    <div
        class="rounded-xl w-100 h-100 pa-4"
        style="background-color: rgb(255, 77, 0)"
    >
        <div
            class="rounded-xl w-100 h-100 container"
            style="background-color: rgb(151, 177, 255)"
        >
            <div class="box box-child" v-for="i in data">
                <div class="container-row d-flex align-center">
                    <div
                        v-for="j in i"
                        class="box-row box-child-row h-100 w-100"
                    >
                        <div class="ma-1 w-100">
                            <div
                                class="rounded-xl h-100 d-flex align-center"
                                style="background-color: rgb(0, 76, 255)"
                            >
                                <p
                                    style="
                                        font-size: 4em;
                                        color: white;
                                        text-align: center;
                                        font-weight: bold;
                                        width: 100%;
                                    "
                                >
                                    {{ j }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
const data = [
    ['X', '', ''],
    ['', 'X', ''],
    ['', 'O', 'O'],
]
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
</style>
