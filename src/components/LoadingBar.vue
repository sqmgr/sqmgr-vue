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
    <transition name="loading">
        <div v-if="loading" class="loading-bar" :style="`width: ${ 100 * percentLoaded}%`">
        </div>
    </transition>
</template>

<script>
    import bus from '@/utils/bus'

    export default {
        name: "LoadingBar",
        data() {
            return {
                percentLoaded: 0,
                loading: false,
            }
        },
        created() {
            this.depth = 0
            bus.$on('loading-start', this.startLoading)
            bus.$on('loading-done', this.stopLoading)
        },
        beforeDestroy() {
            bus.$off('loading-start', this.startLoading)
            bus.$off('loading-done', this.stopLoading)
        },
        methods: {
            progress() {
                if (this.timeout) {
                    clearTimeout(this.timeout)
                }

                this.percentLoaded += (1 - this.percentLoaded) / 8

                this.timeout = setTimeout(() => this.progress(), 100 + Math.random() * 1000)
            },
            startLoading() {
                if (this.depth++ === 0) {
                    this.percentLoaded = 0
                    this.progress()
                }

                this.loading = true
            },
            stopLoading() {
                if (--this.depth === 0) {
                    clearTimeout(this.timeout)
                    this.percentLoaded = 1
                    this.timeout = null
                    this.$nextTick().then(() => this.loading = false)
                }

                if (this.depth < 0) {
                    this.depth = 0
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../variables.scss';

    div.loading-bar {
        transition:       all 200ms;
        position:         fixed;
        top:              0;
        left:             0;
        background-color: $primary;
        height:           2px;
        width:            50%;

        &::after {
            position:   absolute;
            top:        0;
            right:      0;
            content:    '';
            display:    block;
            width:      20px;
            height:     2px;
            background: linear-gradient(to right, $primary, lighten($primary, 20%));
        }
    }

    div.loading-enter-active, div.loading-leave-active {
        transition: transform 400ms;
    }

    div.loading-enter-active, div.loading-leave-to {
        transform: translateY(-2px);
    }
</style>