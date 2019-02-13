/**
 * API业务参数对象，属性名对应mutations
 * url: 接口地址
 * method: 请求类型
 * type: json（参数为json格式对象）, form（参数为form表单对象）, url（参数为字符串拼接）, mix（参数为混合型数据结构）
 * params: 默认请求参数对象
 * extra: 混合模式下的参数类型
 */

const apiConfig = {
  // 获取appid
  getQrcodeLoginAppid: {
    url: '/v1/schedule/user/getappid',
    method: 'GET'
  },
   // 二维码登录
   qrcodeLogin: {
    url: '/v1/schedule/user/qrcodelogin',
    method: 'POST',
    type: 'json',
    params: {
      token: '',
      ticket: '',
      role: 3
    }
  },
  // 用户名登录
  doLogin: {
    url: '/v1/schedule/user/login',
    method: 'POST',
    type: 'json',
    params: {
      "username": "classroom", //类型：String  必有字段  备注：用户名
      "password": "123456", //类型：String  必有字段  备注：密码
      "role": 2 //类型：Number  必有字段  备注：登录类型,1:学生端 2:主讲端 3:教室端 4:助教端
    }
  },
  // 获取已经打点发布的课程配置信息
  getCourseInfo: {
    url: '/v1/schedule/getcoureseinfo',
    method: 'GET',
    type: 'url',
    params: {
      page: 1,
      pageSize: 10
    }
  },
  // 获取配置的课程信息列表
  getScheduleList: {
    url: '/v1/schedule/getschedule',
    method: 'GET',
    type: 'url',
    params: {
      page: 1,
      pageSize: 10
    }
  },
  // 编辑保存现有排课信息
  updateSchedule: {
    url: '/v1/schedule/edit/courseschedule',
    method: 'POST',
    type: 'json',
    params: {
    }
  },
  // 删除已配置的排课信息
  deleteSchedule: {
    url: '/v1/schedule/del/courseschedule',
    method: 'POST',
    type: 'json',
    params: {
    }
  },
  // 获取具体某节课的配置信息
  fetchCurrentSchedule: {
    url: '/v1/schedule/getschedule/courseandlesson',
    method: 'GET',
    type: 'url',
    params: {
    }
  },
  // 新增排课信息
  addSchedule: {
    url: '/v1/schedule/add/courseschedule',
    method: 'POST',
    type: 'json',
    params: {
    }
  },
  // 获取班级列表
  fetchClassroomList: {
    url: '/v1/schedule/classes',
    method: 'GET',
    type: 'url',
    params: {
      page: 1,
      pageSize: 10
    }
  },
  // 获取班级对应的学生列表
  fetchStudentsData: {
    url: '/v1/schedule/students',
    method: 'GET',
    type: 'url',
    params: {
    }
  },
  // 更新班级数据
  updateClassroomData: {
    url: '/v1/schedule/update/class',
    method: 'POST',
    type: 'json',
    params: {
    }
  },
  // 新增班级
  addClassroom: {
    url: '/v1/schedule/add/class',
    method: 'POST',
    type: 'json',
    params: {
    }
  },
  // 删除班级
  delClassroom: {
    url: '/v1/schedule/del/class',
    method: 'POST',
    type: 'json',
    params: {
    }
  },
  // 主教老师查询
  teacherQuery: {
    url: '/v1/schedule/teacher/search',
    method: 'GET',
    type: 'url',
    params: {
    }
  },
  // 新增主教老师
  addTeacher: {
    url: '/v1/schedule/add/teacher',
    method: 'POST',
    type: 'json',
    params: {
    }
  },
  // 获取主教老师列表
  fetchTeacherList: {
    url: '/v1/schedule/teachers',
    method: 'GET',
    type: 'url',
    params: {
      page: 1,
      pageSize: 10
    }
  },
  // 删除老师
  deleteTeacher: {
    url: '/v1/schedule/del/teacher',
    method: 'POST',
    type: 'json',
    params: {
    }
  },
  // 查询排课员列表
  fetchFamerList: {
    url: '/v1/schedule/query/scheduleaccount',
    method: 'GET',
    type: 'url',
    params: {
      page: 1,
      pageSize: 10
    }
  },
  // 授权排课员
  addFamer: {
    url: '/v1/schedule/add/scheduleaccount',
    method: 'POST',
    type: 'json',
    params: {
    }
  },
  // 取消授权排课员
  delFamer: {
    url: '/v1/schedule/del/scheduleaccount',
    method: 'POST',
    type: 'json',
    params: {
    }
  },
  // 登出
  doLogout: {
    url: '/v1/schedule/user/logout',
    method: 'POST',
    type: 'json',
    params: {
    }
  },
  // 上传图片
  uploadImage: {
    url: '/v1/datacenter/storage/upload',
    // contentType: false,
    // processData: false,
    method: 'POST',
    type: 'form',
    params: {

    }
  }
}

export default apiConfig
