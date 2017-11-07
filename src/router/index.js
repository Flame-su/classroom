import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/index/Home.vue'
import List from '@/pages/list/List.vue'
import Homework from '@/pages/homework/Homework.vue'
import Singing from '@/pages/singing/Singing.vue'

import Whole from '@/pages/whole/Whole.vue'
import Task from '@/pages/task/task.vue'

import Group from '@/pages/group/group.vue'
import vocal from '@/pages/Vocal/vocal.vue'
import Finish from '@/pages/finish/finish.vue'
import FinishPic from '@/pages/finishPic/finishPic.vue'
// import testroute from '@/pages/testroute/testroute.vue' //测试中转路由
// import medal from '@/pages/medal/medal.vue'
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: "/home"
    },
    {
      path: '*',
      redirect: "/home"
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/List',
      name: 'List',
      component: List
    },
    {
      path: '/Homework',
      name: 'Homework',
      component: Homework
    },
    {
      path: '/Singing',
      name: "Singing",
      component: Singing
    },
    {
      path: '/Task',
      name: "Task",
      component: Task
    },
    {
      path: '/Whole',
      name: "Whole",
      component: Whole
    },
    {
      path: '/Group',
      name: "Group",
      component: Group
    },
    {
      path: '/vocal',
      name: "vocal",
      component: vocal
    }, {
      path: '/Finish',
      name: "Finish",
      component: Finish
    },
    {
      path: '/FinishPic',
      name: "FinishPic",
      component: FinishPic
    }
  ]
})
