webpackJsonp([11],{N0G3:function(t,e,a){(t.exports=a("yKCJ")(!0)).push([t.i,"","",{version:3,sources:[],names:[],mappings:"",file:"terminal-list.vue",sourceRoot:""}])},shkD:function(t,e,a){var n=a("N0G3");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);a("bUva")("a3f740b4",n,!0,{})},wfzx:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("34v0"),s=a.n(n),l=a("EcfS"),i={data:function(){return{searchItems:{jailId:{type:"select",label:"监狱名称",getting:!0,belong:{value:"id",label:"title"},filterable:!0}}}},computed:s()({},Object(l.e)(["terminals","prisonAll"])),mounted:function(){var t=this;this.getDatas(),this.getPrisonAll().then(function(){t.searchItems.jailId.options=t.prisonAll,t.searchItems.jailId.getting=!1})},methods:s()({},Object(l.b)(["getTerminals","getPrisonAll"]),{sizeChange:function(t){this.$refs.pagination.handleSizeChange(t),this.getDatas()},getDatas:function(){this.getTerminals(s()({},this.filter,this.pagination))},onSearch:function(){this.$refs.pagination.handleCurrentChange(1)},onAdd:function(){this.$router.push("/terminal/add")},onEdit:function(t){this.$router.push("/terminal/edit/"+t)}})},r={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-row",{staticClass:"row-container",attrs:{gutter:0}},[a("el-button",{staticClass:"button-add",attrs:{size:"small",type:"primary",plain:""},on:{click:t.onAdd}},[t._v("添加终端信息")]),t._v(" "),a("m-search",{attrs:{items:t.searchItems},on:{sizeChange:t.sizeChange,search:t.onSearch}}),t._v(" "),a("el-col",{attrs:{span:24}},[a("el-tabs",{attrs:{value:"first",type:"card"}},[a("el-tab-pane",{attrs:{label:"终端管理",name:"first"}})],1),t._v(" "),a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.terminals.contents,border:"",stripe:""}},[a("el-table-column",{attrs:{prop:"terminalNumber",label:"终端号"}}),t._v(" "),a("el-table-column",{attrs:{prop:"roomNumber",label:"会议室号"}}),t._v(" "),a("el-table-column",{attrs:{prop:"jailName",label:"所属监狱"}}),t._v(" "),a("el-table-column",{attrs:{prop:"hostPassword",label:"主持人密码"}}),t._v(" "),a("el-table-column",{attrs:{prop:"mettingPassword",label:"参与密码"}}),t._v(" "),a("el-table-column",{attrs:{label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(a){t.onEdit(e.row.id)}}},[t._v("编辑")])]}}])})],1)],1),t._v(" "),a("m-pagination",{ref:"pagination",attrs:{total:t.terminals.total},on:{onPageChange:t.getDatas}})],1)},staticRenderFns:[]};var o=a("Aizv")(i,r,!1,function(t){a("shkD")},"data-v-963846be",null);e.default=o.exports}});
//# sourceMappingURL=11.c7c835e31d19eb8a43d6.js.map