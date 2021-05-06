<template>
    <div class="meeting-process-container">
        <div class="meeting-process-canvas" ref="process"></div>
        <div class="meeting-process-btns">
            <el-button type="primary" size="small" @click="handleSaveDiagram">保存</el-button>
            <el-button plain type="primary" size="small" @click="handleBack">返回</el-button>
        </div>
        <el-dialog title="请选择审核人员" :visible.sync="auditorVisible" width="30%">
            <el-select v-model="candidateGroups" placeholder="请选择" size="small">
                <el-option v-for="opt in candidateOpts" :key="opt.value" :label="opt.label" :value="opt.label"></el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="auditorVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleAuditorSave" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import BpmnModeler from "bpmn-js/lib/Modeler"
    import customControlsModule from './custom'
    import { mapState, mapActions } from 'vuex'
    import http from '@/service'
    import { getProcessRoles } from '@/service-public/api/account'
    import "bpmn-js/dist/assets/diagram-js.css"
    import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css"
    import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css"
    import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css"
    export default {
        data() {
            return {
                bpmnModeler: null,
                element: null,
                candidateGroups: '',
                auditorVisible: false,
                candidateOpts: []
            }
        },
        computed: {
            ...mapState({
                processBpmnXml: state => state.global.processBpmnXml
            })
        },
        async created() {
            let res = await getProcessRoles(this.$route.query.zipcode)
            if( res && res.length ) {
                this.candidateOpts = res.map(r => ({
                    label: r.name,
                    value: r.id
                }))
            }
        },
        methods: {
            ...mapActions(['setXmlStorage']),
            openDiagram(xml) {
                return this.bpmnModeler.importXML(xml)
            },
            handleAuditorSave() {
                if( this.element ) {
                    let modeling = this.bpmnModeler.get('modeling')
                    modeling.updateLabel(this.element, this.candidateGroups)
                    modeling.updateProperties(this.element, {
                        'activiti:candidateGroups': this.candidateGroups
                    })
                }
                this.auditorVisible = false
            },
            handleBack() {
                this.$router.push({ path: `/prison/process/${ this.$route.query.zipcode }` })
            },
            // 保存bpmn流程图
            async handleSaveDiagram() {
                try {
                    let { xml } = await this.bpmnModeler.saveXML({ format: true })
                    await http.saveProcess({ stringBPMN: xml })
                    this.setXmlStorage(xml)
                } catch(e) {
                    console.log(e)
                }
            },
            removeLabelHidden(id) {
                let sel = document.querySelector(`[data-element-id="${ id }"]`)
                sel && sel.classList.remove('djs-label-hidden')
            },
            initBpmnEvents() {
                // 任务元素双击
                this.bpmnModeler.on('element.dblclick', ({ element }) => {
                    if( element.type == 'bpmn:UserTask' || element.type == 'bpmn:EndEvent' || element.type == 'bpmn:EndEvent' ) {
                        this.removeLabelHidden(element.id)
                    }
                    if( element.type == 'bpmn:UserTask' ) {
                        this.candidateGroups = ''
                        this.auditorVisible = true
                        this.element = element
                    }
                })
                // 任务元素创建
                this.bpmnModeler.on('commandStack.shape.create.postExecuted', ({ context }) => {
                    if( context.shape.type == 'bpmn:UserTask' ) {
                        setTimeout(() => {
                            this.removeLabelHidden(context.shape.id)
                        }, 0)
                    }
                })
            }
        },
        async mounted() {
            this.bpmnModeler = new BpmnModeler({
                container: this.$refs.process,
                additionalModules: [
                    customControlsModule
                ]
            })
            this.initBpmnEvents()
            try {
                await this.openDiagram(this.processBpmnXml)
            } catch (e) {
                console.log(e)
            }
        },
        beforeDestroy() {
            this.bpmnModeler.destroy()
        }
    }
</script>

<style lang="scss" scoped>
    .meeting-process-container {
        width: 80%;
        position: absolute;
        left: 10%;
        right: 10%;
        bottom: 60px;
        top: 30px;
        display: flex;
        flex-direction: column;
    }
    .meeting-process-canvas {
        flex: 1;
    }
    .meeting-process-btns {
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    /deep/ .djs-container {
        background-color: #eee;
    }
    /deep/ .bjs-powered-by {
        display: none;
    }
    /deep/ .djs-palette {
        width: 48px !important;
        left: 0;
        top: 0;
        bottom: 0;
        background: #fff;
        border: none;

        .entry:before {
            color: #409EFF;
        }
    }
    /deep/ .djs-palette-entries .group[data-group="tools"],
    /deep/ .djs-palette-entries .group[data-group="event"],
    /deep/ .djs-palette-entries .group[data-group="data-store"], 
    /deep/ .djs-palette-entries .group[data-group="collaboration"], 
    /deep/ .djs-palette-entries .group[data-group="artifact"],
    /deep/ .djs-palette-entries .group[data-group="data-object"],
    /deep/ .bpmn-icon-task,
    /deep/ .bpmn-icon-subprocess-expanded,
    /deep/ .bpmn-icon-call-activity,
    /deep/ .djs-context-pad .bpmn-icon-text-annotation,
    /deep/ .djs-context-pad .bpmn-icon-screw-wrench {
        display: none;
    }
    /deep/ .djs-context-pad .group {
        width: 26px;
        overflow: hidden;
    }
    /deep/ .djs-direct-editing-parent {
        display: none
    }
</style>