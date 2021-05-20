import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/user/Users'
import Rights from '@/components/power/Rights'
import Roles from '@/components/power/Roles'
import Cate from '@/components/goods/Cate'
import Params from '@/components/goods/Params'
Vue.use(Router)

const router=new  Router({
  routes: [
    {path:'/',redirect:'/login'},
    { path: '/login',component: Login },
    {path:'/home',component:Home,
      redirect:'/welcome',
      children:[
        {path:'/welcome',component:Welcome},
        {path:'/users',component:Users},
        {path:'/roles',component:Roles},
        {path:'/rights',component:Rights},
        {path:'/categories',component:Cate},
        {path:'/params',component:Params}
      ]}
  ]

});
//挂载路由导航守卫
router.beforeEach((to,form,next)=>{
  //to 将要访问的路径
  // form 代表从哪个路径跳转而来
  //next 是一个函数，表示放行
  if(to.path=='/login') return next();
  //获取token,如果token存在，则允许跳转至home页，否则回退回login页面
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()

})
export  default router
