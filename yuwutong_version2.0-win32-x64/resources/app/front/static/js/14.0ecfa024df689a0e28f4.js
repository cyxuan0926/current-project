webpackJsonp([14],{L1ot:function(e,t,s){var n=s("n7Jz");"string"==typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);s("bUva")("4f031b99",n,!0,{})},SyUC:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=s("34v0"),i=s.n(n),o=s("EcfS"),r={data:function(){return{news:{typeId:1,title:"",contents:"",summary:"",isFocus:!1,imageUrl:""},rules:{title:[{required:!0,message:"请填写新闻标题"}]}}},methods:i()({},Object(o.b)(["addNews"]),{onSuccess:function(e){this.news.imageUrl=e},editorChange:function(e,t){this.news.contents=e,this.news.summary=t},onSubmit:function(){var e=this;this.$refs.form.validate(function(t){if(t){if(!e.news.contents)return e.$message.warning("请填写新闻内容"),!1;e.addNews(e.news).then(function(t){t&&e.$router.push("/prison-affairs-public/prison-affairs-public")})}})}})},a={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("el-row",{staticClass:"row-container",attrs:{gutter:0}},[s("el-col",{attrs:{span:13,offset:5}},[s("el-form",{ref:"form",attrs:{model:e.news,"label-position":"top",rules:e.rules}},[s("el-form-item",{attrs:{label:"新闻标题",prop:"title"}},[s("el-input",{attrs:{placeholder:"请填写新闻标题"},model:{value:e.news.title,callback:function(t){e.$set(e.news,"title",t)},expression:"news.title"}})],1),e._v(" "),s("el-form-item",{staticClass:"is-required",attrs:{label:"新闻内容",prop:"contents"}},[s("m-quill-editor",{on:{editorChange:e.editorChange}})],1),e._v(" "),s("el-form-item",{attrs:{label:"新闻图片"}},[s("m-upload-img",{on:{success:e.onSuccess}})],1),e._v(" "),s("el-form-item",[s("el-checkbox",{model:{value:e.news.isFocus,callback:function(t){e.$set(e.news,"isFocus",t)},expression:"news.isFocus"}},[e._v("是否设为焦点新闻")])],1),e._v(" "),s("el-form-item",[s("el-button",{staticStyle:{float:"right"},attrs:{type:"primary",size:"small"},on:{click:e.onSubmit}},[e._v("新增")])],1)],1)],1)],1)},staticRenderFns:[]};var l=s("Aizv")(r,a,!1,function(e){s("L1ot")},"data-v-7ec73105",null);t.default=l.exports},n7Jz:function(e,t,s){(e.exports=s("yKCJ")(!0)).push([e.i,"","",{version:3,sources:[],names:[],mappings:"",file:"prison-affairs-public-add.vue",sourceRoot:""}])}});
//# sourceMappingURL=14.0ecfa024df689a0e28f4.js.map