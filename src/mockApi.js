// 백엔드 서버 없이 동작하도록 /api/* 요청을 브라우저에서 처리하는 axios 어댑터
// 데이터는 localStorage 에 저장되며, 업로드 이미지는 base64(data URL)로 저장된다.
import axios from 'axios';

const STORAGE_KEY = 'groom.boardgames';

// 로그인 계정 (필요 시 수정)
const USERS = [{ userID: 'admin', userPW: '1234' }];

// 최초 실행 시 기본 데이터 (public/img/boardgame 이미지 사용)
const SEED = [
  { gname: '러브레터', image: 'love.jpeg', player: '2,3,4,5,6', people: '4', url: '/' },
  { gname: '미니빌2', image: 'mini.jpeg', player: '2,3,4,5', people: '3', url: '/' },
  { gname: '펭귄얼음깨기', image: 'panice.png', player: '2,3,4', people: '4', url: '/' },
  { gname: '퍼레이드', image: 'parade.png', player: '2,3,4,5,6', people: '4', url: '/' }
];

function load() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  save(SEED);
  return SEED.slice();
}

function save(games) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  } catch (e) {
    throw new Error('저장 공간이 부족합니다. 더 작은 이미지를 사용해 주세요.');
  }
}

// SQL LIKE 패턴('%3%')을 정규식으로 변환
function likeToRegExp(pattern) {
  const escaped = String(pattern).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp('^' + escaped.replace(/%/g, '.*').replace(/_/g, '.') + '$');
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function parseBody(data) {
  if (data instanceof FormData) {
    const body = {};
    data.forEach((value, key) => { body[key] = value; });
    return body;
  }
  return typeof data === 'string' ? JSON.parse(data || '{}') : (data || {});
}

const routes = {
  'GET /api/login': ({ userID, userPW }) => {
    const user = USERS.find(u => u.userID === userID && u.userPW === userPW);
    return user ? user.userID : '';
  },

  'GET /api/boardgames': ({ p_gname_s = '1', p_gname_e = '힣', p_player = '%' }) => {
    const playerRe = likeToRegExp(p_player);
    return load()
      .filter(g => g.gname.charAt(0) >= p_gname_s && g.gname.charAt(0) <= p_gname_e)
      .filter(g => playerRe.test(g.player))
      .sort((a, b) => a.gname.localeCompare(b.gname));
  },

  'POST /api/insert': async body => {
    const games = load();
    games.push({
      gname: body.p_gname,
      image: body.p_image instanceof File ? await readFile(body.p_image) : body.p_image,
      player: body.p_player,
      people: body.p_people,
      url: body.p_url
    });
    save(games);
    return { result: 'OK' };
  },

  'POST /api/update': async body => {
    const games = load();
    const game = games.find(g => g.gname === body.p_gname);
    if (game) {
      game.image = body.p_image instanceof File ? await readFile(body.p_image) : body.p_image_path;
      game.player = body.p_player;
      game.people = body.p_people;
      game.url = body.p_url;
      save(games);
    }
    return { result: 'OK' };
  },

  'POST /api/del': body => {
    save(load().filter(g => g.gname !== body.p_gname));
    return { result: 'OK' };
  }
};

const defaultAdapter = axios.getAdapter(axios.defaults.adapter);

export default async function mockAdapter(config) {
  const method = (config.method || 'get').toUpperCase();
  const path = (config.url || '').split('?')[0];
  const handler = routes[`${method} ${path}`];

  if (!handler) {
    if (path.startsWith('/api/')) {
      throw new Error(`Mock API에 정의되지 않은 요청입니다: ${method} ${path}`);
    }
    return defaultAdapter(config);
  }

  const input = method === 'GET' ? (config.params || {}) : parseBody(config.data);
  const data = await handler(input);
  return { data, status: 200, statusText: 'OK', headers: {}, config, request: {} };
}
