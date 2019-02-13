<template>
  <div class="login">
    <div class="top">
      <div class="in">
        <div class="logo"></div>
      </div>
    </div>
    <div class="back-img"></div>
    <div class="login-wrap">
      <div v-show="useChangeBtn" class="badge" @click="changeLoginWay">
        <transition-group enter-active-class="animated fadeInDown" leave-active-class="animated fadeOut" mode="in-out">
          <i v-if="isEmailLogin" class="icon-computer" :key="1"></i>
          <i v-else class="icon-qrcode" :key="2"></i>
        </transition-group>
      </div>
      <div class="title">排课系统{{ version }}版本</div>
      <h2>{{ title }}</h2>
      <transition-group enter-active-class="animated fadeInUp"  leave-active-class="animated fadeOutDown" mode="in-out">
        <div v-if="!isEmailLogin" class="email-login" :key="1">
          <i class="el-icon-close clear-input" @click="clearUsername" v-show="username !== ''"></i>
          <el-popover
            popper-class="login-popover"
            placement="bottom"
            width="346"
            @show="showPopover"
            v-model="showLocalStorageEmail">
            <div class="localStorage-list">
              <ul>
                <li v-for="items, index in savedEmailData" :key="index" @click="chooseSavedEmail(index)">{{ items.email }}</li>
              </ul>
            </div>
            <el-input
              v-model="username"
              @keyup.enter.native="doLogin"
              @keyup.tab.native="showLocalStorageEmail = false"
              @focus="errMsg = ''"
              class="wisroom-input-login"
              placeholder="请输入邮箱"
              slot="reference">
              <i
                class="el-icon-arrow-down el-input__icon"
                slot="suffix"
                v-show="savedEmailData.length > 0"
                @click="handleIconClick">
              </i>
            </el-input>
          </el-popover>
          <el-input
            v-model="password"
            @keyup.enter.native="doLogin"
            @focus="errMsg = ''"
            type="password"
            clearable
            class="wisroom-input-login"
            placeholder="请输入密码">
          </el-input>
          <transition enter-active-class="animated shake"  leave-active-class="animated fadeOut" mode="in-out">
            <p class="input-err-info login-err-info" v-show="errMsg !== ''">
              <i class="el-icon-warning"></i>
              {{ errMsg }}
            </p>
          </transition>
          <a href="javascript:;" class="wisroom-btn-login margin-top-big" @click="doLogin">邮箱登录</a>
        </div>
        <div v-show="isEmailLogin" class="qrCode-login" :key="2">
          <qrcode ref="qrcode" @qrcodeLogin="qrcodeLogin" @qrShowMessage="qrShowMessage"></qrcode>
          <div v-show="qrcodeStatus !== 1">
            <div class="qrcode-mask" v-if="qrcodeStatus !== 5"></div>
            <i class="icon-login-refresh" @click="qrcodeFresh()" v-if="qrcodeStatus !== 0 && qrcodeStatus !== 2 && qrcodeStatus !== 5"></i>
            <!-- <i class="icon-login-warn" @click="qrcodeFresh()" v-if="qrcodeStatus === 5"></i> -->
            <div v-bind:style="{color:messageColor,marginTop:'15px',fontSize:'14px'}">{{ message }}</div>
            <div v-bind:style="{color:messageColor,fontSize:'14px'}">{{ moreMessage }}</div>
            <!-- <p>
              钉钉扫一扫 <br>
              二维码已过期请刷新
            </p> -->
          </div>
          <div v-show="qrcodeStatus === 1">
            <div v-bind:style="{color:'#888788',marginTop:'15px',fontSize:'14px'}">{{ message }}</div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import demoQrCodeImg from '../assets/images/demo-qrcode.png'
