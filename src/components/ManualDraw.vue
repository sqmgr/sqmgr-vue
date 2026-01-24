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
    <section class="manual-draw">
        <form @submit.prevent="submit" class="standalone">
            <p>Instead of letting SqMGR randomly draw the numbers, you can manually input them below. This action cannot be undone.</p>

            <warning-box v-if="!allSquaresClaimed" warning="Not all squares have been claimed yet" />

            <!-- Single set mode (legacy "same" config) -->
            <template v-if="isSingleSetMode">
                <div class="field">
                    <label :style="homeTeamLabelStyle">{{ grid.homeTeamName }}</label>
                    <manual-draw-numbers ref="homeNumbers" v-model="homeNumbers"/>
                </div>
                <div class="field">
                    <label :style="awayTeamLabelStyle">{{ grid.awayTeamName }}</label>
                    <manual-draw-numbers v-model="awayNumbers"/>
                </div>
            </template>

            <!-- Multi-set mode -->
            <template v-else>
                <div class="tabs">
                    <button
                        v-for="setType in setTypes"
                        :key="setType"
                        type="button"
                        :class="['tab', { active: activeTab === setType, complete: isSetComplete(setType) }]"
                        @click="activeTab = setType"
                    >
                        <span class="tab-label">{{ getSetLabel(setType) }}</span>
                        <i v-if="isSetComplete(setType)" class="fas fa-check-circle"></i>
                    </button>
                </div>

                <div class="tab-content" v-for="setType in setTypes" :key="setType" v-show="activeTab === setType">
                    <div class="field">
                        <label :style="homeTeamLabelStyle">{{ grid.homeTeamName }} ({{ getSetLabel(setType) }})</label>
                        <manual-draw-numbers :ref="el => setNumberSetRef(setType, 'home', el)" v-model="numberSets[setType].home"/>
                    </div>
                    <div class="field">
                        <label :style="awayTeamLabelStyle">{{ grid.awayTeamName }} ({{ getSetLabel(setType) }})</label>
                        <manual-draw-numbers v-model="numberSets[setType].away"/>
                    </div>
                </div>

                <div class="progress-indicator">
                    <span>{{ completedSetsCount }} of {{ setTypes.length }} sets complete</span>
                </div>
            </template>

            <div class="buttons">
                <button type="button" class="secondary" @click="cancel">Cancel</button>
                <button :disabled="!canSubmit" type="submit">Draw</button>
            </div>
        </form>
    </section>
</template>

