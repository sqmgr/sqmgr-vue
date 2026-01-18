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
    <div class="square-details">
        <table>
            <tbody>
            <tr>
                <td>Square ID</td>
                <td class="square-id">{{square.squareId}}</td>
            </tr>
            <tr>
                <td>Claimant</td>
                <td class="claimant">
                    <template v-if="editClaimant">
                        <form @submit.prevent="saveNewClaimant" class="standalone">
                            <input type="text"
                                   v-model="newClaimant"
                                   ref="claimantInput"
                                   @keyup="onKeyup($event)"
                            >
                        </form>
                    </template>
                    <template v-else-if="poolConfig.isAdmin">
                        <a href="#" @click.prevent="editClaimant=true">{{square.claimant}}</a>
                    </template>
                    <template v-else>
                        <span>{{square.claimant}}</span>
                    </template>
                </td>
            </tr>
            <tr v-if="poolConfig.gridType === 'roll100'">
                <td>Type</td>
                <td v-if="isSecondary">Secondary</td>
                <td v-else>Primary</td>
            </tr>
            <tr v-if="poolConfig.gridType === 'roll100'">
                <td>Linked Squares</td>
                <td>
                    <template v-for="square in linkedSquares" :key="square">
                        <a href="#" @click.prevent="showSquare(square)">{{ square }}</a>
                    </template>
                </td>
            </tr>
            <tr v-if="poolConfig.gridType !== 'roll100' || !isSecondary">
                <td>State</td>
                <td class="state">
                    <template v-if="!poolConfig.isAdmin || square.state === 'unclaimed'">
                        {{square.state}}
                    </template>
                    <template v-else>
                        <select name="state" v-model="form.state" @change="stateDidChange">
                            <option v-for="state in states" :key="state" :value="state">{{state}}</option>
                        </select>
                    </template>
                </td>
            </tr>
            <tr>
                <td>Last Modified</td>
                <td class="modified">{{new Date(square.modified).toLocaleDateString(undefined,
                    Common.DateTimeOptions)}}
                </td>
            </tr>
            <tr v-if="poolConfig.isAdmin && square.userInfo">
                <td>User Type</td>
                <td>{{ square.userInfo.userType === 'registered' ? 'Registered User' : 'Guest User' }}</td>
            </tr>
            <tr v-if="poolConfig.isAdmin && square.userInfo && square.userInfo.userType === 'registered'">
                <td>Email</td>
                <td>{{ square.userInfo.email || 'Not available' }}</td>
            </tr>
            </tbody>
        </table>

        <div class="annotation" v-if="computedAnnotation">
            <i :class="`fas fa-${annotationIcon}`" v-if="annotationIcon"></i>

            <span>{{ computedAnnotation.annotation }}</span>

            <a class="delete-annotation" href="#" @click.prevent="deleteAnnotation" v-if="poolConfig.isAdmin"><i
                    class="fas fa-times"></i><span>Delete</span></a>
        </div>

        <div class="buttons" v-if="canClaim || canUnclaim || poolConfig.isAdmin">
            <button type="button" @click.prevent="annotate" v-if="poolConfig.isAdmin">Annotate</button>
            <button type="button" @click.prevent="claimSquare" v-if="canClaim">Claim</button>
            <button type="button" class="destructive" @click.prevent="unclaimSquare" v-if="canUnclaim">Relinquish
                Claim
            </button>
        </div>

        <template v-if="poolConfig.isAdmin">
            <Logs @note-added="reloadData"
                  :pool-config="poolConfig"
                  :square-id="this.square.squareId"
                  :logs="square.logs || []"
                  :show-add-note="true"></Logs>
        </template>
    </div>
</template>

