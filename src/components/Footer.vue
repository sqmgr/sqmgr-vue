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
        <div class="spacer"></div>
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

        <p class="version"><a href="https://github.com/sqmgr" :data-version="versionFull"
                              :title="versionFull">{{ versionFull }}</a>
        </p>
    </section>
</template>

<script>
export default {
    name: "Footer",
    props: {
        version: {
            type: String,
        },
    },
    computed: {
        versionFull() {
            return this.version || 'dev'
        },
    },
}
</script>

<style scoped lang="scss">
@use '../variables' as *;

section.footer {
    padding-bottom: $standard-spacing;
    display: flex;
    justify-content: space-between;

    nav {
        a {
            color:           #fff;
            text-decoration: none;
        }

        ul {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            gap: $standard-spacing;

        }
    }

    div.spacer {
        flex: 1;
    }
    p.version {
        flex: 1;
        text-align: right;
        a {
            color: rgba(255, 255, 255, 0.4);
        }
    }

    @media (max-width: 800px) {
        div.spacer {
            display: none;
        }

        nav ul {
            gap: calc($standard-spacing / 2);
            flex-direction: column;
            align-items: start;
        }
    }
}
</style>