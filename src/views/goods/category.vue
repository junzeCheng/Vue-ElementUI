<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <tree-table
        class="tree-table"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
      >
        <!-- 有效 -->
        <template v-slot:isOk="scoped">
          <i class="el-icon-success" style="color: lightgreen" v-if="scoped.row.cat_deleted==false"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order="scoped">
          <el-tag size="mini" v-if="scoped.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scoped.row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template v-slot:opt="scoped">
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 添加分类对话框 -->
      <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClose">
        <el-form
          :model="addCateForm"
          :rules="addCateRules"
          ref="addCateRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChanged"
              clearable
              change-on-select
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addNewCat">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 分类列表
      cateList: [],
      total: 0,
      //列
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isOk"
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "opt"
        }
      ],
      // 分类对话框
      addCateDialogVisible: false,
      addCateForm: {
        //将要添加的分类名称
        cat_name: "",
        //父级分类ID
        cat_pid: 0,
        //默认分类
        cat_level: 0
      },
      addCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      parentCateList: [],
      cascaderProps: {
            expandTrigger: 'hover',
            value: 'cat_id',
            label: 'cat_name',
            children: "children"
      },
      //选中的父级分类的数组
      selectedKeys: []
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取商品分类失败");
      }
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    //pagesize事件
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getCateList();
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getCateList();
    },
    addCate() {
      this.getParentCateList()
      this.addCateDialogVisible = true;
    },
    //获取父级分类列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取父级分类失败");
      }
      this.parentCateList = res.data;
    },
    //选择父级分类
    parentCateChanged(){
      console.log(this.selectedKeys)
      if(this.selectedKeys.length > 0){
        //父级分类ID
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }else{
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    //点击确定按钮
    addNewCat(){
      this.$refs.addCateRef.validate(async valid=>{
        if(!valid) return
        const {data: res} = await this.$http.post("categories",this.addCateForm)
        if(res.meta.status!==201){
          return this.$message.error("添加分类失败")
        }
        this.$message.success("添加分类成功")
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    //退出清空表单
    addCateDialogClose(){
      this.$refs.addCateRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    }
  }
};
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
.el-cascader{
height:300px;
width:300px;
}
</style>