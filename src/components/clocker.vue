<template>
  <div class="clocker-box">
    <div class="clocker-content">
      <div v-bind:style="{ color: fontColor, fontSize: fontSize + 'px',fontFamily:fontFamily }" class="clocker-text">
        {{changeFormat}}
      </div>
    </div>
  </div>
    
</template>

<script>
  export default {
    data() {
      return {
        // 开始时间
        startTime: 50,
        // 开始时间戳
        startStamp: new Date().getTime(),
        // 结束时间
        endTime: 0,
        // 计时方向:true为增加时间，false为倒计时，默认为倒计时
        direction: false,
        // 当前计时
        currentTime: 50,
        // 计时时间戳
        currentStamp: new Date().getTime,
        // 存储的运行时间
        elapsedTime: 0,
        // 计时状态
        playStatus: false,
        // 计时格式类型 number:数字倒计时 seconds以秒为单位的时钟计时
        formatType: 'seconds',
        // 计时刻度(毫秒) 代表多长时间为一个时间刻度。标准为1000
        unit: 1000,
        // 计时字体大小
        fontSize: 100,
        // 计时字体颜色
        fontColor: 'red',
        // 字体类型 默认使用导入的youyuan字体
        fontFamily: 'Arial',
        // 是否前一单位为0则不显示
        zeroHide: true,
        // 是否显示进度条
        progressStatus: true,
        progressWidth: 100,
        // 计时器
        timer: null
      }
    },
    mounted() {
      let params = this.$route.params
      this.set(params)
      if (this.autoPlay) {
        this.play()
      }
      this.reset()
      if (window['requestAnimationFrame']) {
        this.interval()
      }
    },
    methods: {
      interval() {
        if (this.playStatus) {
          this.spint()
        }
        this.frame = requestAnimationFrame(this.interval.bind(this))
      },
      spint() {
        let nStamp = new Date().getTime()
        this.elapsedTime += (nStamp - this.currentStamp)
        this.currentStamp = nStamp
        if (this.elapsedTime >= this.unit) {
          if (this.direction) {
            this.currentTime += parseInt(this.elapsedTime / this.unit)
          } else {
            this.currentTime -= parseInt(this.elapsedTime / this.unit)
          }
          if (this.direction && this.currentTime >= this.endTime) {
            this.playStatus = false
            this.$emit('callback')
          } else
          if (!this.direction && this.currentTime <= this.endTime) {
            this.playStatus = false
            this.$emit('callback')
          } else {
            this.$emit('update', this.currentTime)
          }
          this.elapsedTime = this.elapsedTime % this.unit
        }
        this.progressWidth = Math.abs(this.endTime - this.currentTime) / Math.abs(this.endTime - this.startTime) * 100
      },
      set(config) {
        let nameList = Object.keys(config)
        for (let i = 0; i < nameList.length; i++) {
          // console.log(nameList[i], config[nameList[i]])
          this[nameList[i]] = config[nameList[i]]
        }
        // console.log(this)
      },
      play() {
        this.startStamp = new Date().getTime()
        this.currentStamp = new Date().getTime()
        this.playStatus = true
      },
      reset() {
        this.currentTime = this.startTime
        this.elapsedTime = 0
        this.currentStamp = new Date().getTime()
      },
      stop() {
        this.playStatus = false
      }
    },
    computed: {
      changeFormat() {
        let showStr = ''
        switch (this.formatType) {
          case 'number':
            showStr = this.currentTime
            break
          case 'seconds':
            var h = parseInt(this.currentTime / 3600)
            var m = parseInt(this.currentTime / 60 % 60)
            var s = parseInt(this.currentTime % 60)
            var sh = h > 9 ? h : '0' + h
            var sm = m > 9 ? m : '0' + m
            var ss = s > 9 ? s : '0' + s
            if (this.zeroHide && h === 0) {
              showStr = sm + ':' + ss
            } else {
              showStr = sh + ':' + sm + ':' + ss
            }
  
            break
          default:
            showStr = this.currentTime
        }
        return showStr
      }
    },
    components: {
    }
  }
</script>

<style>
.clocker-box{
    width: 100%;
    height: 100%;
  }
.clocker-content{
      width: 100%;
      height: 100%;
      position: relative;
}
.clocker-text{
      line-height: 100%;
      text-align: center
    }
</style>