import qrcode from 'components/qrcode'
export default {
  data() {
    return {
      useChangeBtn: false,
      title: '扫码登录',
      username: '',
      password: '',
      qrcodeImg: demoQrCodeImg,
      errMsg: '',
      // 二维码状态 0：未生成 1：正常 2：已扫 3：已过期失效 4:登录失败 5:未授权
      qrcodeStatus: 0,
      message: '',
      moreMessage: '',
      messageColor: '#fff',
      isEmailLogin: true,
      isQrCodeExpired: false,
      showLocalStorageEmail: false,
      savedEmailData: [],
      version: ''
    }
  },
  mounted() {
    this.versionMap()
    document.querySelector('body').style.background = '#f48387'
    this.$refs.qrcode.refreashQrcode()
  },
  methods: {
    versionMap() {
      let host = window.location.host
      if (host.indexOf('localhost') > -1 || host.indexOf('dev') > -1 || host.indexOf('192.168.30.3') > -1) {
        this.version = '开发'
      } else if (host.indexOf('test') > -1) {
        this.version = '测试'
      } else if (host.indexOf('exp') > -1) {
        this.version = '体验'
      } else {
        this.version = '正式'
      }
    },
    changeLoginWay() {
      this.isEmailLogin ? this.title = '邮箱登录' : this.title = '扫码登录'
      this.isEmailLogin = !this.isEmailLogin
      // console.log(this.isEmailLogin)
      if(!this.isEmailLogin){
        this.$refs.qrcode.killQrcode()
      } else {
        this.$refs.qrcode.refreashQrcode()
      }
    },
    doLogin() {
      if (this.username === '' || this.password === '') {
        this.errMsg = '邮箱或者密码不能为空'
        return
      } else if (!this.isEmail) {
        this.errMsg = '请输入正确的邮箱地址'
        return
      }
      // TODO - 登录逻辑
      this.Api.doLogin({
        username: this.username,
        password: this.password,
        role: 3
      }).then(data => {
        this._checkData(data).then(data => {
          data = data.data
          let userInfo = {
            name: data.profile.Name,
            avatar: data.profile.Avatar,
            role: data.profile.Role,
            expire: data.profile.expire
          }
          window.localStorage.setItem('userInfo', JSON.stringify(userInfo))
          // this.$store.dispatch('setUserLoginStatus', true)
          // 存放token，会自动写入请求头
          this._setCookie('token', data.token)
          // 存放登录状态（因为目前没有登录状态接口，所以暂存cookie）
          this._setCookie('isLogin', 'yes')
          console.log('===> login:', data)
          // 修改登录状态
          // 跳转路由
          // 根据角色权限，跳转路由
          this.$router.push({
            name: 'index'
          })
        }).catch(err => {
          this.$notify({
            title: err.detail,
            // message: err.message,
            type: 'warning'
          })
        })
      }).catch(err => {
        this.$notify({
          title: err.detail,
          // message: err.message,
          type: 'warning'
        })
      })
    },
    qrcodeLogin(params){
      this.Api.qrcodeLogin({
        token: params.token,
        ticket: params.ticket
      }).then(data => {
        this._checkData(data).then(data => {
          // this.$store.dispatch('setUserLoginStatus', true)
          data = data.data
          let userInfo = {
            name: data.profile.Name,
            avatar: data.profile.Avatar,
            role: data.profile.Role,
            expire: data.profile.expire
          }
          // window.localStorage.setItem('token', data.token)
          window.localStorage.setItem('userInfo', JSON.stringify(userInfo))
          // 存放token，会自动写入请求头
          this._setCookie('token', data.token)
          // 存放登录状态（因为目前没有登录状态接口，所以暂存cookie）
          this._setCookie('isLogin', 'yes')
          // console.log('===> login:', data)
          this.$router.push({
            name: 'index'
          })
        }).catch(res => {
          this.messageColor = 'red'
          console.log(res)
          // this.message = res.message
          this.qrcodeStatus = 5
          this.$refs.qrcode.setQrcodeStatus(5)
          this.qrcodeFresh()
          this.message = '你没有系统使用权限,'
          this.moreMessage = '请联系管理员'
        })
      }).catch(() => {
        this.qrcodeStatus = 5
        this.$refs.qrcode.setQrcodeStatus(5)
        this.qrcodeFresh()
        this.message = '登录超时,请重试'
        this.moreMessage = ''
        this.messageColor = 'red'
      })
    },
    qrcodeFresh(){
      this.$refs.qrcode.refreashQrcode()
    },
    // 二维码状态
    qrShowMessage(message){
      console.log(message)
      if (this.qrcodeStatus === 5) return
      this.moreMessage = message.moreMessage
      this.message = message.message
      this.qrcodeStatus = message.qrcodeStatus
      this.messageColor = message.messageColor
    },
    handleIconClick() {
      this.showLocalStorageEmail = !this.showLocalStorageEmail
    },
    chooseSavedEmail(index) {
      this.username = this.savedEmailData[index].email
      this.showLocalStorageEmail = false
    },
    clearUsername() {
      this.username = ''
    },
    showPopover() {
      if (this.savedEmailData.length === 0) {
        this.showLocalStorageEmail = false
      }
    }
  },
  computed: {
    'isEmail': function() {
      return /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(this.username)
    }
  },
  components: {
    qrcode
  },
  beforeRouteLeave(to, from, next) {
    document.querySelector('body').style.background = '#f5f5f5'
    next()
  }
}
</script>

