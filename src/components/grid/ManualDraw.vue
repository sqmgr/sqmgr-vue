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
    <section class="manual-draw">
        <form @submit.prevent="submit" class="standalone">
            <p>Instead of letting SqMGR randomly draw the numbers, you can manually input them below. This action cannot
                be undone.</p>

            <warning-box v-if="!allSquaresClaimed" warning="Not all squares have been claimed yet"/>

            <div v-if="!isLocked" class="field checkbox-field">
                <label>
                    <input type="checkbox" v-model="lockPool"/>
                    Lock squares to prevent further changes
                </label>
            </div>

            <!-- Single set mode (legacy "standard" config) -->
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
                        <i v-if="isSetComplete(setType)" class="fas fa-check-circle"></i>
                        <i v-else class="fa-regular fa-circle"></i>
                        <span class="tab-label">{{ getSetLabel(setType) }}</span>
                    </button>
                </div>

                <div class="tab-content" v-for="setType in setTypes" :key="setType" v-show="activeTab === setType">
                    <div class="field">
                        <label :style="homeTeamLabelStyle">{{ grid.homeTeamName }} ({{ getSetLabel(setType) }})</label>
                        <manual-draw-numbers :ref="el => setNumberSetRef(setType, 'home', el)"
                                             v-model="numberSets[setType].home"/>
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
import ManualDrawNumbers from "@/components/grid/ManualDrawNumbers"
import ModalController from "@/controllers/ModalController"
import WarningBox from "@/components/ui/WarningBox"
import sqmgrConfig from "@/models/sqmgrConfig"
import { getShortLabelSync } from "@/models/periodLabels"

export default {
    name: "ManualDraw",
    components: {WarningBox, ManualDrawNumbers},
    props: {
        allSquaresClaimed: {
            type: Boolean,
            required: true,
        },
        isLocked: {
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
            default: () => ({}),
        },
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
            // Lock pool option
            lockPool: true,
            // Config from API
            sqmgrConfigData: null,
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
            return !this.pool.numberSetConfig || this.pool.numberSetConfig === 'standard'
        },
        setTypes() {
            const config = this.pool.numberSetConfig
            const configMap = {
                '1234': ['q1', 'q2', 'q3', 'q4'],
                '123f': ['q1', 'q2', 'q3', 'final'],
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
        },
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
                                },
                            }
                        }
                    })
                    // Set initial active tab
                    if (!this.activeTab) {
                        this.activeTab = types[0]
                    }
                }
            },
        },
    },
    mounted() {
        if (this.isSingleSetMode) {
            this.$refs.homeNumbers.select()
        }
    },
    created() {
        sqmgrConfig().then(config => this.sqmgrConfigData = config)
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
                }, this.lockPool)
            } else {
                const numberSets = {}
                this.setTypes.forEach(st => {
                    numberSets[st] = {
                        homeTeamNumbers: this.numberSets[st].home.numbers.map(n => parseInt(n, 10)),
                        awayTeamNumbers: this.numberSets[st].away.numbers.map(n => parseInt(n, 10)),
                    }
                })
                this.$emit('drawMultiSet', numberSets, this.lockPool)
            }
        },
        labelStyle(c1, c2) {
            return `background: linear-gradient(to bottom, ${c1}, ${c1} calc(50% - 1px), #fff calc(50% - 1px), #fff calc(50% + 1px), ${c2} calc(50% + 1px))`
        },
        isSetComplete(setType) {
            const set = this.numberSets[setType]
            return set && set.home.valid && set.away.valid
        },
        getSetLabel(setType) {
            return getShortLabelSync(this.sqmgrConfigData, setType)
        },
    },
}
</script>

<style scoped lang="scss">
@use '../../variables.scss' as *;

label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size:   1.2em;
    color:       #fff;
    padding:     $minimal-spacing;
    text-align:  center;
    text-shadow: 0 0 3px rgba(black, 0.8);
}

.tab-content {
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.progress-indicator {
    text-align:    center;
    padding:       $minimal-spacing;
    color:         $text-secondary;
    font-size:     0.9em;
    margin-bottom: $standard-spacing;
}

.checkbox-field {
    margin: $standard-spacing 0;

    label {
        display:     flex;
        align-items: center;
        gap:         $minimal-spacing;
        cursor:      pointer;
        font-size:   0.95em;
        color:       $text-color;
        font-family: inherit;
        text-shadow: none;
        padding:     0;
        text-align:  left;
        background:  none;

        input[type="checkbox"] {
            width:        18px;
            height:       18px;
            cursor:       pointer;
            margin-right: $minimal-spacing;
        }
    }
}
</style>
