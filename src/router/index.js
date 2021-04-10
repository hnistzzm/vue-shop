import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home'
import id from 'element-ui/src/locale/lang/id'
Vue.use(Router)

const router=new  Router({
  routes: [
    {path:'/',redirect:'/login'},
    { path: '/login',component: Login },
    {path:'/home',component:Home}
  ]

});
router.beforeEach((to,form,next)=>{
  if(to.path=='/login') return next();
  //获取token,如果token存在，则允许跳转至home页，否则不允许
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return ('/login')
  next()

})
export  default router
