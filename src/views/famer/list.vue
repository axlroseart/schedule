<template>
  <div class="teacher-list">
    <el-table
      v-loading="loading"
      element-loading-text="正在加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      class="table-wisroom"
      stripe
      :show-header="true"
      header-row-class-name="wisroom-header"
      row-class-name="wisroom-table-row teacher-table-row"
      :data="tableData">
      <el-table-column
        prop="account"
        label="排课员邮箱">
      </el-table-column>
      <el-table-column label="" class-name="wisroom-btn-row">
        <template slot="header" slot-scope="scope">
          <el-button v-show="tableData.length > 0" type="danger" style="add-schedule" :data-scope="scope" @click="addTeacher">添加排课员</el-button>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            class="delete"
            @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <template slot="empty" class-name="empty-info">
        <div v-show="isAfterFetch">
          <span><img :src="emptyInfoImg" alt=""></span>
          <p>
            <a href="javascript:;" class="wisroom-empty-info-btn" @click="addTeacher">新增排课员</a>
          </p>
        </div>
      </template>
    </el-table>
    <el-pagination
      class="schedule-pagination"
      layout="prev, pager, next"
      @current-change="currentChange"
      :current-page="currentPage"
      :total="totalPage">
    </el-pagination>
  </div>
</template>

<script>
import emptyInfoImg from '../../assets/images/scheduler_msg_noscheduler.png'
export default {
  data() {
    return {
      emptyInfoImg,
      search: '',
      tableData: [],
      loading: false,
      pageSize: 10,
      totalPage: 0,
      currentPage: 1,
      isAfterFetch: false
    }
  },
  mounted() {
    this.isAfterFetch = false
    this.$store.dispatch('setTabActiveName', 'famer')
    document.querySelector('body').style.background = '#f5f5f5'
    this.loading = true
    // 获取排课员数据列表
    this.fetchListData(1)
  },
  methods: {
    fetchListData(currentPage) {
      // 排课员数据列表
      this.loading = true
      this.Api.fetchFamerList({
        page: currentPage,
        pageSize: this.pageSize
      }).then(data => {
        this.isAfterFetch = true
        this.loading = false
        this._checkData(data).then(data => {
          this.currentPage = currentPage
          data = data.data.data
          // this.tableData = data.accounts
          // this.totalPage = data.total ? data.total : 0
          data ? this.tableData = data.accounts : this.tableData = []
          this.totalPage = data ? data.total : 0
        }).catch(res => {
          this.loading = false
          this.$notify({
            title: res.message,
            type: 'warning'
          })
        })
      }).catch(res => {
        this.isAfterFetch = true
        this.loading = false
        this.$notify({
          title: res.message,
          type: 'warning'
        })
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm(`此操作将删除${row.account ? `【${row.account}】` : '【-】'}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Api.delFamer({
          account: row.account
        }).then(data => {
          this._checkData(data).then(() => {
            this.fetchListData(1)
            this.$notify({
              title: '操作成功',
              // message: data.message,
              type: 'success'
            })
          }).catch(err => {
            this.$notify({
              title: err.detail,
              // message: err.detail,
              type: 'warning'
            })
          })
        })
      }).catch((error) => {
        console.log('==> 取消操作：删除排课员', error)
      })
    },
    // 新增排课
    addTeacher() {
      this.$router.push({
        name: 'famer-add'
      })
    },
    currentChange(val) {
      this.fetchListData(val)
    }
  }
}
</script>

<style lang="stylus" scope>
.teacher-list
  position absolute
  width 1200px
.teacher-table-row img
  width 52px
  height 52px
  display block
  border-radius 50%
  border #fff 1px solid
</style>