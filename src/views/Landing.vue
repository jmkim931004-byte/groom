<template>
    <div>

        <div class="position-relative">
            <!-- shape Hero -->
            <section class="section-shaped my-0">
                <div class="shape shape-style-1 shape-default shape-skew">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="container shape-container d-flex">
                    <div class="col px-0">
                        <div class="row">
                            <div class="col-lg-6">
                                <h1 class="display-3  text-white">보드게임 리스트</h1>
                            </div>
                        </div>
                        <p></p>
                        <div >
                            <!-- <form class="form-inline align-items-center"> -->
                            <form class="form-inline align-items-center" @submit.prevent="searchGames">
                                <!-- 게임명 ㄱ~ㅎ 선택 -->
                                <div class="form-group mr-3">
                                    <label for="gameInitial" class="mr-2 display-4  text-white">게임명</label>
                                    <select v-model="selectedInitial" id="gameInitial" class="form-control">
                                        <option value="1,힣">전체</option>
                                        <option value="1,9">숫자</option>
                                        <option value="가,깋">ㄱ</option>
                                        <option value="나,닣">ㄴ</option>
                                        <option value="다,딯">ㄷ</option>
                                        <option value="라,맇">ㄹ</option>
                                        <option value="마,밓">ㅁ</option>
                                        <option value="바,빟">ㅂ</option>
                                        <option value="사,싷">ㅅ</option>
                                        <option value="아,잏">ㅇ</option>
                                        <option value="자,짛">ㅈ</option>
                                        <option value="차,칳">ㅊ</option>
                                        <option value="카,킿">ㅋ</option>
                                        <option value="타,팋">ㅌ</option>
                                        <option value="파,핗">ㅍ</option>
                                        <option value="하,힣">ㅎ</option>
                                    </select>
                                </div>
                                <!-- 인원수 입력 -->
                                <div class="form-group mr-3">
                                    <label for="playerCount" class="mr-2 display-4  text-white">인원수</label>
                                    <input v-model="playerCount" type="number" id="playerCount" class="form-control" min="2" max="99" placeholder="예: 4">
                                </div>
                                <button type="submit" class="btn btn-neutral text-warning">검색</button>
                                <button type="submit" class="btn btn-neutral text-warning" v-if="isLogin" @click="goToGameInfo(null)">게임추가</button>
                            </form>
                        </div>

                    </div>
                </div>
            </section>
            <!-- 1st Hero Variation -->
        </div>
        <section class="section section-lg pt-lg-0 mt--200">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-12">
                        <div class="row row-grid">
                            <template>
                                <div class="row row-grid">
                                    <div class="col-lg-4" style="margin-bottom:15px;" v-for="gamelist in boardGames" :key="gamelist.gname">
                                        <card class="border-0" hover shadow body-classes="py-5">
                                            <icon name="ni ni-planet" type="warning" rounded class="mb-1" style="display:inline-block; vertical-align:middle;"></icon>
                                            <h2 class="text-warning text-uppercase"
                                                style="display:inline-block; vertical-align:middle; margin:0;">
                                                {{ gamelist.gname }}
                                            </h2>
                                            <img :src="`img/boardgame/${gamelist.image}`" class="img-fluid floating" />
                                            <!-- <img :src="gamelist.image" class="img-fluid floating" /> -->
                                            <p></p>
                                            <div>
                                            <!-- <badge type="warning" rounded>{{ gamelist.player }} 인</badge> -->
                                            <badge type="warning" rounded>{{ gamelist.player.charAt(0) + '-' + gamelist.player.charAt(gamelist.player.length - 1) }} 인</badge>
                                            <badge type="warning" rounded>{{ gamelist.people }}인 추천</badge>
                                            </div>
                                            <base-button :tag="'a'" :href="gamelist.url" type="warning" class="mt-4">게임 규칙 영상</base-button>
                                            <base-button type="button" class="mt-4 btn-1 btn-outline-warning" v-if="isLogin" @click="goToGameInfo(gamelist.gname)">수정</base-button>
                                        </card>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from '@/eventBus';

export default {
    name: "home",
    data() {
        return {
            isLogin: false,
            selectedInitial: '1,힣',
            playerCount: '',
            boardGames: []
        };
    },
    methods: {
        async searchGames() {
        let [p_gname_s, p_gname_e] = this.selectedInitial.split(',');
        let p_player = this.playerCount ? `%${this.playerCount}%` : '%';

        try {
            const response = await axios.get('/api/boardgames', {
            params: {
                p_gname_s,
                p_gname_e,
                p_player
                }
                });
                this.boardGames = response.data;
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('API 호출 에러:', error);
            }
        },

        goToGameInfo(name) {
            // name이 null이면 새 게임 추가, 값이 있으면 수정
            this.$router.push({
            name: 'gameinfo',
            params: { name }   // null이면 /gameinfo 로 이동, 아닐 경우 /gameinfo/게임이름
            });
        }
    },
    async mounted() {
        const user = localStorage.getItem('loginUser');
        this.isLogin = !!user;
        // 로그아웃 감시
        eventBus.$on('logout', () => {
            this.isLogin = false;
        });

        let [p_gname_s, p_gname_e] = this.selectedInitial.split(',');

        let p_player = this.playerCount ? `%${this.playerCount}%` : '%';

        try {
            const response = await axios.get('/api/boardgames', {
            params: {
                p_gname_s,
                p_gname_e,
                p_player
            }
            });
            this.boardGames = response.data;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('API 호출 에러:', error);
        }
    },
    components: {}
    };
</script>
