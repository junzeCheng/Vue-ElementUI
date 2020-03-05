<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="~assets/img/home/home_logo.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isActive ? '64px': '200px'">
        <div class="menuToggle" @click="asideMenuToggle">|||</div>
        <el-menu background-color="#333744" 
                 text-color="#fff" active-text-color="#ffd04b"
                 unique-opened
                 :collapse="isActive"
                 :collapse-transition="false"
                 router
                 :default-active="activePath">
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
                          @click="saveActivePath('/'+subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return{
      menuList: [],
      iconsObj: {
        "125" : "el-icon-user-solid",
        "103" : "el-icon-s-cooperation",
        "101" : "el-icon-s-shop",
        "102" : "el-icon-s-order",
        "145" : "el-icon-s-data"
      },
      isActive: false,
      activePath: ''
    }
  },
  created(){
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem("activePath")
  },
  methods: {
    //退出
    loginOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取左侧菜单
    async getMenuList(){
      const {data: res} = await this.$http.get("menus");
      if(res.meta.status!==200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    //折叠左侧菜单
    asideMenuToggle(){
      this.isActive = !this.isActive
    },
    //左侧menu刷新选中
    saveActivePath(activePath){
      window.sessionStorage.setItem("activePath",activePath)
      this.activePath = activePath
    }
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.menuToggle{
  color: #fff;
  letter-spacing: 0.2em;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
}
.el-menu{
  border-right: none;
}
.el-header {
  background: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 60px;
    }
  }
}
.el-aside {
  background: #333744;
}
.el-main {
  background: #eaedf1;
}
</style>