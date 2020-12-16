<template>
    <div>
        <m-form
            ref="form"
            :items="formItems"
            @submit="handleSubmit"
            :values="guideData"/>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                formItems: {
                    guide: { type: 'textarea', label: '更新内容介绍', rules: ['required'] },
                    contents: { type: 'jaileditor', label: '更新操作指引', rules: ['required']}
                },
                guideData: {}
            }
        },

        handleSubmit() {
            console.log('handleSubmit===')
        }
    }
</script>

<style lang="sass" scoped>

</style>
