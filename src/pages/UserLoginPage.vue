<template>
  <!--登录表单-start -->
    <div class="form-align">
      <img src="src/assets/logo.jpg" style="margin-left: 220px">
      <h2 style="padding-left: 45%">登录</h2>
      <a-form
          :model="formLogin"
          :rules="LoginRules"
          name="normal_login"
          class="login-form"
          @finish="onFinishLogin"
          @finishFailed="onFinishLoginFailed"
          :label-col="labelCol"
          style="padding-right: 100px;"
      >
        <a-form-item
            label="账号"
            name="userAccount"
        >
          <a-input v-model:value="formLogin.userAccount">
            <template #prefix>
              <UserOutlined class="site-form-item-icon"/>
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
            label="密码"
            name="userPassword"
            has-feedback
        >
          <a-input-password v-model:value="formLogin.userPassword">

          </a-input-password>
        </a-form-item>

        <a-form-item style="margin-left: 30%">
          <a-form-item name="remember" no-style>
            <a-checkbox v-model:checked="formLogin.remember">记住密码</a-checkbox>
          </a-form-item>
          <a class="login-form-forgot" href="">忘记密码</a>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" class="login-form-button"
                    style="margin-left:48%;margin-right: 10px">
            登录
          </a-button>
          Or
          <a @click.prevent style="margin-left: 10px" @click="onRegister">注册!</a>

        </a-form-item>
      </a-form>
    </div>

</template>

<script setup>
import {reactive, ref} from "vue";
import instance from "../axios/myAxios.js";
import {useRoute, useRouter} from "vue-router";
import {message} from 'ant-design-vue';

const router = useRouter();
const route = useRoute();

/**跳转注册页面**/
function onRegister() {
  router.push('/user/register')
}

/** 注册账号自定义校验规则 **/
//账号验证规则
var ACuserAccount = async (_rule, value) => {
  if (value === '') {
    console.log(value)
    return Promise.reject('请输入账号');
  } else {
    if (formLogin.userAccount.length < 4) {
      return Promise.reject('账号要大于4位');
    }
    if (formLogin.userAccount.length > 16) {
      return Promise.reject('账号小于16');
    }
    return Promise.resolve();
  }
};
//密码
var ACuserPassword = async (_rule, value) => {
  if (value === '') {
    return Promise.reject('请输入密码');
  } else {
    if (formLogin.userPassword.length < 6) {
      return Promise.reject('密码需要超过6位');
    }
    if (formLogin.userPassword.length > 24) {
      return Promise.reject('密码需要小于24位');
    }
    return Promise.resolve();
  }
};

/** 设置登录表单的校验规则 **/
const LoginRules = reactive({
  userAccount: [{
    required: true,
    validator: ACuserAccount,
    trigger: 'change',
  }],
  userPassword: [{
    required: true,
    validator: ACuserPassword,
    trigger: 'change',
  }]
});

/** 表单的登录数据 **/
const formLogin = reactive({
  userAccount: '',
  userPassword: '',
  remember: true,
});

/** 登录功能 -- start **/
//表单登录成功
const onFinishLogin = ref(async (values) => {
  await instance.post('/user/login', values).then(res => {
    if(res.code == 40001){
      message.error("密码错误")
    }
    if(res.code == 40000){
      message.error('信息错误')
    }
    if (res.code == 200) {
      message.success('登录成功')
      if (res.data.token != null) {
        //登录后添加token
        window.localStorage.setItem("jwtToken", res.data.token)
      }
      router.push('/')
    }
  }).catch(error => {
    message.error('登录失败')
  })
});

//
const onFinishLoginFailed = ref(errorInfo => {
  console.log('Failed:', errorInfo);
  console.log('onFinishLoginFailed')
});

/** 表单登录功能 -- end    **/

//控制输入框的宽度
let labelCol = ref({
  style: {
    width: '120px'
  }
})
</script>

<style scoped>

.form-align {
  position: absolute;
  left: 36%;
  top: 30%;
  width: 500px;
  margin: 0 auto;

  border: 1px solid white;
  background-color: white;
  box-shadow: 0 2px 6px black;
}

</style>