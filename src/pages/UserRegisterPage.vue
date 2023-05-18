<template>
  <!-- 注册表单 --start -->
    <div class="form-align">
      <img src="src/assets/logo.jpg" style="margin-left: 220px">
      <h2 style="padding-left: 45%">注册</h2>
      <a-form
          :model="formRegister"
          :rules="RegisterRules"
          name="normal_login"
          class="login-form"
          @finish="onFinishRegister"
          @finishFailed="onFinishRegisterFailed"
          :label-col="labelCol"
          style="padding-right: 100px;"
      >
        <a-form-item
            label="账号"
            name="userAccount"
        >
          <a-input v-model:value="formRegister.userAccount">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
            label="密码"
            name="userPassword"
            has-feedback
        >
          <a-input-password v-model:value="formRegister.userPassword">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>

        <!-- 确认密码 -->
        <a-form-item
            label="再次"
            name="checkPassword"
            has-feedback
        >
          <a-input-password v-model:value="formRegister.checkPassword">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        <!-- 确认密码 -->

        <a-form-item>
          <a-button  type="primary" html-type="submit" class="login-form-button" style="margin-left: 40%;margin-right: 10px">
            注册
          </a-button>
          Or
          <a @click.prevent style="margin-left: 10px" @click="onLogin">登录!</a>
        </a-form-item>
      </a-form>
    </div>

  <!--注册表单- end -->
</template>

<script setup>
import {computed, reactive, ref} from "vue";
import instance from "../axios/myAxios.js";
import {useRoute, useRouter} from "vue-router";
import { message } from 'ant-design-vue';
const router = useRouter();
const route = useRoute();
/** 跳转登录 **/
const onLogin = ref(()=>{
  router.push('/user/login')
})

/** 注册账号自定义校验规则 **/
//账号验证规则
var ACuserAccount = async (_rule, value) => {
  if (value === '') {
    console.log(value)
    return Promise.reject('请输入账号');
  } else {
    if(formRegister.userAccount.length<4){
      return Promise.reject('账号要大于4位');
    }
    if(formRegister.userAccount.length>16){
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
    if(formRegister.userPassword.length<6){
      return Promise.reject('密码需要超过6位');
    }
    if(formRegister.userPassword.length>24){
      return Promise.reject('密码需要小于24位');
    }
    return Promise.resolve();
  }
};
//确认密码的验证规则
var ACcheckPassword = async (_rule, value) => {
  if (value === '') {
    return Promise.reject('请输入密码');
  } else {
    if(formRegister.checkPassword.length<6){
      return Promise.reject('密码需要超过6位');
    }
    if(formRegister.checkPassword.length>24){
      return Promise.reject('密码需要小于24位');
    }
    if(formRegister.checkPassword != formRegister.userPassword){
      return Promise.reject('两次密码输入不一致');
    }
    return Promise.resolve();
  }
};

/** 设置注册表单的校验规则 **/
const RegisterRules =ref({
  userAccount:[{
    required: true,
    validator: ACuserAccount,
    trigger: 'change',
  }],
  userPassword:[{
    required: true,
    validator: ACuserPassword,
    trigger: 'change',
  }],
  checkPassword:[{
    required: true,
    validator: ACcheckPassword,
    trigger: 'change',
  }]
});
/**  表单的注册数据  **/
const formRegister = reactive({
  userAccount:'',
  userPassword:'',
  checkPassword:'',
})

/**  表单注册功能 -start   **/
//表单注册成功
const onFinishRegister =ref( async (values) => {
  console.log(values)
  await instance.post('/user/register',values).then(res=>{
    console.log(res)
    if(res.code == 200){
      message.success('注册成功')
      window.location.href="http://localhost:5173/";
    }
  }).catch(error=>{
    message.error("注册失败")
  })
});


const onFinishRegisterFailed =ref(errorInfo => {
  console.log('Failed:', errorInfo);
  console.log('onFinishLoginFailed')
}) ;
//表单注册失败
const disabledRegister=ref(computed(() => {
  console.log('disabled')
  return !(formRegister.userAccount && formLogin.password);
}));
/**  表单注册功能 -end  **/
//控制输入框的宽度
let labelCol = ref({
  style:{
    width:'120px'
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