export default class CustomPalette {
    constructor(create, bpmnFactory, elementFactory, palette, translate) {
      this.create = create
      this.bpmnFactory = bpmnFactory
      this.elementFactory = elementFactory
      this.translate = translate
      palette.registerProvider(this)
    }
    getPaletteEntries(element) {
      const {
        create,
        bpmnFactory,
        elementFactory,
        translate
      } = this
      function createUserTask(event) {
        const busObj = bpmnFactory.create('bpmn:UserTask', { name: '请设置审核人员' })
        const shape = elementFactory.createShape({ type: 'bpmn:UserTask', businessObject: busObj })
        create.start(event, shape)
      }
      function createStartEvent(event) {
        const busObj = bpmnFactory.create('bpmn:StartEvent', { name: '开始' })
        const shape = elementFactory.createShape({ type: 'bpmn:StartEvent', businessObject: busObj })
        create.start(event, shape)
      }
      function createEndEvent(event) {
        const busObj = bpmnFactory.create('bpmn:EndEvent', { name: '结束' })
        const shape = elementFactory.createShape({ type: 'bpmn:EndEvent', businessObject: busObj })
        create.start(event, shape)
      }
      return {
        'create.user-task': {
            group: 'activity',
            className: 'bpmn-icon-user-task',
            title: translate('Create ServiceTask'),
            action: {
                dragstart: createUserTask,
                click: createUserTask
            }
        },
        'create.start-event': {
            group: 'activity',
            className: 'bpmn-icon-start-event-none',
            title: translate('Create StartEvent'),
            action: {
                dragstart: createStartEvent,
                click: createStartEvent
            }
        },
        'create.end-event': {
            group: 'activity',
            className: 'bpmn-icon-end-event-none',
            title: translate('Create EndEvent'),
            action: {
                dragstart: createEndEvent,
                click: createEndEvent
            }
        }
      }
    }
  }
  CustomPalette.$inject = [
    'create',
    'bpmnFactory',
    'elementFactory',
    'palette',
    'translate'
  ]
