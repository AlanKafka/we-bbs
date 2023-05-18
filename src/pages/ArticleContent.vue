<template>
  <!--文章详情-->
  <div class="posts">
    <a-card>
      <div class="detail-container">
        <h2 class="title">标题:{{ articleText.title }}</h2>
        <div class="article-head">
          <div>
            <img class="article-img-head" :src="articleText.userAvatar">&nbsp;&nbsp
          </div>

          <div>
            <p class="article-name">
              {{ articleText.userName }}
            </p>
            <span class="article-time">{{ articleText.postTime }}</span>
            <a-button type="text" shape="circle" size="middle" style="margin-right: -5px;margin-left: 3px">
              <template #icon>
                <eye-two-tone/>
              </template>
            </a-button>&nbsp;<span>{{ articleText.readCount }}</span>
          </div>
        </div>
        <div class="detail" v-html="articleText.content">
        </div>
      </div>
      <!--文章详情--->
    </a-card>
  </div>
</template>

<script setup>
import hljs from "highlight.js";
import 'highlight.js/styles/atom-one-dark.css' //样式
import {nextTick, onMounted, reactive,ref} from "vue";
import {UserOutlined, EyeTwoTone} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import instance from "../axios/myAxios.js";
import {useRoute, useRouter} from "vue-router";
const router = useRouter();
const route = useRoute();
/** 文章详情 **/

// //代码高亮
onMounted(() => {
  articleData();

})

function highlightCode() {
  nextTick(() => {
    let blocks = document.querySelectorAll("pre code")
    blocks.forEach(item => {
      hljs.highlightBlock(item);
    })
  })
}

/**文章详情**/

let articleText = reactive(
    {
      title: '',
      userName: '',
      postTime: null,
      readCount: null,
      content: '',
      userAvatar:'',
    }
)
const articleData = async () => {
  await instance.request({
    url:'/article',
    method:'get',
    params:{
      articleId:route.query.id
    }
  }).then(res => {
    if (res.code == 200) {
      articleText.title = res.data.title;
      articleText.userName = res.data.userName;
      let time = new Date(res.data.postTime).toJSON();
      articleText.postTime = new Date(+new Date(time) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      articleText.readCount = res.data.readCount;
      articleText.content = res.data.content;
      articleText.userAvatar  = 'http://localhost:8081/'+res.data.user.userAvatar.slice(3);
      highlightCode();
    }
  }).catch(error => {
   message.error('数据错误')
  })
}

</script>

<style scoped>
/** 文章样式 ***/
.detail-container {
  padding-left: 0px;
  padding-right: 0px;
}

.title {
  font-size: 16px;
  font-weight: bolder;
}

.article-head {
  display: -webkit-flex;
  display: flex;
  border-bottom: 1px solid darkgray;
}

.article-name {
  font-size: 18px;
  font-weight: bold;
  margin-left: 10px;
  margin-top: 0px;
  margin-bottom: 4px;
  padding-bottom: 0px;
  padding-top: 10px;
}

.article-img-head {
  width: 77px;
  height: 77px;
  padding-bottom: 4px;
  border-radius: 50%;
}

.article-time {
  font-weight: bold;
  font-size: 16px;
}

/**文章样式**/

/*卡片的样式*/

.posts {
  top: 50px;
  position: absolute;
  margin-top: 5px;
  margin-left: 15%;
  width: 70%;
}
</style>