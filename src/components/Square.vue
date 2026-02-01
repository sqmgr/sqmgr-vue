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
    <div :class="divClasses" :style="winnerBorderStyle" @click.prevent="didClickSquare" @mouseenter="enter" @mouseleave="leave">
        <!-- Top left: winner badge OR owned indicator -->
        <span v-if="winningPeriods.length" class="winner-badge" :title="winnerTooltip">
            <span v-for="(item, index) in winnerPeriodsStyled" :key="item.period"
                  class="winner-period-label" :style="{ color: item.color }">
                {{ item.label }}<span v-if="index < winnerPeriodsStyled.length - 1" class="winner-separator">,</span>
            </span>
        </span>
        <i v-else-if="isOwned" class="fas fa-asterisk owned"></i>

        <!-- Top right: annotation icon OR square ID -->
        <i :class="`annotation-icon fas fa-${annotationIcon}`" v-if="annotationIcon"></i>
        <span class="square-id" v-else>{{ sqId }}</span>

        <span class="name">{{ squareData.claimant }}</span>
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
            },
            isExpanded: {
                type: Boolean,
                required: true,
            },
            winningPeriods: {
                type: Array,
                default: () => [],
            },
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
            isOwned() {
                return this.squareData.userId === this.poolConfig.userId
            },
            divClasses() {
                const obj = {
                    square: true,
                    held: this.isHeld,
                    secondary: this.isSecondary,
                    highlighted: this.isHighlighted,
                    annotated: this.annotation,
                    expanded: this.isExpanded,
                    owned: this.isOwned,
                    winner: this.winningPeriods.length > 0,
                }

                // Add specific winner classes for each period
                this.winningPeriods.forEach(period => {
                    obj[`winner-${period}`] = true
                })

                if (this.poolConfig.gridType !== 'roll100' || !this.isSecondary) {
                    obj[this.squareData.state] = true
                }

                return obj
            },
            winnerPeriodsStyled() {
                // Returns array of {period, label, color} for styled display
                const order = ['q1', 'half', 'q2', 'q3', 'final', 'all']
                const labels = {
                    'q1': '1',
                    'q2': '2',
                    'q3': '3',
                    'half': 'H',
                    'final': 'F',
                    'all': 'F',
                }
                const colors = {
                    'q1': '#4477aa',    // blue
                    'half': '#4477aa',  // blue
                    'q2': '#ee6677',    // red
                    'q3': '#228833',    // green
                    'final': '#ccbb44', // yellow
                    'all': '#ccbb44',   // yellow
                }
                const sorted = this.winningPeriods
                    .slice()
                    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
                return sorted.map(p => ({
                    period: p,
                    label: labels[p] || p,
                    color: colors[p] || '#b8860b',
                }))
            },
            winnerTooltip() {
                const labels = {
                    'q1': '1st Quarter',
                    'q2': '2nd Quarter',
                    'q3': '3rd Quarter',
                    'half': 'Halftime',
                    'final': 'Final',
                    'all': 'Final',
                }
                return 'Winner: ' + this.winningPeriods.map(p => labels[p] || p).join(', ')
            },
            winnerBorderStyle() {
                if (!this.winningPeriods.length) {
                    return {}
                }

                // Colors matching the legend
                const colors = {
                    'q1': '#4477aa',    // blue
                    'half': '#4477aa',  // blue (same as q1)
                    'q2': '#ee6677',    // red
                    'q3': '#228833',    // green
                    'final': '#ccbb44', // yellow
                    'all': '#ccbb44',   // yellow (same as final)
                }

                // Sort periods in order for border colors
                const order = ['q1', 'half', 'q2', 'q3', 'final', 'all']
                const sorted = this.winningPeriods
                    .slice()
                    .sort((a, b) => order.indexOf(a) - order.indexOf(b))

                // Get colors for each winning period
                const winColors = sorted.map(p => colors[p] || '#daa520')

                // Determine background color - priority: Final > Half > 3rd > 1st
                const bgPriority = ['final', 'all', 'half', 'q3', 'q1', 'q2']
                let bgColor = null
                for (const p of bgPriority) {
                    if (this.winningPeriods.includes(p)) {
                        bgColor = colors[p]
                        break
                    }
                }

                const style = {
                    borderWidth: '3px',
                    background: bgColor ? `${bgColor}22` : undefined, // 22 = ~13% opacity in hex
                }

                if (winColors.length === 1) {
                    // Single winner: all borders same color
                    style.borderColor = winColors[0]
                } else if (winColors.length === 2) {
                    // Two winners: top/right = 1st, bottom/left = 2nd
                    style.borderColor = `${winColors[0]} ${winColors[0]} ${winColors[1]} ${winColors[1]}`
                } else {
                    // 3+ winners: top, right, bottom, left
                    const top = winColors[0]
                    const right = winColors[1]
                    const bottom = winColors[2]
                    const left = winColors[3] || top
                    style.borderColor = `${top} ${right} ${bottom} ${left}`
                }

                return style
            },
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
                    .catch(err => ModalController.showError(err))
            }
        }
    }
</script>

<style scoped lang="scss">
    @use '../variables' as *;

    .annotation-icon {
        color:     $primary;
        position:  absolute;
        top:       2px;
        right:     2px;
        font-size: 1rem;
        z-index:   1;
    }

    .winner-badge {
        position:      absolute;
        top:           2px;
        left:          2px;
        display:       flex;
        align-items:   center;
        z-index:       10;

        .winner-period-label {
            font-weight: 700;
            font-size:   0.8rem;
            line-height: 1;
        }

        .winner-separator {
            color:       #999;
            margin-right: 1px;
        }
    }

    span.name {
        overflow:        hidden;
        text-overflow:   '-';
        position:        relative;
        z-index:         2;
        text-align:      center;
        text-align-last: center;
    }

    @include mobile {
        div.square:not(.expanded) {
            font-size: 0.6em;

            &::after {
                display: none;
            }

            .square-id {
                display: none;
            }

            .owned {
                color: $yellow;
            }

            .winner-badge {
                .winner-period-label {
                    font-size: 0.6rem;
                }

                .winner-separator {
                    display: none;
                }
            }
        }
    }
</style>
