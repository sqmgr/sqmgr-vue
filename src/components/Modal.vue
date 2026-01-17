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
    <div v-if="components.length > 0">
        <template v-for="component in components" :key="component.id">
            <div class="modal-container">
                <div class="cover" @click.prevent="close"></div>
                <transition appear name="modal">
                    <div class="modal">
                        <h2 v-if="component.header === 'Error'" class="error">Error</h2>
                        <h2 v-else>{{component.header}}</h2>

                        <a class="close" href="#" @click.prevent="close"><i class="fas fa-times"></i><span>Close</span></a>
                        <div class="content">
                            <component :is="component.component" v-bind="component.props"
                                       v-on="component.on"></component>
                        </div>
                    </div>
                </transition>
            </div>
        </template>
    </div>
</template>

<script>
    import { markRaw } from 'vue'
    import ModalController from '@/controllers/ModalController'

    export default {
        name: "Modal",
        data() {
            return {
                components: [],
            }
        },
        mounted() {
            ModalController.bus.on('show', (args) => {
                const [header, component, props = {}, on = {}] = args
                this.components.push({
                    id: Math.random(),
                    header,
                    component: markRaw(component),
                    props,
                    on,
                })
            })

            const fireEvent = (c, event) => {
                if (typeof (c.on[event]) === 'function') {
                    c.on[event]()
                }
            }

            ModalController.bus.on('abort', () => fireEvent(this.components.pop(), 'modal-aborted'))

            ModalController.bus.on('hide', () => fireEvent(this.components.pop(), 'modal-closed'))

            ModalController.bus.on('hideAll', () => {
                let c
                while (undefined !== (c = this.components.pop())) {
                    fireEvent(c, 'modal-closed')
                }
            })

            window.addEventListener('keyup', e => {
                if (this.components.length > 0 && e.key === 'Escape') {
                    fireEvent(this.components.pop(), 'modal-aborted')
                }
            })
        },
        methods: {
            close() {
                ModalController.abort()
            }
        }
    }
</script>

<style scoped lang="scss">
    div.modal-enter-active {
        animation: modal 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    div.modal-leave-active {
        animation: modal 0.15s ease-in reverse;
    }

    @keyframes modal {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }

    div.cover {
        background-color: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
    }

    div.modal {
        z-index: 100;
        background-color: #fff;
        border: none;
        border-radius: 16px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05);
        min-width: 90vw;
        overflow: hidden;

        @media (min-width: 600px) {
            min-width: 400px;
            max-width: 90vw;
        }

        h2 {
            background: linear-gradient(180deg, #f8f9fa 0%, #f1f3f4 100%);
            font-size: 1.25em;
            border-bottom: 1px solid #e0e0e0;
            line-height: 52px;
            padding-left: 24px;
            margin-bottom: 0;
            font-weight: 600;

            &.error {
                background: linear-gradient(180deg, #f44336 0%, #d32f2f 100%);
                border-bottom-color: #b71c1c;
                color: #fff;
            }
        }

        a.close {
            color: rgba(0, 0, 0, 0.4);
            text-decoration: none;
            font-weight: normal;
            font-size: 24px;
            line-height: 52px;
            position: absolute;
            top: 0;
            right: 16px;
            width: 40px;
            height: 52px;
            text-align: center;
            border-radius: 8px;
            transition: all 150ms ease;

            &:hover {
                color: rgba(0, 0, 0, 0.7);
                background-color: rgba(0, 0, 0, 0.05);
            }

            span {
                display: none;
            }
        }

        div.content {
            overflow: auto;
            padding: 24px 24px 0;
            max-width: 95vw;
            max-height: calc(80vh - 52px);

            & > *:last-child {
                margin-bottom: 24px;
            }
        }
    }
</style>