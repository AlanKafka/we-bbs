import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';
import router from "./router/routes.js";
import 'highlight.js/styles/atom-one-dark.css' //样式
import hljs from 'highlight.js'
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

const app = createApp(App)
VMdEditor.use(githubTheme, {
    Hljs: hljs,
});
/**代码高亮化*/
app.directive('highlight', function (el) {
    const blocks = el.querySelectorAll('pre code');
    blocks.forEach((block) => {
        hljs.highlightBlock(block)
    })
})
app.use(Antd);
app.use(router);
app.use(VMdEditor);
app.mount('#app')


