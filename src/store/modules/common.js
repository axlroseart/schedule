const state = {
  isLogin: false,
  tabActiveName: 'schedule',
  classroomList: [],
  teacherList: [],
  userInfo: {},
  dialogStatus: false,
  dialogData: []
}

const mutations = {
  TAB_ACTIVE_NAME(state, data) {
    state.tabActiveName = data
  },
  LOGIN_STATUS(state, data) {
    state.isLogin = data
  },
  CLSSSROOM_LIST(state, data) {
    state.classroomList = data
  },
  TEACHER_LIST(state, data) {
    state.teacherList = data
  },
  USER_INFO(state, data) {
    state.userInfo = data
  },
  DIALOG_STATUS(state, data) {
    state.dialogStatus = data
  },
  DIALOG_DATA(state, data) {
    state.dialogData = data
  }
}

const getters = {
}

const actions = {
  setTabActiveName({commit}, data) {
    commit('TAB_ACTIVE_NAME', data)
  },
  setUserLoginStatus({commit}, data) {
    commit('LOGIN_STATUS', data)
  },
  setClassroomData({commit}, data) {
    commit('CLSSSROOM_LIST', data)
  },
  setTeacherData({commit}, data) {
    commit('TEACHER_LIST', data)
  },
  setUserInfo({commit}, data) {
    commit('USER_INFO', data)
  },
  setDialogStatus({commit}, data) {
    commit('DIALOG_STATUS', data)
  },
  setDialogData({commit}, data) {
    commit('DIALOG_DATA', data)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
