# 🍊 오산 귤방 🎲

**오산 귤방**은 경기도 오산에서 모이는 취미 보드게임 모임입니다.
처음 오시는 분도 부담 없이 함께할 수 있도록, 보유한 보드게임과 규칙 영상을 이 사이트에 정리해 두었습니다.

- 💬 **카카오톡 오픈채팅**: <https://open.kakao.com/o/gFrwnIjg>

## 📍 오시는 길

- **주소**: 경기 오산시 대원로 13-1 3층
- **대중교통**: 오산역 1번 출구에서 도보 5분
- 지도: [카카오맵](https://m.map.kakao.com/actions/searchView?q=%EA%B2%BD%EA%B8%B0%20%EC%98%A4%EC%82%B0%EC%8B%9C%20%EB%8C%80%EC%9B%90%EB%A1%9C%2013-1%203%EC%B8%B5) · [네이버지도](https://m.map.naver.com/search?query=%EA%B7%A4%EB%B0%A9)

### 🚗 주차 안내

건물에 주차 공간이 없습니다. 근처 공영주차장을 이용해 주세요.

- 문화의거리 제2공영주차장
- 오산역 환승 공영주차장

## 🎲 사이트에서 할 수 있는 것

- **보드게임 리스트**: 모임에서 보유한 보드게임을 한눈에 볼 수 있습니다.
- **검색**: 게임 이름 첫 글자(ㄱ~ㅎ, 숫자)와 플레이 인원수로 골라 볼 수 있습니다.
- **게임 정보**: 플레이 가능 인원, 추천 인원, 규칙 설명 영상 링크를 제공합니다.

모바일에 최적화 되어있습니다.

---

## 🛠 개발 정보

Vue 2 + [Vue Argon Design System](https://github.com/creativetimofficial/vue-argon-design-system)(Bootstrap 4) 기반의 정적 사이트입니다. 별도 백엔드 서버 없이 동작합니다.

### 실행

```bash
npm install
npm run serve   # 개발 서버 (http://localhost:8080)
npm run build   # 배포용 빌드 → dist/
```

`dist/` 폴더를 그대로 정적 호스팅(GitHub Pages 등)에 올리면 됩니다. 상대 경로로 빌드되므로 하위 경로에 올려도 동작합니다.

### 데이터 관리

- 게임 데이터는 [`src/api/boardgameApi.js`](src/api/boardgameApi.js)에서 관리합니다.
- 기본 게임 목록은 `SEED_GAMES`, 관리자 계정은 `ADMIN_USERS`에서 수정합니다.
- 게임 이미지는 `public/img/boardgame/`에 넣고 파일명을 `image` 값으로 지정합니다.
- 사이트에서 추가·수정한 내용은 **해당 브라우저(localStorage)에만 저장**되며 다른 방문자에게는 보이지 않습니다. 모두에게 보여야 하는 변경은 `SEED_GAMES`에 반영해 주세요.

### 주요 파일

```
src/
├── api/boardgameApi.js       # 게임 데이터 · 로그인 처리
├── layout/AppHeader.vue      # 상단 메뉴
├── views/
│   ├── components/Hero.vue   # 메인 (소개 · 오시는 길)
│   ├── Landing.vue           # 보드게임 리스트
│   ├── Gameinfo.vue          # 게임 추가 · 수정
│   └── Login.vue             # 관리자 로그인
└── assets/scss/custom/_groom.scss  # 사이트 전용 스타일
```

## 라이선스

UI는 Creative Tim의 [Vue Argon Design System](https://github.com/creativetimofficial/vue-argon-design-system)을 기반으로 합니다.
Copyright © 2018 Creative Tim — [MIT License](https://github.com/creativetimofficial/vue-argon-design-system/blob/master/LICENSE.md)
