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
along with this program.  If not, see https://www.gnu.org/licenses/.
*/

<template>
    <div id="app">
        <header>
            <div class="content">
                <h1>
                    <router-link to="/">
                        <img
                            class="logo"
                            src="/images/logo@2x.png"
                            srcset="/images/logo.png,
                                     /images/logo@2x.png 2x,
                                     /images/logo@3x.png 3x"
                            alt="SqMGR"
                        />
                    </router-link>
                </h1>
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
            <router-view name="header"/>
        </header>
        <main>
            <div class="content">
                <router-view v-slot="{ Component }">
                    <component :is="Component"/>
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
    </div>
</template>

<script>
import Footer from "@/components/ui/Footer"
import Modal from "@/components/ui/Modal"
import CookiesDisclaimer from "@/components/ui/CookiesDisclaimer"
import accessTokenManager from "@/models/accessTokenManager"

export default {
    name: 'app',
    components: {
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
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Barlow+Condensed:wght@500;800&family=Outfit:wght@100..900&display=swap');

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
    box-shadow:     0 0 0 4px rgba(46, 139, 62, 0.25);
}

:root {
    --minimal-spacing:    4px;
    --spacing:            20px;

    --midnight-gray:      #0f1218;
    --light-gray:         #e8eaed;
    --gray:               #9ca3af;
    --dark-gray:          #6b7280;
    --red:                #dc3545;
    --red-darker:         #c82333;
    --border-color:       #d4d6db;
    --hr-color:           #e8eaed;
    --font:               'Outfit';
    --primary:            #2e8b3e;
    --primary-light:      #4caf50;
    --primary-darker:     #247032;
    --primary-darkest:    #1a5427;
    --accent:             #f5a623;
    --success:            #2196f3;
    --warning:            #f5a623;

    /* Shadow System */
    --shadow-xs:          0 1px 2px rgba(0, 0, 0, 0.04);
    --shadow-sm:          0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
    --shadow-md:          0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
    --shadow-lg:          0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03);
    --shadow-xl:          0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03);
    --shadow-primary:     0 4px 14px rgba(46, 139, 62, 0.35);

    /* Transition */
    --transition-fast:    150ms ease;
    --transition-base:    200ms ease;
    --transition-slow:    300ms ease;

    /* Border Radius */
    --radius-sm:          4px;
    --radius-md:          6px;
    --radius-lg:          8px;
    --radius-xl:          12px;
    --radius-2xl:         16px;

    /* Alert Colors */
    --alert-error-bg:     #f8d7da;
    --alert-error-text:   #721c24;
    --alert-success-bg:   #d4edda;
    --alert-success-text: #155724;

    /* Card Shadow */
    --shadow-card:        0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.04);
}

html, body {
    background-color:        var(--midnight-gray);
    color:                   $text-color;
    font-family:             'Outfit', sans-serif;
    -webkit-font-smoothing:  antialiased;
    -moz-osx-font-smoothing: grayscale;
}

main {
    background-color: #f8f9fb;
    min-height:       400px;
    padding:          calc(var(--spacing) * 1.5) 0 calc(3 * var(--spacing));
    position:         relative;
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
    transition:      color var(--transition-fast);
}

a:hover {
    text-decoration: underline;
    color:           var(--primary-darker);
}

footer {
    color:       rgba(255, 255, 255, 0.45);
    min-height:  100px;
    font-size:   0.9em;
    padding-top: calc(var(--spacing) * 1.5);
    position:    relative;
    text-align:  center;
    background:  linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, transparent 100%);
}


header {
    background:    linear-gradient(180deg, #0f1218 0%, #141820 100%);
    color:         #fff;
    padding:       calc(var(--spacing) * 1.1) 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);

    & > div {
        position:        relative;
        display:         flex;
        justify-content: space-between;
        align-items:     center;
    }

    img.logo {
        display: block;
        height:  42px;
    }

    h1 {
        font-family: 'Anton', sans-serif;
        font-weight: 400;
        font-size:   1.6em;
        text-shadow: 3px 3px var(--midnight-gray), 5px 5px var(--primary);
        margin:      0;

        a {
            color: #fff;

            &:hover {
                text-decoration: none;
            }
        }
    }

    nav {
        ul {
            list-style:      none;
            display:         flex;
            flex-wrap:       wrap;
            gap:             $space-1;
            align-items:     center;
            justify-content: center;
        }

        ul li a {
            display:        block;
            color:          rgba(255, 255, 255, 0.75);
            font-weight:    500;
            line-height:    42px;
            padding:        0 $space-3;
            border-radius:  $radius-md;
            transition:     all var(--transition-fast);
            font-size:      0.95em;
            letter-spacing: 0.01em;

            &:hover {
                color:           #fff;
                background:      rgba(255, 255, 255, 0.08);
                text-decoration: none;
            }

            &.router-link-exact-active {
                color:      #fff;
                background: rgba(255, 255, 255, 0.1);
            }
        }
    }


    h2 {
        border:      none;
        font-size:   2.0em;
        font-weight: 400;
        margin:      0;
        text-align:  center;
        font-family: 'Anton', sans-serif;
    }

    a {
        color:           var(--primary-light);
        text-decoration: none;
    }

    p {
        margin-top: var(--spacing);
        text-align: center;
    }
}

