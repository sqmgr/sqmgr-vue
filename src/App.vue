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

<template>
    <div id="app">
        <header>
            <div class="content">
                <h1>
                    <router-link to="/">
                        <img
                            class="logo"
                            src="./assets/logo@2x.png"
                            srcset="./assets/logo.png,
                                     ./assets/logo@2x.png 2x,
                                     ./assets/logo@3x.png 3x"
                            alt="SqMGR"
                        />
                    </router-link>
                </h1>
                <router-view name="header"/>

                <nav>
                    <ul>
                        <li>
                            <router-link to="/">Home</router-link>
                        </li>

                        <template v-if="isAuthenticated">
                            <li>
                                <router-link to="/account">Your Account</router-link>
                            </li>
                            <li><a href="#" @click.prevent="logout">Logout</a></li>
                        </template>
                        <template v-else>
                            <li><a href="#" @click.prevent="login">Log in / Sign up</a></li>
                            <li v-if="isGuest">
                                <router-link to="/guest-account">Joined Pools</router-link>
                            </li>
                        </template>
                        <li>
                            <router-link to="/tipjar">Tip Jar</router-link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
        <main>
            <div class="content">
                <router-view v-slot="{ Component }">
                    <transition name="page" mode="out-in">
                        <component :is="Component"/>
                    </transition>
                </router-view>
            </div>
        </main>
        <footer>
            <div class="content">
                <Footer :version="version"/>
            </div>
        </footer>
        <Modal/>
        <cookies-disclaimer/>
        <loading-bar/>
    </div>
</template>

<script>
import Footer from "@/components/Footer"
import Modal from "@/components/Modal"
import CookiesDisclaimer from "@/components/CookiesDisclaimer"
import accessTokenManager from "@/models/accessTokenManager"
import LoadingBar from "@/components/LoadingBar"

export default {
    name: 'app',
    components: {
        LoadingBar,
        CookiesDisclaimer,
        Modal,
        Footer,
    },
    data() {
        return {
            isGuest: !!accessTokenManager.getGuestAccessToken(),
            isAuthenticated: this.$auth.isAuthenticated,
            version: __APP_VERSION__,
        }
    },
    async created() {
        try {
            await this.$auth.loadProfile()
        } catch {
            // not logged in
        }
    },
    methods: {
        logout() {
            this.$auth.logout()
        },
        login() {
            this.$auth.loginWithRedirect({
                target: this.$route.query.target,
            })
        },
        handleLoginEvent(data) {
            this.isAuthenticated = data.loggedIn
            this.profile = data.profile
        },
        handleGuestJoinEvent() {
            this.isGuest = true
        },
    },
}
</script>

<style lang="scss">
@use "sass:color";
@use 'variables.scss' as *;
@import url('https://fonts.googleapis.com/css?family=Lobster|Alfa+Slab+One|Shadows+Into+Light|Roboto:400,700');

* {
    padding:    0;
    margin:     0;
    box-sizing: border-box;
}

/* Accessibility: Focus-visible styles for keyboard navigation */
:focus {
    outline: none;
}

:focus-visible {
    outline:        2px solid var(--primary);
    outline-offset: 2px;
}

button:focus-visible,
a.btn:focus-visible {
    outline:        2px solid var(--primary-darkest);
    outline-offset: 2px;
    box-shadow:     0 0 0 4px rgba(76, 175, 80, 0.3);
}

:root {
    --minimal-spacing: 4px;
    --spacing:         20px;

    --midnight-gray:   #171717;
    --light-gray:      #eee;
    --gray:            #bbb;
    --dark-gray:       #888;
    --red:             #f44336;
    --red-darker:      #e53935;
    --border-color:    #ccc;
    --hr-color:        #eee;
    --font:            'Roboto';
    --primary:         #4caf50;
    --primary-light:   #81c784;
    --primary-darker:  #43a047;
    --primary-darkest: #1b5e20;
    --success:         #2196f3;
    --warning:         #ffc107;

    /* Shadow System */
    --shadow-xs:       0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-sm:       0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
    --shadow-md:       0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg:       0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-xl:       0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    --shadow-primary:  0 4px 14px rgba(76, 175, 80, 0.4);

    /* Transition */
    --transition-fast: 150ms ease;
    --transition-base: 200ms ease;
    --transition-slow: 300ms ease;
}

html, body {
    background-color: var(--primary);
    color:            $text-color;
    font-family:      'Roboto', sans-serif;
}

main {
    background-color: #fff;
    min-height:       400px;
    padding:          var(--spacing) 0 calc(3 * var(--spacing));
}

main ul,
main ol {
    margin-left:   calc(2 * var(--spacing));
    margin-bottom: var(--spacing);
}

main ol ol {
    margin-bottom: 0;
}

