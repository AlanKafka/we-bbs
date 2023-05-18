<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import {onBeforeMount} from "vue";
import UserProfile from "./components/UserProfile.vue";
/**设置的背景色**/
onBeforeMount(()=>{
    document.querySelector('body').setAttribute('style', 'background-color:#DEE1E6')
})
</script>
<style scoped>

</style>
