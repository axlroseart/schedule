<template>
  <div class="cropper-content">
    <p class="title">{{uploadTitle}}</p>
    <div class="add-in">
      <div class="upload-content">
        <div class="upload-message">
          <span>{{uploadMessage}}</span>
          <!-- <label class="btn btn-orange" for="uploads" style="display:inline-block;width: 70px;padding: 5px 10px;cursor:pointer;margin-top:10px;border: 1px solid #dcdfe6;border-radius: 4px;text-align: center;line-height: 28px;">选择图片</label> -->
          <label class="btn btn-orange" for="uploads">选择图片</label>
        </div>
        <input type="file" id="uploads" :value="imgFile" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/jpg" @change="uploadImg($event, 1)">
      </div>
      <div class="cropper-box-x">
        <div class="cropper-croppe-box">
          <vueCropper
            ref="cropper"
            class="schedule-cropper"
            :img="option.img"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="false"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :fixedBox="option.fixedBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :centerBox="option.centerBox"
            :high="option.high"
            :infoTrue="option.infoTrue"
            :enlarge="option.enlarge"
            @cropMoving="cropMoving"
            @realTime="realTime"
          ></vueCropper>
        </div>
        <div class="cropper-croppe-show">
          <div class="cropper-preview">
            <img :src="previews.url" :style="previews.img">
          </div>
        </div>
      </div>
      <!-- <div class="cropper-btn-box">
        <el-button class="cropper-btn-base" style="margin-top:10px" @click="queryTeacher" :loading="loading"></el-button>
      </div> -->
      <div class="btn-box">
        <el-button @click="cancelFunc()" :disabled="uploading">取消</el-button>
        <el-button :loading="loading" type="danger" @click="submitFunc()" :disabled="fileName === ''">确认</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { VueCropper }  from 'vue-cropper'
