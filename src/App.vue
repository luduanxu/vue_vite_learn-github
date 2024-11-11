<script setup>
import HelloWorld from './components/HelloWorld.vue'
import GojsFirst from "./test/GojsFirst.vue";
import GojsAddNode from "./test/GojsAddNode.vue";
import FirebaseRead from "./components/FirebaseRead.vue";
import FireDataManager from "./components/FireDataManager.vue";
</script>

<template>
  <!--<gojs-first/>-->
  <!--<gojs-add-node/>-->
  <!--<firebase-read/>-->
  <fire-data-manager/>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
