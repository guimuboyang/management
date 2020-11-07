<template>
  <div class="login_container">
    <!--登录框区域-->
    <div class="login_box">
      <!--头像区域-->
      <div class="head_image">
        <img src="../assets/images/head_image.png" alt="" />
      </div>
      <!--表单区域-->
      <el-form
        ref="loginformRef"
        class="loginForm"
        :model="loginform"
        :rules="loginformrules"
      >
        <!--用户名-->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginform.username">
          </el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginform.password"
            type="password"
          >
          </el-input>
        </el-form-item>
        <!--按钮区域-->
        <el-form-item class="btns">
          <el-button type="success" @click="login()">登陆</el-button>
          <el-button type="info" @click="loginformRef()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //表单数据绑定对象
      loginform: {
        username: "admin",
        password: "123456"
      },
      loginformrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 10, message: "长度在 5 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码", trigger: "blur" },
          { min: 6, max: 10, message: "长度在 6 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //重置表单
    loginformRef() {
      this.$refs.loginformRef.resetFields();
    },
    //登陆方法
    login() {
      this.$refs.loginformRef.validate(async valid => {
        if (valid == false) {
          return;
        } else {
          const res = await this.$http.post("login", this.loginform);
          if (res.data.meta.status !== 200) {
            return this.$message.error("登陆失败");
          } else {
            this.$message.success("登陆成功");
            sessionStorage.setItem("token", res.data.data.token);
            this.$router.push("/home");
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background: url("../assets/images/back.jpg") no-repeat 0 0;
  background-size: cover;
}
.login_box {
  width: 550px;
  height: 350px;
  background: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  opacity: 0.9;
}
.head_image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid #593c2d;
  background: #593c2d;
  position: absolute;
  left: 50%;
  top: -50%;
  transform: translate(-50%, 100%);
  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
}
.loginForm {
  position: absolute;
  bottom: 0;
  width: 100%;
  .btns {
    display: flex;
    justify-content: flex-end;
    margin-right: 20px;
  }
}
</style>