import testImg from '../../assets/images/haha.png'
export default {
  data() {
    return {
      showStatus: true,
      index: 0,
      uploadAction: '/v1/datacenter/storage/upload',
      toolName: '',
      uploadMessage: '图片格式只支持JPG、PNG',
      teacherEmail: '',
      option: {
        img: '',                         //裁剪图片的地址
        info: true,                      // 裁剪框的大小信息
        outputSize: 1,                   // 裁剪生成图片的质量
        outputType: 'jpeg',              // 裁剪生成图片的格式
        canScale: false,                 // 图片是否允许滚轮缩放
        autoCrop: true,                  // 是否默认生成截图框
        autoCropWidth: 180,              // 默认生成截图框宽度
        autoCropHeight: 180,             // 默认生成截图框高度
        fixedBox: true,                    // 是否开启截图框宽高固定比例
        fixedNumber: [4, 4]              // 截图框的宽高比例
      },
      previews: {},
      fileName: '',
      isShowCropper: false,            //是否显示截图框
      fileUpload: null,
      fileinfo: {},
      form: {},
      testImg,
      imgFile: '',
      loading: false,
      uploading: false,
      // 上传文件大小限制
      sizelimit: 20 * 1024 * 1024
    }
  },
  props: ['currIndex', 'uploadTitle'],
  mounted() {
    // this.option.img = testImg
    // this.previews.url = testImg
    document.querySelector('.cropper-view-box').style.outline = 'none'
  },
  methods: {
    clear(){  
      this.option.img = ' '
      this.fileName = ''
      this.cropping = false
      this.cropW = 0
      this.cropH = 0
      this.$refs.cropper.clearCrop()
      setTimeout(()=> {
        this.previews.url = ''
      }, 50)
    },
    cropMoving(){
      // console.log(arguments)
    },
    realTime(data) {
      this.previews = data
    },
   //上传按钮上传成功执行事件
    handleUploadSuccess(response, file) {
      // console.log(fileList)
      this.log('Upload response is %o', response)
      this.fileinfo = response
      this.fileUpload = file
      //上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        this.option.img = file.url;
        this.isShowCropper = true
      })
    },
    // 确定裁剪图片
    onCubeImg() {
      // 获取cropper的截图的base64 数据
      this.$refs.cropper.getCropData(data => {
        this.fileinfo.url = data
        this.isShowCropper = false

       //先将显示图片地址清空，防止重复显示
        this.option.img = ''

       //将剪裁后base64的图片转化为file格式
        let file = this.convertBase64UrlToBlob(data)
        file.name = this.fileUpload.name

        //将剪裁后的图片执行上传
        this.uploadFile(file).then(res => {
          this.form.content = res.file_id    //将上传的文件id赋值给表单from的content
        })

      })
    },

    // 将base64的图片转换为file文件
    convertBase64UrlToBlob(urlData) {
      let bytes = window.atob(urlData.split(',')[1]);//去掉url的头，并转换为byte
      //处理异常,将ascii码小于0的转换为大于0
      let ab = new ArrayBuffer(bytes.length);
      let ia = new Uint8Array(ab);
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ab], { type: 'image/jpeg' });
    },
    customUpload(){
      console.log(arguments)
    },
    //放大/缩小
    changeScale(num) { 
      console.log('changeScale')
      num = num || 1; 
      this.$refs.cropper.changeScale(num); 
    }, 
    //坐旋转
    rotateLeft() { 
      console.log('rotateLeft')
      this.$refs.cropper.rotateLeft(); 
    }, 
    //右旋转
    rotateRight() { 
      console.log('rotateRight')
      this.$refs.cropper.rotateRight(); 
    }, 
    //下载图片
    down(type) { 
      console.log('down')
      var aLink = document.createElement('a') 
      aLink.download = 'author-img' 
      if (type === 'blob') { 
        this.$refs.cropper.getCropBlob((data) => { 
          this.downImg = window.URL.createObjectURL(data)
          aLink.href = window.URL.createObjectURL(data) 
          aLink.click() 
        }) 
      } else { 
        this.$refs.cropper.getCropData((data) => { 
          this.downImg = data;
          aLink.href = data; 
          aLink.click() 
        }) 
      } 
    }, 
    //选择本地图片
    uploadImg(e, num) { 
      // console.log('uploadImg')
      var _this = this
      //上传图片 
      var file = e.target.files[0]
      _this.fileName = file.name
      if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)) {
        // alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种') 
        this.fileName = ''
        this.$notify({
          title: '文件格式不正确',
          type: 'warning'
        })
        return false
      }
      if (file.size >= this.sizelimit) {
        this.fileName = ''
        this.$notify({
          title: '图片大小不能超过20MB',
          type: 'warning'
        })
        return false
      }
      var reader = new FileReader()
      reader.onload =(e) => { 
        let data
        if (typeof e.target.result === 'object') { 
          // 把Array Buffer转化为blob 如果是base64不需要 
          data = window.URL.createObjectURL(new Blob([e.target.result])) 
        } 
        else { 
          data = e.target.result 
        }
        if (num === 1) {
          _this.option.img = data 
        } else if (num === 2) { 
          _this.example2.img = data 
        }
        _this.isShowCropper = true
      } 
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file)   

    },
    open(index){
      this.index = index
      this.showStatus = true
    },
    cancelFunc(){
      this.clear()
      this.showStatus = false
      this.$emit('cancelFunc', false)
    },
    submitFunc() {
      if(!this.option.img || this.option.img == ''){
        this.$notify({
          // title: response.message,
          title: '请先上传图片',
          type: 'warning'
        })
        return
      }
      this.loading = true
      this.uploading = true
      var self = this
      let formData = new FormData()
      formData.append('method', 'POST')
      formData.append('enctype', "multipart/form-data")
        // 输出
      this.$refs.cropper.getCropBlob((data) => {
        let img = window.URL.createObjectURL(data)
        this.model = true
        this.modelSrc = img
        formData.append("file", data, this.fileName)
        var params = {
          type: 'POST',
          url: window.location.origin + '/v1/datacenter/storage/upload',
          data: formData,
          contentType: 'multipart/form-data',
          success: function(data) {
            // data = JSON.parse(data).data.url
            self.loading = false
            self.uploading = false
            data = JSON.parse(data)
            self.showStatus = false
            // console.log({url: data, index: self.currIndex})
            self.$emit('handleAvatarSuccess', data, self.currIndex, self.fileName)
            self.$emit('cancelFunc')
            self.clear()
          },
          fail: function(e) {
            self.loading = false
            self.uploading = false
            self.$notify({
              // title: response.message,
              title: '头像上传失败，请检查网络并重试',
              type: 'warning'
            })
            console.log(e)
            // this.$emit('uploadOnError', Object.assign(JSON.parse(e),{index: this.index}))
          }
        }
        this.ajax(params)
      })
    },
    successFunc(){

    },
    // post 表单上传
    ajax(options) {
      options = options || {};
      options.type = (options.type || "GET").toUpperCase();
      options.dataType = options.dataType || "json";
      options.contentType = options.contentType || "application/json";
      var params = options.data
      var xhr  
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else {
        xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
      }
      // xhr.overrideMimeType('text/plain')
      xhr.onreadystatechange = function(){
        if (xhr.readyState == 4) {
          var status = xhr.status;
          if (status >= 200 && status < 300) {
            options.success && options.success(xhr.responseText, xhr.responseXML);
          } else {
            options.fail && options.fail(status);
          }
        }
      };
      if (options.type.toUpperCase() == "GET") {
        xhr.open("GET", options.url + "?" + params, true);
        xhr.send(null);
      } else if (options.type.toUpperCase() == "POST") {
        xhr.open("POST", options.url, true);
        // xhr.setRequestHeader("Content-Type", options.contentType);
        xhr.send(params);
      }
    }
  },
  components: {
    VueCropper
  }
}
</script>

<style lang="stylus">
.cropper-content
  width 619px
  position absolute
  top 150px
  left 0
  right 0
  margin auto
p.title
  height 50px
  line-height 50px
  background #e7e7e7
.cropper-view-box
  outline none
  border-radius 50%
  box-shadow 0 0 0 2px #39f
.cropper-face
  border-radius 50%
.add-in
  width 100%
  height 456px
  background #f5f5f5
  .upload-content
    width 100%
    height 80px
    .upload-message
      width 100%
      height 80px
      line-height 80px
      font-size 16px
      color #8C8B90
      span
        margin-left 0
      label
        margin-left 140px
        display inline-block
        width 110px
        line-height 32px
        font-size 14px
        border #ccc 1px solid
        border-radius 4px
        background #fff
        color #c9151e
        cursor pointer
  .cropper-box-x
    width 100%
    height 260px
    .cropper-croppe-box
      width 260px
      height 260px
      display inline-block
      float left
      margin-left 50px
    .cropper-croppe-show
      display inline-block
      float right
      margin-top 40px
      margin-right 50px
      border-radius 50%
      width 180px
      height 180px
      background  #cccccc
      overflow hidden
      .cropper-preview
        // overflow  hidden
        // border-radius  50%
        border 1px solid #cccccc
        background  #cccccc
        width 180px
        height 180px
        // margin-left -45px
        // margin-top 5px
  .cropper-btn-box
    width 100%
    height 50px
    .cropper-btn-base
      float left 
      margin-left 15px
      margin-top 15px
      padding 10px 10px
  .btn-box
    width 100%
    height 50px
    margin-top 38px
    button
      &:last-child
        margin-left 30px
</style>
