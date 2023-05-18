<template>
  <a-card-grid class="card-grid" v-for="(p) in timeText" :key="p.articleId">
    <div style="float: left;width: 70%;">
      <img class="img-head"  :src="p.user.userAvatar">&nbsp;&nbsp
      <span style="font-size: 14px;color: dimgrey;font-weight: bold">
              {{ p.userName }}&nbsp;&nbsp;
            </span>
      <span>|</span>
      <span style="font-size: 14px;color: dimgrey;font-weight: bold">&nbsp;&nbsp;{{ p.postTime }}</span>
      <span style="font-size: 14px;color: dimgrey;margin-left: 6px;font-weight: bold">{{ labelDetail(p.label) }}</span>
      <h2 id="title" @click="addReadCount(p.articleId)">
        <router-link style="color:#000;" :to="{
              path:'/article',
             query:{
              id:p.articleId,
              }
            }">{{ p.title }}
        </router-link>
      </h2>
      <p class="p-hidden" style="font-size: 12px">{{ p.summary }}</p>

      <a-button type="text" shape="circle" size="small">
        <template #icon>
          <eye-two-tone/>
        </template>
      </a-button>
      <span style="margin-right: 10px;color:#1890FF">{{ p.readCount }}</span>

      <a-button type="text" shape="circle" size="small">
        <template #icon>
          <like-two-tone/>
        </template>
      </a-button>
      <span style="margin-right: 10px;color:#1890FF">{{ p.goodCount }}</span>

      <a-button type="text" shape="circle" size="small">
        <template #icon>
          <message-two-tone/>
        </template>
      </a-button>
      <span style="margin-right: 10px;color:#1890FF">{{ p.commentCount }}</span>
    </div>


    <div class="div-img-banner"><img class="img-banner" src="../assets/aaa.jpg"></div>
  </a-card-grid>

</template>

<script setup>
import {LikeTwoTone, EyeTwoTone, MessageTwoTone, UserOutlined} from '@ant-design/icons-vue';
import {onMounted, reactive, ref} from "vue";
import instance from "../axios/myAxios.js";
import {useRoute, useRouter} from "vue-router";
import {message} from 'ant-design-vue';

const router = useRouter();
const route = useRoute();

/** 主页请求数据 **/
onMounted(() => {
  timeOtherData();
})

let timeText = reactive([]);
let texts = reactive([])

async function timeOtherData() {
  await instance.get('/other/time').then(res => {
    if (res.code == 200) {
      texts = res.data;
      texts.forEach(item => {
        item.user.userAvatar = 'http://localhost:8081/'+ item.user.userAvatar.slice(3);
        timeText.push(item)
      })
    }
  }).catch(error => {
    message.error('页面加载失败');
  })
}
//点击增加浏览器数量

async function addReadCount(articleId){
  await instance.request({
    url:'/article/readCount',
    method:'get',
    params:{
      articleId:articleId
    }
  }).then(res=>{
    if(res.code == 200){
      console.log("添加成功")
    }
  }).catch(error=>{
    console.log("error")
  })
}
/** 标签 **/
function labelDetail(value) {
  if (value == -1) {
    return "其他"
  }
  if (value == 0) {
    return "前端"
  }
  if (value == 1) {
    return "后端"
  }
}
</script>

<style scoped>
.img-head {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

#title {
  color: black;
  margin: 0px 0px 0px 0px;
  padding: 0px 0px 0px 0px;
  font-weight: bold;
}

/*卡片的样式*/
.card-grid {
  width: 100%;
  height: 150px;
  text-align: left;
  align-items: center;
  padding-top: 8px;
}

.div-img-banner {
  float: right;
  margin-top: 10px;

}

.img-banner {
  height: 120px;
  width: 240px;

  float: right;

}

/*设置内容的显示*/
.p-hidden {
  width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 路由跳转 */
#title :hover {
  border-bottom: 2px solid #000000;

}
</style>