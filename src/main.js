/*
Copyright 2019 Tom Peters

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createStore } from 'vuex'
import App from './App.vue'
import AuthPlugin from './plugins/auth'
import Home from "@/components/Home"
import Auth0Callback from "@/components/Auth0Callback"
import HomeHeader from "@/components/HomeHeader"
import About from "@/components/About"
import TermsOfService from "@/components/TermsOfService"
import PrivacyPolicy from "@/components/PrivacyPolicy"
import YourAccount from "@/components/YourAccount"
import LogIn from "@/components/LogIn"
import TipJar from "@/components/TipJar.vue"
import Pool from "@/components/Pool"
import PoolGrid from "@/components/PoolGrid"
import CreatePool from "@/components/CreatePool"
import accessTokenManager from "@/models/accessTokenManager"
import sqmgrClient from "@/models/sqmgrClient"
import PoolJoin from "@/components/PoolJoin"
import CookiesPolicy from "@/components/CookiesPolicy"
import GuestAccount from "@/components/GuestAccount"
import loadingBar from "@/utils/loadingBar.ts"
import PoolGridAll from "@/components/PoolGridAll"
import authService from "@/models/authService"
import './register-service-worker'

const store = createStore({
    state() {
        return {
            primarySquare: null,
            highlightSquares: {},
        }
    },
    mutations: {
        primarySquare(state, data) {
            state.primarySquare = data
        },
        highlightSquares(state, data) {
            state.highlightSquares = {...data}
        },
    },
})

const routes = [
    {
        path: '/',
        components: {
            default: Home,
            header: HomeHeader,
        },
        meta: {
            description: 'SqMGR is a free, online football squares pool manager.',
        },
    },
    {path: '/callback', component: Auth0Callback},
    {path: '/about', component: About, meta: {title: 'About'}},
    {path: '/terms', component: TermsOfService, meta: {title: 'Terms of Service'}},
    {path: '/privacy', component: PrivacyPolicy, meta: {title: 'Privacy Policy'}},
    {path: '/cookies', component: CookiesPolicy, meta: {title: 'Cookies Policy'}},
    {path: '/login', component: LogIn, meta: {title: 'Login'}},
    {path: '/tipjar', component: TipJar, meta: {title: 'Tip Jar'}},
    {path: '/account', component: YourAccount, meta: {requireLogin: true, title: 'Your Account'}},
    {path: '/guest-account', component: GuestAccount, meta: {requireGuestAccount: true, title: 'Guest Account'}},
    {path: '/create', component: CreatePool, meta: {requireLogin: true, title: 'Create Squares Pool'}},
    {path: '/pool/:token', component: Pool, props: true, meta: {requirePoolMembership: true}},
    {path: '/pool/:token/join', component: PoolJoin, props: true},
    {path: '/pool/:token/game/all', component: PoolGridAll, props: true, meta: {requirePoolMembership: true}},
    {path: '/pool/:token/game/:gridId', component: PoolGrid, props: true, meta: {requirePoolMembership: true}},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {left: 0, top: 0}
        }
    },
})

router.beforeEach(async (to) => {
    loadingBar.start()
    if (to.meta.title) {
        document.title = `${to.meta.title} - SqMGR`
    } else {
        document.title = 'SqMGR - The Football Squares Pool Manager'
    }

    if (to.meta.description) {
        document.querySelector('meta[name="description"]').content = to.meta.description
    }

    if (to.meta.requireLogin) {
        try {
            await authService.loadProfile()
        } catch (e) {
            return `/login?target=${encodeURIComponent(to.path)}`
        }

        return true
    }

    if (to.meta.requireGuestAccount) {
        if (!accessTokenManager.getGuestAccessToken()) {
            return '/'
        }

        return true
    }

    if (to.meta.requirePoolMembership) {
        try {
            await accessTokenManager.getAccessToken(true)
            to.params.initialPool = await sqmgrClient.getPoolByToken(to.params.token)
        } catch (e) {
            return `/pool/${to.params.token}/join?target=${encodeURIComponent(to.path)}`
        }
    }

    return true
})

router.afterEach(() => {
    loadingBar.stop()
})

authService.initAuth0()
    .then(() => {
        const app = createApp(App)
        app.use(router)
        app.use(store)
        app.use(AuthPlugin)
        app.mount('#app')
    })
