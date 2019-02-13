<template>
  <div class="classroom-add">
    <bread v-if="!isUpdate" :breadData="breadDataAdd"></bread>
    <bread v-else :breadData="breadDataUpdate"></bread>
    <div class="add-content-area">
      <p>
        <label>班级名称</label>
        <el-input ref="classnameInput" class="wisroom-input-long" maxlength="20" v-model="classroomName" placeholder="请输入要添加的班级名称" clearable></el-input>
      </p>
      <div class="students-list">
        <p>学生列表</p>
        <div class="students-list-content">
          <div class="left">
            <p class="title">
              <label>英文名</label>
              <label>头像</label>
            </p>
          </div>
          <div class="right">
            <p class="title">
              <label>英文名</label>
              <label>头像</label>
            </p>
          </div>
          <div class="info-list">
            <ul>
              <li v-for="items, index of studentList" :key="index">
                <el-input
                  class="wisroom-input-small"
                  v-model="items.name"
                  @input.native="(()=>{usernameFormat(items)})"
                  maxlength="20"
                  placeholder="请输入学生英文名"
                  clearable>
                </el-input>
                <!-- <div class="avatar-upload-wrap"></div> -->
                <div class="avatar-uploader" @click="callCropper(index, '上传头像')">
                  <img v-if="items.avatarURL" :src="items.avatarURL" class="avatar">
                  <div class="float-btn" v-show="items.avatarURL && items.avatarURL !== ''">
                    <a href="javascript:;" @click="((res) => { deleteAvatar(res, index, items) })">删除</a>
                    <a href="javascript:;" @click.stop="callCropper(index, '替换头像')">替换</a>
                  </div>
                  <i class="el-icon-loading" v-show="items.isOnProgress"></i>
                  <div class="hover-mask"></div>
                </div>
                <!-- <el-upload
                  :ref="'avatarUpload-' + index"
                  class="avatar-uploader"
                  :action="uploadAction"
                  :before-upload="beforeUpload"
                  :on-success="((res) => { handleAvatarSuccess(res, index, items) })"
                  :on-change="((res)=>{uploadOnChange(res, index, items)})"
                  :on-error="(()=>{uploadOnError(index)})"
                  :data="{ bucket: 'image' }"
                  :auto-upload="true"
                  list-type="picture"
                  accept="image/png, image/jpeg"
                  :show-file-list="false">
                  <img v-if="items.avatarURL" :src="items.avatarURL" class="avatar">
                  <div class="float-btn" v-show="items.avatarURL && items.avatarURL !== ''">
                    <a href="javascript:;" @click="((res) => { deleteAvatar(res, index, items) })">删除</a>
                    <a href="javascript:;" @click="replaceAvatar">替换</a>
                  </div>
                  <i class="el-icon-loading" v-show="items.isOnProgress"></i>
                  <div class="hover-mask"></div>
                </el-upload> -->
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p class="btn-area">
        <el-button type="danger" @click="update" v-if="isUpdate" :loading="loading">更新</el-button>
        <el-button type="danger" @click="submit" v-else :loading="loading">保存</el-button>
      </p>
    </div>
    <el-dialog 
      title="" 
      :close-on-click-modal="false" 
      :visible.sync="showCropper" 
      custom-class="cropper-dialog" 
      top="0"
      :lock-scroll="false"
      :show-close="false" 
      >
      <cropper 
        ref="cropper" 
        :uploadTitle="uploadTitle"
        @cancelFunc="cancelFunc" 
        @uploadOnError="uploadOnError" 
        @handleAvatarSuccess="handleAvatarSuccess"
        :currIndex="currIndex"></cropper>
    </el-dialog>
  </div>
</template>

