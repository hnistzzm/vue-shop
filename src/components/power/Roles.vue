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
    <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
<!--    角色列表区域-->
    <el-table :data="roleList" border stripe>

      <el-table-column type="expand" >
      <template slot-scope="scope">
        <el-row  :class="['bdBottom',i1===0 ? 'bdTop' : '','vcenter']"  v-for="(item1,i1) in scope.row.children" :key="item1.id">
<!--          渲染一级权限-->
          <el-col :span="5">
            <el-tag style="background-color: #afd1ea" >{{item1.authName}}</el-tag>
            <i class="el-icon-caret-right"></i>
          </el-col>
<!--          渲染二级权限-->
          <el-col :span="19">
            <el-row :class="[i2 ===0 ? '': 'bdTop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">

              <el-col :span="6">
                <el-tag type="success"  style="background-color: #b5f0b5" >{{item2.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <el-col :span="18">
                <el-tag style="background-color: #f9f9ac" type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>

              </el-col>
            </el-row>

          </el-col>
        </el-row>


      </template>

      </el-table-column>
<!--      索引列-->
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="showEdit(scope.row.id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="removeUserById(scope.row.id)">删除</el-button>
          <el-button type="warning" icon="el-icon-share" size="small" >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

<!--    添加角色的对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="30%" @close="addCloseDialog" >
      <!--      内容主体区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <!--      底部区域-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
<!--    修改权限信息的对话框-->
    <el-dialog title="编辑信息" :visible.sync="editDialogVisible" width="30%">

      <el-form :model="editForm"  ref="editFormRef" label-width="70px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName" ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc" ></el-input>
        </el-form-item>

      </el-form>

<!--      底部栏-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser()">确 定</el-button>
  </span>
    </el-dialog>

  </el-card>
</div>
</template>

<script>
export default {
  name: 'roles',
  data(){
    return{
      roleList:[],
      addForm:{
        roleName:'',
        roleDesc:''
      },
      editForm: {

      },
      addDialogVisible:false,
      editDialogVisible:false,

      addFormRules:{
        roleName: [],
        roleDesc: []

      }
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
      //console.log(this.roleList.id)
    },
    //关闭表单后，将表单里的内容清空
    addCloseDialog(){
      this.$refs.addFormRef.resetFields();
    },
    addUser () {
      this.$refs.addFormRef.validate(async valid =>{
        if(!valid) return
        //console.log(valid)
        const {data:res}= await this.$http.post('roles',this.addForm)
        if(res.meta.status!==201)
          this.$message.error('添加用户失败！')
        else
          this.$message.success('添加用户成功！')
        //将对话框隐藏
        this.addDialogVisible = false
        //重置表单
        await this.getRoleList()
      } )
    },

    async showEdit(id){
      //console.log(id)
      console.log(this.roleList.id+"zzz")
      const {data:res} = await this.$http.get("roles/"+id)
      if(res.meta.status!==200)
        return this.$message.error('查询用户信息失败!')
      this.editForm = res.data
      console.log(this.editForm)
      this.editDialogVisible =true
    },
    editUser(){
      this.$refs.editFormRef.validate(async valid =>{
        if(!valid) return
        console.log(valid)
        //console.log(this.editForm.id)
        //发起修改用户信息的数据请求
        const {data:res}= await  this.$http.put("roles/"+this.editForm.roleId,{
          roleName:this.editForm.roleName,
          roleDesc:this.editForm.roleDesc
        })
        console.log(this.editForm.roleId)
        console.log(res)
        if(res.meta.status!==200)
          this.$message.error('修改用户信息失败！')
        else
          this.$message.success('修改用户信息成功！')
        this.editDialogVisible =false
        await  this.getRoleList()

      })
    },
    //显示删除用户的对话框
  async  removeUserById (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //如果用户确定删除，则返回值为字符串confirm
      //如果用户取消了删除，则返回值为字符串cancel
      //console.log(confirmResult)
      if(confirmResult !=='confirm'){
        return this.$message.info('已取消删除')
      }
      //console.log('确认了删除')
      const {data:res} = await this.$http.delete("roles/"+id)
      if(res.meta.status!==200){
        this.$message.error('删除失败!')
      }
      else
        this.$message.success('删除成功!')
      //重置表单
      await  this.getRoleList()
    },
    //根据id删除对应的权限
    async removeRightById(role,rightId){
      //弹框提示用户是否要删除
    const confirmResult =await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if(confirmResult !=='confirm'){
        return this.$message.info('取消了删除!')
        //console.log('确认了删除')
      }
      const {data : res} =await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      console.log(res)
      if(res.meta.status !== 200){
        return  this.$message.error('删除权限失败!')
      }
      role.children = res.data
    }


    }
  }

</script>

<style Lang="less" scoped>
.el-tag{
  margin:  7px;
}
.bdTop{
  border-top: 1px solid #1047e3;
}
.bdBottom{
  border-bottom: 1px solid #1047e3;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
