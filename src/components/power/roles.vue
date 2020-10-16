<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary" @click="roleDialogVisible = true">添加用户</el-button>
            </el-col>
        </el-row>
        <el-table :data="roleList" stripe border>
            <el-table-column type="expand">
                <template slot-scope="scoped">
                    <el-row :class="['bdbottom',l1===0?'bdtop':'', 'vcenter']" v-for="(item,l1) in scoped.row.children" :key="item.id">
                        <el-col :span="5">
                            <el-tag closable @close="removeRightsById(scoped.row,item.id)">{{item.authName}}
                            </el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <el-col :span="19">
                            <el-row :class="[l2===0?'':'bdbottom' ,'vcenter']" v-for="(item2,l2) in item.children" :key="item2.id">
                                <el-col :span="6">
                                    <el-tag type="success" closable @close="removeRightsById(scoped.row,item2.id)">
                                        {{item2.authName}}
                                    </el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="18">
                                    <el-tag closable type="warning" :class="[l3===0?'':'bdbottom']" v-for="(item3,l3) in item2.children" :key="item3.id" @close="removeRightsById(scoped.row,item3.id)">
                                        {{item3.authName}}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
</el-table-column>
<el-table-column type="index" prop="序号"></el-table-column>
<el-table-column prop="roleName" label="角色名称"></el-table-column>
<el-table-column prop="roleDesc" label="描述"></el-table-column>
<el-table-column label="操作" width="300px">
    <template slot-scope="scoped">
                    <el-button size="mini" @click="showRoles(scoped.row.id)" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" type="danger" @click="deleteRole(scoped.row.id)" icon="el-icon-delete">删除</el-button>
                    <el-button size="mini" type="warning" icon="el-icon-setting" @click="allotRights(scoped.row)">分配权限</el-button>
                </template>
</el-table-column>
</el-table>
</el-card>
<el-dialog title="添加角色" :visible.sync="roleDialogVisible" @close="roleFormReset">
    <el-form :model="roleForm" :rules="roleRules" ref="roleRuleForm" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
            <el-button @click="roleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
</el-dialog>
<el-dialog title="修改角色信息" :visible.sync="editdialogVisible" @close="editFormReset">
    <el-form :model="editRoleForm" ref="editRoleRuleForm" label-width="100px">
        <el-form-item label="角色名称">
            <el-input v-model="editRoleForm.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
            <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
            <el-button @click="editdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRoles">确 定</el-button>
        </span>
</el-dialog>
<!-- 分配角色 -->
<el-dialog title="提示" :visible.sync="allotRightDialogVisible" width="50%" @close='allotRightclose()'>
    <el-tree :data="allotRight" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
    <span slot="footer" class="dialog-footer">
            <el-button @click="allotRightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="getAllotRights()">确 定</el-button>
        </span>
</el-dialog>

</div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      editRoleForm: {},
      roleForm: {
        roleName: '',
        roleDesc: ''
      },
      roleDialogVisible: false,
      editdialogVisible: false,
      roleRules: {
        roleName: [{
          required: true,
          message: '请输入角色名称',
          trigger: 'blur'
        }],
        roleDesc: [{
          required: true,
          message: '请输入角色描述',
          trigger: 'blur'
        }]
      },
      allotRightDialogVisible: false,
      allotRight: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      roleId: ''
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const {
        data: res
      } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取信息失败')
      else {
        this.roleList = res.data
      }
    },
    addRole () {
      this.$refs.roleRuleForm.validate(async valid => {
        if (!valid) return false
        else {
          const {
            data: res
          } = await this.$http.post('roles', this.roleForm)
          if (res.meta.status !== 201) return this.$message.error('添加角色失败')
          else {
            this.$message.success('添加角色成功')
            this.getRoleList()
          }
        }
      })
    },
    roleFormReset () {
      this.$refs.roleRuleForm.resetFields()
    },
    async deleteRole (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('用户取消了删除操作')
      } else {
        const {
          data: res
        } = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) return this.$message.error('删除角色失败')
        else {
          this.$message.success('删除角色成功')
          this.getRoleList()
        }
      }
    },
    async showRoles (id) {
      this.editdialogVisible = true
      const {
        data: res
      } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询用户数据失败')
      else {
        this.editRoleForm = res.data
      }
    },
    editRoles () {
      // 表单域验证
      this.$refs.editRoleRuleForm.validate(async valid => {
        if (!valid) return false
        else {
          const {
            data: res
          } = await this.$http.put('roles/' + this.editRoleForm.id, {
            roleName: this.editRoleRuleForm.roleName,
            roleDesc: this.editRoleRuleForm.roleDesc
          })
          if (res.meta.status !== 200) return this.$message.error('更新角色列表失败')
          else {
            this.$message.success('更新角色列表成功')
            this.getRoleList()
            this.editdialogVisible = false
          }
        }
      })
    },
    editFormReset () {
      this.$refs.editRoleRuleForm.resetFields()
    },
    async removeRightsById (role, rightId) {
      const resultRight = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (resultRight !== 'confirm') {
        this.$message.info('用户取消了删除')
      } else {
        const {
          data: res
        } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) {
          this.$message.error('删除权限失败')
        } else {
          this.$message.success('删除权限成功')
          role.children = res.data
        }
      }
    },
    async allotRights (role) {
      this.roleId = role.id
      const {
        data: res
      } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        this.$message.error('请求权限失败')
      } else {
        this.allotRight = res.data
      }
      this.getDefKeys(role, this.defKeys)
      console.log(this.defKeys)
      this.allotRightDialogVisible = true
    },
    // 通过递归遍历出三级节点
    getDefKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      } else {
        node.children.forEach(item => {
          this.getDefKeys(item, arr)
        })
      }
    },
    // 关闭窗口
    allotRightclose () {
      this.defKeys = []
    },
    async getAllotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const {
        data: res
      } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: idStr
      })
      if (res.meta.status !== 200) {
        this.$message.error('分配用户权限失败')
      } else {
        this.$message.success('分配用户权限成功')
        this.getRoleList()
        this.allotRightDialogVisible = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
    .el-tag {
        margin: 7px;
    }

    .bdbottom {
        border-bottom: 1px solid #eee;
    }

    .bdtop {
        border-top: 1px solid #eee;
    }

    .vcenter {
        display: flex;
        align-items: center;
    }
</style>
