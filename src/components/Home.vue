<template>
<!--  点击”退出“按钮,将token删除，使用户页面跳转至登录页面-->

  <el-container>
<!--    头部区域-->
    <el-header>Header<el-button type="info" @click="logout">退出</el-button></el-header>
<!--    主体区域-->
    <el-container>
<!--      侧边栏-->
      <el-aside width="200px">Aside</el-aside>
<!--      内容主题-->
      <el-main>Main</el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  name: 'Home',
  methods:{
    logout(){
      //销毁session
      window.sessionStorage.clear();
      this.$router.push("/login");
    }
  }
}
</script>

<style Lang="less" scoped>
.el-container{
  height: 100%;
}

.el-header{
  background-color: #373d41;
}
.el-aside{
  background-color: #333744;
}
.el_main{
  background-color: #eaedf1;
}
</style>