h1, h2, h3, h4, h5, h6 {
    margin-bottom:  var(--spacing);
    font-family:    'Anton', sans-serif;
    font-weight:    400;
    letter-spacing: -0.01em;
}

p {
    margin-bottom: var(--spacing);
}

h1 {
    font-size: 2.2em;
}

h2 {
    font-size: 1.8em;
}

h3 {
    font-size: 1.5em;
}

h4 {
    font-size: 1.2em;
}

h5 {
    font-size: 1.0em;
}

div.content {
    padding:   0 var(--spacing);
    max-width: 1280px;
    margin:    0 auto;
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
    width:         100%;
    overflow:      auto;
    border-radius: $radius-lg;
    border:        1px solid var(--light-gray);
}

table {
    border-collapse: collapse;
    width:           100%;
}

th, td {
    padding: $space-3 $space-4;
}

th {
    background-color: var(--midnight-gray);
    color:            #fff;
    text-align:       left;
    font-weight:      600;
    font-size:        0.875em;
    text-transform:   uppercase;
    letter-spacing:   0.04em;
}

tr:nth-child(odd) td {
    background-color: #fff;
}

tr:nth-child(even) td {
    background-color: var(--light-gray);
}

td {
    border-bottom: 1px solid var(--border-color);
    font-size:     0.95em;
}

p.generated-by {
    font-size: 0.8em;
    color:     var(--gray);
}

@include tablet {
    div.columns {
        display: block;
    }
    div.columns > * {
        margin-bottom: var(--spacing);
    }
    div.columns > *:last-child {
        margin-bottom: 0;
    }

    header > div {
        flex-direction: column;
        align-items:    center;
        gap:            $standard-spacing;

        & > nav {
            a {
                line-height: normal;
            }
        }

    }

    header h2 {
        font-size: 1.8em;
        margin:    var(--spacing) 0;
    }
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
    border:         none;
    border-radius:  $radius-lg;
    color:          #fff;
    font:           1em 'Outfit', sans-serif;
    font-weight:    600;
    padding:        $space-3 $space-6;
    background:     $color;
    box-shadow:     0 1px 2px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.06) inset;
    cursor:         pointer;
    transition:     all var(--transition-fast);
    min-height:     42px;
    letter-spacing: 0.01em;

    &:hover {
        background:      color.adjust($color, $lightness: 6%);
        color:           white;
        transform:       translateY(-1px);
        box-shadow:      0 4px 12px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.08) inset;
        text-decoration: none;
    }

    &:active {
        transform:  translateY(0);
        background: color.adjust($color, $lightness: -4%);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) inset;
    }

    &:disabled {
        opacity:    0.5;
        background: $color;
        cursor:     not-allowed;
        transform:  none;
        box-shadow: none;
    }
}

button, .action-btn {
    @include sqmgrButton($primary);

    &.sm {
        padding:     $space-2 $space-3;
        font-size:   0.8125rem;
        display:     flex;
        align-items: center;
        gap:         $space-1;
        min-height:  34px;
    }

    &.lg {
        padding:    $space-4 $space-8;
        font-size:  1.0625em;
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
    border:     1.5px solid color.adjust($primary, $alpha: -0.6);

    &:hover {
        border-color: $primary;
        background:   rgba($primary, 0.06);
        transform:    translateY(-1px);
        box-shadow:   none;
    }

    &:active {
        background: rgba($primary, 0.1);
        transform:  translateY(0);
    }
}

.tabs {
    display:       flex;
    gap:           $space-1;
    margin-top:    $standard-spacing;
    margin-bottom: $standard-spacing;
    border-bottom: 2px solid #e5e7eb;

    button {
        all:           unset;
        display:       inline-flex;
        align-items:   center;
        gap:           $space-2;
        padding:       $space-3 $space-4;
        font-size:     0.9375rem;
        font-weight:   500;
        color:         $dark-gray;
        cursor:        pointer;
        border-bottom: 2px solid transparent;
        margin-bottom: -2px;
        transition:    color var(--transition-fast), border-color var(--transition-fast);
        border-radius: $radius-sm $radius-sm 0 0;

        i {
            font-size: 1em;
        }

        &:hover:not(.active) {
            color:      $text-color;
            background: rgba(0, 0, 0, 0.02);
        }

        &.active {
            color:        var(--primary);
            border-color: var(--primary);
            font-weight:  600;
        }
    }
}

@media print {
    header { display: none; }
    footer { display: none; }
    html, body { background-color: #fff; }
}

</style>