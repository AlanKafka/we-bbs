<template>
  <div class="header" v-if="showHeader">
    <div class="header-content">
      <img src="../assets/logo.jpg">
      <a-menu v-model:selectedKeys="current" mode="horizontal">
        <a-menu-item @click="toHome" key="home">
          首页
        </a-menu-item>
        <a-menu-item @click="toFront" key="front">
          前端
        </a-menu-item>
        <a-menu-item @click="toBackend" key="backend">
          后端
        </a-menu-item>
        <a-menu-item @click="toCollect" key="collect">
          其他
        </a-menu-item>
      </a-menu>

      <a-input-search
          v-model:value="value"
          placeholder="input search text"
          enter-button
          @search="onSearch"
      />

      <a-button type="primary" class="header-button1" @click="newArticle">
        <template #icon>
          <plus-outlined/>
        </template>
        发布
      </a-button>
      <a-button type="primary" class="header-button2" @click="visible = true">
        <template #icon>
          <aliwangwang-outlined/>
        </template>
        消息
      </a-button>
      <a-dropdown>
        <a class="ant-dropdown-link" @click.prevent @click="onClikLogin">

          <img v-if="imgFlag" class="img-head" :src="imgUrl" >
          <!--设置登录不显示图像-->
          <a-avatar size="large" v-if="!imgFlag" @click="toLogin">
            <template #icon>
              <UserOutlined/>
            </template>
          </a-avatar>

        </a>

        <template #overlay>
          <a-menu v-if="imgFlag" :key="num">
            <a-menu-item>
              <a href="javascript:;">点赞</a>
            </a-menu-item>
            <a-menu-item>
              <a @click.prevent @click="Topersonal">个人资料</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">历史记录</a>
            </a-menu-item>
            <a-menu-item>
              <a @click.prevent @click="LogOut">退出登录</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, computed, reactive, watch, nextTick} from "vue";
import {PlusOutlined, AliwangwangOutlined, UserOutlined, LockOutlined} from '@ant-design/icons-vue';
import instance from "../axios/myAxios.js";
import {useRoute, useRouter} from "vue-router";
const router = useRouter();
const route = useRoute();
const current = ref(['home']);  //首先选定首页
const value = ref('');


/** 搜索框功能-- start **/
const onSearch = searchValue => {   //搜索框的内容
  alert(searchValue);
};
/** 搜索框 --end  **/
const showHeader = ref(true) //设置导航头显不显示
/** 设置点击图像弹出表单 **/
let visible = ref(false);



/** 设置导航栏下滑关闭 -- start  **/
const getScrollTop = () => {
  const scrollTop =
      document.documentElement.scrollTop ||
      window.pageYOffset || document.body.scrollTop;
  return scrollTop
}
const initScroll = () => {
  let initScrollTop = getScrollTop();
  let scrollType = 0;
  window.addEventListener("scroll", () => {
    let currentScrollTop = getScrollTop();
    if (currentScrollTop > initScrollTop) {
      //向下滚动
      scrollType = 1;
    } else {
      //向上滚动
      scrollType = 0;
    }
    initScrollTop = currentScrollTop;
    if (scrollType == 1 && currentScrollTop > 120) {
      showHeader.value = false;
    } else {
      showHeader.value = true;
    }
  })
}
onMounted(() => {
  initScroll();
  Authentication();
})
/** 导航栏下滑关闭 - end   **/

let imgFlag = ref(false)
let num = ref(1)
let imgUrl = ref('');
/** 退出登录方法 ***/
const LogOut = ref(()=>{
  localStorage.removeItem("jwtToken");
  window.location.reload(); //刷新当前页面
})

/** 鉴权 **/
async function Authentication (){
  await instance.get('/user/authentication').then(res=>{
    if(res.code == 200){
      imgUrl.value = 'http://localhost:8081/'+ res.data.slice(3)
      imgFlag.value = true
    }
  }).catch(error=>{

  })
}


/** 发布文章 **/

const newArticle = ref(()=>{
  router.push('/user/newArticle')
})

/** 个人资料 **/
const Topersonal = ref(()=>{
  router.push('/user/personal');
})


/** 切换页面 **/
const toFront = ref(()=>{
  router.push('/front')
})
const toHome = ref(()=>{
  router.push('/home')
})
const toBackend = ref(()=>{
  router.push('/backend')
})
const toCollect = ref(()=>{
  router.push('/collect')
})
//没有登录点击去登录页面
const toLogin = ref(()=>{
  router.push('/user/login');
})
</script>

<style scoped>
.header {
  height: 50px;
  width: 100%;
  position: fixed;
  z-index: 1000;
  box-shadow: 0 2px 6px #ddd;
  background: #fff;
}

.header-content {
  width: 70%;
  margin: 0px auto;
  align-items: center;
  display: flex;
  height: 50px;
}

.header-button1 {
  margin-left: 20px;
  margin-right: 20px;
}

.header-button2 {
  margin-right: 20px;
}

.img-head {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}


</style>