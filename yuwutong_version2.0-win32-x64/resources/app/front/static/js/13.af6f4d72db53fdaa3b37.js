webpackJsonp([13],{"5LYA":function(t,e,n){var a=n("ymH0");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);n("bUva")("4b8d772a",a,!0,{})},J6PA:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n("34v0"),i=n.n(a),o=n("EcfS"),s={data:function(){return{searchItems:{title:{type:"input",label:"新闻标题"}}}},computed:i()({},Object(o.c)(["newsAll","newsTotal"])),mounted:function(){this.getNewsAll(i()({},this.pagination,{type:2}))},methods:i()({},Object(o.b)(["getNewsAll","deleteNews"]),{onSearch:function(){this.$refs.pagination.handleCurrentChange(1)},sizeChange:function(t){this.$refs.pagination.handleSizeChange(t),this.currentChange()},currentChange:function(){this.getNewsAll(i()({},this.filter,this.pagination,{type:2}))},onDelete:function(t){var e=this;this.$confirm("确定删除？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.deleteNews({id:t}).then(function(t){t&&e.currentChange()})}).catch(function(){})},onEdit:function(t){this.$router.push({path:"/prison-affairs-public/working-dynamics/edit/"+t})},onAdd:function(){this.$router.push({path:"/prison-affairs-public/working-dynamics/add"})}})},r={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("el-row",{staticClass:"row-container",attrs:{gutter:0}},[n("el-button",{staticClass:"button-add",attrs:{size:"small",type:"primary",plain:""},on:{click:t.onAdd}},[t._v("添加工作动态")]),t._v(" "),n("m-search",{attrs:{items:t.searchItems},on:{sizeChange:t.sizeChange,search:t.onSearch}}),t._v(" "),n("el-col",{attrs:{span:24}},[n("el-table",{staticStyle:{width:"100%"},attrs:{data:t.newsAll,border:"",stripe:""}},[n("el-table-column",{attrs:{prop:"title","show-overflow-tooltip":"",label:"新闻标题"}}),t._v(" "),n("el-table-column",{attrs:{label:"新闻图片"},scopedSlots:t._u([{key:"default",fn:function(t){return t.row.imageUrl?[n("img",{attrs:{src:t.row.imageUrl+"?token=523b87c4419da5f9186dbe8aa90f37a3876b95e448fe2a",alt:""}})]:void 0}}])}),t._v(" "),n("el-table-column",{attrs:{label:"焦点"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n            "+t._s(e.row.isFocus?"是":"否")+"\n          ")]}}])}),t._v(" "),n("el-table-column",{attrs:{label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-button",{attrs:{size:"mini",type:"primary"},on:{click:function(n){t.onEdit(e.row.id)}}},[t._v("\n              编辑\n            ")]),t._v(" "),n("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(n){t.onDelete(e.row.id)}}},[t._v("\n              删除\n            ")])]}}])})],1)],1),t._v(" "),n("m-pagination",{ref:"pagination",attrs:{total:t.newsTotal},on:{onPageChange:t.currentChange}})],1)},staticRenderFns:[]};var l=n("Aizv")(s,r,!1,function(t){n("5LYA")},"data-v-7f7420e2",null);e.default=l.exports},ymH0:function(t,e,n){(t.exports=n("yKCJ")(!0)).push([t.i,"","",{version:3,sources:[],names:[],mappings:"",file:"working-dynamics-list.vue",sourceRoot:""}])}});
//# sourceMappingURL=13.af6f4d72db53fdaa3b37.js.map