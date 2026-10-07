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
                <div class="col-lg-12">
                  <div class="row">
                    <div class="col-lg-6">
                        <h1 class="display-3  text-white">게임 정보 관리</h1>
                        <p class="text-white" v-if="name">현재 수정 중인 게임: {{ name }}</p>
                        <p class="text-white" v-else>새로운 게임을 추가합니다.</p>
                    </div>
                  </div>
                  <card type="secondary" shadow header-classes="bg-white pb-5" body-classes="px-lg-5 py-lg-5" class="border-0">
                    <template>
                      <form role="form">
                        <div>
                          <h2 class="text-warning text-uppercase" style="display:inline-block; vertical-align:middle; margin:0;">게임명 : </h2>
                          <base-input style="display:inline-block; vertical-align:middle; margin:10px; width:200px" v-model="boardGames.gname" :readonly="read == 'T'" ></base-input>
                        </div>
                        <div>
                          <h2 class="text-warning text-uppercase" style="display:inline-block; vertical-align:middle; margin:0;">인원 : </h2>
                          <base-input type="number" min="2" max="99" placeholder="예: 2"
                              style="display:inline-block; vertical-align:middle; margin:10px; width:70px" v-model="boardGames.player1"></base-input>
                          <h2 class="text-warning text-uppercase" style="display:inline-block; vertical-align:middle; margin:0;">~</h2>
                          <base-input type="number" min="2" max="99" placeholder="예: 3"
                              style="display:inline-block; vertical-align:middle; margin:10px; width:70px" v-model="boardGames.player2"></base-input>
                        </div>
                        <div>
                          <h2 class="text-warning text-uppercase" style="display:inline-block; vertical-align:middle; margin:0;">추천 인원 : </h2>
                          <base-input type="number" min="2" max="99" placeholder="예: 2"
                              style="display:inline-block; vertical-align:middle; margin:10px; width:70px" v-model="boardGames.people"></base-input>
                        </div>
                        <div>
                          <h2 class="text-warning text-uppercase" style="vertical-align:middle; margin:0;">규칙영상링크 : </h2>
                          <base-input style="vertical-align:middle; margin:0;" v-model="boardGames.url"></base-input>
                        </div>
                        <div>
                          <h2 class="text-warning text-uppercase" style="display:inline-block; vertical-align:middle; margin:0;">이미지</h2>
                          <base-button type="btn-1 btn-outline-warning" class="my-4" style="display:inline-block;" @click="triggerUpload">업로드</base-button>
                          <!-- 숨겨진 파일 입력 -->
                          <input type="file" ref="fileInput" accept="image/*" style="display: none" @change="previewImage"/>
                          <!-- 이미지 미리보기 -->
                          <div style="margin-top: 10px;">
                            <img :src="imagePreview" style="max-height: 200px; border: 1px solid #ccc; border-radius: 5px;" />
                          </div>
                        </div>
                        <div class="text-center">
                          <base-button type="btn-1 btn-outline-warning" class="my-4" native-type="submit" @click="cancel">취소</base-button>
                          <base-button type="btn-1 btn-outline-warning" class="my-4" native-type="submit" v-if="name" @click="del">삭제</base-button>
                          <base-button type="warning" class="my-4" native-type="submit" @click="save">저장</base-button>
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
      imagePath: '',      // 실제 파일명 또는 경로
      imagePreview: '',    // base64 미리보기
      boardGames: {},
      checkGames: {},
      read: '',
    };
  },
  props: ['name'],
  async mounted() {
    if (this.name) {
      this.read = 'T';
      let p_gname_s = this.name;
      let p_gname_e = this.name;
      let p_player = '%';

      try {
        const response = await axios.get('/api/boardgames', {
        params: {
            p_gname_s,
            p_gname_e,
            p_player
          }
        });

        this.boardGames = Array.isArray(response.data) ? response.data[0] : response.data;
        const players = this.boardGames.player.split(',').map(n => parseInt(n, 10));
        this.boardGames.player1 = players[0];
        this.boardGames.player2 = players[players.length - 1];

        // 업로드한 이미지는 data URL, 기본 이미지는 파일명이므로 public 하위 경로와 조합
        const image = this.boardGames.image;
        const imgPath = image && image.startsWith('data:') ? image : `/img/boardgame/${image}`;
        this.imagePreview = imgPath;  // 미리보기용 이미지 URL
        this.boardGames.imagePath = this.boardGames.image;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('API 호출 에러:', error);
      }
    }
  },
  methods: {
    // 업로드 버튼 클릭 시 파일 선택 창 열기
    triggerUpload() {
      this.$refs.fileInput.click();
    },

    // 파일 선택 시 미리보기 표시
    previewImage(event) {
      const file = event.target.files[0];
      if (!file) return; // 파일 선택 안 하면 종료

      this.boardGames.imagePath = file.name; // 파일명 저장
      this.boardGames.imageFile = file; // 파일 객체 저장

      const reader = new FileReader();
      reader.onload = e => {
        this.imagePreview = e.target.result; // Base64 URL 저장
      };
      reader.readAsDataURL(file);
    },

    cancel() {
        // 로그인 페이지로 이동
        this.$router.push('/landing');
    },

    async del(){
      if (this.name) {
        const proceed = window.confirm('정말 삭제하시겠습니까?');
        if (!proceed) {
          return; // 삭제 취소 시 함수 종료
        }

        let p_gname = this.name;

        try {
          await axios.post('/api/del', {
            p_gname
          })

          alert('삭제 하였습니다.');
          this.$router.push('/landing');
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('API 호출 에러:', error);
          alert('API 호출 에러:', error);
        }
      }
    },

    async save(){
      //필수값 체크
      if (!this.boardGames.gname) {
        alert('게임명을 입력해 주세요.');
        return false;
      }

      if (!this.boardGames.player1 || !this.boardGames.player2) {
        alert('게임인원 입력해 주세요.');
        return false;
      }
      if (!this.boardGames.people) {
        alert('추천인원 입력해 주세요.');
        return false;
      }
      if (!this.boardGames.url) {
        alert('규칙영상링크 입력해 주세요. 없을시 / 입력해주세요.');
        return false;
      }
      if (!this.boardGames.imagePath) {
        alert('이미지를 업로드 해주세요.');
        return false;
      }

      if (this.name) {
        let p_gname = this.boardGames.gname;
        let p_image = this.boardGames.imageFile ? this.boardGames.imageFile : null; // 새 업로드 파일 객체
        let p_image_path = this.boardGames.imagePath; // 기존 이미지명
        const start = this.boardGames.player1;
        const end = this.boardGames.player2;

        if (start > end) {
          alert('최소인원이 최대인원보다 클수 없습니다.');
          return false;
        }

        const range = [];
        for (let i = start; i <= end; i++) {
          range.push(i);
        }
        this.boardGames.player = range.join(',');

        const formData = new FormData();
        formData.append('p_gname', p_gname);
        if (p_image) {
          formData.append('p_image', p_image);  // 새로 업로드한 파일
        } else {
          formData.append('p_image_path', p_image_path); // 기존 이미지 경로 (수정 없이 그대로)
        }
        formData.append('p_player', this.boardGames.player);
        formData.append('p_people', this.boardGames.people);
        formData.append('p_url', this.boardGames.url);

        try {
          await axios.post('/api/update', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          alert('수정 완료하였습니다.');
          this.$router.push('/landing');
        } catch (error) {
          alert('API 호출 에러: ' + error.message);
        }

      } else {
        //중복데이터 확인
        let p_gname_s = this.boardGames.gname;
        let p_gname_e = this.boardGames.gname;
        let p_player = '%';
        try {
          const response = await axios.get('/api/boardgames', {
          params: {
              p_gname_s,
              p_gname_e,
              p_player
            }
          });

          if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
            let p_gname = this.boardGames.gname;
            let p_image = this.boardGames.imagePath;

            const start = this.boardGames.player1;
            const end = this.boardGames.player2;

            if (start <= end) {
              const range = [];
              for (let i = start; i <= end; i++) {
                range.push(i);
              }
              this.boardGames.player = range.join(',');
            } else {
              alert('최소인원이 최대인원보다 클수 없습니다.');
              return false;
            }

            const formData = new FormData();
            formData.append('p_gname', this.boardGames.gname);
            formData.append('p_image', this.boardGames.imageFile); // File 객체
            formData.append('p_player', this.boardGames.player);
            formData.append('p_people', this.boardGames.people);
            formData.append('p_url', this.boardGames.url);

            try {
              await axios.post('/api/insert', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
              });
              alert('신규저장 완료하였습니다.');
              this.$router.push('/landing');
            } catch (error) {
              alert('API 호출 에러: ' + error.message);
            }

          }else{
            alert('이미 같은 이름의 게임이 존재합니다.');
            return false;
          }

        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('API 호출 에러:', error);
        }
      }
    }

  }
};

</script>
<style>
</style>
