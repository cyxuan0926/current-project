webpackJsonp([9],{Hcya:function(e,t,a){(e.exports=a("yKCJ")(!0)).push([e.i,"","",{version:3,sources:[],names:[],mappings:"",file:"feedback-list.vue",sourceRoot:""}])},HyyK:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("34v0"),s=a.n(n),r=a("EcfS"),o={data:function(){return{tabNum:"first",searchItems:{uuid:{type:"input",label:"身份证号"},phone:{type:"input",label:"手机号"},name:{type:"input",label:"家属姓名"}}}},computed:s()({},Object(r.e)(["feedbacks","feedbacksTotal"])),mounted:function(){this.getFeedbacks(this.pagination)},methods:s()({},Object(r.b)(["getFeedbacks"]),{sizeChange:function(e){this.$refs.pagination.handleSizeChange(e),this.currentChange()},currentChange:function(){this.getFeedbacks(s()({},this.filter,this.pagination))},onSearch:function(){this.$refs.pagination.handleCurrentChange(1)}})},l={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-row",{staticClass:"row-container",attrs:{gutter:0}},[a("m-search",{attrs:{items:e.searchItems},on:{sizeChange:e.sizeChange,search:e.onSearch}}),e._v(" "),a("el-col",{attrs:{span:24}},[a("el-tabs",{attrs:{type:"card"},model:{value:e.tabNum,callback:function(t){e.tabNum=t},expression:"tabNum"}},[a("el-tab-pane",{attrs:{label:"意见反馈",name:"first"}})],1),e._v(" "),"first"===e.tabNum?a("el-table",{staticStyle:{width:"100%"},attrs:{data:e.feedbacks,border:"",stripe:""}},[a("el-table-column",{attrs:{prop:"name",label:"姓名"}}),e._v(" "),a("el-table-column",{attrs:{prop:"phone",label:"电话"}}),e._v(" "),a("el-table-column",{attrs:{prop:"uuid",label:"身份证"}}),e._v(" "),a("el-table-column",{attrs:{prop:"content","show-overflow-tooltip":"",label:"内容"}}),e._v(" "),a("el-table-column",{attrs:{label:"反馈时间"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n          "+e._s(e._f("Date")(t.row.createdAt))+"\n        ")]}}])})],1):e._e()],1),e._v(" "),a("m-pagination",{ref:"pagination",attrs:{total:e.feedbacksTotal},on:{onPageChange:e.currentChange}})],1)},staticRenderFns:[]};var i=a("Aizv")(o,l,!1,function(e){a("P745")},"data-v-a5c3ae1a",null);t.default=i.exports},P745:function(e,t,a){var n=a("Hcya");"string"==typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);a("bUva")("23e04360",n,!0,{})}});
//# sourceMappingURL=9.40b68df876d266b00755.js.map