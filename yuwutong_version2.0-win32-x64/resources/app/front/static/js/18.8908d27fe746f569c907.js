webpackJsonp([18],{"65Th":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("34v0"),o=a.n(n),i=a("EcfS"),l=a("YN9k"),s={data:function(){return{pagination:{rows:10,page:1},isMailBoxesInspect:!1,type:1}},computed:o()({},Object(i.c)({mailBoxes:"mailBoxes",mailBoxesTotal:"mailBoxesTotal"})),methods:o()({},Object(i.b)({getMailBoxes:"getMailBoxes"}),{currentChange:function(t){this.pagination.page=t,this.getMailBoxes(this.pagination)},inspectMail:function(t){this.$router.push({path:"/mailbox/detail/"+t.id})},refreshMailBoxes:function(){this.getMailBoxes(this.pagination)}}),components:{Pagination:l.a},mounted:function(){this.getMailBoxes(this.pagination)}},r={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-row",{attrs:{id:"mail-boxes",gutter:0}},[t.isMailBoxesInspect?t._e():a("el-row",{attrs:{gutter:0}},[a("el-col",{attrs:{span:24}},[a("el-button",{attrs:{size:"mini"},on:{click:function(e){t.refreshMailBoxes()}}},[t._v("刷新")])],1),t._v(" "),a("el-col",{attrs:{span:24}},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.mailBoxes,stripe:""}},[a("el-table-column",{attrs:{label:"标题",width:"180"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){t.inspectMail(e.row)}}},[t._v("\n              "+t._s(e.row.title)+"\n            ")])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"contents",label:"内容",width:"180"}}),t._v(" "),a("el-table-column",{attrs:{prop:"name",label:"发件人"}}),t._v(" "),a("el-table-column",{attrs:{label:"发送日期"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n            "+t._s(t._f("Date")(e.row.createdAt))+"\n          ")]}}])})],1)],1),t._v(" "),a("pagination",{attrs:{total:t.mailBoxesTotal,pageSize:t.pagination.rows,currentPage:t.pagination.page},on:{currentChange:t.currentChange}})],1)],1)},staticRenderFns:[]};var c=a("Aizv")(s,r,!1,function(t){a("RTSK")},"data-v-681698b4",null);e.default=c.exports},I5Aj:function(t,e,a){(t.exports=a("yKCJ")(!0)).push([t.i,"\n#mail-boxes[data-v-681698b4] {\n  padding: 20px 1% 0 1%;\n}\n#mail-boxes[data-v-681698b4] .el-table__body-wrapper {\n  overflow: visible;\n}\n#mail-boxes[data-v-681698b4] .el-col-24 > .el-button--default {\n  float: right;\n}","",{version:3,sources:["E:/Project/狱务通重构/yuwutong_version2.0/src/views/mailbox/mailbox-list.vue"],names:[],mappings:";AACA;EACE,sBAAsB;CACvB;AACD;EACE,kBAAkB;CACnB;AACD;EACE,aAAa;CACd",file:"mailbox-list.vue",sourcesContent:["\n#mail-boxes[data-v-681698b4] {\n  padding: 20px 1% 0 1%;\n}\n#mail-boxes[data-v-681698b4] .el-table__body-wrapper {\n  overflow: visible;\n}\n#mail-boxes[data-v-681698b4] .el-col-24 > .el-button--default {\n  float: right;\n}"],sourceRoot:""}])},RTSK:function(t,e,a){var n=a("I5Aj");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);a("bUva")("f1781c82",n,!0,{})}});
//# sourceMappingURL=18.8908d27fe746f569c907.js.map