<script>
    import Logs from './Logs.vue'
    import Claim from './Claim.vue'
    import Note from './Note.vue'
    import Common from '../common'
    import ModalController from '@/controllers/ModalController'
    import sqmgrClient from "@/models/sqmgrClient";
    import sqmgrConfig from "@/models/sqmgrConfig";
    import SquareDetails from '@/components/SquareDetails'
    import EventBus from "@/models/EventBus";
    import Annotate from "@/components/Annotate";

    export default {
        name: "SquareDetails",
        components: {Logs},
        props: {
            data: {
                type: Object,
                required: true,
            },
            poolConfig: {
                type: Object,
                required: true,
            },
            gridId: {
                type: Number,
                required: true,
            },
            annotation: {
                type: Object,
            }
        },
        data() {
            return {
                Common,
                localAnnotation: undefined,
                editClaimant: false,
                newClaimant: null,
                loadedData: null,
                form: {
                    state: this.loadedData ? this.loadedData.state : this.data.state,
                },
                states: [],
                gridAnnotationIcons: {},
            }
        },
        created() {
            sqmgrConfig()
                .then(config => {
                    this.states = config.poolSquareStates
                    this.gridAnnotationIcons = config.gridAnnotationIcons
                })
                .catch(err => ModalController.showError(err))
        },
        computed: {
            annotationIcon() {
                if (this.computedAnnotation) {
                    const icon = this.gridAnnotationIcons[this.computedAnnotation.icon]
                    if (icon) {
                        return icon.name
                    }
                }

                return null
            },
            square() {
                return this.loadedData || this.data
            },
            isSecondary() {
                return this.square.parentSquareId > 0
            },
            canClaim() {
                return this.square.state === 'unclaimed' && (!this.poolConfig.isLocked || this.poolConfig.isAdmin)
            },
            canUnclaim() {
                if (this.square.state !== 'claimed') return false
                if (this.poolConfig.isLocked) return false
                if (this.isSecondary) return false
                return this.square.userId === this.poolConfig.userId
            },
            linkedSquares() {
                let ids = []
                if (this.square.parentSquareId > 0) {
                    ids.push(this.square.parentSquareId)
                }

                if (this.square.childSquareIds) {
                    this.square.childSquareIds.forEach(s => ids.push(s))
                }

                return ids.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
            },
            computedAnnotation() {
                return typeof(this.localAnnotation) !== 'undefined' ? this.localAnnotation : this.annotation
            }
        },
        methods: {
            claimSquare() {
                if (this.poolConfig.gridType === 'roll100') {
                    const pSq = this.$store.state.primarySquare
                    if (pSq) {
                        this.$store.commit('primarySquare', null)
                        sqmgrClient.claimSquareWithSecondary(this.poolConfig.token, pSq.squareId, this.square.squareId, pSq.name)
                            .then(() => ModalController.hideAll())
                            .catch(err => ModalController.showError(err))
                    }
                }

                ModalController.show('Claim Square', Claim, {
                    poolConfig: this.poolConfig,
                    squareId: this.square.squareId
                })
            },
            unclaimSquare() {
                sqmgrClient.unclaimSquare(this.poolConfig.token, this.square.squareId)
                    .then(() => ModalController.hide())
                    .catch(err => ModalController.showError(err))
            },
            stateDidChange() {
                ModalController.show('Note', Note, {}, {
                    save: note => {
                        sqmgrClient.setSquareState(this.poolConfig.token, this.square.squareId, this.form.state, note)
                            .then(() => {
                                ModalController.hide()
                                this.reloadData()
                            })
                            .catch(err => ModalController.showError(err.message))
                    },
                })
            },
            reloadData() {
                sqmgrClient.getSquareByTokenAndSquareId(this.poolConfig.token, this.square.squareId)
                    .then(res => this.loadedData = res)
            },
            onKeyup(event) {
                if (event.key === 'Escape') {
                    event.stopPropagation()
                    this.editClaimant = false
                }
            },
            saveNewClaimant() {
                if (this.newClaimant === this.square.claimant) {
                    this.editClaimant = false
                    return
                }

                if (this.newClaimant.match(/\w/)) {
                    sqmgrClient.renameSquare(this.poolConfig.token, this.square.squareId, this.newClaimant)
                        .then(res => {
                            this.loadedData = res;
                            this.editClaimant = false
                        })
                        .catch(err => ModalController.showError(err))
                }
            },
            showSquare(squareId) {
                ModalController.hide()
                setTimeout(() => {
                    sqmgrClient.getSquareByTokenAndSquareId(this.poolConfig.token, squareId)
                        .then(data => {
                            ModalController.show('Square Details', SquareDetails, {
                                data,
                                poolConfig: this.poolConfig,
                            })
                        })
                }, 200)
            },
            annotate() {
                ModalController.show('Annotate Square', Annotate, {
                    annotation: this.computedAnnotation,
                }, {
                    submit: ({ annotation, icon }) => {
                        if (!annotation) {
                            ModalController.hide()
                            return
                        }

                        sqmgrClient.setPoolGridSquareAnnotation(this.poolConfig.token, this.gridId, this.square.squareId, annotation, icon)
                            .then(res => {
                                this.localAnnotation = res
                                EventBus.emit('grid-updated')
                                ModalController.hide()
                            })
                        .catch(err => ModalController.showError(err))
                    }
                })
            },
            deleteAnnotation() {
                ModalController.showPrompt('Delete Annotation?', 'Do you want to delete the annotation?', {
                    actionButton: 'Delete',
                    isDestructive: true,
                    action: () => {
                        sqmgrClient.deletePoolGridSquareAnnotation(this.poolConfig.token, this.gridId, this.square.squareId)
                            .then(() => {
                                this.localAnnotation = null
                                EventBus.emit('grid-updated')
                                ModalController.hide()
                            })
                            .catch(err => ModalController.showError(err))
                    },
                })
            }
        },
        watch: {
            editClaimant(newVal) {
                if (newVal) {
                    this.newClaimant = this.square.claimant
                    this.$nextTick()
                        .then(() => {
                            this.$refs.claimantInput.select()
                        })
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    @use '../variables.scss' as *;

    table {
        width: 100%;

        td:last-child {
            font-weight: bold;
            text-align:  right;
        }
    }

    div.buttons {
        margin-top: $standard-spacing;
        text-align: left;
    }

    div.annotation {
        border-left: 5px solid $primary;
        margin-top:       $standard-spacing;
        padding-left: $standard-spacing;
        position:         relative;

        & > * {
            vertical-align: middle;
        }

        & > i {
            font-size: 2em;
            display: block;
            color: $primary;
            margin-bottom: $minimal-spacing;
            margin-right: $minimal-spacing;
        }

        a.delete-annotation {
            color:    $red;
            position: absolute;
            top:      $minimal-spacing;
            right:    $minimal-spacing;

            span {
                display: none;
            }
        }
    }
</style>