<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-alert show-icon title="注意，只允许第三级分类设置相关参数" type="warning" :closable="false"></el-alert>
            <el-row class="cat_opt">
                选择商品分类：<el-cascader expandTrigger='hover' v-model="selectId" :options="cateList" :props="cateProps" @change="handleChange" clearable></el-cascader>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type='primary' :disabled='isDisabled'>动态参数</el-button>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only" :disabled='isDisabled'>
                    <el-button type='primary'>静态属性</el-button>
                </el-tab-pane>
              </el-tabs>
        </el-card>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                cateList: [],
                cateProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                selectId: [],
                activeName: 'many'
            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            async getCateList() {
                const {
                    data: res
                } = await this.$http.get('categories')
                if (res.meta.status !== 200) {
                    return this.$message.error('请求商品列表错误')
                } else {
                    this.cateList = res.data
                    console.log(this.cateList)
                }
            },
            async handleChange() {
                if (this.selectId.length != 3) {
                    this.selectId = []
                } else {
                    const {
                        data: res
                    } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                        params: {
                            sel: this.activeName
                        }
                    })
                    if (res.meta.status !== 200) {
                        return this.$message.error("获取参数错误")
                    } else {
                        console.log(res.data)
                    }
                }
            },
            handleClick() {

            }
        },
        computed: {
            isDisabled() {
                if (this.selectId.length !== 3) {
                    return true
                } else {
                    return false
                }
            },
            cateId() {
                if (this.selectId === 3) {
                    return this.selectId[2]
                } else {
                    return null
                }
            }
        },
    }
</script>
<style scoped lang="less">
    .cat_opt {
        margin: 10px auto;
    }
</style>