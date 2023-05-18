<template>
  <div class="posts">
    <a-card>
      <a-radio-group v-model:value="value1" button-style="solid">
        <a-radio-button value="a" @click="toHot">热度</a-radio-button>
        <a-radio-button value="b" @click="toTime">最新</a-radio-button>
      </a-radio-group>
      <router-view></router-view>
    </a-card>
  </div>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";

const router = useRouter();
const route = useRoute();
const value1 = ref('a');
const toHot = ref(() => {
  router.push('/collect/hot');
})
const toTime = ref(() => {
  router.push('/collect/time');
})


</script>

<style scoped>
.posts {
  top: 50px;
  position: absolute;
  margin-top: 5px;
  margin-left: 15%;
  width: 70%;
}


/* 路由跳转 */
#title :hover {
  border-bottom: 2px solid #000000;

}
</style>