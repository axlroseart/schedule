<template>
  <div class="index">
    <top />
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
import top from 'components/top'
export default {
  components: {
    top
  },
  // 路由分发
  mounted() {
    let route = this.$route
    let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    if (userInfo) {
      let role = userInfo ? userInfo.role : !0
      switch (role) {
        case 1:
          if (route.name !== 'index') {
            this.$router.push({
              path: route.path
            })
          } else {
            this.$router.push({
              path: '/famer/list'
            })
          }
          break
        case 2:
          if (route.name !== 'index') {
            this.$router.push({
              path: route.path
            })
          } else {
            this.$router.push({
              path: '/schedule/list'
            })
          }
          break
      }
    } else {
      this.$router.push({
        name: 'login'
      })
    }
  }
}
</script>

<style>

</style>
