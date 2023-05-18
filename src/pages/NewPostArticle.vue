<!--发帖-->
<template>
  <div class="all-page">
    <a-card style="width: 100%;height: 100%">

      <div class="head-article">
        <a-card hoverable style="width:20%" class="head-img">
          <template #cover>
            <img alt="example" src="../assets/github.png" style="height: 200px"/>
          </template>
          <a-card-meta title="Quality article that belongs to you">
            <template #description>GitHub is a hosting platform for open source and private software projects.
            </template>
          </a-card-meta>
        </a-card>
        <a-form
            :model="formState"
            name="validate_other"
            labelAlign="right"
            class="head-form"
            @finishFailed="onFinishFailed"
            @finish="onFinish"
        >

          <a-form-item
              name="title"
              label="标题"
          >
            <a-input v-model:value="formState.title" placeholder="请输入标题"/>
          </a-form-item>

          <a-form-item
              name="label"
              label="分类"
          >
            <a-select v-model:value="formState.label" placeholder="请选择文章分类">
              <a-select-option value="0">前端</a-select-option>
              <a-select-option value="1">后端</a-select-option>
              <a-select-option value="-1">其他</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item name="summary" label="简介">
            <a-textarea v-model:value="formState.summary" :rows="5" placeholder="请介绍文章" show-count
                        :maxlength="100"/>
          </a-form-item>

          <a-form-item style="margin-left: 40px">
            <a-button type="primary" style="width:100%" html-type="submit">发布</a-button>
          </a-form-item>
        </a-form>
      </div>

      <a-button type="primary" shape="round" style="margin-bottom: 10px" :size="size" @click="changeEditor">
        <template #icon>
          <swap-outlined/>
        </template>
        切换为{{ editorType == 0 ? '富文本编辑器' : 'markdown编辑器' }}
      </a-button>
      <!-- markdown 文档 -->
      <v-md-editor :model-value="formState.markdownContent" mode="html" height="400px"
                   v-if="editorType == 0"></v-md-editor>

      <div style="border: 1px solid #ccc" v-if="editorType == 1">
        <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            :mode="mode"
        />
        <Editor
            style="height: 500px; overflow-y: hidden;"
            v-model="valueHtml"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="handleCreated"
        />
      </div>

    </a-card>
  </div>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref, shallowRef} from "vue";
import {SwapOutlined} from '@ant-design/icons-vue';

import {useRoute, useRouter} from "vue-router";
import instance from "../axios/myAxios.js";
import {message} from 'ant-design-vue';
import VueMarkdownEditor, {xss} from '@kangc/v-md-editor';
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import {Editor, Toolbar} from '@wangeditor/editor-for-vue'

const router = useRouter();
const route = useRoute();

//切换文本编辑器
let editorType = ref(0)
const changeEditor = ref(() => {
  editorType.value = editorType.value == 0 ? 1 : 0;
  window.localStorage.setItem("markdownContent", formState.markdownContent)
})


/******* 富文本编辑器 start  *******/


const valueHtml = ref('')
const mode = ref('default')
const editorRef = shallowRef()

const toolbarConfig = {}
const editorConfig = {placeholder: '请输入内容...'}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}


/******* 富文本编辑器  end *******/


/***** 表单提交start *****/

const formState = reactive({
  title: '', //标题
  label: '', //标签
  content: '',//内容
  summary: '',//摘要
  markdownContent: '',

});

const onFinish = ref(async (values) => {
  let formData = new FormData()
  formData.set('title', formState.title)
  formData.set('label', formState.label)
  formData.set('summary', formState.summary)
  if(formState.markdownContent!=null){
    formData.set('markdownContent', formState.markdownContent)
    formState.content = ref(xss.process(VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(formState.markdownContent)));
    formData.set('content', formState.content)
  }
  if(valueHtml.value !=null){
    formData.set('markdownContent', valueHtml.value)
    formState.content = valueHtml.value;
    formData.set('content', formState.content);
  }
  formData.set('editorType',editorType.value)
  await instance.post('/article/newPost', formData).then(res => {
    if(res.code == 200){
      message.success("发布成功");

    }
    if(res.code == 40100){
      message.error("请先登录");
      router.push('/user/login')
    }
  }).catch(error => {
    message.error("发布失败");
  })
});
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};

/****** 表单提交end *******/


</script>

<style scoped>
.all-page {
  width: 100%;
  height: 100%;
}

.head-article {
  display: -webkit-flex;
}

.head-img {
  width: 20%;
  height: 200px;
  margin-bottom: 15px;
}


.head-form {
  margin-right: 10px;
  width: 80%;
  margin-left: 15px;
}

</style>