<script>
    import ManualDrawNumbers from "@/components/ManualDrawNumbers";
    import ModalController from "@/controllers/ModalController";
    import WarningBox from "@/components/WarningBox";

    export default {
        name: "ManualDraw",
        components: {WarningBox, ManualDrawNumbers},
        props: {
            allSquaresClaimed: {
                type: Boolean,
                required: true,
            },
            grid: {
                type: Object,
                required: true,
            },
            pool: {
                type: Object,
                required: true,
            },
            numberSetTypeInfos: {
                type: Object,
                default: () => ({})
            }
        },
        emits: ['draw', 'drawMultiSet'],
        data() {
            return {
                // Single set mode
                homeNumbers: {
                    valid: false,
                    numbers: ['', '', '', '', '', '', '', '', '', ''],
                },
                awayNumbers: {
                    valid: false,
                    numbers: ['', '', '', '', '', '', '', '', '', ''],
                },
                // Multi-set mode
                activeTab: null,
                numberSets: {},
                numberSetRefs: {},
            }
        },
        computed: {
            homeTeamLabelStyle() {
                return this.labelStyle(this.grid.settings.homeTeamColor1, this.grid.settings.homeTeamColor2)
            },
            awayTeamLabelStyle() {
                return this.labelStyle(this.grid.settings.awayTeamColor1, this.grid.settings.awayTeamColor2)
            },
            isSingleSetMode() {
                return !this.pool.numberSetConfig || this.pool.numberSetConfig === 'same'
            },
            setTypes() {
                const config = this.pool.numberSetConfig
                const configMap = {
                    'q1234': ['q1', 'q2', 'q3', 'q4'],
                    'q123f': ['q1', 'q2', 'q3', 'final'],
                    'hf': ['half', 'final'],
                    'h4': ['half', 'q4'],
                }
                return configMap[config] || []
            },
            canSubmit() {
                if (this.isSingleSetMode) {
                    return this.homeNumbers.valid && this.awayNumbers.valid
                }
                return this.completedSetsCount === this.setTypes.length
            },
            completedSetsCount() {
                return this.setTypes.filter(st => this.isSetComplete(st)).length
            }
        },
        watch: {
            setTypes: {
                immediate: true,
                handler(types) {
                    if (!this.isSingleSetMode && types.length > 0) {
                        // Initialize number sets for each type
                        types.forEach(st => {
                            if (!this.numberSets[st]) {
                                this.numberSets[st] = {
                                    home: {
                                        valid: false,
                                        numbers: ['', '', '', '', '', '', '', '', '', ''],
                                    },
                                    away: {
                                        valid: false,
                                        numbers: ['', '', '', '', '', '', '', '', '', ''],
                                    }
                                }
                            }
                        })
                        // Set initial active tab
                        if (!this.activeTab) {
                            this.activeTab = types[0]
                        }
                    }
                }
            }
        },
        mounted() {
            if (this.isSingleSetMode) {
                this.$refs.homeNumbers.select()
            }
        },
        methods: {
            setNumberSetRef(setType, team, el) {
                if (!this.numberSetRefs[setType]) {
                    this.numberSetRefs[setType] = {}
                }
                this.numberSetRefs[setType][team] = el
            },
            cancel() {
                ModalController.hide()
            },
            submit() {
                if (this.isSingleSetMode) {
                    this.$emit('draw', {
                        homeNumbers: this.homeNumbers.numbers.map(n => parseInt(n, 10)),
                        awayNumbers: this.awayNumbers.numbers.map(n => parseInt(n, 10)),
                    })
                } else {
                    const numberSets = {}
                    this.setTypes.forEach(st => {
                        numberSets[st] = {
                            homeTeamNumbers: this.numberSets[st].home.numbers.map(n => parseInt(n, 10)),
                            awayTeamNumbers: this.numberSets[st].away.numbers.map(n => parseInt(n, 10)),
                        }
                    })
                    this.$emit('drawMultiSet', numberSets)
                }
            },
            labelStyle(c1, c2) {
                return `background: linear-gradient(to bottom, ${c1}, ${c1} calc(50% - 1px), #fff calc(50% - 1px), #fff calc(50% + 1px), ${c2} calc(50% + 1px))`;
            },
            isSetComplete(setType) {
                const set = this.numberSets[setType]
                return set && set.home.valid && set.away.valid
            },
            getSetLabel(setType) {
                const labels = {
                    'q1': '1st',
                    'q2': '2nd',
                    'q3': '3rd',
                    'q4': '4th',
                    'half': 'Half',
                    'final': 'Final',
                    'all': 'All'
                }
                return labels[setType] || setType
            }
        }
    }
</script>

<style scoped lang="scss">
    @use '../variables.scss' as *;

    label {
        font-family: 'Alfa Slab One', sans-serif;
        font-size:   1.2em;
        color:       #fff;
        padding:     $minimal-spacing;
        text-align:  center;
        text-shadow: 0 0 3px rgba(black, 0.8);
    }

    .tabs {
        display: flex;
        gap: $minimal-spacing;
        margin-bottom: $standard-spacing;
        flex-wrap: wrap;
    }

    .tab {
        padding: $minimal-spacing $standard-spacing;
        border: 1px solid $border-color;
        border-radius: $radius-md;
        background: $surface-elevated;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: $minimal-spacing;
        transition: all 0.2s ease;

        &:hover {
            background: $light-gray;
        }

        &.active {
            background: $primary;
            color: white;
            border-color: $primary;
        }

        &.complete {
            border-color: $primary;

            i {
                color: $primary;
            }

            &.active i {
                color: white;
            }
        }

        .tab-label {
            font-weight: 600;
        }
    }

    .tab-content {
        animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .progress-indicator {
        text-align: center;
        padding: $minimal-spacing;
        color: $text-secondary;
        font-size: 0.9em;
        margin-bottom: $standard-spacing;
    }
</style>