<script>
import bread from 'components/bread'
import cropper from './cropper'
export default {
  data() {
    return {
      classroomName: '',
      classID: 0,
      uploadAction: '/v1/datacenter/storage/upload',
      avtarFileList: [],
      isUpdate: false,
      loading: false,
      studentList: [],
      breadDataAdd: [
        {
          name: '班级管理',
          path: '/classroom/list'
        },
        {
          name: '新增班级',
          path: '/classroom/add'
        }
      ],
      breadDataUpdate: [
        {
          name: '班级管理',
          path: '/classroom/list'
        },
        {
          name: '修改班级',
          path: ''
        }
      ],
      totalStudents: 14,
      allStudentArr: [],
      anotherone: [],
      // 上传文件大小限制
      sizelimit: 2 * 1024 * 1024,
      // 图片裁剪框
      showCropper: false,
      currIndex: 0,
      uploadTitle: ''
    }
  },
  mounted() {
    let params = this.$route.params
    // 修改班级信息 - 数组赋值
    if (params && params.class_name) {
      this.isUpdate = true
      this.classroomName = params.class_name
      this.classID = params.class_id
      this.Api.fetchStudentsData({
        classId: params.class_id
      }).then(data => {
        this._checkData(data).then(data => {
          data = data.data
          if (data) {
            let arrFill = []
            for (let jj = 0; jj < data.length; jj++) {
              const element = data[jj]
              arrFill[jj] = element
            }
            let arr = []
            if (data.length < this.totalStudents) {
              for (let index = 0; index < this.totalStudents - data.length; index++) {
                arr.push({
                  name: '',
                  avatarURL: ''
                })
              }
            }
            this.studentList = [...arrFill, ...arr]
          } else {
            for (let index = 0; index < this.totalStudents; index++) {
              this.studentList.push({
                name: '',
                avatarURL: ''
              })
            }
          }
        }).catch((err) => {
          this.$notify({
            title: err.detail,
            // message: err.detail,
            type: 'warning'
          })
        })
      })
    } else {
      for (let index = 0; index < this.totalStudents; index++) {
        this.studentList.push({
          name: '',
          avatarURL: ''
        })
      }
    }
    this.$store.dispatch('setTabActiveName', 'classroom')
  },
  methods: {
    // 头像上传中事件
    // onProgress(event, index, item) {
    //   console.log('头像上传中...')
    //   item.isOnProgress = true
    //   if (event.percent) {
    //     item.isOnProgress = true
    //     item.percent = Number(event.percent.toFixed(2))
    //   }
    // },
    // 删除头像
    deleteAvatar(event, index) {
      event.cancelBubble = true
      this.$set(this.studentList[index], 'name', '')
      this.$set(this.studentList[index], 'avatarURL', '')
      this.$set(this.studentList[index], 'isOnProgress', false)
    },
    // 替换头像
    replaceAvatar() {
      // event.cancelBubble = true
    },
    // 上传服务器前
    beforeUpload(res) {
      let fileType = res.type.split('/')[0]
      if (fileType !== 'image') {
        this.$notify({
          title: '文件格式不正确',
          type: 'warning'
        })
        // this.$set(this.studentList[index], 'isOnProgress', false)
        for (let index = 0; index < this.studentList.length; index++) {
          const element = this.studentList[index]
          element.isOnProgress = false
        }
        return false
      }
      if (res.size >= this.sizelimit) {
        this.$notify({
          title: '图片大小不能超过2MB',
          type: 'warning'
        })
        // this.$set(this.studentList[index], 'isOnProgress', false)
        for (let index = 0; index < this.studentList.length; index++) {
          const element = this.studentList[index]
          element.isOnProgress = false
        }
        return false
      }
    },
    // 只能输入英文，首字母自动大写
    usernameFormat(item) {
      this.$nextTick(() => {
        if (item.name) {
          // 学生姓名支持：英文字母、数字、空格符、英文字符.
          item.name = item.name.replace(/[^A-Za-z0-9_. ]/g, '')
          let firstLetter = item.name.substring(0, 1).toUpperCase()
          item.name = firstLetter + item.name.substring(1, item.name.length)
        }
      })
    },
    // 上传头像服务器回调
    handleAvatarSuccess(response, index, fileName) {
      // console.log('头像上传成功...')
      this.$set(this.studentList[index], 'isOnProgress', false)
      if (response.code !== 0) {
        this.$notify({
          // title: response.message,
          title: '头像上传失败，请重新选择文件',
          type: 'warning'
        })
        this.$set(this.studentList[index], 'name', '')
      } else {
        let name = fileName.split('.')[0].substring(0, 20)
        let firstLetter = name.substring(0, 1).toUpperCase()
        name = firstLetter + name.substring(1, name.length)
        if (this.studentList[index].name === '') {
          this.$set(this.studentList[index], 'name', name.replace(/[^A-Za-z0-9_. ]/g, ''))
        }
        this.$set(this.studentList[index], 'avatarURL', response.data.url)
      }
    },
    // 上传状态改变时回调
    uploadOnChange(res, index) {
      // console.log('头像状态变化', res.status)
      this.$set(this.studentList[index], 'isOnProgress', true)
      if (res.status === 'success' || res.status === 'fail') {
        this.$set(this.studentList[index], 'isOnProgress', false)
      } else if (res.status === 'ready') {
        this.$set(this.studentList[index], 'name', '')
        this.$set(this.studentList[index], 'avatarURL', '')
      }
      let name = res.name.split('.')[0].substring(0, 20)
      let firstLetter = name.substring(0, 1).toUpperCase()
      name = firstLetter + name.substring(1, name.length)
      if (this.studentList[index].name === '') {
        this.$set(this.studentList[index], 'name', name.replace(/[^A-Za-z0-9_. ]/g, ''))
      }
    },
    // 上传失败回调
    uploadOnError(index) {
      console.log('===> upload failed', index)
      this.$set(this.studentList[index], 'isOnProgress', false)
      this.$notify({
        // title: response.message,
        title: '头像上传失败，请重新选择文件',
        type: 'warning'
      })
    },
    // 提交新增班级
    submit() {
      if (this.classroomName.replace(/\s+/g,"") === '') {
        this.$refs.classnameInput.focus()
        this.$notify({
          title: '请输入班级名称',
          // message: '请输入班级名称',
          type: 'warning'
        })
        return
      }
      this.loading = true
      this.Api.addClassroom({
        className: this.classroomName,
        studentList: this.studentList
      }).then(data => {
        this.loading = false
        this._checkData(data).then(() => {
          this.$notify({
            title: '操作成功',
            // message: data.message,
            type: 'success'
          })
          setTimeout(() => {
            this.$router.push({
              name: 'classroom-list'
            })
          }, 1000)
        }).catch(err => {
          this.$notify({
            title: err.message,
            // message: err.detail,
            type: 'warning'
          })
        })
      })
    },
    // 更新班级信息
    update() {
      if (this.classroomName.replace(/\s+/g,"") === '') {
        this.$refs.classnameInput.focus()
        this.$notify({
          title: '请输入班级名称',
          // message: '请输入班级名称',
          type: 'warning'
        })
        return
      }
      this.loading = true
      this.Api.updateClassroomData({
        className: this.classroomName,
        classId: Number(this.classID),
        studentList: this.studentList
      }).then(data => {
        this.loading = false
        this._checkData(data).then(() => {
          this.$notify({
            title: '操作成功',
            // message: data.message,
            type: 'success'
          })
          setTimeout(() => {
            this.$router.push({
              name: 'classroom-list'
            })
          }, 1000)
        }).catch(err => {
          this.$notify({
            title: err.message,
            // message: err.detail,
            type: 'warning'
          })
        })
      })
    },
    cancelFunc(){
      this.showCropper = false
    },
    callCropper(index, type) {
      this.showCropper = true
      this.currIndex = index
      this.uploadTitle = type
    }
  },
  components: {
    bread,
    cropper
  }
}
</script>

