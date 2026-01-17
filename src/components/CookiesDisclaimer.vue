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
    @use '../variables.scss' as *;

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
        border-radius:    8px;
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