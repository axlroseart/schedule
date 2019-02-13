<template>
  <div class="classroom-list">
    <el-table
      v-loading="loading"
      element-loading-text="正在加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      class="table-wisroom"
      stripe
      :show-header="true"
      header-row-class-name="wisroom-header"
      row-class-name="wisroom-table-row"
      :data="tableData">
      <el-table-column
        label="班级">
        <template slot-scope="scope">
          <span>{{ scope.row.className }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="学生数">
        <template slot-scope="scope">
          <span>{{ scope.row.studentCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" class-name="wisroom-btn-row">
        <template slot="header" slot-scope="scope">
          <el-button v-show="tableData.length > 0" type="danger" style="add-schedule" :data-scope="scope" @click="addClassroom">新增班级</el-button>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            class="delete"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleEdit(scope.$index, scope.row)">修改</el-button>
        </template>
      </el-table-column>
      <template slot="empty" class-name="empty-info">
        <div v-show="isAfterFetch">
          <span><img :src="emptyInfoImg" alt=""></span>
          <p>
            <a href="javascript:;" class="wisroom-empty-info-btn" @click="addClassroom">新增班级</a>
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
import emptyInfoImg from '../../assets/images/class_msg_noclass.png'
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
    this.$store.dispatch('setTabActiveName', 'classroom')
    document.querySelector('body').style.background = '#f5f5f5'
    this.fetchListData(1)
  },
  methods: {
    fetchListData(currentPage) {
      // 班级数据列表
      this.loading = true
      this.Api.fetchClassroomList({
        page: currentPage,
        pageSize: this.pageSize
      }).then(data => {
        this.isAfterFetch = true
        this.loading = false
        this._checkData(data).then(data => {
          this.currentPage = currentPage
          this.tableData = data.data.data
          this.totalPage = data.data.total
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
    handleDelete(index, row) {
      this.$confirm(`此操作将删除班级【${row.className}】, 是否继续?`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Api.delClassroom({
          classId: row.classId
        }).then(data => {
          this._checkData(data).then(() => {
            // 重新拿数据
            this.fetchListData(1)
            this.$notify({
              title: '操作成功',
              // message: data.message,
              type: 'success'
            })
          }).catch((error) => {
            this.$notify({
              title: error.message,
              // message: error.detail,
              type: 'warning'
            })
          })
        })
      }).catch((error) => {
        console.log('==> 取消操作：删除班级', error)
      })
    },
    // 修改
    handleEdit(index, row) {
      this.$router.push({
        path: '/classroom/upadte/' + row.classId + '/' + row.className
      })
    },
    // 新增排课
    addClassroom() {
      this.$router.push({
        name: 'classroom-add'
      })
    },
    currentChange(val) {
      this.fetchListData(val)
    }
  }
}
</script>

<style lang="stylus" scope>
.classroom-list
  position absolute
  width 1200px
</style>