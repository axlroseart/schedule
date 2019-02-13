<template>
  <div class="schedule-list">
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
        prop="start_timestamp"
        width="320"
        label="时间">
        <template slot-scope="scope">
          <span>{{ _dateFormat(scope.row.start_timestamp * 1000).substring(0, 16) + '-' + _dateFormat(scope.row.end_timestamp * 1000).substring(0, 16).split(' ')[1] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="start_timestamp"
        label="课程">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.stage + '-' + (scope.row.unit ? scope.row.unit : '') + '-' + scope.row.sessionname }}</span> -->
          <span>{{ scope.row.sessionname }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="class_name"
        label="班级">
      </el-table-column>
      <el-table-column
        prop="assistant_username"
        label="主教">
      </el-table-column>
      <el-table-column label="" class-name="wisroom-btn-row">
        <template slot="header" slot-scope="scope">
          <el-button v-show="tableData.length > 0" type="danger" style="add-schedule" :data-scope="scope" @click="addSchedule">新增排课</el-button>
        </template>
        <template slot-scope="scope">
          <div v-if="scope.row.status === 2">
            <el-tooltip class="item btn" effect="dark" content="未下课，无法操作" placement="left">
              <label>删除</label>
            </el-tooltip>
            <el-tooltip class="item btn" effect="dark" content="未下课，无法操作" placement="left">
              <label>修改</label>
            </el-tooltip>
          </div>
          <div v-else>
            <el-button
              size="mini"
              type="text"
              class="delete"
              @click="handleDelete(scope.row)">删除</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.row)">修改</el-button>
          </div>
        </template>
      </el-table-column>
      <template slot="empty" class-name="empty-info">
        <div v-show="isAfterFetch">
          <span><img :src="emptyInfoImg" alt=""></span>
          <p>
            <a href="javascript:;" class="wisroom-empty-info-btn" @click="addSchedule">新增排课</a>
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
    <scheduleDialog
      @deleteAction="deleteAction"
      :type="dialog_type"
      :sub="dialog_sub"
      :title="dialog_title">
    </scheduleDialog>
  </div>
</template>

<script>
import scheduleDialog from 'components/dialog'
import emptyInfoImg from '../../assets/images/info-no-schedule.png'
export default {
  data() {
    return {
      emptyInfoImg,
      loading: false,
      search: '',
      tableData: [],
      totalPage: 0,
      pageSize: 10,
      currentPage: 1,
      dialog_type: 'confirm',
      dialog_sub: '',
      dialog_title: '确定要删除该课程吗？',
      isAfterFetch: false
    }
  },
  mounted() {
    this.isAfterFetch = false
    this.getListData(1)
    this.$store.dispatch('setTabActiveName', 'schedule')
    document.querySelector('body').style.background = '#f5f5f5'
  },
  methods: {
    // 获取数据列表
    getListData(currentPage) {
      this.loading = true
      this.Api.getScheduleList({
        page: currentPage,
        pageSize: this.pageSize,
        teacherID: 1
      }).then(data => {
        this.loading = false
        this.isAfterFetch = true
        this._checkData(data).then(data => {
          this.currentPage = currentPage
          data = data.data.lessons
          data ? this.tableData = data.lessons : this.tableData = []
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
      this.$store.dispatch('setDialogStatus', true)
      this.$store.dispatch('setDialogData', [row])
    },
    deleteAction(row) {
      this.Api.deleteSchedule({
        course_id: row.course_id,
        lesson_id: row.lesson_id,
        assistant_id: row.assistant_id,
        assistant_name: row.assistant_name,
        assistant_username: row.assistant_username,
        class_id: row.class_id,
        class_name: row.class_name
      }).then(data => {
        this.$store.dispatch('setDialogStatus', false)
        this._checkData(data).then(() => {
          // 重新拿数据
          this.getListData(1)
          this.$notify({
            title: '操作成功',
            // message: data.message,
            type: 'success'
          })
        }).catch((error) => {
          this.$notify({
            title: error.message,
            // message: error.message,
            type: 'warning'
          })
        })
      })
    },
    // 修改
    handleEdit(row) {
      this.$router.push({
        path: '/schedule/upadte/' + row.assistant_name + '/' + row.class_name + '/' + row.lesson_id + '/' +row.course_id
      })
    },
    // 新增排课
    addSchedule() {
      this.$router.push({
        name: 'schedule-add'
      })
    },
    currentChange(val) {
      this.getListData(val)
    }
  },
  computed: {
  },
  components: {
    scheduleDialog
  }
}
</script>

<style lang="stylus" scope>
.schedule-list
  position absolute
  width 1200px
</style>