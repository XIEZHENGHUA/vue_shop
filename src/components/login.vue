<template>
<div class="login_container">
    <div class="login_box">
        <!-- 头部 -->
        <div class="avator_box">
            <img src="../assets/logo.png" alt="" />
        </div>
        <!-- 表单区 -->
        <el-form ref="LoginFormRef" :rules="loginFormRules" label-width="0" class="login" :model="loginForm">
            <!-- 用户名 -->
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-3702mima"></el-input>
            </el-form-item>
            <el-form-item class="btns">
                <el-button type="primary" @click="Login">登录</el-button>
                <el-button type="info" @click="LoginFormRef">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      // 登陆表单的数据对象
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        //   用户名验证
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
        ]
      }
    }
  },
  //   表单重置
  methods: {
    LoginFormRef () {
      this.$refs.LoginFormRef.resetFields()
    },
    // 登录验证
    Login () {
      this.$refs.LoginFormRef.validate(async (valid) => {
        if (!valid) return
        const {
          data: res
        } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          this.$message.error('登录失败')
        } else {
          this.$message.success('登陆成功')
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}

.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avator_box {
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        padding: 10px;
        height: 130px;
        width: 130px;
        border-radius: 50%;
        border: 1px solid #eee;
        box-shadow: 0 0 10px #ddd;

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }

    .login {
        position: absolute;
        bottom: 0;
        padding: 0 20px;
        width: 100%;
        box-sizing: border-box;

        .btns {
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>
