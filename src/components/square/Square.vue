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
    <div :class="divClasses" :style="winnerBorderStyle" @click.prevent="didClickSquare" @mouseenter="enter"
         @mouseleave="leave">
        <!-- Top left: winner badge OR owned indicator -->
        <span v-if="winningPeriods.length" class="winner-badge" :title="winnerTooltip">
            <span v-for="(item, index) in winnerPeriodsStyled" :key="item.period"
                  class="winner-period-label" :style="{ color: item.color }">
                {{ item.label }}<span v-if="index < winnerPeriodsStyled.length - 1" class="winner-separator">,</span>
            </span>
        </span>
        <i v-else-if="isOwned" class="fas fa-asterisk owned"></i>

        <!-- Top right: annotation icon OR square ID -->
        <i :class="`annotation-icon fas fa-${annotationIcon}`" v-if="annotationIcon" :style="annotationIconStyle"></i>
        <span class="square-id" v-else>{{ sqId }}</span>

        <span class="name">{{ squareData.claimant }}</span>

        <!-- Payment status badge (admin only, toggleable) -->
        <span
            v-if="paymentStateBadge"
            class="payment-badge"
            :style="{ backgroundColor: paymentStateBadge.color }"
            :title="paymentStateBadge.tooltip">
            {{ paymentStateBadge.label }}
        </span>
    </div>
</template>

<script>
import SquareDetails from './SquareDetails.vue'
import ModalController from '@/controllers/ModalController'
import sqmgrClient from "@/models/sqmgrClient"
import sqmgrConfig from "@/models/sqmgrConfig"
import { getLongLabelSync } from "@/models/periodLabels"
import { useSquareHighlight } from "@/composables/useSquareHighlight"

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
        showPaymentStates: {
            type: Boolean,
            default: false,
        },
    },
    setup() {
        const { state: highlightState, setPrimarySquare, setHighlightSquares } = useSquareHighlight()
        return { highlightState, setPrimarySquare, setHighlightSquares }
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
            const primarySquare = this.highlightState.primarySquare
            if (!primarySquare) {
                return
            }

            return primarySquare.squareId === this.sqId
        },
        isSecondary() {
            return this.squareData.parentSquareId > 0
        },
        isHighlighted() {
            return this.highlightState.highlightSquares[this.sqId]
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
                'q1': '#33bbee',    // cyan
                'half': '#33bbee',  // cyan
                'q2': '#cc3311',    // red
                'q3': '#ee7733',    // orange
                'final': '#009988', // teal
                'all': '#009988',   // teal
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
            return 'Winner: ' + this.winningPeriods.map(p => getLongLabelSync(this.sqmgrConfig, p)).join(', ')
        },
        winnerBorderStyle() {
            if (!this.winningPeriods.length) {
                return {}
            }

            // Colors matching the legend
            const colors = {
                'q1': '#33bbee',    // cyan
                'half': '#33bbee',  // cyan (same as q1)
                'q2': '#cc3311',    // red
                'q3': '#ee7733',    // orange
                'final': '#009988', // teal
                'all': '#009988',   // teal (same as final)
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
        annotationIconStyle() {
            if (!this.winningPeriods.length) {
                return {}
            }

            const colors = {
                'q1': '#33bbee',
                'half': '#33bbee',
                'q2': '#cc3311',
                'q3': '#ee7733',
                'final': '#009988',
                'all': '#009988',
            }

            // Use same priority as border background
            const bgPriority = ['final', 'all', 'half', 'q3', 'q1', 'q2']
            for (const p of bgPriority) {
                if (this.winningPeriods.includes(p)) {
                    return { color: colors[p] }
                }
            }

            return {}
        },
        paymentStateBadge() {
            // Only show if admin has toggled the feature on
            if (!this.showPaymentStates || !this.poolConfig.isAdmin) {
                return null
            }

            const state = this.squareData.state

            // No badge needed for unclaimed squares (handled by pulsing background)
            if (state === 'unclaimed') {
                return null
            }

            const badges = {
                'claimed': {
                    color: '#9ca3af',
                    label: 'C',
                    tooltip: 'Claimed - Payment pending'
                },
                'paid-partial': {
                    color: '#f5a623',
                    label: 'P',
                    tooltip: 'Partially paid'
                },
                'paid-full': {
                    color: 'var(--success)',
                    label: '✓',
                    tooltip: 'Fully paid'
                },
            }

            return badges[state] || null
        },
    },
    mounted() {
        sqmgrConfig()
            .then(res => this.sqmgrConfig = res)
            .catch(err => ModalController.showError(err))
    },
    methods: {
        updateHighlightSquares(highlight) {
            const highlightSquares = { ...this.highlightState.highlightSquares }
            const {parentSquareId, childSquareIds} = this.squareData
            if (parentSquareId > 0) {
                highlightSquares[parentSquareId] = highlight
            }

            if (childSquareIds) {
                childSquareIds.forEach(id => highlightSquares[id] = highlight)
            }

            this.setHighlightSquares(highlightSquares)
        },
        enter() {
            this.updateHighlightSquares(true)
        },
        leave() {
            this.updateHighlightSquares(false)
        },
        didClickSquare() {
            if (this.isHeld) {
                this.setPrimarySquare(null)
                return
            }

            sqmgrClient.getSquareByTokenAndSquareId(this.poolConfig.token, this.sqId, this.gridId)
                .then(data => {
                    ModalController.show('Square Details', SquareDetails, {
                        data,
                        annotation: this.annotation,
                        gridId: this.gridId,
                        poolConfig: this.poolConfig,
                    })
                })
                .catch(err => ModalController.showError(err))
        },
    },
}
</script>

<style scoped lang="scss">
@use '../../variables' as *;

.annotation-icon {
    color:      $primary;
    position:   absolute;
    top:        2px;
    right:      2px;
    font-size:  0.8rem;
    z-index:    1;
    text-align: right;
}

.winner-badge {
    position:    absolute;
    top:         2px;
    left:        2px;
    display:     flex;
    align-items: center;
    z-index:     1;

    .winner-period-label {
        font-weight: 700;
        font-size:   0.8rem;
        line-height: 1;
    }

    .winner-separator {
        color:        #999;
        margin-right: 1px;
    }
}

span.name {
    position:        relative;
    z-index:         2;
    text-align:      center;
    text-align-last: center;
    color:           $text-color;
    display:         block;
    width:           100%;
    max-height:      100%;
    text-wrap:       balance;
    overflow:        hidden;
    line-height:     1.1;
    overflow-wrap:   break-word;
    word-break:      break-word;
}

@include mobile {
    div.square:not(.expanded) {
        font-size: 0.6rem;

        &::after {
            display: none;
        }

        .square-id {
            display: none;
        }

        .owned {
            color: $yellow;
        }

        .annotation-icon {
            font-size: 0.6rem;
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

.payment-badge {
    position:         absolute;
    bottom:           2px;
    right:            2px;
    width:            16px;
    height:           16px;
    display:          flex;
    align-items:      center;
    justify-content:  center;
    border-radius:    50%;
    font-size:        0.6rem;
    font-weight:      700;
    color:            #fff;
    z-index:          3;
    line-height:      1;

    @include mobile {
        width:      12px;
        height:     12px;
        font-size:  0.5rem;
    }
}

// Hide payment badges on mobile when grid is in shrink mode
.square:not(.expanded) {
    @include mobile {
        .payment-badge {
            display: none;
        }
    }
}

@media print {
    .payment-badge {
        display: none !important;
    }
}
</style>
