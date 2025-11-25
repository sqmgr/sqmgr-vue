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
    <section class="footer">
        <nav>
            <ul>
                <li>
                    <router-link to="/about">About</router-link>
                </li>
                <li>
                    <router-link to="/tipjar">Tip Jar</router-link>
                </li>
                <li>
                    <router-link to="/terms">Terms of Service</router-link>
                </li>
                <li>
                    <router-link to="/privacy">Privacy Policy</router-link>
                </li>
                <li>
                    <router-link to="/cookies">Cookies Policy</router-link>
                </li>
            </ul>
        </nav>

        <p class="version"><a href="https://github.com/sqmgr" :data-version="versionFull" :title="versionFull">{{versionShort}}</a>
        </p>
    </section>
</template>

<script>
    export default {
        name: "Footer",
        props: {
            version: {
                type: String
            }
        },
        computed: {
            versionFull() {
                return this.version || 'dev'
            },
            versionShort() {
                const match = this.versionFull.match(/^v\d+.\d+/)
                if (match) {
                    return match[0]
                }

                return this.versionFull
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../variables';

    @media (max-width: 800px) {
        footer {
            nav {
                li {
                display: block;
                margin: 0;
                text-align: left;
                }

                margin-bottom: $standard-spacing;
            }
        }
    }
</style>