<template>
<div>
  <!--  面包屑导航栏-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>
  <!--卡片区域-->
  <el-card>
    <el-row>
      <!--  设置添加分类的列表  -->
      <el-button type="primary" @click="addDialogVisible = true">添加分类</el-button>
    </el-row>

<!--    分类列表区域-->
    <tree-table :data="cateList" :columns="columns"
                :selection-type="false" :expand-type="false"
                show-index index-text="#" border>
          <template slot="isok" slot-scope="scope">
              <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
              <i class="el-icon-error" v-else  style="color: red"></i>
          </template>
    </tree-table>
<!--    分页区-->
  </el-card>

  <!--    添加角色的对话框-->
  <el-dialog
    title="添加用户"
    :visible.sync="addDialogVisible"
    width="30%"  >
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

</div>
</template>

<script>
export default {
  name: 'Cate.vue',
  data(){
    return{
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
        //商品分类的数据列表
      cateList:[],
      //总数据条数
      total:0,
      columns:[
        {
        label:'分类名称',
        prop:'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          //表示将当前列定位模板列
          type:'template',
          template:'isok'
        }

      ],
      addDialogVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  methods:{
    //获取商品分类数据
    async getCateList(){
        const {data : res}= await this.$http.get('categories',{params:this.queryInfo})
        if(res.meta.status !== 200)
          return this.$message.error('获取商品分类失败!')

      console.log(res.data)
        //把数据列表赋值给cateList
        this.cateList = res.data.result
      console.log(this.cateList)
      //为总数据条数赋值
        this.total = res.data.total
    }
  }
}
</script>

<style  Lang="less" scoped>

</style>
