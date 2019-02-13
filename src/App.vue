<template>
  <div id="app">
    <div class="inside">
      <!-- <transition enter-active-class="animated fadeIn" leave-active-class="animated zoomOut" mode="out-in"> -->
      <router-view/>
      <!-- </transition> -->
    </div>
  </div>
</template>

<script>
import 'assets/styles/reset'
import 'assets/styles/common'

export default {
  name: 'app',
  data() {
    return {
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
