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
    <div :class="divClasses" @click.prevent="didClickSquare" @mouseenter="enter" @mouseleave="leave">
        <i :class="`annotation-icon fas fa-${annotationIcon}`" v-if="annotationIcon"></i>
        <span class="square-id">{{ sqId }}</span>
        <span class="name">{{ squareData.claimant }}</span>

        <template v-if="squareData.userId === poolConfig.userId">
            <i class="fas fa-asterisk owned"></i>
        </template>
    </div>
</template>

<script>
    import SquareDetails from './SquareDetails.vue'
    import ModalController from '@/controllers/ModalController'
    import sqmgrClient from "@/models/sqmgrClient";
    import sqmgrConfig from "@/models/sqmgrConfig";

    export default {
        name: "Square.vue",
        props: {
            poolConfig: {
                type: Object,
                required: true,
            },
            gridId: {
                type: Number,
                required: true,
            },
            sqId: {
                type: Number,
                required: true,
            },
            squareData: {
                type: Object,
                required: true,
            },
            annotation: {
                type: Object,
            }
        },
        data() {
            return {
                sqmgrConfig: null,
            }
        },
        computed: {
            annotationIcon() {
                if (!this.sqmgrConfig || !this.annotation) {
                    return
                }

                return this.sqmgrConfig.gridAnnotationIcons[this.annotation.icon].name
            },
            isHeld() {
                const primarySquare = this.$store.state.primarySquare
                if (!primarySquare) {
                    return
                }

                return primarySquare.squareId === this.sqId
            },
            isSecondary() {
                return this.squareData.parentSquareId > 0
            },
            isHighlighted() {
                return this.$store.state.highlightSquares[this.sqId]
            },
            divClasses() {
                const obj = {
                    square: true,
                    held: this.isHeld,
                    secondary: this.isSecondary,
                    highlighted: this.isHighlighted,
                    annotated: this.annotation,
                }

                if (this.poolConfig.gridType !== 'roll100' || !this.isSecondary) {
                    obj[this.squareData.state] = true
                }

                return obj
            }
        },
        mounted() {
            sqmgrConfig()
                .then(res => this.sqmgrConfig = res)
                .catch(err => ModalController.showError(err))
        },
        methods: {
            highlightSquares(highlight) {
                const highlightSquares = this.$store.state.highlightSquares
                const {parentSquareId, childSquareIds} = this.squareData
                if (parentSquareId > 0) {
                    highlightSquares[parentSquareId] = highlight
                }

                if (childSquareIds) {
                    childSquareIds.forEach(id => highlightSquares[id] = highlight)
                }

                this.$store.commit('highlightSquares', highlightSquares)
            },
            enter() {
                this.highlightSquares(true)
            },
            leave() {
                this.highlightSquares(false)
            },
            didClickSquare() {
                if (this.isHeld) {
                    this.$store.commit('primarySquare', null)
                    return
                }

                sqmgrClient.getSquareByTokenAndSquareId(this.poolConfig.token, this.sqId)
                    .then(data => {
                        ModalController.show('Square Details', SquareDetails, {
                            data,
                            annotation: this.annotation,
                            gridId: this.gridId,
                            poolConfig: this.poolConfig,
                        })
                    })
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../variables';

    .annotation-icon {
        position: absolute;
        opacity: 0.75;
        font-size: 2em;
        color: $yellow;
    }
    span.name {
        overflow: hidden;
    }
</style>