<style lang="stylus">
.classroom-add
  position absolute
  width 1200px
.add-content-area
  background #fff
  padding-top 44px
  padding-bottom 14px
  p
    margin-bottom 18px
    label
      display inline-block
      margin-right 35px
  p.btn-area
    margin 0 auto
    margin-top 30px
    margin-bottom 35px
  .students-list
    position relative
    width 611px
    height 569px
    padding-left 4px
    padding-right 4px
    padding-bottom 4px
    margin 0 auto
    background #e7e7e7
    p
      height 50px
      line-height 50px
      font-size 18px
      color #1d1c1c
      text-align left
      text-indent 1.5em
      margin-bottom 0
    .students-list-content
      display block
      .left
        position absolute
        width 303px
        height 503px
        background #f5f5f5
        left 4px
        padding-bottom 15px
      .right
        position absolute
        width 303px
        height 503px
        right 4px
        background #f5f5f5
        padding-bottom 15px
      p.title
        font-size 14px
        color #7d7d7d
        height 35px
        line-height 35px
        label
          &:nth-child(1)
            width 160px
      .info-list
        padding-bottom 0px
        height 486px
        display inline-block
        margin-top 44px
        li
          position relative
          height 64px
          float left
          margin-left 29px
          margin-bottom 3px
          &:nth-child(even)
            margin-left 92px
          .el-input
            margin-top 10px
          .avatar-uploader
            position absolute
            z-index 9
            right -40px
            top 0
            border-radius 50%
            width 64px
            height 64px
            background url(../../assets/images/icon-upload-off.png)
            cursor pointer
            &:hover
              background url(../../assets/images/icon-upload-on.png)
            &:hover .hover-mask
              opacity 1
            &:hover .float-btn
              display block
            img
              position absolute
              z-index 7
              width 62px
              height 62px
              border #d6d6d6 1px solid
              display block
              border-radius 50%
            .el-upload
              display block
              width 100%
              height 100%
              i.el-icon-loading
                display block
                position absolute
                top 24px
                left 0
                right 0
            .hover-mask
              width 100%
              height 100%
              position absolute
              z-index 9
              background rgba(255, 255, 255, 0.8)
              border-radius 50%
              opacity 0
.float-btn
  position absolute
  right -50px
  display none
  a
    display block
    width 48px
    height 30px
    line-height 30px
    font-size 14px
    background #e14147
    color #fff
    border-radius 4px
    margin-bottom 4px
    margin-left 5px
</style>
