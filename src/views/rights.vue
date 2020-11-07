<template>
  <div>
    <!--面包屑导航区域-->
    <bread :fromComponentbread="dataPath"></bread>
    <!--权限列表数据区域-->
    <el-table :data="rightsList" stripe style="width: 100%">
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="authName" label="权限名称"> </el-table-column>
      <el-table-column prop="path" label="路径"> </el-table-column>
      <el-table-column prop="level" label="权限等级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level == 0">一级权限</el-tag>
          <el-tag type="success" v-else-if="scope.row.level == 1">
            二级权限
          </el-tag>
          <el-tag type="warning" v-else>三级权限</el-tag>
        </template>
      </el-table-column>
    </el-table>
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
      dataPath: [{ name: "权限管理" }, { name: "权限列表" }],
      rightsList: []
    };
  },
  created() {
    this.getrightsList();
  },
  methods: {
    async getrightsList() {
      const res = await this.$http.get("rights/list");
      if (res.data.meta.status !== 200) {
        return this.$message.error("获取权限列表失败");
      } else {
        this.rightsList = res.data.data;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 20px;
}
</style>
