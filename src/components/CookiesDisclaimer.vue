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
    @import '../variables.scss';

    section.cookies-disclaimer {
        background-color: #333;
        box-shadow:       0 0 8px 1px rgba(black, 0.4);
        padding:          $standard-spacing;
        font-size:        0.9em;
        color:            #eee;
        position:         fixed;
        max-width:        400px;
        bottom:           $standard-spacing;
        right:            $standard-spacing;
        border-radius:    5px;

        @media(max-width: 400px + ( $standard-spacing * 2 )) {
            max-width: calc(100vw - (2 * #{ $standard-spacing }));
        }

        button {
            box-shadow: none;
        }
    }
</style>