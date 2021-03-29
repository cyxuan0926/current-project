// 监狱范围内的常量
export default {
  PRISONAREA: {
    belong: { value: 'name', label: 'name' }
  },
  auditorRoles: [
    {
      label: '监区审核人员',
      value: 'visit.approve.examine'
    },
    {
      label: '狱政科',
      value: 'visit.approve.prisonofficial'
    },
    {
      label: '教育科',
      value: 'visit.approve.education'
    },
    {
      label: '狱政科领导',
      value: 'visit.approve.prisonofficialleader'
    }
  ],
  bpmnList: [
    {
      label: '亲情电话家属管理审核',
      value: 'phonefamily'
    },
    {
      label: '亲情电话次数修改审核',
      value: 'phonenumber'
    }
  ]
}

export const initStore = {
  APP_AFFAIRS_DATA() {
    return {
      headline: '',
      subhead: '',
      content: '',
      videoUrl: '',
      seq: 0
    }
  },
  APP_AFFAIRS_MODULE_DATA() {
    return []
  },
  APP_GUIDE_DATA() {
    return {
      content: '',
      guide: '',
      updatedTime: '',
      preContent: ''
    }
  }
}

export const initBpmnData = (id) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:activiti="http://activiti.org/bpmn" xmlns:yaoqiang="http://bpmn.sourceforge.net" xmlns:tns="http://sourceforge.net/bpmn/definitions" xmlns:xsd="http://www.w3.org/2001/XMLSchema" targetNamespace="http://sourceforge.net/bpmn/definitions">
    <process id="${ id }" processType="None" isClosed="false" isExecutable="true">
      <startEvent id="Event_0eeymxa" name="开始">
        <outgoing>Flow_0ueo4d4</outgoing>
      </startEvent>
      <userTask id="Activity_08x97u5" name="请设置审核人员">
        <incoming>Flow_0ueo4d4</incoming>
      </userTask>
      <sequenceFlow id="Flow_0ueo4d4" sourceRef="Event_0eeymxa" targetRef="Activity_08x97u5" />
    </process>
    <bpmndi:BPMNDiagram id="Diagram-_1" name="New Diagram" documentation="background=#3C3F41;count=1;horizontalcount=1;orientation=0;width=842.4;height=1195.2;imageableWidth=832.4;imageableHeight=1185.2;imageableX=5.0;imageableY=5.0">
      <bpmndi:BPMNPlane bpmnElement="${ id }">
        <bpmndi:BPMNEdge id="Flow_0ueo4d4_di" bpmnElement="Flow_0ueo4d4">
          <di:waypoint x="188" y="170" />
          <di:waypoint x="300" y="170" />
        </bpmndi:BPMNEdge>
        <bpmndi:BPMNShape id="Event_0eeymxa_di" bpmnElement="Event_0eeymxa">
          <dc:Bounds x="152" y="152" width="36" height="36" />
          <bpmndi:BPMNLabel>
            <dc:Bounds x="159" y="191" width="22" height="14" />
          </bpmndi:BPMNLabel>
        </bpmndi:BPMNShape>
        <bpmndi:BPMNShape id="Activity_08x97u5_di" bpmnElement="Activity_08x97u5">
          <dc:Bounds x="300" y="130" width="100" height="80" />
        </bpmndi:BPMNShape>
      </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
  </definitions>`
}
