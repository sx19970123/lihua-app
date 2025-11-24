<template>
  <view class="home">
    <text class="title">狸花猫后台管理系统APP</text>
	<br/>
	<br/>
	<br/>
	<br/>
	<password-input v-model:value="pwd"></password-input>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import PasswordInput from '@/components/password-input/index.vue'
const pwd = ref<string>()
watch(() => pwd.value, () => {
	console.log("pwd", pwd.value);
})
</script>

<style lang="scss" scoped>
.home {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
}

</style>