a {
    color:           var(--primary);
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

footer {
    color:       rgba(255, 255, 255, 0.4);
    min-height:  100px;
    font-size:   0.9em;
    padding-top: var(--spacing);
    position:    relative;
    text-align:  center;
}


header {
    background-color: var(--midnight-gray);
    color:            #fff;
    padding:          var(--spacing) 0;

    & > div {
        position: relative;
    }

    img.logo {
        height: 42px;
        width:  158px;
    }

    nav {
        position: absolute;
        top:      0;
        right:    var(--spacing);

        ul {
            list-style: none;
        }

        ul li {
            display:     inline-block;
            margin-left: var(--spacing);
        }

        ul li:first-child {
            margin-left: 0;
        }

        a {
            color:       #fff;
            font-weight: bold;
        }
    }

    h1 {
        font-family: 'Alfa Slab One', sans-serif;
        font-size:   1.6em;
        text-shadow: 3px 3px var(--midnight-gray), 5px 5px var(--primary);
        margin:      0;
        display:     inline-block;

        a {
            color: #fff;

            &:hover {
                text-decoration: none;
            }
        }
    }

    h2 {
        border:      none;
        font-size:   2.0em;
        font-weight: normal;
        margin:      0;
        text-align:  center;
    }

    a {
        color:           #4caf50;
        text-decoration: none;
    }

    p {
        margin-top: var(--spacing);
        text-align: center;
    }
}

h1, h2, h3, h4, h5, h6, p {
    margin-bottom: var(--spacing);
}


h1 {
    font-size: 2.2em;
}

h2 {
    font-size: 1.8em;
}

h3 {
    font-size:   1.6em;
    font-weight: normal;
}

h4 {
    font-size:   1.2em;
    font-weight: normal;
}

h5 {
    font-size:   1.0em;
    font-weight: normal;
}

div.content {
    padding: 0 var(--spacing);
}

hr {
    border:        none;
    border-top:    1px solid var(--border-color);
    margin-bottom: var(--spacing);
}

section.error {
    font-size:  1.4em;
    text-align: center;
}

div.error {
    color: $red;
}

.columns {
    display:               grid;
    grid-gap:              var(--spacing);
    grid-template-columns: repeat(4, 1fr);
    align-items:           start;
}

.col-2 {
    grid-column: span 2;
}

.col-3 {
    grid-column: span 3;
}

.col-4 {
    grid-column: span 4;
}

.small {
    max-width: 600px;
    margin:    0 auto;
}

div.table-container {
    width:    100%;
    overflow: auto;
}

table {
    border-collapse: collapse;
}

th, td {
    padding: calc(2 * var(--minimal-spacing));
}

th {
    background-color: var(--midnight-gray);
    color:            #fff;
    text-align:       left;
}

tr:nth-child(odd) td {
    background-color: #fff;
}

tr:nth-child(even) td {
    background-color: var(--light-gray);
}

td {
    border-bottom: 1px solid var(--border-color);
}

p.generated-by {
    font-size: 0.8em;
    color:     var(--gray);
}

@media (max-width: 800px) {
    div.columns {
        display: block;
    }
    div.columns > * {
        margin-bottom: var(--spacing);
    }
    div.columns > *:last-child {
        margin-bottom: 0;
    }

    header nav {
        margin-top: var(--spacing);
        position:   static;
        text-align: center;
    }

    header h2 {
        font-size: 1.8em;
        margin:    var(--spacing) 0;
    }
}

a.btn {
    border-radius:    8px;
    background-color: var(--primary);
    color:            #fff;
    display:          inline-block;
    padding:          calc(var(--minimal-spacing) + 3px);
}

a.btn:hover {
    background:      var(--primary) linear-gradient(rgba(255, 255, 255, 0.2), transparent);
    text-decoration: none;
}

a.btn:active {
    background: var(--primary-darker);
}

@keyframes spin {
    0% {
        transform: rotateY(0deg);
    }
    25% {
        transform: rotateY(540deg);
    }
    50% {
        transform: rotateZ(180deg);
    }
    75%, 100% {
        transform: rotate(360deg);
    }
}

@keyframes reveal {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@mixin sqmgrButton($color) {
    border:        1px solid transparent;
    border-radius: 6px;
    color:         #fff;
    font:          1em Roboto, sans-serif;
    padding:       $minimal-spacing * 2 $standard-spacing;
    background:    linear-gradient(180deg, $color 0%, color.adjust($color, $lightness: -5%) 100%);
    box-shadow:    0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    cursor:        pointer;
    transition:    all var(--transition-fast);
    min-height:    40px;

    &:hover {
        background: linear-gradient(180deg, color.adjust($color, $lightness: 5%) 0%, $color 100%);
        transform:  translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }

    &:active {
        transform:  translateY(0);
        background: color.adjust($color, $lightness: -5%);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    &:disabled {
        opacity:    0.5;
        background: $color;
        cursor:     not-allowed;
        transform:  none;
        box-shadow: none;
    }
}

button {
    @include sqmgrButton($primary);

    &.sm {
        padding:    $minimal-spacing $minimal-spacing * 3;
        font-size:  0.875em;
        min-height: 32px;
    }

    &.lg {
        padding:    $minimal-spacing * 3 $standard-spacing * 1.5;
        font-size:  1.125em;
        min-height: 48px;
    }

    &.small {
        box-shadow: none;
    }
}

button.destructive {
    @include sqmgrButton($red);
}

button.secondary {
    background: transparent;
    color:      $primary;
    box-shadow: none;
    border:     1px solid color.adjust($primary, $alpha: -0.5);

    &:hover {
        border-color: $primary;
        background:   rgba($primary, 0.05);
        transform:    translateY(-1px);
    }

    &:active {
        background: rgba($primary, 0.1);
        transform:  translateY(0);
    }
}

/* Page transition animations */
.page-enter-active {
    transition: opacity 200ms ease, transform 200ms ease;
}

.page-leave-active {
    transition: opacity 150ms ease;
}

.page-enter-from {
    opacity:   0;
    transform: translateY(10px);
}

.page-leave-to {
    opacity: 0;
}
</style>
