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
    <transition name="slide-up" appear>
    <section v-if="!allowed" class="cookies-disclaimer">
        <p>SqMGR uses cookies to manage your access to this service and anonymously track usage to improve your
            experience. For more information, please see our
            <router-link to="/cookies">Cookies Policy</router-link>
            .
        </p>

        <p>Click 'Allow' to confirm you are okay with that.</p>

        <div class="buttons">
            <button type="button" @click="allowCookies">Allow</button>
        </div>
    </section>
    </transition>
</template>

<script>
    import cookiesGranter from "@/models/cookiesGranter";

    export default {
        name: "CookiesDisclaimer",
        data() {
            return {
                allowed: cookiesGranter.isAllowed()
            }
        },
        methods: {
            allowCookies() {
                this.allowed = true
                cookiesGranter.allow()
            }
        }
    }
</script>

<style scoped lang="scss">
    @use "sass:color";
    @use '../../variables.scss' as *;

    section.cookies-disclaimer {
        background-color: #333;
        box-shadow:       0 4px 20px rgba(black, 0.3);
        padding:          $standard-spacing;
        font-size:        0.9em;
        color:            #eee;
        position:         fixed;
        max-width:        400px;
        bottom:           $standard-spacing;
        right:            $standard-spacing;
        border-radius:    $radius-lg;
        border-left:      4px solid $primary;

        @media(max-width: 400px + ( $standard-spacing * 2 )) {
            max-width: calc(100vw - (2 * #{ $standard-spacing }));
        }

        p {
            line-height: 1.5;
        }

        a {
            color: color.adjust($primary, $lightness: 15%);
            text-decoration: underline;

            &:hover {
                color: color.adjust($primary, $lightness: 25%);
            }
        }

        button {
            box-shadow: none;
        }
    }

    /* Slide-up entrance animation */
    .slide-up-enter-active {
        animation: slideUp 0.4s ease-out;
    }

    .slide-up-leave-active {
        animation: slideUp 0.3s ease-in reverse;
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>