import Vue from 'vue'
import Router from 'vue-router'
// import { setCookie, getCookie } from '../utils/index'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: (resolve) => require(['@/index'], resolve),
      children: [
        {
          path: '/famer/list',
          name: 'famer',
          component: (resolve) => require(['@/famer/index'], resolve),
          beforeEnter: (to, from, next) => {
            // 角色权限值 1: 超级管理员 2: 主教老师
            let userType = JSON.parse(window.localStorage.getItem('userInfo'))
            userType ? userType = userType.role : !0
            // console.log('身份权限：', userType)
            if(userType !== 1) {
              // 非超级管理员，无法进入排课员管理
              next('/schedule/list')
            } else {
              next()
            }
          },
          children: [
            {
              path: '/famer/list',
              name: 'famer-list',
              component: (resolve) => require(['@/famer/list'], resolve)
            },
            {
              path: '/famer/add',
              name: 'famer-add',
              component: (resolve) => require(['@/famer/add'], resolve)
            }
          ]
        },
        {
          path: '/schedule/list',
          name: 'schedule',
          component: (resolve) => require(['@/schedule/index'], resolve),
          children: [
            {
              path: '/schedule/list',
              name: 'schedule-list',
              component: (resolve) => require(['@/schedule/list'], resolve)
            },
            {
              path: '/schedule/add',
              name: 'schedule-add',
              component: (resolve) => require(['@/schedule/add'], resolve)
            },
            {
              path: '/schedule/upadte/:teacher_name/:class_name/:lesson_id/:course_id',
              name: 'schedule-update',
              component: (resolve) => require(['@/schedule/add'], resolve)
            }
          ]
        },
        {
          path: '/classroom/list',
          name: 'classroom',
          component: (resolve) => require(['@/classroom/index'], resolve),
          children: [
            {
              path: '/classroom/list',
              name: 'classroom-list',
              component: (resolve) => require(['@/classroom/list'], resolve)
            },
            {
              path: '/classroom/add',
              name: 'classroom-add',
              component: (resolve) => require(['@/classroom/add'], resolve)
            },
            {
              path: '/classroom/upadte/:class_id/:class_name',
              name: 'classroom-update',
              component: (resolve) => require(['@/classroom/add'], resolve)
            }
          ]
        },
        {
          path: '/teacher/list',
          name: 'teacher',
          component: (resolve) => require(['@/teacher/index'], resolve),
          children: [
            {
              path: '/teacher/list',
              name: 'teacher-list',
              component: (resolve) => require(['@/teacher/list'], resolve)
            },
            {
              path: '/teacher/add',
              name: 'teacher-add',
              component: (resolve) => require(['@/teacher/add'], resolve)
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: (resolve) => require(['@/login'], resolve)
    },
    {
      path: '*', // 此处需特别注意至于最底部
      name: '404',
      component: (resolve) => require(['@/404'], resolve)
    }
  ]
})
// 总控
// router.beforeEach((to, from, next) => {
//   console.log('router to:', to)
//   next()
// })

export default router
