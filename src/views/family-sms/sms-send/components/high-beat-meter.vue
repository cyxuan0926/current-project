<template>
    <div>
        <el-image
            style="width: 405px; height: 304px"
            :src="imgSrc"
            fit="contain"></el-image>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'

export default {
    props: {
        imgSrc: String
    }
}
</script>

<style lang="scss" scoped>

</style>