<template>
    <section class="section section-shaped section-jm my-0">
        <div class="shape shape-style-1 shape-default">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div class="container pt-lg-md">
            <div class="row justify-content-center">
                <div class="col-lg-5">
                    <card type="secondary" shadow
                          header-classes="bg-white pb-5"
                          body-classes="px-lg-5 py-lg-5"
                          class="border-0">
                        <template>
                            <div class="text-muted text-center mb-3">
                                <small>Sign in with</small>
                            </div>
                        </template>
                        <template>
                            <form role="form" @submit.prevent="login">
                                <base-input v-model="userID"
                                            class="mb-3"
                                            placeholder="ID"
                                            addon-left-icon="ni ni-email-83">
                                </base-input>
                                <base-input v-model="userPW"
                                            type="password"
                                            placeholder="Password"
                                            addon-left-icon="ni ni-lock-circle-open">
                                </base-input>
                                <div class="text-center">
                                    <base-button type="warning" class="my-4" native-type="submit">Sign In</base-button>
                                </div>
                            </form>
                        </template>
                    </card>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import axios from 'axios'

export default {
  data() {
    return {
      userID: '',
      userPW: ''
    };
  },
    methods: {
    async login() {
      try {
        // public 폴더의 user.json 불러오기
        // const response = await axios.get('/user.json');
        const response = await axios.get('/api/login', {
            params: {
                userID: this.userID,
                userPW: this.userPW
            }
          });

        const users = response.data;

        if (!!users) {
          alert('로그인 하였습니다.');
          // 로그인 상태 저장
          localStorage.setItem('loginUser', users);
          this.$router.push('/'); // 로그인 후 landing 페이지로 이동
        } else {
          alert('아이디 또는 비밀번호가 일치하지 않습니다.');
        }
      } catch (err) {
        console.error('로그인 오류:', err);
      }
    }
  }
};
</script>
<style>
</style>
