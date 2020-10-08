<template>
<el-container class="home-container">
    <el-header>
        <div>
            <img src="../assets/heima.png" alt="">
            电商后台管理系统
        </div>
        <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
        <el-aside :width="isconllapse?'64px':'200px'">
            <div class="toggle-button" @click="toggleMenu">|||</div>
            <el-menu :default-active="activePath" router collapse-transition unique-opened :collapse="isconllapse" class="el-menu-vertical-demo" background-color="#333744" text-color="#fff" active-text-color="#409eff">
                <!-- 一级菜单 -->
                <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                    <template slot="title">
                        <i :class="iconObj[item.id]"></i>
                        <span>{{item.authName}}</span>
                    </template>
                    <!-- 二级菜单 -->
                    <el-menu-item @click="getActiveStatus('/'+ subItem.path)" :index="'/'+ subItem.path" v-for="subItem in item.children" :key="subItem.id">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>{{subItem.authName}}</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-main>
            <!-- 路由占位符 -->
            <router-view></router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menuList: [],
      iconObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isconllapse: true,
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
    },
    async getMenuList () {
      const {
        data: res
      } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      else this.menuList = res.data
    },
    toggleMenu () {
      this.isconllapse = !this.isconllapse
    },
    getActiveStatus (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
    height: 100%;
}

.el-menu {
    border-right: 0;
}

.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
    padding-left: 0;

    div {
        display: flex;
        align-items: center;

        img {
            margin-right: 15px;
        }
    }
}

.el-aside {
    background-color: #333744;

    .iconfont {
        margin-right: 10px;
    }

    .toggle-button {
        background-color: #4a5064;
        font-size: 10px;
        line-height: 20px;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
        color: #fff;
    }
}

.el-main {
    background-color: #eaedf1;
}
</style>
