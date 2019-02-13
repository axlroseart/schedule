<template>
  <div class="qrcode-box">
    <div id="qrcode"></div>
    <!-- <div class="qrcode-mark"  v-if="qrcodeStatus !== 1" v-bind:style="'color:' + messageColor">
      <div>{{ message }}</div>
      <div>{{ moreMessage }}</div>  
    </div> -->
    <!-- <div class="qrcode-refreash" v-if="qrcodeStatus !== 2">
        请使用钉钉扫码登录&nbsp;
      <span id="refreashQrCodeBtn" style="color:#38adff;cursor:pointer;" @click="refreashQrcode">
      <span class="iconfont"><i class="el-icon-refresh"></i></span>刷新</span>
    </div> -->
    <clocker ref="clocker" @callback="clockerCallback" @update="clockerUpdate" style="width:10px;height:10px;visibily:hidden;overflow:hidden"></clocker>
  </div>
</template>
<script>
import '../assets/styles/qrcode.styl'
import { mapState } from 'vuex'
import MYAIDE from '../utils/myaide.js'
import QRCode from '../utils/qrcode.js'
import clocker from './clocker'

export default {
  data() {
    return {
      appid: 540952711,
      appkey: 'hAz1juEV69ZcRo8s',
      // ticket是否已经准备好
      ticketStatus: false,
      ticket: '',
      uuid: '',
      // 二维码状态 0：未生成 1：正常 2：已扫 3：已过期失效 4:登录失败
      qrcodeStatus: 0,
      // 二维码地址
      qrcode: '',
      // 查询地址
      nextcall: 'https://api.service.100tal.com/sso/qrcode/status',
      // 扫码成功所得token
      token: '',
      // 二维码有效时间（s）
      qrtime: 60,
      message: '',
      moreMessage: '',
      messageColor: 'red'
    }
  },
  mounted() {
    this.getAppid()
    // this.getTicket()

    this.qrcodeTool = new QRCode(document.getElementById('qrcode'), {
      width: 188, // 设置宽高
      height: 188
    })
  },
  methods: {
    resetAll() {
      this.$refs.clocker.stop()
      this.getCodeAndListener()
    },
    // 刷新二维码
    refreashQrcode() {
      if (this.qrcodeStatus === 2) return
      this.$refs.clocker.stop()
      // console.log(this.ticketStatus)
      if (this.ticketStatus) {
        this.getCodeAndListener()
      } else {
        this.getTicket()
      }
    },
    setQrcodeStatus(index){
      this.qrcodeStatus = index
    },
    killQrcode() {
      if (this.qrcodeStatus === 2) return
      this.$refs.clocker.stop()
      this.qrcodeStatus = 3
    },
    // 获取appid & appkey
    getAppid() {
      this.Api.getQrcodeLoginAppid().then(data => {
        this._checkData(data).then(data => {
          data = data.data
          this.appid = data.appID
          this.appkey = data.appKey
          this.getTicket()
        }).catch(error => {
          this.showMessage('getappid', error)
          this.$notify({
            title: '获取appid失败！',
            message: error.message,
            type: 'warning'
          })
        })
      })
    },
    // 获取ticket
    getTicket() {
      var self = this
      var params = {
        type: 'GET',
        url: 'http://api.service.100tal.com/basic/get_ticket',
        data: 'appid=' + this.appid + '&appkey=' + this.appkey,
        success: function(data) {
          data = JSON.parse(data)
          if (data.ticket) {
            self.ticket = data.ticket
            self.ticketStatus = true
            self.getCodeAndListener()
          } else {
            self.showMessage('ticket', data)
          }
        },
        fail: function(e) {
          self.showMessage('ticket', e)
        }
      }
      MYAIDE.Loader.ajax(params)
    },
    // 获取qrcode地址 & 轮询地址
    getCodeAndListener() {
      var self = this
      var params = {
        type: 'GET',
        url: 'https://api.service.100tal.com/sso/qrcode/gen',
        data: 'ticket=' + this.ticket,
        success: function(data) {
          data = JSON.parse(data)
          if (data.errcode === 0) {
            self.uuid = data.uuid
            self.qrcode = data.qrcode
            // self.nextcall = data.nextcall_eg
            self.setQrcode(self.qrcode)
            self.qrcodeStatus = 1
            self.setAndPlayClocker(self.qrtime)
            self.showMessage('refreshSuccess')
          } else {
            self.showMessage('getqrcode', data)
          }
        },
        fail: function(e) {
          self.showMessage('getqrcode', e)
        }
      }
      MYAIDE.Loader.ajax(params)
    },
    // 询问是否已经扫描二维码
    askQrcodeStatus() {
      var self = this
      var params = {
        type: 'GET',
        url: this.nextcall,
        data: 'callback=_callback&uuid=' + this.uuid,
        success: function(data) {
          self.encodeJsonp(data)
        },
        fail: function() {
          // console.log(e)
        }
      }
      MYAIDE.Loader.ajax(params)
    },
    // 报错
    showMessage(step) {
      var errorMessage = ''
      var moreErrorMessage = ''
      var color = 'red'
      var status = 0
      switch (step) {
        case 'getappid':
          errorMessage = '获取二维码出错'
          moreErrorMessage = '请检查网络'
          break
        case 'ticket':
          errorMessage = '获取二维码出错'
          moreErrorMessage = '请检查网络'
          break
        case 'getqrcode':
          errorMessage = '获取二维码出错'
          moreErrorMessage = '请检查网络'
          break
        case 'timeout':
          status = 3
          errorMessage = '二维码已失效'
          moreErrorMessage = '请点击上方刷新按钮'
          break
        case 'logined':
          status = 2
          errorMessage = '已扫码，正在登录...'
          color = '#000'
          break
        case 'loginFail':
          status = 4
          errorMessage = '扫码登录失败，请检查身份...'
          break
        case 'refreshSuccess':
          status = 1
          errorMessage = '钉钉扫一扫'
          color = '#fff'
          break
      }
      console.log(status, errorMessage)
      this.message = errorMessage
      this.moreMessage = moreErrorMessage
      this.qrcodeStatus = status
      this.messageColor = color
      this.$emit('qrShowMessage', {
        step: step,
        message: this.message,
        moreMessage: this.moreMessage,
        qrcodeStatus: this.qrcodeStatus,
        messageColor: this.messageColor,
        color: color
      })
    },
    // 生成qrcode
    setQrcode(url) {
      this.qrcodeTool.makeCode(url)
    },
    // 计时器
    setAndPlayClocker(timer) {
      var param = {
        startTime: timer
      }
      this.$refs.clocker.set(param)
      this.$refs.clocker.reset()
      this.$refs.clocker.play()
    },
    // 计时结束
    clockerCallback() {
      // console.log('callback')
      this.showMessage('timeout')
    },
    // 轮询
    clockerUpdate() {
      this.askQrcodeStatus()
    },
    // 解析返回的的jsonp
    encodeJsonp(message) {
      var start = message.indexOf('({')
      var end = message.indexOf('})')
      message = message.slice(start + 1, end + 1)
      message = JSON.parse(message)
      // console.log(message)
      if (message.errcode === 0 && message.token) {
        this.showMessage('logined')
        this.token = message.token
        this.$refs.clocker.stop()
        this.qrcodeLogin()
      }
    },
    // qrcode登录
    qrcodeLogin() {
      var params = {
        token: this.token,
        ticket: this.ticket
      }
      this.$emit('qrcodeLogin', params)
    }
  },
  computed: {
    ...mapState({

    })
  },
  components: {
    clocker
  }
}
</script>