<template>
  <div id="app">
    <!-- header 뷰에 key 바인딩 -->
    <router-view name="header" :key="headerKey"></router-view>

    <main>
      <fade-transition origin="center" mode="out-in" :duration="250">
        <!-- 기본 router-view에도 key 바인딩 -->
        <router-view :key="$route.fullPath"/>
      </fade-transition>
    </main>

    <router-view name="footer"></router-view>
  </div>
</template>

<script>
import { FadeTransition } from "vue2-transitions";
 
export default {
  components: { FadeTransition },
  data() {
    return {
      headerKey: 0
    };
  },
  watch: {
    // 라우트가 바뀔 때마다 key를 갱신 → 헤더 재렌더링
    $route() {
      this.headerKey++;
    }
  }
};
</script>
