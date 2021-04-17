<template>
<div>
  <!--  面包屑导航栏-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
<!--  卡片区域-->
  <el-card class="el-card">
<!--    设置添加角色按钮-->
    <el-button type="primary">添加角色</el-button>
<!--    角色列表区域-->
    <el-table :data="roleList" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" >
        <template >
          <el-button type="primary" icon="el-icon-edit" size="small" >编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" >删除</el-button>
          <el-button type="warning" icon="el-icon-share" size="small" >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

  </el-card>
</div>
</template>

<script>
export default {
  name: 'roles',
  data(){
    return{
      roleList:[]
    }
  },
  created () {
    this.getRoleList()
  },
  methods:{
    async getRoleList(){
      const {data:res} = await this.$http.get("roles")
      if(res.meta.status !==200){
        return this.$message.error('获取角色列表失败!')
      }
      this.roleList=res.data
      console.log(this.roleList)
    }
  }
}
</script>

<style scoped>

</style>
