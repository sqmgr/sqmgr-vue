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
    <div class="horizontal-bar-chart">
        <div v-if="rows.length === 0" class="empty">{{ emptyText }}</div>
        <template v-else>
        <svg
            :viewBox="`0 0 ${width} ${height}`"
            role="img"
            :aria-label="title"
        >
            <line :x1="barLeft" :x2="barLeft" y1="0" :y2="height" class="baseline"/>
            <g
                v-for="(row, i) in rows"
                :key="row.label"
                :class="['bar-row', { hovered: hoverIndex === i }]"
                @mouseenter="hoverIndex = i"
                @mouseleave="hoverIndex = null"
            >
                <title>{{ row.label }}: {{ valueLabel(row) }}</title>
                <rect x="0" :y="rowTop(i)" :width="width" :height="rowHeight" class="hit"/>
                <text
                    :x="barLeft - 12"
                    :y="rowTop(i) + rowHeight / 2 + 4"
                    text-anchor="end"
                    class="row-label"
                >{{ truncate(row.label) }}</text>
                <path :d="barPath(i, row)" class="bar"/>
                <text
                    :x="barLeft + barWidth(row) + 8"
                    :y="rowTop(i) + rowHeight / 2 + 4"
                    class="value-label"
                >{{ valueLabel(row) }}</text>
            </g>
        </svg>

        <details class="data-table">
            <summary>Show data table</summary>
            <table>
                <thead>
                <tr>
                    <th>{{ title }}</th>
                    <th class="numeric">Count</th>
                    <th v-if="hasSublabels" class="numeric">Share</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="row in rows" :key="row.label">
                    <td>{{ row.label }}</td>
                    <td class="numeric">{{ formatNumber(row.value) }}</td>
                    <td v-if="hasSublabels" class="numeric">{{ row.sublabel || '-' }}</td>
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
const LABEL_WIDTH = 190
const VALUE_WIDTH = 130
const ROW_HEIGHT = 32
const BAR_HEIGHT = 20
const PADDING = 6
const RADIUS = 4

export default {
    name: "HorizontalBarChart",
    props: {
        // rows: [{ label, value, sublabel? }]
        rows: {
            type: Array,
            default: () => [],
        },
        emptyText: {
            type: String,
            default: 'No data for this range.',
        },
        title: {
            type: String,
            default: 'Breakdown',
        },
    },
    data() {
        return {
            width: WIDTH,
            rowHeight: ROW_HEIGHT,
            barLeft: LABEL_WIDTH,
            hoverIndex: null,
        }
    },
    computed: {
        height() {
            return this.rows.length * ROW_HEIGHT + PADDING * 2
        },
        maxValue() {
            return Math.max(1, ...this.rows.map(r => r.value || 0))
        },
        barSpan() {
            return WIDTH - LABEL_WIDTH - VALUE_WIDTH
        },
        hasSublabels() {
            return this.rows.some(r => r.sublabel)
        },
    },
    methods: {
        formatNumber,

        rowTop(i) {
            return PADDING + i * ROW_HEIGHT
        },

        barWidth(row) {
            return (this.barSpan * (row.value || 0)) / this.maxValue
        },

        // A bar with a 4px rounded data-end and a square baseline end.
        barPath(i, row) {
            const w = this.barWidth(row)
            const x = this.barLeft
            const y = this.rowTop(i) + (ROW_HEIGHT - BAR_HEIGHT) / 2
            const h = BAR_HEIGHT
            if (w <= 0) return ''
            if (w <= RADIUS) {
                return `M${x} ${y} h${w} v${h} h${-w} Z`
            }
            const straight = w - RADIUS
            return `M${x} ${y} h${straight} a${RADIUS} ${RADIUS} 0 0 1 ${RADIUS} ${RADIUS} v${h - RADIUS * 2} a${RADIUS} ${RADIUS} 0 0 1 ${-RADIUS} ${RADIUS} h${-straight} Z`
        },

        valueLabel(row) {
            const value = formatNumber(row.value)
            return row.sublabel ? `${value} (${row.sublabel})` : value
        },

        truncate(label) {
            const text = String(label ?? '')
            return text.length > 26 ? `${text.slice(0, 25)}…` : text
        },
    },
}
</script>

<style scoped lang="scss">
@use '../../../variables' as *;

.horizontal-bar-chart {
    --viz-series:  #{$primary};
    --viz-axis:    #{$border-color};
    --viz-text:    #{$text-color};
    --viz-muted:   #{$dark-gray};

    svg {
        display: block;
        width:   100%;
        height:  auto;

        .baseline {
            stroke:       var(--viz-axis);
            stroke-width: 1;
        }

        .bar-row {
            .hit {
                fill: transparent;
            }

            .row-label {
                fill:        var(--viz-text);
                font-size:   13px;
                font-family: inherit;
            }

            .bar {
                fill:       var(--viz-series);
                transition: opacity var(--transition-fast);
            }

            .value-label {
                fill:                 var(--viz-muted);
                font-size:            12px;
                font-family:          inherit;
                font-variant-numeric: tabular-nums;
            }

            &.hovered {
                .bar {
                    opacity: 0.8;
                }

                .value-label {
                    fill:        var(--viz-text);
                    font-weight: 600;
                }
            }
        }
    }

    .empty {
        padding:    $space-8;
        text-align: center;
        color:      $text-secondary;
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
