<template>
    <header class="header-global">
        <base-nav class="navbar-main" transparent type="" effect="light" expand>
            <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
                <img src="img/brand/white1.png" alt="logo">
            </router-link>

            <div class="row" slot="content-header" slot-scope="{closeMenu}">
                <div class="col-6 collapse-brand">
                    <a>  <!-- href="https://demos.creative-tim.com/vue-argon-design-system/documentation/" -->
                        <img src="img/brand/blue2.png">
                    </a>
                </div>
                <div class="col-6 collapse-close">
                    <close-button @click="closeMenu"></close-button>
                </div>
            </div>

            <ul class="navbar-nav align-items-lg-center ml-lg-auto">

                <a href="#" data-toggle="dropdown" role="button" class="nav-link">
                    <router-link to="/landing" class="nav-link-inner--text"> board game List</router-link>
                </a>

                <li class="nav-item d-lg-block ml-lg-4" v-if="!isLogin">
                    <router-link to="/login" class="btn btn-neutral btn-icon">
                        <span class="nav-link-inner--text text-warning">관리자 로그인</span>
                    </router-link >
                </li>

                <li class="nav-item d-lg-block ml-lg-4" v-else>
                    <button type="submit" class="btn btn-neutral text-warning"  @click="logout">로그아웃</button>
                </li>
            </ul>
        </base-nav>
    </header>
</template>
<script>
import BaseNav from "@/components/BaseNav";
import BaseDropdown from "@/components/BaseDropdown";
import CloseButton from "@/components/CloseButton";
import { eventBus } from '@/eventBus';

export default {
  components: {
    BaseNav,
    CloseButton,
    BaseDropdown
  },
  data() {
    return {
      isLogin: false
    };
  },
  mounted() {
    // 로그인 여부를 localStorage에서 판단
    const user = localStorage.getItem('loginUser');
    this.isLogin = !!user; // user가 존재하면 true, 없으면 false
  },
  methods: {
    logout() {
        alert('로그아웃 하였습니다.');
        // 로그인 정보 제거
        localStorage.removeItem('loginUser');
        eventBus.$emit('logout'); // 로그아웃 이벤트 발생
        this.isLogin = false;
        // 로그인 페이지로 이동
        // this.$router.push('/');
    }
  }
};
</script>
<style>
</style>
