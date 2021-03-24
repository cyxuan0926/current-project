<template>
    <div class="meeting-process-container">
        <div class="meeting-process-canvas" ref="process"></div>
    </div>
</template>

<script>
    import BpmnModeler from "bpmn-js/lib/Modeler"
    export default {
        data() {
            return {
                bpmnModeler: null
            }
        },
        computed() {},
        methods: {
            openDiagram(xml) {
                return this.bpmnModeler.importXML(xml)
            },
        },
        mounted() {
            this.bpmnModeler = new BpmnModeler({
                container: this.$refs.process
            })
            try {
                this.openDiagram()
            } catch (e) {

            }
        }
    }
</script>

<style lang="scss" scoped>
    .meeting-process-container {
        width: 80%;
        margin: 0 auto;
        padding: 50px 0;
        display: flex;
    }
    .meeting-process-canvas {
        flex: 1;
    }
</style>