<template>
  <div class="top">
    <div class="in">
      <div class="logo"></div>
      <div v-show="isLogin === 'yes'">
      <!-- <div> -->
        <div class="top-menu">
          <el-tabs :value="tabActiveName" @tab-click="handleClick">
            <el-tab-pane label="排课管理" name="schedule"></el-tab-pane>
            <el-tab-pane label="班级管理" name="classroom"></el-tab-pane>
            <el-tab-pane label="主教管理" name="teacher"></el-tab-pane>
            <el-tab-pane label="排课员管理" name="famer" v-if="userInfo.role !== 2"></el-tab-pane>
            <!-- <el-tab-pane label="排课管理" name="schedule" v-if="userInfo.role === 2"></el-tab-pane>
            <el-tab-pane label="班级管理" name="classroom" v-if="userInfo.role === 2"></el-tab-pane>
            <el-tab-pane label="主教管理" name="teacher" v-if="userInfo.role === 2"></el-tab-pane>
            <el-tab-pane label="排课员管理" name="famer" v-if="userInfo.role === 1"></el-tab-pane> -->
          </el-tabs>
        </div>
        <div class="top-info">
          <div class="avatar">
            <img :src="userInfo.avatar" alt="头像加载失败">
          </div>
          <label>{{ userInfo.name }}</label>
          <el-button size="mini" @click="logOut">退出</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import avatar from 'assets/images/avatar.png'
export default {
  data() {
    return {
      userName: '红辣椒',
      avatar,
      isLogin: null
    }
  },
  created() {
    this.isLogin = this._getCookie('isLogin')
  },
  methods: {
    handleClick(val) {
      this.$store.dispatch('setTabActiveName', val.name)
      this.$router.push({
        name: `${val.name}-list`
      })
    },
    logOut() {
      this.$confirm('确定退出排课系统吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let token = window.localStorage.getItem('token')
        this.Api.doLogout({
          token: token
        }).then(data => {
          this._checkData(data).then(() => {
            window.localStorage.clear()
            this._setCookie('isLogin', 'no')
            this.$store.dispatch('setTabActiveName', 'schedule')
            // this.$store.dispatch('setUserLoginStatus', false)
            this.$router.push({
              name: 'login'
            })
          }).catch(err => {
            this.$notify({
              title: err.detail,
              // message: err.detail,
              type: 'warning'
            })
          })
        }).catch(err => {
          this.$notify({
            title: err.detail,
            // message: err.detail,
            type: 'warning'
          })
        })
      }).catch((error) => {
        console.log('==> 取消操作：登出', error)
      })
    }
  },
  computed: {
    ...mapState({
      tabActiveName: state => state.common.tabActiveName,
      // isLogin: state => state.common.isLogin
    }),
    userInfo: function() {
      return JSON.parse(window.localStorage.getItem('userInfo')) || {}
    }
  }
}
</script>

<style lang="stylus">

</style>
