<template>
  <div>
    <!--面包屑导航区域-->
    <bread :fromComponentbread="dataPath"></bread>
    <!--卡片区域-->
    <el-card>
      <!--搜索区域-->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            placeholder="请输入内容"
            v-model="queryinfo.query"
            clearable
            @clear="getuserList()"
          >
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="info" round @click="getuserList()">搜索 </el-button>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" class="adduserbtn" @click="isdialog = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>
      <!--信息列表区域-->
      <el-table border style="width: 100%" :data="userListdata">
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              style="display: block"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userstatechange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190px">
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              content="修改"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditdialog(scope.row.id)"
              >
              </el-button>
            </el-tooltip>
            <el-tooltip
              effect="light"
              content="删除"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-delete"
                size="mini"
                @click="showDeletetip(scope.row.id)"
              >
              </el-button>
            </el-tooltip>
            <el-tooltip
              effect="light"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-user"
                size="mini"
                @click="showSetRole(scope.row)"
              >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-size="queryinfo.pagesize"
        layout="total, prev, pager, next"
        :total="total"
      >
      </el-pagination>
      <!--添加用户区域-->
      <el-dialog
        title="添加用户"
        :visible.sync="isdialog"
        width="50%"
        center
        @close="addDialogClose()"
      >
        <span>
          <el-form
            ref="addformRef"
            :model="addform"
            label-width="70px"
            :rules="addrules"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addform.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addform.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addform.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="addform.mobile"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="adduser()">确 定</el-button>
          <el-button @click="isdialog = false">
            取 消
          </el-button>
        </span>
      </el-dialog>
      <!--修改用户区域-->
      <el-dialog
        title="修改用户信息"
        :visible.sync="editIsdialog"
        width="50%"
        center
        @close="editDialogClose()"
      >
        <span>
          <el-form
            ref="editformRef"
            :model="editform"
            label-width="70px"
            :rules="editrules"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="editform.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email" type="email">
              <el-input v-model="editform.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="editform.mobile"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="edituser()">
            确 定
          </el-button>
          <el-button @click="editIsdialog = false">
            取 消
          </el-button>
        </span>
      </el-dialog>
      <!--分配角色区域-->
      <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisible"
        width="50%"
        @close="setRoleDialogClosed"
      >
        <div>
          <p>当前用户：{{ userInfo.username }}</p>
          <p>当前角色：{{ userInfo.role_name }}</p>
          <p>
            分配角色：
            <el-select
              v-model="selectRoleId"
              filterable
              allow-create
              default-first-option
              placeholder="请选择文章标签"
            >
              <el-option
                v-for="item in rolesLsit"
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
import { isEmail } from "@/utils/validation";
import bread from "@/components/bread";
export default {
  components: {
    bread
  },
  data() {
    //验证邮箱
    let validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error("邮箱格式错误"));
      } else {
        callback();
      }
    };
    //验证手机号
    let checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      isdialog: false,
      dataPath: [{ name: "用户管理" }, { name: "用户列表" }],
      //添加用户的对象
      addform: {
        username: "",
        password: ""
      },
      //请求参数对象
      queryinfo: {
        query: "",
        pagenum: 1,
        pagesize: 3
      },
      //用户数据
      userListdata: [],
      //总页数
      total: 0,
      //对话框是否显示
      isdialog: false,
      //修改对话框是否显示
      editIsdialog: false,
      //添加用户对象验证规则
      addrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 10, message: "长度在 5 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ]
      },
      editform: {},
      editrules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ]
      },
      setRoleDialogVisible: false,
      // 当前需要被分配角色的用户
      userInfo: {},
      // 所有角色数据列表
      rolesLsit: [],
      // 已选中的角色Id值
      selectRoleId: ""
    };
  },
  created() {
    this.getuserList();
  },
  methods: {
    //获取数据
    async getuserList() {
      const res = await this.$http.get("users", { params: this.queryinfo });
      if (res.data.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      } else {
        this.total = res.data.data.total;
        this.queryinfo.pagenum = res.data.data.pagenum;
        this.userListdata = res.data.data.users;
      }
    },
    //获取分页数据
    handleCurrentChange(newpage) {
      this.queryinfo.pagenum = newpage;
      this.getuserList();
    },
    //保存用户状态的方法
    async userstatechange(newstate) {
      const res = await this.$http.put(
        `users/${newstate.id}/state/${newstate.mg_state}`
      );
      if (res.data.meta.status !== 200) {
        newstate.mg_state = !newstate.mg_state;
        return this.$message.error("更新用户状态失败");
      } else {
        return this.$message.success(res.data.meta.msg);
      }
    },
    //关闭添加对话框并且重置对话框的方法
    addDialogClose() {
      this.$refs.addformRef.resetFields();
    },
    //添加用户
    adduser() {
      this.$refs.addformRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          const res = await this.$http.post("users", this.addform);
          if (res.data.meta.status !== 201) {
            return this.$message.error("添加用户失败,请检查用户名是否已存在");
          } else {
            this.isdialog = false;
            this.$message.success("添加用户成功");
            this.getuserList();
          }
        }
      });
    },
    //显示修改对话框
    async showEditdialog(id) {
      const res = await this.$http.get(`users/${id}`);
      this.editform = res.data.data;
      this.editIsdialog = true;
    },
    //关闭修改对话框并且重置对话框的方法
    editDialogClose() {
      this.$refs.editformRef.resetFields();
    },
    //修改用户
    edituser() {
      this.$refs.editformRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          const res = await this.$http.put(`users/${this.editform.id}`, {
            email: this.editform.email,
            mobile: this.editform.mobile
          });
          if (res.data.meta.status !== 200) {
            return this.$message.error("修改用户失败");
          } else {
            this.editIsdialog = false;
            this.$message.success("修改用户成功");
            this.getuserList();
          }
        }
      });
    },
    //删除用户
    async showDeletetip(id) {
      const confirmresult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmresult == "confirm") {
        const res = await this.$http.delete(`users/${id}`);
        if (res.data.meta.status !== 200) {
          this.$message.error("删除失败");
        } else {
          this.$message.success("删除成功");
          this.getuserList();
        }
      } else {
        return;
      }
    },
    // 展示分配角色的对话框
    async showSetRole(role) {
      this.userInfo = role;
      // 展示对话框之前，获取所有角色列表
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败！");
      }
      this.rolesLsit = res.data;
      this.setRoleDialogVisible = true;
    },
    // 分配角色
    async saveRoleInfo() {
      if (!this.selectRoleId) {
        return this.$message.error("请选择要分配的角色");
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectRoleId
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("更新用户角色失败！");
      }
      this.$message.success("更新角色成功！");
      this.getuserList();
      this.setRoleDialogVisible = false;
    },
    // 分配角色对话框关闭事件
    setRoleDialogClosed() {
      this.selectRoleId = "";
      this.userInfo = {};
    }
  }
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-table {
  margin-top: 20px;
  font-size: 14px;
}
.el-switch {
  height: 25px;
}
.adduserbtn {
  position: absolute;
  right: 10px;
}
</style>
