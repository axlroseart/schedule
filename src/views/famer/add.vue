<template>
  <div class="teacher-add">
    <bread :breadData="breadData"></bread>
    <div class="content-in">
      <div class="teacher-add-content-area">
        <p class="title">请输入排课员的邮箱</p>
        <div class="add-in">
          <el-input
            ref="queryInput"
            @keyup.enter.native="queryTeacher"
            @focus="errMsg = ''"
            v-model="teacherEmail"
            class="wisroom-input-username"
            placeholder="请输入邮箱">
          </el-input>
          <label>@100tal.com</label>
          <transition enter-active-class="animated shake"  leave-active-class="animated fadeOut" mode="in-out">
            <p class="input-err-info" v-show="errMsg !== ''">
              <i class="el-icon-warning"></i>
              {{ errMsg }}
            </p>
          </transition>
          <p class="input-success-info" v-show="successMsg !== ''">
            <i class="el-icon-success"></i>
            {{ successMsg }}
          </p>
          <!-- <p  class="input-err-info query-loading" v-show="queryLoading"><i class="el-icon-loading"></i></p> -->
          <el-button class="wisroom-submit-btn" @click="queryTeacher" type="danger" :loading="loading">添加</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bread from 'components/bread'
export default {
  data() {
    return {
      teacherEmail: '',
      errMsg: '',
      successMsg: '',
      // queryLoading: false,
      loading: false,
      disabledSubmitBtn: true,
      teachers: [],
      avatar: '',
      dingID: '',
      name: '',
      breadData: [
        {
          name: '排课员管理',
          path: '/famer/list'
        },
        {
          name: '新增排课员',
          path: '/famer/add'
        }
      ]
    }
  },
  mounted() {
    this.$store.dispatch('setTabActiveName', 'famer')
  },
  methods: {
    queryTeacher() {
      this.successMsg = ''
      if (this.teacherEmail === '') {
        this.errMsg = '请输入排课员邮箱'
        return
      }
      this.errMsg = ''
      // this.disabledSubmitBtn = true
      // if (this.isEmail) {
      this.loading = true
      // this.queryLoading = true
      this.Api.teacherQuery({
        email: this.teacherEmail + '@100tal.com'
      }).then(data => {
        this.loading = false
        // this.queryLoading = false
        this._checkData(data).then(data => {
          this.errMsg = ''
          // this.successMsg = `查询到老师：${data.data.name}`
          // this.disabledSubmitBtn = false
          this.avatar = data.data.avatar
          this.dingID = data.data.dingID
          this.name = data.data.name
          this.submit()
        }).catch((err) => {
          // this.disabledSubmitBtn = true
          this.successMsg = ''
          this.errMsg = err.message
        })
      })
      // }
    },
    submit() {
      this.$refs.queryInput.blur()
      const h = this.$createElement
      this.$confirm('', '', {
        lockScroll: false,
        // customClass: 'schedule-dialog',
        // message: h('p', null, [
        //   h('span', null, '确定添加该邮箱账为排课员吗？'),
        //   h('p', { style: 'color: #464646; font-size: 14px; margin-top: 20px;' }, this.teacherEmail)
        // ]),
        // showClose: false,
        message: h('p', null, [
          h('span', null, '确定添加该邮箱账号排课员权限吗？'),
          h('p', null, this.teacherEmail + '@100tal.com')
        ]),
        // center: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.Api.addFamer({
          account: this.teacherEmail + '@100tal.com'
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
                name: 'famer-list'
              })
            }, 1000)
          }).catch(err => {
            this.$notify({
              title: err.detail,
              // message: err.detail,
              type: 'warning'
            })
          })
        })
      }).catch((error) => {
        console.log('==> 取消操作：授权排课员', error)
      })
    },
    querySearchAsync(queryString, cb) {
      let datas = this.teachers
      let results = queryString ? datas.filter(this.createStateFilter(queryString)) : datas
      cb(results)
    },
    createStateFilter(queryString) {
      return (datas) => {
        return (datas.userName.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    }
  },
  computed: {
    'isEmail': function() {
      return /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(this.teacherEmail)
    }
  },
  components: {
    bread
  }
}
</script>

<style lang="stylus">
.teacher-add
  position absolute
  width 1200px
  .content-in
    width 100%
    min-height 770px
    background #fff
    padding-top 1px
    .add-in
      width 100%
      height 356px
      background #f5f5f5
      label
        margin-left 5px
      .el-input
        margin-top 85px
      button
        display block
        margin 0 auto
        margin-top 100px
</style>
