<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <el-table :data="rightsList" stripe border>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="authName" label="权限名称">
            </el-table-column>
            <el-table-column prop="path" label="路径">
            </el-table-column>
            <el-table-column prop="level" label="权限等级">
                <template slot-scope="scoped">
                    <el-tag v-if="scoped.row.level==='0'">一级</el-tag>
                    <el-tag type="warning" v-else-if="scoped.row.level==='1'">二级</el-tag>
                    <el-tag type="info" v-else>三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightList()
  },
  methods: {
    async getRightList () {
      const {
        data: res
      } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        this.$message.error('权限列表获取失败')
      } else {
        this.rightsList = res.data
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
