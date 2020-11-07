<template>
  <div>
    <!--面包屑导航区域-->
    <bread :fromComponentbread="dataPath"></bread>
    <!--卡片区域-->
    <el-card class="box-card">
      <el-button type="danger" round @click="isroledialog = true">
        添加角色
      </el-button>
      <!--角色区域-->
      <el-table :data="rolesList" style="width: 100%" stripe>
        <el-table-column type="expand" label="权限详情" width="100px">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '']"
              v-for="(item1, index1) in scope.row.children"
              :key="index1"
            >
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="deleterights(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级和三级权限-->
              <el-col :span="19">
                <!--渲染二级-->
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="index2"
                  :class="[index2 === 0 ? '' : 'bdtop']"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="deleterights(scope.row, item2.id)"
                    >
                      {{ item1.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!--渲染三级权限-->
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="(item3, index3) in item2.children"
                      :key="index3"
                      @close="deleterights(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
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
                @click="showRoledialog(scope.row.id)"
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
              content="分配权限"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-setting"
                size="mini"
                @click="showRights(scope.row)"
              >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--添加角色区域-->
      <el-dialog
        title="添加角色"
        :visible.sync="isroledialog"
        width="50%"
        center
        @close="roleDialogClose()"
      >
        <span>
          <el-form
            ref="roleformRef"
            :model="roleform"
            label-width="80px"
            :rules="rolerules"
          >
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleform.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="roleform.roleDesc"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addrole()">确 定</el-button>
          <el-button @click="isroledialog = false">
            取 消
          </el-button>
        </span>
      </el-dialog>
      <!--修改角色-->
      <el-dialog
        title="修改角色"
        :visible.sync="isEditRoledialog"
        width="50%"
        center
        @close="EditroleDialogClose()"
      >
        <span>
          <el-form
            ref="EditroleformRef"
            :model="Editroleform"
            label-width="80px"
            :rules="rolerules"
          >
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="Editroleform.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="Editroleform.roleDesc"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="Editrole()">确 定</el-button>
          <el-button @click="isEditRoledialog = false">
            取 消
          </el-button>
        </span>
      </el-dialog>
      <!--分配权限对话框-->
      <el-dialog
        title="分配权限"
        :visible.sync="showrightdialog"
        width="50%"
        @close="showrightdialogclose()"
      >
        <el-tree
          :data="rightList"
          :props="treeprop"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="treekey"
          ref="treeRef"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showrightdialog = false">取 消</el-button>
          <el-button type="primary" @click="addrights()">确 定 </el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import bread from "@/components/bread";
export default {
  components: {
    bread
  },
  data() {
    return {
      dataPath: [{ name: "权限管理" }, { name: "角色列表" }],
      //角色列表
      rolesList: [],
      //添加角色对话框的布尔值
      isroledialog: false,
      //修改角色对话框的布尔值
      isEditRoledialog: false,
      //添加角色的对象参数
      roleform: {
        roleName: "",
        roleDesc: ""
      },
      //修改角色的对象参数
      Editroleform: {},
      //验证规则
      rolerules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 6 个字符", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 5, max: 10, message: "长度在 5 到 10 个字符", trigger: "blur" }
        ]
      },
      //所有权限数组
      rightList: [],
      //展示权限分配对话框
      showrightdialog: false,
      //树形控件展示的内容
      treeprop: {
        label: "authName",
        children: "children"
      },
      //目前已有权限的数组id
      treekey: [],
      //角色id
      roleid: ""
    };
  },
  created() {
    this.getrolesList();
  },
  methods: {
    //获取角色列表
    async getrolesList() {
      const res = await this.$http.get("roles");
      if (res.data.meta.status !== 200) {
        return $this.message.erroe("获取角色列表失败");
      } else {
        this.rolesList = res.data.data;
      }
    },
    //修改角色信息
    async showRoledialog(id) {
      this.isEditRoledialog = true;
      const res = await this.$http.get(`roles/${id}`);
      this.Editroleform = res.data.data;
    },
    //重置添加角色对话框
    roleDialogClose() {
      this.$refs.roleformRef.resetFields();
    },
    //重置修改角色对话框
    EditroleDialogClose() {
      this.$refs.EditroleformRef.resetFields();
    },
    showrightdialogclose() {
      this.treekey = [];
    },
    //添加角色
    addrole() {
      this.$refs.roleformRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("请输入正确的格式");
        } else {
          const res = await this.$http.post("roles", this.roleform);
          if (res.data.meta.status !== 201) {
            return this.$message.error("添加角色失败");
          } else {
            this.$message.success("添加角色成功");
            this.isroledialog = false;
            this.getrolesList();
          }
        }
      });
    },
    //修改角色
    Editrole() {
      this.$refs.EditroleformRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("请输入正确的格式");
        } else {
          const res = await this.$http.put(
            `roles/${this.Editroleform.roleId}`,
            this.Editroleform
          );
          if (res.data.meta.status !== 200) {
            return this.$message.error("修改角色信息失败");
          } else {
            this.$message.success("修改角色信息成功");
            this.isEditRoledialog = false;
            this.getrolesList();
          }
        }
      });
    },
    //删除角色
    async showDeletetip(id) {
      const confirmresult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmresult == "confirm") {
        const res = await this.$http.delete(`roles/${id}`);
        if (res.data.meta.status !== 200) {
          this.$message.error("删除失败");
        } else {
          this.$message.success("删除成功");
          this.getrolesList();
        }
      } else {
        return;
      }
    },
    //删除权限
    async deleterights(roleId, rightsId) {
      const confirmresult = await this.$confirm(
        "此操作将删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmresult !== "confirm") {
        return;
      } else {
        const res = await this.$http.delete(
          `roles/${roleId.id}/rights/${rightsId}`
        );
        if (res.data.meta.status !== 200) {
          this.$message.error("删除权限失败");
        } else {
          this.$message.success("删除成功");
          roleId.children = res.data.data;
        }
      }
    },
    //获取权限分配对话框
    async showRights(role) {
      this.roleid = role.id;
      const { data: res } = await this.$http.get("rights/tree");
      this.rightList = res.data;
      this.getrights(role, this.treekey);
      this.showrightdialog = true;
    },
    //分配权限
    async addrights() {
      const key = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const idstr = key.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleid}/rights`,
        {
          rids: idstr
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败");
      } else {
        this.$message.success("分配权限成功");
        this.showrightdialog = false;
        this.getrolesList();
      }
    },
    //通过递归获取当前已有的权限
    getrights(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      } else {
        node.children.forEach(item => this.getrights(item, arr));
      }
    }
  }
};
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
.el-table {
  margin-top: 20px;
}
.el-row {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 15px 10px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>
