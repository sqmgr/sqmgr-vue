/*
Copyright 2019 Tom Peters

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import AuthPlugin from './plugins/auth'
import accessTokenManager from "@/models/accessTokenManager"
import sqmgrClient from "@/models/sqmgrClient"
import authService from "@/models/authService"
import './assets/forms.css'

// Keep eager: Home, HomeHeader, Auth0Callback (critical path)
import Home from "@/components/pages/Home"
import HomeHeader from "@/components/pages/HomeHeader"
import Auth0Callback from "@/components/auth/Auth0Callback"

// Lazy load everything else
const ResourcesIndex = () => import("@/components/pages/resources/ResourcesIndex")
const HowFootballSquaresWork = () => import("@/components/pages/resources/HowFootballSquaresWork")
const SettingUpPool = () => import("@/components/pages/resources/SettingUpPool")
const LinkedEventsAndPayouts = () => import("@/components/pages/resources/LinkedEventsAndPayouts")
const MultipleGamesAndRollover = () => import("@/components/pages/resources/MultipleGamesAndRollover")
const BestNumbers = () => import("@/components/pages/resources/BestNumbers")
const SuperBowlSquares = () => import("@/components/pages/resources/SuperBowlSquares")
const About = () => import("@/components/pages/About")
const HowItWorks = () => import("@/components/pages/HowItWorks")
const TermsOfService = () => import("@/components/pages/TermsOfService")
const PrivacyPolicy = () => import("@/components/pages/PrivacyPolicy")
const CookiesPolicy = () => import("@/components/pages/CookiesPolicy")
const ReleaseNotes = () => import("@/components/pages/ReleaseNotes")
const LogIn = () => import("@/components/auth/LogIn")
const TipJar = () => import("@/components/pages/TipJar.vue")
const YourAccount = () => import("@/components/auth/YourAccount")
const GuestAccount = () => import("@/components/auth/GuestAccount")
const CreatePool = () => import("@/components/pool/CreatePool")
const Pool = () => import("@/components/pool/Pool")
const PoolJoin = () => import("@/components/pool/PoolJoin")
const PoolGrid = () => import("@/components/pool/PoolGrid")
const PoolGridAll = () => import("@/components/pool/PoolGridAll")
const Admin = () => import("@/components/admin/Admin")
const AdminUser = () => import("@/components/admin/AdminUser")
const NotFound = () => import("@/components/pages/NotFound")

// Unregister any existing service workers from previous versions
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => registration.unregister())
    })
}

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
    {path: '/resources', component: ResourcesIndex, meta: {title: 'Football Squares Resources', description: 'Guides covering how football squares work, setting up a pool on SqMGR, live event linking, payout configuration, and strategy.'}},
    {path: '/resources/how-football-squares-work', component: HowFootballSquaresWork, meta: {title: 'How Football Squares Work', description: 'A complete guide to football squares: the 10x10 grid, claiming squares, drawing numbers, determining winners each quarter, and common payout structures.'}},
    {path: '/resources/setting-up-a-pool', component: SettingUpPool, meta: {title: 'Setting Up a Pool on SqMGR', description: 'Step-by-step guide to creating a football squares pool on SqMGR, covering grid types, sharing links, drawing numbers, and marking winners.'}},
    {path: '/resources/linking-live-events-and-payouts', component: LinkedEventsAndPayouts, meta: {title: 'Linking Live Events & Configuring Payouts', description: 'Learn how to link your grid to a live NFL or college football game for real-time scores and configure payout percentages per quarter.'}},
    {path: '/resources/multiple-games-and-rollover', component: MultipleGamesAndRollover, meta: {title: 'Multiple Games & the Rollover Mechanic', description: 'How to add multiple game grids to one pool and how the rollover mechanic carries claimed squares forward from game to game.'}},
    {path: '/resources/best-numbers-in-football-squares', component: BestNumbers, meta: {title: 'Best Numbers in Football Squares', description: 'Which digits win most often in football squares and why — the scoring math behind 0, 7, 3, and 4 being the best numbers to land.'}},
    {path: '/resources/super-bowl-squares', component: SuperBowlSquares, meta: {title: 'Super Bowl Squares Guide', description: 'Everything you need to run a Super Bowl squares pool: planning timeline, payout structures, draw timing, tips for large pools, and game day advice.'}},
    {path: '/about', component: About, meta: {title: 'About'}},
    {path: '/how-it-works', component: HowItWorks, meta: {title: 'How It Works'}},
    {path: '/terms', component: TermsOfService, meta: {title: 'Terms of Service'}},
    {path: '/privacy', component: PrivacyPolicy, meta: {title: 'Privacy Policy'}},
    {path: '/cookies', component: CookiesPolicy, meta: {title: 'Cookies Policy'}},
    {path: '/release-notes', component: ReleaseNotes, meta: {title: 'Release Notes'}},
    {path: '/login', component: LogIn, meta: {title: 'Login'}},
    {path: '/tipjar', component: TipJar, meta: {title: 'Tip Jar'}},
    {path: '/account', component: YourAccount, meta: {requireLogin: true, title: 'Your Account'}},
    {path: '/guest-account', component: GuestAccount, meta: {requireGuestAccount: true, title: 'Guest Account'}},
    {path: '/create', component: CreatePool, meta: {requireLogin: true, title: 'Create Squares Pool'}},
    {path: '/pool/:token', component: Pool, props: true, meta: {requirePoolMembership: true}},
    {path: '/pool/:token/join', component: PoolJoin, props: true},
    {path: '/pool/:token/game/all', component: PoolGridAll, props: true, meta: {requirePoolMembership: true}},
    {path: '/pool/:token/game/:gridId', component: PoolGrid, props: true, meta: {requirePoolMembership: true}},
    {path: '/admin', component: Admin, meta: {requireAdmin: true, title: 'Admin'}},
    {path: '/admin/user/:userId', component: AdminUser, props: true, meta: {requireAdmin: true, title: 'Admin - User Details'}},
    {path: '/:pathMatch(.*)*', component: NotFound, meta: {title: 'Page Not Found'}},
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
        } catch {
            return `/login?target=${encodeURIComponent(to.path)}`
        }

        return true
    }

    if (to.meta.requireAdmin) {
        try {
            await authService.loadProfile()
            const user = await sqmgrClient.getUser()
            if (!user.is_admin) {
                return '/'
            }
        } catch {
            return '/'
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
        } catch {
            return `/pool/${to.params.token}/join?target=${encodeURIComponent(to.path)}`
        }
    }

    return true
})

authService.initAuth0()
    .then(() => {
        const app = createApp(App)
        app.use(router)
        app.use(AuthPlugin)
        app.mount('#app')
    })
