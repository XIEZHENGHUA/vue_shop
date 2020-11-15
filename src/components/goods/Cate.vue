<template>
    <div>
        <!-- 头部面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCate()">添加分类</el-button>
                </el-col>
            </el-row>
               <!-- 内容区域 -->
               <tree-table class="treeTable" :expand-type='false' :selection-type="false" :data="cateList" :columns="columns" show-index :show-row-hover="false" border>
                   <template slot="isok" slot-scope='scoped'>
                        <i class="el-icon-success" v-if="scoped.row.cat_deleted===false" style="color:lightgreen"></i>
                        <i class="el-icon-error" v-else style="color:red"></i>
                   </template>
<template slot="order" slot-scope='scoped'>
                        <el-tag size='mini'v-if="scoped.row.cat_level===0">一级</el-tag>
                        <el-tag size='mini' type='success' v-else-if="scoped.row.cat_level===1">二级</el-tag>
                        <el-tag size='mini' type='warning' v-else>三级</el-tag>
                   </template>
<template slot="opt">
                        <el-button type='primary'  size='mini' icon="el-icon-edit">编辑</el-button>
                        <el-button type='danger' size='mini' icon="el-icon-delete">删除</el-button>
                   </template>
</tree-table>
<!-- 分页区域 -->
<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
</el-pagination>

</el-card>
<!-- 添加分类对话框 -->
<el-dialog title="添加分类" :visible.sync="addCateAialogVisible" width="50%" @close="addCateClose">
    <el-form :model="addCateRuleForm" :rules="addCateRules " ref="addCateRuleForm" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateRuleForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
            <el-cascader expand-trigger="hover" :options="parentCateList" v-model="CateKeys" @change="parentCateChange" :props="parentCateprop" clearable>
            </el-cascader>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="addCateAialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirmAddCate">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>
<script>
export default {
  data () {
    return {
      // 接收返回数据
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 返回数据总条数
      total: 0,
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        type: 'template',
        template: 'isok'
      }, {
        label: '排序',
        type: 'template',
        template: 'order'
      }, {
        label: '操作',
        type: 'template',
        template: 'opt'
      }],
      addCateAialogVisible: false,
      addCateRuleForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      addCateRules: {
        cat_name: {
          required: true,
          message: '请输入分类名称',
          trigger: 'blur'
        }
      },
      parentCateList: [],
      parentCateprop: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      CateKeys: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const {
        data: res
      } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      } else {
        this.cateList = res.data.result
        this.total = res.data.total
        console.log(res.data)
        console.log(this.cateList)
      }
    },
    handleSizeChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    handleCurrentChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    showAddCate () {
      this.addCateAialogVisible = true
      this.getParentCateList()
    },
    async getParentCateList () {
      const {
        data: res
      } = await this.$http.get('categories', {
        params: {
          type: 3
        }

      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级数据失败')
      } else {
        this.parentCateList = res.data
      }
    },
    parentCateChange () {
      if (this.CateKeys.length > 0) {
        this.addCateRuleForm.cat_pid = this.CateKeys[this.CateKeys.length - 1]
        this.addCateRuleForm.cat_level = this.CateKeys.length
      } else {
        this.addCateRuleForm.cat_pid = 0
        this.addCateRuleForm.cat_level = 0
      }
    },
    confirmAddCate () {
      console.log(this.addCateRuleForm)
      // 表单域验证
      this.$refs.addCateRuleForm.validate(async vaild => {
        if (!vaild) return
        else {
          const {
            data: res
          } = await this.$http.post('categories', this.addCateRuleForm)
          if (res.meta.status !== 201) {
            return this.$message.error('添加商品信息失败')
          } else {
            this.$message.success('添加商品信息成功！')
            this.getCateList()
            this.addCateAialogVisible = false
          }
        }
      })
    },
    addCateClose () {
      this.$refs.addCateRuleForm.resetFields()
      this.CateKeys = []
      this.addCateRuleForm.cat_level = 0
      this.addCateRuleForm.cat_pid = 0
    }
  }
}
</script>
<style lang="less" scoped>
    .treeTable {
        margin: 20px 0 20px 0;
    }

    .el-cascader {
        width: 100%;
    }
</style>
