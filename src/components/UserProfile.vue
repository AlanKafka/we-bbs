<template>
  <div class="posts">
    <a-card class="card-outer">
      <div class="user-box">
        <img class="img-head" v-if="true" :src="userInfo.userAvatar">
      </div>
      <p class="user-name">{{userInfo.userName}}</p>
      <p class="in-time">加入论坛时间&nbsp;:&nbsp;{{userInfo.createTime}}</p>
      <p class="brief">博客简介&nbsp;:</p>
      <p class="brief">粉丝数:2220</p>

    </a-card>
    <a-card title="基本信息" style="width: 100%;height: 71.5vh">
      <template #extra></template>

      <a-upload
          v-model:file-list="fileList"
          name="file"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          :customRequest="customRequest"
          :before-upload="beforeUpload"
          @change="handleChange"
      >
        <img v-if="imageUrl" :src="imageUrl" alt="avatar"/>
        <div v-else>
          <loading-outlined v-if="loading"></loading-outlined>
          <plus-outlined v-else></plus-outlined>
          <div class="ant-upload-text">修改头像</div>
        </div>
      </a-upload>


      用户名称<span style="margin-left: 80px">{{ userInfo.userName }}</span><br><br>
      用户账号<span style="margin-left: 80px">{{ userInfo.userAccount }}</span><br><br>
      个人简介<span style="margin-left: 78px">大家好我是卡夫卡</span><br><br>
      <div>


        <a-button type="primary" @click="visible = true">修改资料</a-button>
        <a-modal
            v-model:visible="visible"
            title="修改资料"
            footer=" "
        >
          <a-form
              ref="formRef"
              :model="formState"
              layout="vertical"
              name="form_in_modal"
              @finish="updateUserInfo"
              @finishFailed="onFinishFailed">
            <a-form-item
                name="userName"
                label="用户名"
            >
              <a-input v-model:value="formState.userName" />
            </a-form-item>

            <a-form-item name="userProfile" label="用户简介">
              <a-textarea v-model:value="formState.userProfile" />
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit">提交</a-button>
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    </a-card>

  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import {useRoute, useRouter} from "vue-router";
import instance from "../axios/myAxios.js";
const router = useRouter();
const route = useRoute();
/*** 弹出表单 start ***/
const formRef = ref();
const visible = ref(false);
const formState = reactive({
  userName: '',
  userProfile:'',
});


/**** 弹出表单 end ****/

/*** 修改图像 start***/
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const loading = ref(false);
const imageUrl = ref('');
//文件数据
const fileList = ref([]);

const handleChange = info => {
  if (info.file.status === 'uploading') {
    loading.value = true;
    return;
  }
  if (info.file.status === 'done') {
    // Get this url from response in real world.
    getBase64(info.file.originFileObj, base64Url => {
      imageUrl.value = base64Url;
      loading.value = false;
    });
  }
  if (info.file.status === 'error') {
    loading.value = false;
    message.error('upload error');
  }
};


function customRequest(file){
  const form = new FormData()
  form.append('file', file.file)
  console.log(file)
  console.log(form)
  instance.post(
      '/user/UploadPicture',form
  ).then(res=>{
    if(res.code === 40100){
     message.error("请先登录")
     router.push('/user/login')
    }
    if(res.code === 200){
      // 调用组件内方法, 设置为成功状态
      message.success("上传成功")
      file.status = 'success'
      window.setTimeout(function(){
        window.location.reload()
      },1000)
    }else {
      file.status = 'error'
    }
  }).catch(error=>{
    message.error('上传失败')
  })
}
const beforeUpload = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG file!');
  }
  const isLt6M = file.size / 1024 / 1024 < 6;
  if (!isLt6M) {
    message.error('Image must smaller than 6MB!');
  }
  return isJpgOrPng && isLt6M;
};
/*** 修改图像 end ***/

/** 加载页面  **/
//用户信息
const userInfo = reactive({

})
onMounted(()=>{
  LoadUserInfo();
})
async function LoadUserInfo(){
  await instance.request({
    url:'/user/info',
    method:'get',
  }).then(res=>{
    if(res.code === 40100){
      message.error("请先登录")
      router.push('/user/login')
    }
    if(res.code === 200){
      userInfo.userName = res.data.userName
      let time = new Date(res.data.createTime).toJSON();
      userInfo.createTime = new Date(+new Date(time) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      userInfo.userProfile = res.data.userProfile
      userInfo.userAvatar = 'http://localhost:8081/'+ res.data.userAvatar.slice(3)
      userInfo.userAccount = res.data.userAccount
    }
  }).catch(error=>{
    console.log(error)
  })
}
//修改用户信息
const updateUserInfo = ref(async (values)=>{
  console.log(values)
  await instance.post('/user/updateInfo',values).then(res=>{

    if(res.code === 40100){
      message.error("请先登录")
      router.push('/user/login')
    }
    if(res.code === 200){
      message.success("修改成功")
      window.setTimeout(function(){
        window.location.reload()
      },1000)
    }
  }).catch(error =>{
    message.error("修改失败")
  })
})
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};

</script>

<style scoped>

.posts {
  top: 50px;
  position: absolute;
  margin-top: 5px;
  margin-left: 15%;
  width: 70%;
}

.img-head {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-box {
  float: left;
}

.user-name {
  font-size: 25px;
  margin-top: 0px;
  margin-left: 135px;
}
.in-time{
  font-size: 15px;
  margin-top: -25px;
  margin-left: 135px;
}
.brief{
  font-size: 15px;
  margin-top: -10px;
  margin-left: 135px;

}
/** 上传图片 start **/
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
/** 上传图片 end **/
</style>