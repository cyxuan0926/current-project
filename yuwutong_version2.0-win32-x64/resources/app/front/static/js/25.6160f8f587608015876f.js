webpackJsonp([25],{K5iF:function(t,e,a){(t.exports=a("yKCJ")(!0)).push([t.i,"\n#mailboxes-inspect p.contents[data-v-39004ba5] {\n  margin-left: 15px;\n}\n#mailboxes-inspect .box-body .mailbox-read-info h5[data-v-39004ba5]:nth-child(2) {\n  margin-top: 12px;\n}","",{version:3,sources:["E:/Project/狱务通重构/yuwutong_version2.0/src/views/mailbox/mailbox-detail.vue"],names:[],mappings:";AACA;EACE,kBAAkB;CACnB;AACD;EACE,iBAAiB;CAClB",file:"mailbox-detail.vue",sourcesContent:["\n#mailboxes-inspect p.contents[data-v-39004ba5] {\n  margin-left: 15px;\n}\n#mailboxes-inspect .box-body .mailbox-read-info h5[data-v-39004ba5]:nth-child(2) {\n  margin-top: 12px;\n}"],sourceRoot:""}])},ezX3:function(t,e,a){var n=a("K5iF");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);a("bUva")("04d59f6f",n,!0,{})},uJ4C:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("34v0"),i=a.n(n),s=a("EcfS"),o={data:function(){return{comments:{content:""},rule:{content:[{required:!0,message:"请输入回复的内容",trigger:"blur"}]}}},watch:{commentResult:function(t){this.comments.content=""}},computed:i()({},Object(s.c)({mailDetail:"mailDetail",commentResult:"commentResult"})),methods:i()({},Object(s.b)({getMailDetailById:"getMailDetailById",replyComment:"replyComment"}),{reply:function(){var t=this;this.$refs.replyForm.validate(function(e){if(!e)return console.log("submit err"),!1;t.replyComment({id:t.$route.params.id,contents:t.comments.content,family_id:t.mailDetail.familyId})})}}),mounted:function(){this.getMailDetailById(this.$route.params.id)}},l={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-row",{attrs:{id:"mailboxes-inspect",gutter:0}},[a("div",{staticClass:"box-header with-border"},[a("h3",{staticClass:"box-title"},[t._v(t._s(t.mailDetail.title))])]),t._v(" "),a("div",{staticClass:"box-body no-padding"},[a("div",{staticClass:"mailbox-read-info"},[a("h5",[t._v("来自：\n        "),t._v(" "),a("span",[t._v(t._s(t.mailDetail.name)+"     <"+t._s(t.mailDetail.prisonerName)+" 的 "+t._s(t.mailDetail.relationship)+">")])]),t._v(" "),a("h5",[t._v("日期：\n        "),a("span",[t._v(t._s(t._f("Date")(t.mailDetail.createdAt)))])])]),t._v(" "),a("div",{staticClass:"mailbox-read-message"},[a("h5",[t._v("信件内容：")]),t._v(" "),a("p",{staticClass:"contents"},[t._v(t._s(t.mailDetail.contents))])])]),t._v(" "),a("div",{staticClass:"box-footer"},[t._l(t.mailDetail.comments,function(e){return a("el-row",{key:e.id,attrs:{gutter:0}},[a("el-col",{attrs:{span:24}},[a("el-button",{attrs:{type:"text"}},[t._v("监狱回复：")]),t._v(" "),a("span",[t._v(t._s(t._f("Date")(e.createdAt)))])],1),t._v(" "),a("el-col",{attrs:{span:24}},[a("p",{staticClass:"contents"},[t._v(t._s(e.contents))])])],1)}),t._v(" "),a("el-form",{ref:"replyForm",attrs:{model:t.comments,rules:t.rule}},[a("el-form-item",{attrs:{prop:"content"}},[a("el-input",{attrs:{type:"textarea",rows:3,placeholder:"快速回复"},model:{value:t.comments.content,callback:function(e){t.$set(t.comments,"content",e)},expression:"comments.content"}})],1)],1)],2),t._v(" "),a("div",{staticClass:"box-footer"},[a("div",{staticClass:"pull-right"},[a("el-button",{attrs:{plain:"",size:"mini"},on:{click:t.reply}},[t._v("回复")])],1)])])},staticRenderFns:[]};var r=a("Aizv")(o,l,!1,function(t){a("ezX3")},"data-v-39004ba5",null);e.default=r.exports}});
//# sourceMappingURL=25.6160f8f587608015876f.js.map