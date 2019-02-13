<template>
  <div class="schedule-add">
    <bread v-if="!isUpdate" :breadData="breadDataAdd"></bread>
    <bread v-else :breadData="breadDataUpdate"></bread>
    <div class="content">
      <!-- <el-tabs :tab-position="tabPosition" class="schedule-add-tabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="时间" name="date" :disabled="true"></el-tab-pane>
        <el-tab-pane label="课程" name="schedule" :disabled="true"></el-tab-pane>
        <el-tab-pane label="班级" name="classroom" :disabled="true"></el-tab-pane>
        <el-tab-pane label="主教" name="teacher" :disabled="true"></el-tab-pane>
      </el-tabs> -->
      <div class="fill-info-title">
        <ul>
          <li>时间</li>
          <li>课程</li>
          <li>班级</li>
          <li>主教</li>
        </ul>
      </div>
      <div class="fill-info-area">
        <ul>
          <li>
            <el-date-picker
              v-model="date"
              @change="reBuildDate"
              format="yyyy-MM-dd HH:mm"
              popper-class="wisroom-date-picker"
              type="datetime"
              placeholder="选择课程日期时间">
            </el-date-picker>
          </li>
          <li>
            <!-- <el-tooltip class="item" effect="dark" :content="scheduleAlt" placement="bottom" :open-delay="200">
              <el-cascader
                :options="scheduleOptions"
                ref="scheduleSelect"
                @change="selectSchedule"
                :placeholder="classPlaceHolder"
                v-model="schedule"
                :props="selectProps"
              ></el-cascader>
            </el-tooltip> -->
            <el-cascader
              :options="scheduleOptions"
              ref="scheduleSelect"
              @change="selectSchedule"
              :placeholder="classPlaceHolder"
              v-model="schedule"
              :props="selectProps"
            ></el-cascader>
          </li>
          <!-- <li class="classroom">{{ classroom }}</li> -->
          <li class="classroom">
            <el-select v-model="classroom" placeholder="请选择，可搜索" @change="chooseClassroom" filterable>
              <el-option
                v-for="item in classroomData"
                :key="item.classId"
                :label="item.className"
                :value="item.classId+'&'+item.className">
              </el-option>
            </el-select>
          </li>
          <!-- <el-tooltip class="item" effect="dark" :content="teacher" placement="bottom" :open-delay="200">
            <div slot="content">姓名：{{teacher.split(':')[0]}}<br/>邮箱：{{teacher.split(':')[1]}}</div>
            <li class="teacher">
            {{ teacher }}
            </li>
          </el-tooltip> -->
          <!-- <li><div slot="content">{{ teacher }}</div></li> -->
          <li>
            <el-select v-model="teacher" placeholder="请选择，可搜索" @change="chooseTeacher" filterable>
              <el-option
                v-for="item in teacherData"
                :key="item.teacherID"
                :label="item.userName"
                :value="item.teacherID+'&'+item.name+'&'+item.userName">
              </el-option>
            </el-select>
          </li>
        </ul>
      </div>
      <transition-group enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in">
        <div class="func-block date" v-if="activeName === 'date'" :key="1">
          <div class="choose-area"></div>
          <div class="route">
            <!-- <el-button plain @click="next('schedule')">下一步</el-button> -->
            <!-- <el-button v-show="isAllFilled && isUpdate" type="danger" @click="update">更新排课</el-button> -->
            <!-- <el-button v-show="isAllFilled && !isUpdate" type="danger" @click="submit">新增排课</el-button> -->
          </div>
        </div>
        <div class="func-block schedule" v-else-if="activeName === 'schedule'" :key="2">
          <div class="choose-area"></div>
          <div class="route">
            <!-- <el-button plain @click="prev('date')">上一步</el-button> -->
            <!-- <el-button plain @click="next('classroom')">下一步</el-button> -->
            <!-- <el-button v-show="isAllFilled && isUpdate" type="danger" @click="update">更新排课</el-button> -->
            <!-- <el-button v-show="isAllFilled && !isUpdate" type="danger" @click="submit">新增排课</el-button> -->
          </div>
        </div>
        <div class="func-block classroom" v-else-if="activeName === 'classroom'" :key="3">
          <!-- <div class="choose-area">
            <div class="normal-cube">
              <p>选择班级</p>
              <el-table
                v-loading="loading"
                element-loading-text="正在加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.8)"
                class="normal-cube-table"
                :data="classroomData"
                highlight-current-row
                @current-change="handleCurrentChangeClassroom"
                :height="tableHeight"
                stripe>
                <el-table-column
                  align="center"
                  prop="className"
                  label="班级名称">
                </el-table-column>
              </el-table>
            </div>
            <el-pagination
              @current-change="currentChange_classroom"
              :total="totalPage_classroom"
              :current-page="currentPage"
              layout="prev, pager, next">
            </el-pagination>
          </div> -->
          <div class="route">
            <!-- <el-button plain @click="prev('schedule')">上一步</el-button> -->
            <!-- <el-button plain @click="next('teacher')">下一步</el-button> -->
            <!-- <el-button v-show="isAllFilled && isUpdate" type="danger" @click="update">更新排课</el-button> -->
            <!-- <el-button v-show="isAllFilled && !isUpdate" type="danger" @click="submit">新增排课</el-button> -->
          </div>
        </div>
        <div class="func-block teacher" v-else-if="activeName === 'teacher'" :key="4">
          <!-- <div class="choose-area">
            <div class="normal-cube">
              <p>选择主教</p>
              <el-table
                v-loading="loading"
                element-loading-text="正在加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.8)"
                class="normal-cube-table"
                :data="teacherData"
                highlight-current-row
                @current-change="handleCurrentChangeTeacher"
                :height="tableHeight"
                stripe>
                <el-table-column
                  align="center"
                  prop="name"
                  label="主教名称">
                </el-table-column>
                <el-table-column
                  align="center"
                  width="320"
                  prop="userName"
                  label="主教邮箱">
                </el-table-column>
              </el-table>
            </div>
            <el-pagination
              @current-change="currentChange_teacher"
              :total="totalPage_teacher"
              :current-page="currentPage"
              layout="prev, pager, next">
            </el-pagination>
          </div> -->
          <div class="route">
            <!-- <el-button plain @click="prev('classroom')">上一步</el-button> -->
            <!-- <el-button v-show="isAllFilled && isUpdate" type="danger" @click="update">更新排课</el-button> -->
            <!-- <el-button v-show="isAllFilled && !isUpdate" type="danger" @click="submit">新增排课</el-button> -->
          </div>
        </div>
      </transition-group>
      <div class="schedule-add-btn-aera">
        <el-button :disabled="!isAllFilled" v-if="isUpdate" type="danger" @click="update" :loading="loading">更新排课</el-button>
        <el-button :disabled="!isAllFilled" v-else type="danger" @click="submit" :loading="loading">新增排课</el-button>
      </div>
    </div>
    <scheduleDialog
      :type="dialog_type"
      :sub="dialog_sub"
      :title="dialog_title">
    </scheduleDialog>
  </div>
