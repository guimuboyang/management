<template>
  <!-- 面包屑 -->
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item
      v-for="(item, index) in fromComponentbread"
      :key="index"
    >
      {{ item.name }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "bread",
  props: ["fromComponentbread"]
};
</script>

<style lang="less">
.el-breadcrumb {
  background-color: #fff;
  width: 100%;
  height: 50px;
  padding: 0 16px;
  border: 1px #efefef solid;
  box-sizing: border-box;
  box-shadow: 1px 2px 4px #bababa;
  margin-bottom: 36px;
  .el-breadcrumb__item {
    font-size: 20px;
    line-height: 50px;
  }
  .el-breadcrumb__inner {
    cursor: pointer !important;
  }
}
</style>
