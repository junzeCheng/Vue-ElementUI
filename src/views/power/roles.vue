<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template v-slot="scoped">
            <el-row
              :class="['bdbottom' ,i1==0 ? 'bdtop':'','dpcenter'] "
              v-for="(item1,i1) in scoped.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightsById(scoped.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2==0 ? '':'bdtop','dpcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="8">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightsById(scoped.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="11">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightsById(scoped.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoleDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserById(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightsDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分配权限对话框 -->
      <el-dialog title="分配权限" :visible.sync="setRightsDialogVisible" width="50%">
        <el-tree
          :data="rightsList"
          :props="rightsProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
          ref="treeRef"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 添加角色对话框 -->
      <el-dialog title="添加角色" :visible.sync="addRoleVisible" width="50%" @close="addDialogClose()">
        <el-form :model="addRoleForm" :rules="addRoleRules" ref="addRoleRef" label-width="90px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRoleVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑角色对话框 -->
       <el-dialog title="修改角色" :visible.sync="editRoleVisible" width="50%" @close="editDialogClose()">
        <el-form :model="editRoleForm" :rules="editRoleRules" ref="editRoleRef" label-width="90px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRoleVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      rightsList: [],
      setRightsDialogVisible: false,
      addRoleVisible: false,
      rightsProps: {
        label: "authName",
        children: "children"
      },
      addRoleForm: {
        roleName: "",
        roleDesc: ""
      },
      addRoleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },
      defKeys: [],
      // 即将分配权限的角色ID
      roleId: "",
      editRoleVisible: false,
      editRoleForm: {},
      editRoleRules:{
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取权限列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.rolesList = res.data;
    },
    // 添加角色
    addRole() {
      this.$refs.addRoleRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addRoleForm);
        console.log(res);
        if (res.meta.status != 201) {
          this.$message.error("添加用户失败");
        }
        this.$message.success("创建成功");
        this.addRoleVisible = false;
        this.getRolesList();
      });
    },
    // 添加角色表单验证
    addDialogClose() {
      this.$refs.addRoleRef.resetFields();
    },
    // 删除角色权限
    async removeRightsById(role, rightsId) {
      const confirmResult = await this.$confirm(
        "此操作将删除该角色权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除");
      }
      const { data: result } = await this.$http.delete(
        `roles/${role.id}/rights/${rightsId}`
      );
      if (result.meta.status != 200) {
        return this.$message.error("删除权限失败");
      }
      this.$message.success("删除权限成功");
      role.children = result.data;
    },
    //分配角色权限
    async showSetRightsDialog(role) {
      this.roleId = role.id;
      this.defKeys = [];
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status != 200) {
        return this.$message.error("获取用户权限失败!");
      }
      this.rightsList = res.data;
      this.getLeafsKeys(role, this.defKeys);
      this.setRightsDialogVisible = true;
    },
    // 递归获取三级权限id 保存到defKeys数组中
    getLeafsKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => this.getLeafsKeys(item, arr));
    },
    // 获取新增权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status != 200) {
        return this.$message.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      this.getRolesList();
      this.setRightsDialogVisible = false;
    },
    //编辑角色对话框
    editDialogClose(){
      this.$refs.editRoleRef.resetFields();
    },
    async editRoleDialog(id){
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status != 200)
        return this.$message.error("查询分类信息失败");
      this.editRoleForm = res.data;
      this.editRoleVisible = true;
    },
    // 编辑角色确认
    editRole(){
      this.$refs.editRoleRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.editRoleForm.roleId,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          }
        );
        if (res.meta.status != 200) {
          return this.$message.error("修改角色信息失败");
        }
        this.$message.success("修改成功");
        this.editRoleVisible = false;
        this.getRolesList();
      });
    },
    //删除角色
    async deleteUserById(id){
      const res = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (res !== "confirm") {
        return this.$message.info("取消了删除");
      }
      const { data: result } = await this.$http.delete("roles/" + id);
      if (result.meta.status != 200) {
        return this.$message.error("删除角色失败");
      }
      this.$message.success("删除角色成功");
      this.getRolesList();
    },
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 8px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.dpcenter {
  display: flex;
  align-items: center;
}
</style>