</template>

<script>
import scheduleDialog from 'components/dialog'
import bread from 'components/bread'
const _ = require('lodash')
export default {
  data() {
    return {
      activeName: 'date',
      date: null,
      schedule: [],
      tableHeight: 330,
      classroom: '',
      teacher: '',
      tabPosition: 'top',
      // isAllFilled: false,
      datePickerSelectStatus: false,
      scheduleSelectStatus: true,
      currentPage: 1,
      pageSize: 9999,
      classroomData: [],
      teacherData: [],
      totalPage_classroom: 0,
      totalPage_teacher: 0,
      loading: false,
      selectProps: {
        // value: 'StageID',
        // label: 'Name',
        // children: 'Units'
      },
      breadDataAdd: [
        {
          name: '排课管理',
          path: '/schedule/list'
        },
        {
          name: '新增排课',
          path: '/schedule/add'
        }
      ],
      breadDataUpdate: [
        {
          name: '排课管理',
          path: '/schedule/list'
        },
        {
          name: '更新排课',
          path: ''
        }
      ],
      scheduleOptions: [
        {
          label: '常规',
          value: 1,
          children: []
        },
        {
          label: 'DEMO',
          value: 2,
          children: []
        }
      ],
      // 课程配置中文提示
      scheduleAlt: '请选择课程',
      assistant_id: 0,
      assistant_name: '',
      assistant_username: '',
      class_id: 0,
      class_name: '',
      class_type: '',
      stage: '',
      unit: '',
      sessions: [],
      isUpdate: false,
      course_id: 0,
      courseid1: 0,
      courseid2: 0,
      lesson_id: 0,
      lessonid1: 0,
      lessonid2: 0,
      sessionname: '',
      classPlaceHolder: '请选择',
      start_timestamp: 0,
      end_timestamp: 0,
      classroomVal: '',
      teacherVal: '',
      dialog_sub: '同一班级/老师两次课至少需要间隔20分钟',
      dialog_title: '与下面的排课冲突了',
      dialog_type: 'info'
    }
  },
  mounted() {
    let params = this.$route.params
    // 如果是修改当前排课配置
    if (params && params.class_name) {
      this.isUpdate = true
      this.courseid1 = params.course_id.split(',')[0]
      this.courseid2 = params.course_id.split(',')[1]
      this.course_id = [Number(this.courseid1), Number(this.courseid2)]
      this.lessonid1 = params.lesson_id.split(',')[0]
      this.lessonid2 = params.lesson_id.split(',')[1]
      this.lesson_id = [Number(this.lessonid1), Number(this.lessonid2)]
      this.Api.fetchCurrentSchedule({
        courseID1: this.courseid1,
        courseID2: this.courseid2,
        lessonID1: this.lessonid1,
        lessonID2: this.lessonid2
      }).then(data => {
        this._checkData(data).then(data => {
          data = data.data.lessons
          if (data) {
            data = data[0]
            this.date = data.start_timestamp * 1000
            this.start_timestamp = data.start_timestamp
            this.end_timestamp = data.end_timestamp
            this.sessionname = data.sessionname
            this.assistant_id = data.assistant_id
            this.assistant_name = data.assistant_name
            this.assistant_username = data.assistant_username
            this.class_id = data.class_id
            this.class_name = data.class_name
            let type = data.type === 1 ? '常规' : 'DEMO'
            this.classroom = data.class_name
            this.teacher = data.assistant_username
            // 防止this.schedule为空
            this.schedule = [data.type]
            this.classPlaceHolder = ''
            let para = document.createElement('div')
            let t = document.createTextNode(`${type} / ${data.stage} / ${data.unit ? data.unit + '/' : ''} ${data.sessions[0]} + ${data.sessions[1]}`)
            para.appendChild(t)
            document.querySelector('.el-cascader__label').appendChild(para)
            // document.querySelector('.el-cascader__label').innerText = `${type} / ${data.stage} / ${data.unit ? data.unit + '/' : ''} ${data.sessions[0]} + ${data.sessions[1]}`
            // document.querySelector('.el-cascader__label').append(info)
            this.scheduleAlt = `${type} / ${data.stage} / ${data.unit ? (data.unit + '/') : ''} ${data.sessions[0]} + ${data.sessions[1]}`
          } else {
            this.$notify({
              title: '查询数据为空',
              type: 'warning'
            })
          }
        }).catch((err) => {
          this.$notify({
            title: err.message,
            type: 'warning'
          })
        })
      }).catch((err) => {
        this.$notify({
          title: err.message,
          type: 'warning'
        })
      })
    }
    this.$store.dispatch('setTabActiveName', 'schedule')
    this.Api.getCourseInfo().then(data => {
      this._checkData(data).then(data => {
        let normalList = data.data.lessons.CourseInfo
        let demoList = data.data.lessons.demoCourseInfo
        normalList ? this.reWriteObj(normalList) : !0
        demoList ? this.reWriteObj(demoList) : !0
        // 常规课配置项
        normalList ? this.scheduleOptions[0].children = normalList : delete this.scheduleOptions[0]
        // demo课配置项
        demoList ? this.scheduleOptions[1].children = demoList : delete this.scheduleOptions[1]
      }).catch(err => {
        this.$notify({
          title: err.message,
          // message: err.message,
          type: 'warning'
        })
      })
    })
    this.getClassroomInfo(1)
    this.getTeacherInfo(1)
  },
  watch: {
    'activeName': function(val) {
      val === 'date' ? this.datePickerSelectStatus = false : this.datePickerSelectStatus = true
      val === 'schedule' ? this.scheduleSelectStatus = false : this.scheduleSelectStatus = true
    }
  },
  methods: {
    reWriteObj(arr) {
      if (arr && arr.length > 0) {
        // 重写 stage 数组对象，转为标准化字段，方便渲染menu
        for (let index = 0; index < arr.length; index++) {
          // stage 数组
          const aa = this.changeKeyNames(arr[index], {
            'Name': 'label',
            'StageID': 'value',
            'Units': 'children',
            'Sessions': 'children'
          })
          arr[index] = aa
          if (aa.children && aa.children.length > 0) {
            // unit 数组
            for (let jj = 0; jj < aa.children.length; jj++) {
              const bb = this.changeKeyNames(aa.children[jj], {
                'Name': 'label',
                'UnitID': 'value',
                'SessionArry': 'children',
                'SectionIDs': 'value'
              })
              arr[index].children[jj] = bb
              if (bb.children && bb.children.length > 0) {
                // session 数组
                for (let kk = 0; kk < bb.children.length; kk++) {
                  const cc = this.changeKeyNames(bb.children[kk], {
                    'Name': 'label',
                    'SectionIDs': 'value'
                  })
                  arr[index].children[jj].children[kk] = cc
                }
              }
            }
          }
        }
      }
    },
    // 重写属性名
    changeKeyNames(obj, namesMap) {
      return _.transform(obj, function(result, value, key) {
        result[namesMap[key] || key] = value
      })
    },
    getClassroomInfo(currentPage) {
      this.loading = true
      // 班级信息
      this.Api.fetchClassroomList({
        page: currentPage,
        pageSize: this.pageSize
      }).then(data => {
        this.loading = false
        this._checkData(data).then(data => {
          this.classroomData = data.data.data
          this.totalPage_classroom = data.data.total
          this.$store.dispatch('setClassroomData', data.data.data)
        })
      }).catch(err => {
        this.$notify({
          title: err.message,
          // message: err.message,
          type: 'warning'
        })
      })
    },
    getTeacherInfo(currentPage) {
      this.loading = true
      // 主教信息
      this.Api.fetchTeacherList({
        page: currentPage,
        pageSize: this.pageSize
      }).then(data => {
        this.loading = false
        this._checkData(data).then(data => {
          this.teacherData = data.data.teachers
          this.totalPage_teacher = data.data.total
          this.$store.dispatch('setTeacherData', data.data.teachers)
        })
      }).catch(err => {
        this.$notify({
          title: err.message,
          // message: err.message,
          type: 'warning'
        })
      })
    },
    chooseClassroom(val) {
      val = val.split('&')
      this.class_id = Number(val[0])
      this.class_name = val[1]
    },
    chooseTeacher(val) {
      val = val.split('&')
      this.assistant_id = Number(val[0])
      this.assistant_name = val[1]
      this.assistant_username = val[2]
    },
    handleClick(tab) {
      this.activeName = tab.name
    },
    prev(name) {
      this.activeName = name
    },
    next(name) {
      this.activeName = name
    },
    selectSchedule() {
      // console.log(this.schedule)
      let kkDiv = document.querySelector('.el-cascader__label').querySelector('div')
      if (kkDiv) {
        kkDiv.innerText = ''
      }
      setTimeout(() => {
        this.scheduleAlt = document.querySelector('.el-cascader__label').innerText
      }, 500)
    },
    // 拆分提交参数
    splitClassData() {
      this.class_type = this.schedule[0]
      // 课程配置 - 中文字符
      let txtArr = this.scheduleAlt.split('/')
      // console.log(txtArr)
      // console.log('this.class_type:', this.class_type)
      this.sessions = txtArr[txtArr.length - 1].split('+')
      for (let index = 0; index < this.sessions.length; index++) {
        this.sessions[index] = this.deleteSpace(this.sessions[index])
      }
      switch (this.class_type) {
        case 1:
          this.stage = this.deleteSpace(txtArr[1])
          this.unit = this.deleteSpace(txtArr[2])
          break
        case 2:
          this.stage = this.deleteSpace(txtArr[1])
          this.unit = ''
          break
      }
    },
    // 去除空格
    deleteSpace(str) {
      return str.replace(/^\s+|\s+$/g, '')
    },
    // 提交保存排课数据
    submit() {
      this.loading = true
      this.splitClassData()
      this.Api.addSchedule({
        class_type: this.class_type,
        stage: this.stage,
        unit: this.unit,
        sessions: this.sessions,
        start_timestamp: this.start_timestamp,
        end_timestamp: this.end_timestamp,
        assistant_id: this.assistant_id,
        assistant_name: this.assistant_name,
        assistant_username: this.assistant_username,
        class_id: this.class_id,
        class_name: this.class_name
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
              name: 'schedule-list'
            })
          }, 1000)
        }).catch(err => {
          if (err.data && err.data.length > 0) { // 排课冲突提示
            this.$store.dispatch('setDialogStatus', true)
            this.$store.dispatch('setDialogData', err.data)
          } else { // 普通失败
            this.$notify({
              title: err.message,
              // message: err.message,
              type: 'warning'
            })
          }
        })
      })
    },
    // 更新排课信息
    update() {
      this.loading = true
      this.splitClassData()
      this.Api.updateSchedule({
        class_type: this.class_type,
        stage: this.stage,
        unit: this.unit,
        sessions: this.sessions,
        course_id: this.course_id,
        lesson_id: this.lesson_id,
        sessionname: this.sessionname,
        start_timestamp: this.start_timestamp,
        end_timestamp: this.end_timestamp,
        assistant_id: this.assistant_id,
        assistant_name: this.assistant_name,
        assistant_username: this.assistant_username,
        class_id: this.class_id,
        class_name: this.class_name
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
              name: 'schedule-list'
            })
          }, 1000)
        }).catch(err => {
          this.$notify({
            title: err.message,
            // message: err.message,
            type: 'warning'
          })
        })
      })
    },
    reBuildDate() {
      if (this.date !== null) {
        this.start_timestamp = this.date / 1000
        this.end_timestamp = (this.date / 1000) + 90 * 60
      }
      // console.log('==> start_timestamp:', this.start_timestamp)
      // console.log('==> end_timestamp:', this.end_timestamp)
    },
    handleCurrentChangeClassroom(val) {
      if (val !== null) {
        this.classroom = val.className
        this.class_id = val.classId
        this.class_name = val.className
      }
    },
    handleCurrentChangeTeacher(val) {
      if (val !== null) {
        this.teacher = `${val.name} : ${val.userName}`
        this.assistant_id = val.teacherID
        this.assistant_name = val.name
        this.assistant_username = val.userName
      }
    },
    currentChange_classroom(val) {
      this.getClassroomInfo(val)
    },
    currentChange_teacher(val) {
      this.getTeacherInfo(val)
    }
  },
  computed: {
    // 是否填完所必要的信息
    isAllFilled: function() {
      return this.date !== null && this.schedule.length > 0 && this.classroom !== '' && this.teacher !== ''
    }
  },
  components: {
    bread,
    scheduleDialog
  }
}
</script>

