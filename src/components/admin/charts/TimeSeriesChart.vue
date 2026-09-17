/*
Copyright 2026 Tom Peters

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
    <div class="time-series-chart">
        <div v-if="points.length === 0" class="empty">No data for this range.</div>
        <template v-else>
            <svg
                :viewBox="`0 0 ${width} ${height}`"
                role="group"
                aria-roledescription="line chart"
                :aria-label="ariaLabel"
                tabindex="0"
                @mousemove="onMouseMove"
                @mouseleave="hoverIndex = null"
                @focus="onFocus"
                @blur="hoverIndex = null"
                @keydown.left.prevent="moveHover(-1)"
                @keydown.right.prevent="moveHover(1)"
            >
                <!-- gridlines and y-axis ticks -->
                <g class="grid">
                    <line
                        v-for="tick in yTicks"
                        :key="`grid-${tick}`"
                        :x1="plot.left"
                        :x2="plot.right"
                        :y1="yScale(tick)"
                        :y2="yScale(tick)"
                        class="gridline"
                    />
                    <text
                        v-for="tick in yTicks"
                        :key="`ytick-${tick}`"
                        :x="plot.left - 8"
                        :y="yScale(tick) + 4"
                        text-anchor="end"
                        class="tick-label"
                    >{{ formatNumber(tick) }}</text>
                </g>

                <!-- baseline -->
                <line :x1="plot.left" :x2="plot.right" :y1="plot.bottom" :y2="plot.bottom" class="baseline"/>

                <!-- x-axis labels -->
                <g class="x-axis">
                    <text
                        v-for="idx in xLabelIndexes"
                        :key="`xtick-${idx}`"
                        :x="xScale(idx)"
                        :y="plot.bottom + 20"
                        text-anchor="middle"
                        class="tick-label"
                    >{{ axisLabel(points[idx].period) }}</text>
                </g>

                <!-- marks -->
                <path :d="areaPath" class="area"/>
                <path :d="linePath" class="line"/>

                <!-- direct label at the end of the series -->
                <g v-if="points.length > 0" class="end-mark">
                    <circle :cx="xScale(lastIndex)" :cy="yScale(points[lastIndex].count)" r="6" class="ring"/>
                    <circle :cx="xScale(lastIndex)" :cy="yScale(points[lastIndex].count)" r="4" class="dot"/>
                    <text
                        :x="xScale(lastIndex) + 10"
                        :y="yScale(points[lastIndex].count) + 4"
                        text-anchor="start"
                        class="end-label"
                    >{{ formatNumber(points[lastIndex].count) }}</text>
                </g>

                <!-- hover layer -->
                <g v-if="hoverIndex !== null" class="hover">
                    <line
                        :x1="xScale(hoverIndex)"
                        :x2="xScale(hoverIndex)"
                        :y1="plot.top"
                        :y2="plot.bottom"
                        class="crosshair"
                    />
                    <circle :cx="xScale(hoverIndex)" :cy="yScale(points[hoverIndex].count)" r="6" class="ring"/>
                    <circle :cx="xScale(hoverIndex)" :cy="yScale(points[hoverIndex].count)" r="4" class="dot"/>
                    <g :transform="`translate(${tooltipX}, ${tooltipY})`">
                        <rect :width="tooltipWidth" height="46" rx="6" class="tooltip-bg"/>
                        <text x="10" y="19" class="tooltip-value">{{ formatNumber(points[hoverIndex].count) }}</text>
                        <text x="10" y="37" class="tooltip-label">{{ fullLabel(points[hoverIndex].period) }}</text>
                    </g>
                </g>
            </svg>

            <!-- announces the focused/hovered point for screen readers -->
            <p class="sr-only" aria-live="polite">{{ liveText }}</p>

            <details class="data-table">
                <summary>Show data table</summary>
                <table>
                    <thead>
                    <tr>
                        <th>Period</th>
                        <th class="numeric">{{ metricLabel }}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="point in points" :key="point.period">
                        <td>{{ fullLabel(point.period) }}</td>
                        <td class="numeric">{{ formatNumber(point.count) }}</td>
                    </tr>
                    </tbody>
                </table>
            </details>
        </template>
    </div>
</template>

<script>
import { formatNumber } from "@/utils/adminFormat"

const WIDTH = 800
const HEIGHT = 300
const MARGIN = { top: 28, right: 72, bottom: 44, left: 64 }

export default {
    name: "TimeSeriesChart",
    props: {
        points: {
            type: Array,
            default: () => [],
        },
        interval: {
            type: String,
            default: 'day',
        },
        metricLabel: {
            type: String,
            default: 'Count',
        },
    },
    data() {
        return {
            width: WIDTH,
            height: HEIGHT,
            hoverIndex: null,
            tooltipWidth: 150,
        }
    },
    computed: {
        plot() {
            return {
                left: MARGIN.left,
                right: WIDTH - MARGIN.right,
                top: MARGIN.top,
                bottom: HEIGHT - MARGIN.bottom,
            }
        },
        lastIndex() {
            return this.points.length - 1
        },
        tickStep() {
            const max = Math.max(0, ...this.points.map(p => p.count || 0))
            return this.niceStep(max)
        },
        maxValue() {
            const max = Math.max(0, ...this.points.map(p => p.count || 0))
            return Math.max(this.tickStep, Math.ceil(max / this.tickStep) * this.tickStep)
        },
        yTicks() {
            const ticks = []
            for (let value = 0; value <= this.maxValue; value += this.tickStep) {
                ticks.push(value)
            }
            return ticks
        },
        xLabelIndexes() {
            const count = this.points.length
            if (count <= 7) {
                return this.points.map((_, i) => i)
            }
            const labels = 6
            const step = (count - 1) / (labels - 1)
            const indexes = new Set()
            for (let i = 0; i < labels; i++) {
                indexes.add(Math.round(i * step))
            }
            return [...indexes]
        },
        linePath() {
            return this.points
                .map((p, i) => `${i === 0 ? 'M' : 'L'}${this.xScale(i)} ${this.yScale(p.count)}`)
                .join(' ')
        },
        areaPath() {
            if (this.points.length === 0) return ''
            return `${this.linePath} L${this.xScale(this.lastIndex)} ${this.plot.bottom} L${this.xScale(0)} ${this.plot.bottom} Z`
        },
        tooltipX() {
            const x = this.xScale(this.hoverIndex)
            // flip to the left of the crosshair near the right edge
            if (x + 14 + this.tooltipWidth > this.plot.right) {
                return x - 14 - this.tooltipWidth
            }
            return x + 14
        },
        tooltipY() {
            const y = this.yScale(this.points[this.hoverIndex].count) - 56
            return Math.max(this.plot.top, y)
        },
        ariaLabel() {
            const total = this.points.reduce((sum, p) => sum + (p.count || 0), 0)
            return `${this.metricLabel} by ${this.interval}, ${this.points.length} periods, ${formatNumber(total)} total. Use the left and right arrow keys to move between points.`
        },
        liveText() {
            if (this.hoverIndex === null || !this.points[this.hoverIndex]) return ''
            const point = this.points[this.hoverIndex]
            return `${this.fullLabel(point.period)}: ${formatNumber(point.count)} ${this.metricLabel}`
        },
    },
    watch: {
        points() {
            this.hoverIndex = null
        },
    },
    methods: {
        formatNumber,

        // niceStep picks a 1/2/5 x 10^n tick step that yields about four
        // gridlines with clean, whole-number tick values.
        niceStep(max) {
            if (max <= 4) return 1
            const rawStep = max / 4
            const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)))
            const candidates = [1, 2, 5, 10].map(m => m * magnitude)
            return candidates.find(step => step >= rawStep) || candidates[candidates.length - 1]
        },

        xScale(index) {
            if (this.points.length <= 1) {
                return (this.plot.left + this.plot.right) / 2
            }
            const span = this.plot.right - this.plot.left
            return this.plot.left + (span * index) / (this.points.length - 1)
        },

        yScale(value) {
            const span = this.plot.bottom - this.plot.top
            return this.plot.bottom - (span * (value || 0)) / this.maxValue
        },

        periodDate(period) {
            // periods are UTC calendar days; pin them to UTC so the label
            // does not drift by a day in western time zones
            return new Date(`${period}T00:00:00Z`)
        },

        axisLabel(period) {
            const date = this.periodDate(period)
            if (isNaN(date.getTime())) return period
            switch (this.interval) {
                case 'year':
                    return date.toLocaleDateString(undefined, { year: 'numeric', timeZone: 'UTC' })
                case 'month':
                    return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit', timeZone: 'UTC' })
                default:
                    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' })
            }
        },

        fullLabel(period) {
            const date = this.periodDate(period)
            if (isNaN(date.getTime())) return period
            switch (this.interval) {
                case 'year':
                    return date.toLocaleDateString(undefined, { year: 'numeric', timeZone: 'UTC' })
                case 'month':
                    return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric', timeZone: 'UTC' })
                case 'week':
                    return `Week of ${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}`
                default:
                    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
            }
        },

        onMouseMove(event) {
            if (this.points.length === 0) return
            const rect = event.currentTarget.getBoundingClientRect()
            const x = ((event.clientX - rect.left) * WIDTH) / rect.width
            const span = this.plot.right - this.plot.left
            const fraction = Math.min(1, Math.max(0, (x - this.plot.left) / span))
            this.hoverIndex = Math.round(fraction * this.lastIndex)
        },

        onFocus() {
            if (this.points.length > 0 && this.hoverIndex === null) {
                this.hoverIndex = this.lastIndex
            }
        },

        moveHover(delta) {
            if (this.points.length === 0) return
            const current = this.hoverIndex === null ? this.lastIndex : this.hoverIndex
            this.hoverIndex = Math.min(this.lastIndex, Math.max(0, current + delta))
        },
    },
}
</script>

<style scoped lang="scss">
@use '../../../variables' as *;

.time-series-chart {
    --viz-series:  #{$primary};
    --viz-surface: #{$surface-elevated};
    --viz-grid:    #{$light-gray};
    --viz-axis:    #{$border-color};
    --viz-text:    #{$text-color};
    --viz-muted:   #{$dark-gray};

    svg {
        display: block;
        width:   100%;
        height:  auto;
        outline: none;

        &:focus-visible {
            outline:        2px solid var(--primary);
            outline-offset: 2px;
            border-radius:  $radius-md;
        }

        .gridline {
            stroke:       var(--viz-grid);
            stroke-width: 1;
        }

        .baseline {
            stroke:       var(--viz-axis);
            stroke-width: 1;
        }

        .tick-label {
            fill:                 var(--viz-muted);
            font-size:            12px;
            font-family:          inherit;
            font-variant-numeric: tabular-nums;
        }

        .area {
            fill:    var(--viz-series);
            opacity: 0.1;
        }

        .line {
            fill:            none;
            stroke:          var(--viz-series);
            stroke-width:    2;
            stroke-linejoin: round;
            stroke-linecap:  round;
        }

        .ring {
            fill: var(--viz-surface);
        }

        .dot {
            fill: var(--viz-series);
        }

        .end-label {
            fill:        var(--viz-text);
            font-size:   12px;
            font-weight: 600;
            font-family: inherit;
        }

        .crosshair {
            stroke:       var(--viz-axis);
            stroke-width: 1;
        }

        .tooltip-bg {
            fill:   var(--viz-surface);
            stroke: var(--viz-axis);
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.12));
        }

        .tooltip-value {
            fill:        var(--viz-text);
            font-size:   14px;
            font-weight: 700;
            font-family: inherit;
        }

        .tooltip-label {
            fill:        var(--viz-muted);
            font-size:   11px;
            font-family: inherit;
        }
    }

    .empty {
        padding:    $space-8;
        text-align: center;
        color:      $text-secondary;
    }

    .sr-only {
        position: absolute;
        width:    1px;
        height:   1px;
        margin:   -1px;
        padding:  0;
        overflow: hidden;
        clip:     rect(0, 0, 0, 0);
        border:   0;
    }

    .data-table {
        margin-top: $space-3;
        font-size:  0.85rem;

        summary {
            cursor: pointer;
            color:  $text-secondary;
        }

        table {
            margin-top: $space-2;

            th, td {
                padding: 6px 10px;
            }

            th {
                background:     #f8f9fa;
                color:          $text-color;
                text-transform: none;
                letter-spacing: normal;
            }

            .numeric {
                text-align:           right;
                font-variant-numeric: tabular-nums;
            }
        }
    }
}
</style>
