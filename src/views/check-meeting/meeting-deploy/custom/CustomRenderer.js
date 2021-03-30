import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'
import {
    append as svgAppend,
    attr as svgAttr,
    // classes as svgClasses,
    create as svgCreate,
    remove as svgRemove
} from 'tiny-svg'
import { getRoundRectPath } from 'bpmn-js/lib/draw/BpmnRenderUtil'
import { is } from 'bpmn-js/lib/util/ModelUtil'
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil'

const HIGH_PRIORITY = 1500
const TASK_BORDER_RADIUS = 10
// const EVENT_BORDER_RADIUS = 15
const drawRect = (parentNode, width, height, borderRadius, strokeColor) => {
    const rect = svgCreate('rect')
    svgAttr(rect, {
        width: width,
        height: height,
        rx: borderRadius,
        ry: borderRadius,
        stroke: strokeColor || '#000',
        strokeWidth: 2,
        fill: '#fff'
    })
    svgAppend(parentNode, rect)
    return rect
}
const prependTo = (newNode, parentNode, siblingNode) => {
    parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild)
}

export default class CustomRenderer extends BaseRenderer {
    constructor(eventBus, bpmnRenderer) {
        super(eventBus, HIGH_PRIORITY)
        this.bpmnRenderer = bpmnRenderer
    }
    canRender(element) {
        return isAny(element, [ 'bpmn:UserTask', 'bpmn:Event' ]) && !element.labelTarget
    }
    drawShape(parentNode, element) {
        const shape = this.bpmnRenderer.drawShape(parentNode, element)
        if (is(element, 'bpmn:UserTask')) {
            const rect = drawRect(parentNode, 100, 80, TASK_BORDER_RADIUS, '#409EFF')
            prependTo(rect, parentNode)
            svgRemove(shape)
            return shape
        }
    }

    getShapePath(shape) {
        if (is(shape, 'bpmn:UserTask')) {
            let path = getRoundRectPath(shape, TASK_BORDER_RADIUS)
            return path
        }
        return this.bpmnRenderer.getShapePath(shape)
    }
}

CustomRenderer.$inject = [ 'eventBus', 'bpmnRenderer' ]
