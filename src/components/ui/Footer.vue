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

        <p class="version"><a href="https://github.com/sqmgr/sqmgr" :data-version="versionFull"
                              :title="versionFull">{{ versionFull }}</a>
        </p>

        <p class="copyright">© 2019–{{year}} <a href="https://tompeters.me">Tom Peters</a>. All rights reserved.</p>
    </section>
</template>

<script setup>
import {computed} from "vue"

const props = defineProps({
    version: {
        type: String,
    }
})

const versionFull = computed(() => props.version || 'dev')
const year = new Date().getFullYear()
</script>

<style scoped lang="scss">
@use '../../variables' as *;

section.footer {
    padding-bottom: $space-6;
    display:        flex;
    justify-content: space-between;
    flex-wrap:      wrap;
    align-items:    center;

    nav {
        a {
            color:           rgba(255, 255, 255, 0.55);
            text-decoration: none;
            font-size:       0.85em;
            transition:      color 200ms ease;

            &:hover {
                color: rgba(255, 255, 255, 0.9);
            }
        }

        ul {
            list-style: none;
            padding:    0;
            margin:     0;
            display:    flex;
            gap:        $space-5;
        }
    }

    div.spacer {
        flex: 1;
    }

    p.version {
        flex:       1;
        text-align: right;

        a {
            color:      rgba(255, 255, 255, 0.25);
            font-size:  0.8em;
            transition: color 200ms ease;

            &:hover {
                color: rgba(255, 255, 255, 0.5);
            }
        }
    }

    p.copyright {
        width:       100%;
        text-align:  center;
        color:       rgba(255, 255, 255, 0.3);
        font-size:   0.8rem;
        margin-top:  $space-6;
        padding-top: $space-6;
        border-top:  1px solid rgba(255, 255, 255, 0.06);

        a {
            color:           rgba(255, 255, 255, 0.4);
            text-decoration: none;
            transition:      color 200ms ease;

            &:hover {
                color: rgba(255, 255, 255, 0.8);
            }
        }
    }

    @include tablet {
        flex-direction:  column;
        align-items:     center;
        gap:             $space-4;

        div.spacer {
            display: none;
        }

        p.version {
            text-align: center;
        }

        nav ul {
            gap:        $space-4;
            flex-wrap:  wrap;
            justify-content: center;
        }
    }
}
</style>