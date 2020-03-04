<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="~assets/logo.png" alt />
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock"
          type="password"></el-input>
        </el-form-item>
        <el-form-item class='btns'>
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "login",
  data(){
    return {
      // 登陆表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证
      loginFormRules: {
         username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
      }
    }
  },
  methods: {
      // 重置表单
    resetLoginForm(){
      // 获取表单实例对象
      this.$refs.loginFormRef.resetFields();
    },
    login(){
      this.$refs.loginFormRef.validate(async(val,obj)=>{
        if(!val) return;
        let {data:res}= await this.$http.post('login',this.loginForm)
        if(res.meta.status!==200) return this.$message.error("登陆失败");
        this.$message.success("登陆成功");
        // 1.登陆成功后的token保存到客户端的sessionStorage中
        //   -项目中除了登陆之外的api 其他的都需要登陆后才能访问
        //   -token应在页面关闭后失效，所以存在sessionStorage中
        // 2.跳转到路由地址home
        window.sessionStorage.setItem("token",res.data.token);
        this.$router.push("/home");
      })
    }
  }
};
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #347c85;
  .login-box {
    width: 480px;
    height: 320px;
    box-shadow: 0px 2px 400px 6px #000;
    position: relative;
    background: #fff;
    .avatar-box {
      width: 140px;
      height: 140px;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      padding: 10px;
      background: #41b883;
      img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background: #ccc;
      }
    }
  }
}
.login-form{
  position: absolute;
  bottom: 0;
  padding: 20px 10px;
  box-sizing: border-box;
  width: 100%;
}
.btns{
  display: flex;
  justify-content: flex-end;
}
</style>