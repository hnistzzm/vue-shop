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
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag v-for="(item,i) in scope.row.attr_vals"
                      :key="i" closable>{{item}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small"
                         @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
<!--          索引列-->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini"
                         icon="el-icon-edit" @click="showEdit(scope.row.attr_id)">修改</el-button>
              <el-button type="danger" size="mini"
                         icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" :disabled="isBtnDisabled"
                   @click="addDialogVisible  = true">添加参数</el-button>
        <!--        动态参数表格-->
        <el-table :data="onlyTableData"  border stripe>
          <!--          展开行-->
          <el-table-column type="expand"></el-table-column>
          <!--          索引列-->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini"
                         icon="el-icon-edit" @click="showEdit(scope.row.attr_id)">修改</el-button>
              <el-button type="danger" size="mini"
                         icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
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
    width="30%" @close="addDialogClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

    <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams()">确 定</el-button>
    </span>
  </el-dialog>

  <!--  修改参数的对话框-->
  <el-dialog
    :title="'修改'+titleText"
    :visible.sync="editDialogVisible"
    width="30%" >
    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
      <el-form-item :label="titleText" prop="attr_name">
        <el-input v-model="editForm.attr_name"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams()">确 定</el-button>
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
      //级联选择框双向绑定到的数组
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
      },
      //修改参数的表单
      editForm:[],
      editDialogVisible : false,
      //添加表单的验证规则对象
      editFormRules:{
        attr_name:[
          {required:true,message:'请输入分类参数',trigger:'blur'},
        ]
      },
      //控制按钮与文本框的切换显示
      inputVisible:false,
      //文本框中输入的内容
      inputValue:''

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
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ?
        item.attr_vals.split(' ') : []
        //控制文本框的显示与隐藏
        item.inputVisible = false
        //文本框中输入的值
        item.inputValue = ''
      })
      console.log(res.data)
      if(this.activeName === 'many'){
        this.manyTableData = res.data
        console.log(this.manyTableData)
      }else{
        this.onlyTableData = res.data
      }
    },
    //关闭添加属性的对话框
    addDialogClose(){
      this.addDialogVisible = false
      this.$refs.addFormRef.resetFields()
    },
    //完成添加分类的操作
    async  addParams(){
       this.$refs.addFormRef.validate(async valid=>{
          if(!valid)
            return
          const {data : res} =await this.$http.post(`categories/${this.cateId}/attributes`,{
            attr_name:this.addForm.attr_name,
            attr_sel:this.activeName
          })
          if(res.meta.status !== 201){
            return this.$message.error('添加参数失败!')
          }

            this.$message.success('添加参数成功!')
            this.addDialogVisible = false
            await this.getParamsData()
        })

    },
    //点击按钮，展示修改参数的对话框
    async showEdit(attr_id){
      this.editDialogVisible = true
      //查询当前参数的信息
     const {data : res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
        params:{ attr_sel :this.activeName}
      })
      if(res.meta.status !== 200)
        return this.$message.error('获取参数信息失败!')
      this.editForm = res.data
      console.log(this.editForm)
    },
    async editParams(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid)
          return
        const {data : res} = await  this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {attr_name:this.editForm.attr_name,attr_sel:this.activeName})
        if(res.meta.status !== 200)
          return this.$message.error('修改参数失败!')

        this.$message.success('修改参数成功!')
        await this.getParamsData()
        this.editDialogVisible = false


      })
    },
    async removeParams(attr_id){
      const  confirmResult =await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      console.log(confirmResult)
      if(confirmResult !== 'confirm'){
        return this.$message.info('已取消删除!')
      }
      const {data : res} =await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
      console.log(res.data)
      if(res.meta.status !== 200)
        return this.$message.error('删除参数失败!')

       this.$message.success('删除参数成功!')
       await this.getParamsData()

    },
    //文本框失去焦点或者按下了enter键都会触发
    handleInputConfirm(row){
      //如果输入不合法
      if(row.inputValue.trim().length === 0){
        row.inputValue = ''
        row.inputVisible= false
        return
      }
      //否则


    },
    //点击按钮，展示文本输出框
    showInput(row){
      row.inputVisible = true
      //让文本框自动获得焦点
      //$nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
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
.el-tag{
  margin-right: 10px;
}
.input-new-tag{
  width: 70px;
}
</style>
