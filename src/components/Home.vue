<template>
<div>
<!--  点击”退出“按钮,将token删除，使用户页面跳转至登录页面-->
  <el-button type="info" @click="logout">退出</el-button>

</div>
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

<style scoped>

</style>
