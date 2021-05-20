<template>
<div>
<!--  面包屑导航栏-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>参数列表</el-breadcrumb-item>
  </el-breadcrumb>
<!--  卡片区域-->
  <!--卡片区域-->
  <el-card>
    <el-alert
      title="注意:只允许为第三级分类设置相关参数!"
      type="warning" :closable="false">
    </el-alert>
<!--    选择商品分类区域-->
    <el-row class="cat">
      <el-col>
        <span>选择商品分类: </span>
<!--        选择商品分类的级联选择框-->
        <el-cascader
          v-model="selectedKeys"
          :options="cateList"
          :props="CascaderProps"
          @change="handleChanged()" clearable change-on-select>
        </el-cascader>
      </el-col>
    </el-row>
<!--    tab页签区域-->
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible  = true">添加参数</el-button>
<!--        动态参数表格-->
        <el-table :data="manyTableData"  border stripe>
<!--          展开行-->
          <el-table-column type="expand"></el-table-column>
<!--          索引列-->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template >
              <el-button type="primary" size="mini"
                         icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" size="mini"
                         icon="el-icon-delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" :disabled="isBtnDisabled"  @click="addDialogVisible  = true">添加参数</el-button>
        <!--        动态参数表格-->
        <el-table :data="onlyTableData"  border stripe>
          <!--          展开行-->
          <el-table-column type="expand"></el-table-column>
          <!--          索引列-->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template >
              <el-button type="primary" size="mini"
                         icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" size="mini"
                         icon="el-icon-delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
<!--  添加参数的对话框-->
  <el-dialog
    :title="'添加'+titleText"
    :visible.sync="addDialogVisible"
    width="30%">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>

      </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
  </span>
  </el-dialog>

</div>
</template>

<script>
export default {
  name: 'Params',
  data(){
    return{
      cateList:[],
      //级联选择框双向绑定道德数组
      selectedKeys:[],
      //父级节点的数据
      parentCateList:[],
    //  指定级联选择器的配置对象
      CascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        expandTrigger: 'hover'
      },
      //被激活的页面的名称
      activeName:'many',
      //动态参数的数据
      manyTableData:[],
      //静态属性的数据
      onlyTableData:[],
      addDialogVisible:false,
      //添加参数的表单
      addForm:[],
      //添加表单的验证规则对象
      addFormRules:{
        attr_name:[
          {required:true,message:'请输入分类参数',trigger:'blur'},
        ]


      }
    }
  },
  created () {
    this.getCateList()
  },
  methods:{
    //获取商品数据
    async  getCateList () {
        const {data:res} =await this.$http.get('categories')
      if(res.meta.status !== 200){
        return this.$message.error('获取商品分类失败!')
      }
      this.cateList = res.data
      console.log(res.data)
    },
     handleChanged(){
      this.getParamsData()
    },
    handleTabClick(){
      this.getParamsData()
      //console.log(this.activeName)
    },
    //获取分类参数的数据
    async  getParamsData(){
      //证明选中的不是三级分类
      if(this.selectedKeys.length !==3){
        this.selectedKeys = []
        return
      }
      console.log(this.selectedKeys)

      const  {data:res} = await this.$http.get
      (`categories/${this.cateId}/attributes`, {params:{sel: this.activeName}})

      if(res.meta.status !== 200){
        return  this.$message.error('获取参数列表失败!')
      }
      if(this.activeName === 'many'){
        this.manyTableData = res.data
        console.log(this.manyTableData)
      }else{
        this.onlyTableData = res.data
      }
    }
  },
  computed:{
    isBtnDisabled(){
      if(this.selectedKeys.length !==3)
        return true
      return  false
    },
    cateId(){
      if(this.selectedKeys.length === 3 )
        return this.selectedKeys[2]

      return  null
    },
    //动态计算标题的文本
    titleText(){
      if(this.activeName === 'many'){
        return '动态参数'
      }else{
        return '静态属性'
      }
    }
  }
}
</script>

<style  Lang="less" scoped>
.cat{
  margin: 15px 10px;
}
</style>