<style lang="stylus" scope>
.schedule-add
  position absolute
  width 1200px
  .content
    width 100%
    min-height 679px
    padding-top 48px
    background #fff
    .schedule-add-tabs
      .el-tabs__active-bar
        display none
      .el-tabs__nav-wrap::after
        background-color #fff
      .el-tabs__nav
        float none
      // .el-tabs__item
        // padding 0
        // text-align left
        // text-indent 1.5em
    .func-block
      .choose-area
        // height 460px
      .route
        position absolute
        left 0
        right 0
        bottom 389px
        margin auto
    .fill-info-title
      width 1101px
      height 50px
      line-height 50px
      margin 0 auto
      li
        float left
        text-align left
        overflow hidden
        margin-left 10px
        margin-right 10px
        text-overflow ellipsis
        white-space nowrap
        &:nth-child(1)
          width 220px
          margin-left 35px
        &:nth-child(2)
          width 300px
        &:nth-child(3)
          width 230px
    .fill-info-area
      width 1101px
      height 50px
      line-height 50px
      margin 0 auto
      background #f5f5f5
      li
        float left
        text-align left
        overflow hidden
        margin-left 10px
        margin-right 10px
        text-overflow ellipsis
        white-space nowrap
        .el-cascader input
          width 300px
        .el-select input
          width 230px
        &:nth-child(1)
          margin-left 30px
        // .el-input__prefix
        //   top 4px
        //   left 0
        // .el-input__suffix
        //   top 4px
      li.classroom
        // width 230px
      li.teacher
        // width 320px
    .func-block button
      // margin-top 60px
      // margin-bottom 50px
.schedule-add-btn-aera
  // position absolute
  // bottom 0
  margin 80px auto
</style>