<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <el-row gutter=30>
            <el-col :span="8">
                <el-input clearable placeholder="请输入内容" v-model="queryInfo.query" @clear="getUserList">
                    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
            </el-col>
        </el-row>
        <el-table :data="userList" stripe border>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="username" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="180">
            </el-table-column>
            <el-table-column prop="mobile" label="电话">
            </el-table-column>
            <el-table-column prop="role_name" label="角色">
            </el-table-column>
            <el-table-column prop="mg_state" label="状态">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180px">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showUser(scope.row.id)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
                    <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="fasle">
                        <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </el-card>
    <el-dialog title="添加用户" :visible.sync="dialogVisible" @close="formReset">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
                <el-input v-model="ruleForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="修改用户信息" :visible.sync="editdialogVisible" @close="editFormReset">
        <el-form :model="editForm" :rules="editFormrules" ref="editRuleForm" label-width="70px">
            <el-form-item label="用户名">
                <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUsers">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    var checkEmail = (rule, value, cb) => {
      const EmailRule = /^[A-Za-z0-9]+@([A-Za-z0-9_-])+(\.[A-Za-z0-9_-])+/
      if (!EmailRule.test(value)) {
        return cb(new Error('请输入正确的邮箱'))
      } else cb()
    }
    var checkMobile = (rule, value, cb) => {
      const MobileRule = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (!MobileRule.test(value)) {
        return cb(new Error('请输入正确的电话'))
      } else cb()
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      editdialogVisible: false,
      editForm: {},
      ruleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 10,
          message: '长度在 3 到 10 个字符',
          trigger: 'blur'
        }
        ],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        },
        {
          min: 6,
          max: 15,
          message: '长度在 6 到 15 个字符',
          trigger: 'blur'
        }
        ],
        email: [{
          required: true,
          message: '请输入邮箱',
          trigger: 'blur'
        }, {
          validator: checkEmail,
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          message: '请输入电话',
          trigger: 'blur'
        }, {
          validator: checkMobile,
          trigger: 'blur'
        }]
      },
      editFormrules: {
        email: [{
          required: true,
          message: '请输入邮箱',
          trigger: 'blur'
        }, {
          validator: checkEmail,
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          message: '请输入电话',
          trigger: 'blur'
        }, {
          validator: checkMobile,
          trigger: 'blur'
        }]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const {
        data: res
      } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表数据失败')
      else {
        this.userList = res.data.users
        this.total = res.data.total
      }
      console.log(this.userList)
      console.log(this.total)
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getUserList()
    },
    async userStateChange (userState) {
      const {
        data: res
      } = await this.$http.put(`users/${userState.id}/state/${userState.mg_state}`)
      if (res.meta.status !== 200) {
        this.userList.mg_state = !this.userList.mg_state
        this.$message.error('更新用户状态失败')
      } else {
        this.$message.success('更新用户状态成功')
      }
    },
    formReset () {
      this.$refs.ruleForm.resetFields()
    },
    // 表单域验证
    addUser () {
      this.$refs.ruleForm.validate(async vaild => {
        if (!vaild) return false
        else {
          const {
            data: res
          } = await this.$http.post('users', this.ruleForm)
          if (res.meta.status !== 201) {
            this.$message.error('添加用户失败')
          } else {
            this.$message.success('添加用户成功')
            this.getUserList()
          }
        }
      })
    },
    async showUser (id) {
      this.editdialogVisible = true
      const {
        data: res
      } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询用户数据失败')
      else {
        this.editForm = res.data
      }
    },
    // 监听用户修改重置函数
    editFormReset () {
      this.$refs.editRuleForm.resetFields()
    },
    editUsers () {
      this.$refs.editRuleForm.validate(async vaild => {
        if (!vaild) return false
        else {
          const {
            data: res
          } = await this.$http.put('users/' + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          console.log(res)
          if (res.meta.status !== 200) {
            this.$message.error('更新用户信息失败')
          } else {
            this.$message.success('更新用户信息成功')
            this.editdialogVisible = false
            this.getUserList()
          }
        }
      })
    },
    async deleteUser (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('用户取消了删除操作')
      } else {
        const {
          data: res
        } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) {
          this.$message.error('删除用户失败')
        } else {
          this.$message.success('删除用户成功')
          this.getUserList()
        }
      }
    }

  }
}
</script>

<style lang="less" scoped>

</style>>
