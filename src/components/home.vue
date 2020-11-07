<template>
  <el-container class="home_container">
    <!--头部区域-->
    <el-header>
      <div class="head_left">
        <div><img src="../assets/images/head_image.png" alt="" /></div>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="warning" round size="small" @click="loginOut()"
        >退出系统</el-button
      >
    </el-header>
    <el-container>
      <!--侧边导航区域-->
      <el-aside :width="asidewidth + 'px'">
        <div class="toggle_btn" @click="togglecollapse">|||</div>
        <el-menu
          background-color="#DDD6C1"
          text-color="#786454"
          active-text-color="#E6A23C"
          unique-opened
          :collapse="iscollapse"
          :collapse-transition="false"
          router
          :default-active="activepath"
        >
          <!--一级菜单-->
          <el-submenu
            :index="item.id + ''"
            v-for="(item, index) in menuList"
            :key="index"
          >
            <template slot="title">
              <i :class="iconfontobj[index]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item
              :index="'/' + sunitem.path + ''"
              v-for="(sunitem, index) in item.children"
              :key="index"
              @click="savelight('/' + sunitem.path)"
            >
              <template slot="title">
                <i class="el-icon-caret-right"></i>
                <span>{{ sunitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧主体内容区域-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      //一级图标对象
      iconfontobj: {
        "0": "el-icon-user-solid",
        "1": "el-icon-s-opportunity",
        "2": "el-icon-s-grid",
        "3": "el-icon-document-copy",
        "4": "el-icon-s-data"
      },
      iscollapse: false,
      asidewidth: "200",
      activepath: ""
    };
  },
  created() {
    this.getMenuList();
    this.activepath = sessionStorage.getItem("activepath");
  },
  methods: {
    loginOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
      this.$message.warning("退出成功");
    },
    async getMenuList() {
      const res = await this.$http.get("menus");
      this.menuList = res.data.data;
    },
    togglecollapse() {
      this.iscollapse = !this.iscollapse;
      if (this.iscollapse == true) {
        this.asidewidth = 65;
      } else {
        this.asidewidth = 200;
      }
    },
    savelight(activepath) {
      window.sessionStorage.setItem("activepath", activepath);
      this.activepath = activepath;
    }
  }
};
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background: #d3cbb7;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  .head_left {
    display: flex;
    line-height: 60px;
    color: #fff;
    font-size: 20px;
    font-weight: 600;
  }
  .head_left span {
    margin-left: 20px;
  }
  .el-button {
    height: 40px;
    margin-top: 10px;
  }
}
.el-aside {
  background: #ddd6c1;
  transition: all 0.5s;
  .el-menu {
    border-right: 0;
  }
  .toggle_btn {
    background: #7d6b5a;
    opacity: 0.8;
    color: #fff;
    text-align: center;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
  }
}
.el-main {
  background: #fdf6e3;
}
</style>
