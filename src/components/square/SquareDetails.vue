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
                    <template v-else-if="poolConfig.isAdmin && !isSecondary">
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

        <div class="winning-periods"
             v-if="square.winningPeriods && square.winningPeriods.length"
             :style="winningPeriodsBoxStyle">
            <div v-for="period in square.winningPeriods" :key="period.period"
                 class="winning-period">
                <div class="winning-period-label">{{ period.label }}</div>
                <div class="winning-period-score">{{ period.awayTeamName }} {{ period.awayScore }} - {{ period.homeTeamName }} {{ period.homeScore }}</div>
            </div>
        </div>

        <div class="annotation" v-if="computedAnnotation" :style="annotationStyle">
            <i :class="`fas fa-${annotationIcon}`" v-if="annotationIcon" :style="annotationIconStyle"></i>

            <span>{{ computedAnnotation.annotation }}</span>

            <a class="delete-annotation" href="#" @click.prevent="deleteAnnotation" v-if="poolConfig.isAdmin"><i
                    class="fas fa-times"></i><span>Delete</span></a>
        </div>

        <div class="buttons" v-if="canClaim || canUnclaim || poolConfig.isAdmin">
            <button type="button" @click.prevent="annotate" v-if="poolConfig.isAdmin" class="secondary">Add Symbol</button>
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
    import Logs from '../pool/Logs.vue'
    import Claim from './Claim.vue'
    import Note from '../ui/Note.vue'
    import Common from '../../common'
    import ModalController from '@/controllers/ModalController'
    import sqmgrClient from "@/models/sqmgrClient";
    import sqmgrConfig from "@/models/sqmgrConfig";
    import SquareDetails from '@/components/square/SquareDetails'
    import EventBus from "@/models/EventBus";
    import { GRID_UPDATED, MODAL_HIDE } from "@/constants/events";
    import Annotate from "@/components/square/Annotate";
    import { useSquareHighlight } from "@/composables/useSquareHighlight";

    export default {
        name: "SquareDetails",
        setup() {
            const { state: highlightState, setPrimarySquare } = useSquareHighlight()
            return { highlightState, setPrimarySquare }
        },
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
            },
            primaryWinnerColor() {
                if (!this.square.winningPeriods?.length) return null

                const colors = {
                    'q1': '#33bbee',
                    'half': '#33bbee',
                    'q2': '#cc3311',
                    'q3': '#ee7733',
                    'final': '#009988',
                    'all': '#009988',
                }
                const priority = ['final', 'all', 'half', 'q3', 'q1', 'q2']
                const periods = this.square.winningPeriods.map(p => p.period)

                for (const p of priority) {
                    if (periods.includes(p)) {
                        return colors[p]
                    }
                }
                return colors[periods[0]] || '#009988'
            },
            winningPeriodsBoxStyle() {
                const color = this.primaryWinnerColor
                if (!color) return {}
                return {
                    borderLeftColor: color,
                    background: `${color}14`,
                }
            },
            annotationStyle() {
                const color = this.primaryWinnerColor
                if (!color) return {}
                return {
                    borderLeftColor: color,
                }
            },
            annotationIconStyle() {
                const color = this.primaryWinnerColor
                if (!color) return {}
                return {
                    color: color,
                }
            }
        },
        methods: {
            claimSquare() {
                if (this.poolConfig.gridType === 'roll100') {
                    const pSq = this.highlightState.primarySquare
                    if (pSq) {
                        this.setPrimarySquare(null)
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
                const previousState = this.square.state
                let saving = false

                const revertOnCancel = () => {
                    if (!saving) {
                        this.form.state = previousState
                    }
                    ModalController.bus.off(MODAL_HIDE, revertOnCancel)
                }
                ModalController.bus.on(MODAL_HIDE, revertOnCancel)

                ModalController.show('Note', Note, {}, {
                    save: note => {
                        saving = true
                        sqmgrClient.setSquareState(this.poolConfig.token, this.square.squareId, this.form.state, note)
                            .then(() => {
                                ModalController.hide()
                                this.reloadData()
                            })
                            .catch(err => {
                                this.form.state = previousState
                                ModalController.showError(err.message)
                            })
                    },
                })
            },
            reloadData() {
                sqmgrClient.getSquareByTokenAndSquareId(this.poolConfig.token, this.square.squareId, this.gridId)
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
                    sqmgrClient.getSquareByTokenAndSquareId(this.poolConfig.token, squareId, this.gridId)
                        .then(data => {
                            ModalController.show('Square Details', SquareDetails, {
                                data,
                                gridId: this.gridId,
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
                                EventBus.emit(GRID_UPDATED)
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
                                EventBus.emit(GRID_UPDATED)
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
    @use '../../variables.scss' as *;

    table {
        width: 100%;

        td:last-child {
            font-weight: bold;
            text-align:  right;
        }
    }

    div.buttons {
        margin-top: $standard-spacing;
        text-align: center;
    }

    div.winning-periods {
        border-left:   5px solid;
        border-radius: 0 $minimal-spacing $minimal-spacing 0;
        margin-top:    $standard-spacing;
        padding:       $minimal-spacing $standard-spacing;

        .winning-period {
            &:not(:first-child) {
                margin-top: $minimal-spacing;
            }

            .winning-period-label {
                font-weight: 600;
            }

            .winning-period-score {
                font-weight:          600;
                font-variant-numeric: tabular-nums;
            }
        }
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