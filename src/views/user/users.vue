<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- // 用户数据 -->
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>

        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserById(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="管理用户" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 添加用户 -->
      <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="dialogClose()">
        <el-form :model="addUserForm" :rules="addUserRules" ref="addUserRef" label-width="70px">
          <el-form-item label="姓名" prop="username">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑用户 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="magDialogVisible"
        width="50%"
        @close="editDialogClose()"
      >
        <el-form :model="magUserForm" :rules="magUserRules" ref="magUserRef" label-width="70px">
          <el-form-item label="姓名" prop="username">
            <el-input v-model="magUserForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="magUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="magUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="magDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑角色 -->
      <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisible"
        width="50%"
      >
        <div>
          <p>当前的用户: {{userInfo.username}}</p>
          <p>当前的角色: {{userInfo.role_name}}</p>
          <p>
            分配新角色:
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    // 验证手机号
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    // var checkEmail = (rule, value, cb) => {
    //   const regEmail = /^[\da-z]+([\-\.\_]?[\da-z]+)*@[\da-z]+([\-\.]?[\da-z]+)*(\.[a-z]{2,})+$/;
    //   if (regEmail.test(value)) {
    //     return cb();
    //   }
    //   cb(new Error("请输入正确的邮箱"));
    // };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      magDialogVisible: false,
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
          // { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      magUserForm: {},
      magUserRules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
          // { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      setRoleDialogVisible: false,
      userInfo: {},
      roleList: [],
      // 选中角色的ID
      selectedRoleId: ''
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    // 分页
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum;
      this.getUserList();
    },
    search() {
      this.queryInfo.pagenum = 1;
      this.getUserList();
    },
    // 更新用户状态
    async userStateChanged(newUserState) {
      const { data: res } = await this.$http.put(`users/${newUserState.id}
                           /state/${newUserState.mg_state}`);
      if (res.meta.status !== 200) {
        newUserState.mg_state = !newUserState.mg_state;
        return this.$message.error("更新用户状态失败 请重试!");
      }
      this.$message.success("用户状态更新成功");
    },
    //清空表单
    dialogClose() {
      this.$refs.addUserRef.resetFields();
    },
    editDialogClose() {
      this.$refs.magUserRef.resetFields();
    },
    addUser() {
      this.$refs.addUserRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addUserForm);
        console.log(res);
        if (res.meta.status != 201) {
          this.$message.error("添加用户失败");
        }
        this.$message.success("创建成功");
        this.dialogVisible = false;
        this.getUserList();
      });
    },
    //编辑用户信息
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status != 200)
        return this.$message.error("查询用户信息失败");
      this.magUserForm = res.data;
      this.magDialogVisible = true;
    },
    // 修改用户信息
    editUser() {
      this.$refs.magUserRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "users/" + this.magUserForm.id,
          {
            email: this.magUserForm.email,
            mobile: this.magUserForm.mobile
          }
        );
        if (res.meta.status != 200) {
          return this.$message.error("修改用户信息失败");
        }
        this.$message.success("修改成功");
        this.magDialogVisible = false;
        this.getUserList();
      });
    },
    async deleteUserById(id) {
      const res = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
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
      const { data: result } = await this.$http.delete("users/" + id);
      if (result.meta.status != 200) {
        return this.$message.error("删除用户失败");
      }
      this.$message.success("删除用户成功");
      this.queryInfo.pagenum = 1;
      this.getUserList();
    },
    // 设置角色
    async setRole(userInfo) {
      this.selectedRoleId = ''
      this.userInfo = {}
      this.userInfo = userInfo;
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200) {
        return this.$message.error("获取用户角色失败！");
      }
      this.roleList = res.data;
      this.setRoleDialogVisible = true;
    },
    // 保存设置的角色
    async saveRoleInfo(){
      if(!this.selectedRoleId){return this.$message.error("请选择一个角色")}
      const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,
      {
        rid: this.selectedRoleId
      })
      if(res.meta.status!=200){
        return this.$message.error("更新角色失败")
      }
      this.$message.success("更新角色成功")
      this.getUserList()
      this.setRoleDialogVisible = false
    }
  }
};
</script>

<style lang="less" scoped>
</style>