<style lang="stylus">
.back-img
  position absolute
  z-index 0
  display block
  width 1220px
  height 450px
  top 380px
  margin 0 auto
  background url(../assets/images/login_bg.png) center center
.login-wrap
  position relative
  z-index 7
  width 410px
  height 506px
  padding-top 1px
  top 212px
  left 0
  right 0
  margin auto
  background #fff
  border-radius 4px
  .title
    font-size 16px
    color #d6b3b4
    margin-top 16px
    margin-left 16px
    display block
    text-align left
  h2
    font-size 24px
    font-weight bold
    margin-top 66px
    color #202020
    margin-bottom 40px
    display block
    text-align center
  .login-err-info
    position absolute
    top 124px
    left 0
    right 0
    margin auto
  .email-login, .qrCode-login
    position absolute
  .badge
    display block
    position absolute
    width 53px
    height 53px
    right 16px
    top 16px
    cursor pointer
    i
      position absolute
      width 100%
      height 100%
      display block
    i.icon-computer
      background url(../assets/images/login_icon_accountnumber.png)
    i.icon-qrcode
      background url(../assets/images/login_icon_code.png)
  .email-login i.el-input__icon
    cursor pointer
  .email-login .clear-input
    position absolute
    z-index 9
    right 60px
    top 17px
    cursor pointer
    color #bbb
    &:hover
      color #111
  .qrCode-login
    position absolute
    width 188px
    height 188px
    margin 0 auto
    top 180px
    left 0
    right 0
    margin auto
    .qrcode-mask, img
      position absolute
      left 0
      top 0
      width 100%
      height 100%
    img
      display block
      top 0
      right 0
      left 0
      bottom 0
      margin auto
    .qrcode-mask
      cursor pointer
      background rgba(245, 245, 245, 0.97)
    i.icon-login-refresh
      position absolute
      top 0
      right 0
      left 0
      bottom 0
      margin auto
      width 81px
      height 66px
      background url(../assets/images/login_icon_refresh.png)
      cursor pointer
    i.icon-login-warn
      position absolute
      top 0
      right 0
      left 0
      bottom 0
      margin auto
      width 81px
      height 66px
      background url(../assets/images/login_icon_warn.png)
      cursor pointer
    p
      position absolute
      font-size 14px
      color #888788
      bottom -48px
      left 0
      right 0
      margin auto
      text-align center
.login-popover
  padding 0
  .localStorage-list
    width 100%
    li
      line-height 28px
      text-indent 1em
      cursor pointer
      color #999
      &:hover
        color #000
.login-popover[x-placement^="bottom"]
  margin-top 8px
</style>