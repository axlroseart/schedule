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
      <!-- <el-table-column
        label="主教头像">
        <template slot-scope="scope">
          <span>
            <img :src="scope.row.avatar" alt="">
          </span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="主教名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="主教邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" class-name="wisroom-btn-row">
        <template slot="header" slot-scope="scope">
          <el-button v-show="tableData.length > 0" type="danger" style="add-schedule" :data-scope="scope" @click="addTeacher">添加主教</el-button>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            class="delete"
            @click="handleDelete(scope.row)">删除</el-button>
          <!-- <el-button
            size="mini"
            v-if="scope.row.isShowBig"
            @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="text"
            v-else
            @click="handleEdit(scope.$index, scope.row)">修改</el-button> -->
        </template>
      </el-table-column>
      <template slot="empty" class-name="empty-info">
        <div v-show="isAfterFetch">
          <span><img :src="emptyInfoImg" alt=""></span>
          <p>
            <a href="javascript:;" class="wisroom-empty-info-btn" @click="addTeacher">新增主教</a>
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
import emptyInfoImg from '../../assets/images/info-no-teacher.png'
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
    this.$store.dispatch('setTabActiveName', 'teacher')
    document.querySelector('body').style.background = '#f5f5f5'
    this.loading = true
    // 获取老师数据列表
    this.fetchListData(1)
  },
  methods: {
    fetchListData(currentPage) {
      // 主教数据列表
      this.loading = true
      this.Api.fetchTeacherList({
        page: currentPage,
        pageSize: this.pageSize,
      }).then(data => {
        this.isAfterFetch = true
        this.loading = false
        this._checkData(data).then(data => {
          this.currentPage = currentPage
          this.tableData = data.data.teachers
          this.totalPage = data.data.total
        }).catch(res => {
          this.loading = false
          this.$notify({
            title: res.message,
            // message: res.message,
            type: 'warning'
          })
        })
      }).catch(res => {
        this.isAfterFetch = true
        this.loading = false
        this.$notify({
          title: res.message,
          // message: res.message,
          type: 'warning'
        })
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm(`确定要删除${row.name ? `${row.name}` : '-'}吗?`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Api.deleteTeacher({
          teacherId: row.teacherID
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
        console.log('==> 取消操作：删除主教', error)
      })
    },
    // 修改
    handleEdit(index, row) {
      console.log(index, row)
    },
    // 新增排课
    addTeacher() {
      this.$router.push({
        name: 'teacher-add'
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