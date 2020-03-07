<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="注意: 只允许为第三分类设置相关参数!" type="warning" :closable="false" show-icon></el-alert>

      <!-- 选择商品分类 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:&nbsp;&nbsp;</span>
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="paramsProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 页签 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="dialogVisible=true"
          >添加参数</el-button>
          <!-- 动态属性 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scoped">
                <el-tag
                  v-for="(item,index) in scoped.row.attr_vals"
                  :key="index"
                  closable
                  @close="handClose(index,scoped.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scoped.row.inputVisible"
                  v-model="scoped.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scoped.row)"
                  @blur="handleInputConfirm(scoped.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scoped.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scoped">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scoped.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scoped.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="dialogVisible=true"
          >添加属性</el-button>
          <!-- 静态属性 -->

          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scoped">
                <el-tag
                  v-for="(item,index) in scoped.row.attr_vals"
                  :key="index"
                  closable
                  @close="handClose(index,scoped.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scoped.row.inputVisible"
                  v-model="scoped.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scoped.row)"
                  @blur="handleInputConfirm(scoped.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scoped.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scoped">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scoped.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scoped.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      :title="'编辑'+titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      paramsProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      selectedKeys: [],
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      dialogVisible: false,
      addForm: {
        attr_name: ""
      },
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      //添加分类对话框
      editDialogVisible: false,
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      editForm: {
        attr_name: ""
      }
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true;
      }
      return false;
    },
    //当前选中的三级分类的ID
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2];
      }
      return null;
    },
    titleText() {
      return this.activeName == "many" ? "动态参数" : "静态属性";
    }
  },
  methods: {
    //获取分类列表显示
    async getCateList() {
      const { data: res } = await this.$http.get("categories");

      if (res.meta.status != 200) {
        return this.$message.error("获取商品分类失败");
      }
      this.cateList = res.data;
    },
    //分类列表改变
    handleChange() {
      this.getParamsChange();
    },
    // 页签点击处理函数
    handleTabClick() {
      this.getParamsChange();
    },
    //获取分类改变
    async getParamsChange() {
      if (this.selectedKeys.length < 3) {
        this.selectedKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return this.$message.error("请选择三级分类!");
      }
      const { data: result } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      if (result.meta.status !== 200) {
        return this.$message.error("获取参数列表失败!");
      }

      result.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
        item.inputVisible = false;
        item.inputValue = "";
      });
      if (this.activeName == "many") {
        this.manyTableData = result.data;
      } else if (this.activeName == "only") {
        this.onlyTableData = result.data;
      }
    },
    //关闭添加对话框
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    //添加分类
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status != 201) {
          return this.$message.error("添加属性失败");
        }
        this.$message.success("添加属性成功");
        this.dialogVisible = false;
        this.getParamsChange();
      });
    },
    //显示编辑分类对话框
    async showEditDialog(attr_id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName }
        }
      );
      if (res.meta.status != 200) {
        return this.$message.error("获取参数信息失败");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    //重置修改表单
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    //编辑
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}
        /attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status != 200) {
          return this.$message.error("修改参数失败");
        }
        this.$message.success("修改参数成功");
        this.getParamsChange();
        this.editDialogVisible = false;
      });
    },
    //删除
    async removeParams(attr_id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该属性,是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      // 取消删除
      if (confirmResult != "confirm") {
        return this.$message.info("已取消删除操作");
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (res.meta.status != 200) {
        return this.$message.error("删除参数失败!");
      }
      this.$message.success("删除参数成功");
      this.getParamsChange();
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.saveAttrValues(row);
    },
    async saveAttrValues(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(",")
        }
      );
      if (res.meta.status != 200) {
        return this.$message.error("修改新标签失败");
      }
      this.$message.success("修改新标签成功");
    },
    showInput(row) {
      row.inputVisible = true;
      //让文本框自动获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrValues(row);
    }
  }
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 8px;
}
.input-new-tag {
  width: 120px;
}
</style>