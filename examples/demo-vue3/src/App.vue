<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Welcome to Your Vue.js App" />

  <div>VUE_INSPECTOR_OPTIONS: {{ VUE_INSPECTOR_OPTIONS }}</div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue';

const VUE_INSPECTOR_OPTIONS = ref('');

onMounted(() => {
  VUE_INSPECTOR_OPTIONS.value = process.env.__VUE_INSPECTOR_OPTIONS__;
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
