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
    <div :class="divClasses">
        <template v-if="grid">
            <div class="print-layout">
                <!-- Page Header -->
                <div class="page-header">
                    <div class="header-content">
                        <router-link v-if="!embedded" :to="`/pool/${pool.token}`" class="breadcrumb">
                            <i class="fas fa-arrow-left"></i>
                            {{ pool.name }}
                        </router-link>
                        <h2>{{ grid.name }}</h2>
                        <div class="header-badges">
                            <span v-if="hasEventDate" class="date-badge">
                                <i class="fas fa-calendar-alt"></i>
                                {{ eventDate }}
                            </span>
                            <span class="status-badge" :class="{ locked: isLocked, open: !isLocked }">
                                <i :class="isLocked ? 'fas fa-lock' : 'fas fa-lock-open'"></i>
                                {{ isLocked ? 'Locked' : 'Open' }}
                            </span>
                            <span v-if="grid.bdlEvent" class="event-status-badge" :class="eventStatusClass">
                                <template v-if="grid.bdlEvent.status === 'in_progress'">
                                    <span class="game-clock">{{ gameClockDisplay }}</span>
                                    <span class="game-score">
                                        {{ grid.bdlEvent.awayTeam?.abbreviation }} {{ grid.bdlEvent.awayScore ?? 0 }} -
                                        {{ grid.bdlEvent.homeTeam?.abbreviation }} {{ grid.bdlEvent.homeScore ?? 0 }}
                                    </span>
                                    <span class="live-indicator">LIVE</span>
                                </template>
                                <template v-else>
                                    <i :class="eventStatusIcon"></i>
                                    {{ eventStatusText }}
                                </template>
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Print-only header -->
                <div class="print-only print-header">
                    <div class="print-header-text">
                        <p class="pool-name">Squares Pool - {{ pool.name }}</p>
                        <h3>{{ grid.name }}</h3>
                        <p v-if="hasEventDate" class="event-date">{{ eventDate }}</p>
                    </div>
                    <div v-if="grid.settings.brandingImageUrl" class="print-header-branding">
                        <img :src="grid.settings.brandingImageUrl"
                             :alt="grid.settings.brandingImageAlt || 'Sponsor logo'">
                    </div>
                </div>

                <!-- Print-only Number Rotation legend -->
                <div v-if="hasMultipleNumberSets" class="print-only print-legend">
                    <strong>Number Rotation:</strong>
                    <span v-for="setType in sortedNumberSets" :key="setType" class="print-legend-item">
                        <span class="legend-color" :class="setType"></span>
                        {{ numberSetLabels[setType] }}
                    </span>
                </div>

                <div class="grid-layout">
                    <aside class="grid-sidebar">
                        <!-- Admin Menu Card -->
                        <template v-if="isAdmin">
                            <div class="card admin-card">
                                <div class="card-header">
                                    <i class="fas fa-cog"></i>
                                    <h3>Admin Actions</h3>
                                </div>
                                <div class="admin-actions">
                                    <button type="button" class="action-btn"
                                            :class="{ 'needs-setup': needsCustomization }"
                                            @click.prevent="customizeWasClicked">
                                        <i class="fas fa-paint-brush"></i>
                                        <div class="action-text">
                                            <span class="action-label">Customize</span>
                                            <span class="action-desc">Edit team names, colors, and settings</span>
                                        </div>
                                    </button>

                                    <button type="button" class="action-btn"
                                            @click.prevent="showPaymentStates = !showPaymentStates">
                                        <i class="fas fa-money-check-alt"></i>
                                        <div class="action-text">
                                            <span class="action-label">{{ showPaymentStates ? 'Hide' : 'Show' }} Payment Status</span>
                                            <span class="action-desc">Toggle payment state indicators on squares</span>
                                        </div>
                                    </button>

                                    <button type="button" class="action-btn"
                                            :class="{ active: highlightState.bulkMode }"
                                            @click.prevent="toggleBulkMode">
                                        <i class="fas fa-tasks"></i>
                                        <div class="action-text">
                                            <span class="action-label">{{ highlightState.bulkMode ? 'Exit Bulk Edit' : 'Bulk Edit' }}</span>
                                            <span class="action-desc">Select multiple squares to claim, unclaim, or update payment</span>
                                        </div>
                                    </button>

                                    <button v-if="canAddGame" type="button" class="action-btn"
                                            @click.prevent="$emit('add-game')">
                                        <i class="fas fa-plus-circle"></i>
                                        <div class="action-text">
                                            <span class="action-label">Add Another Game</span>
                                            <span class="action-desc">Add a second game to this pool</span>
                                        </div>
                                    </button>

                                    <template v-if="!numbersAreDrawn">
                                        <div class="action-divider">
                                            <span>Draw Numbers</span>
                                        </div>
                                        <button type="button" class="action-btn"
                                                @click.prevent="randomlyDrawNumbersWasClicked">
                                            <i class="fas fa-dice"></i>
                                            <div class="action-text">
                                                <span class="action-label">Random Draw</span>
                                                <span class="action-desc">Let the system randomly assign numbers</span>
                                            </div>
                                        </button>
                                        <button type="button" class="action-btn"
                                                @click.prevent="manuallyDrawNumbersWasClicked">
                                            <i class="fas fa-edit"></i>
                                            <div class="action-text">
                                                <span class="action-label">Manual Entry</span>
                                                <span class="action-desc">Enter the numbers yourself</span>
                                            </div>
                                        </button>
                                    </template>
                                    <template v-else>
                                        <div class="numbers-drawn-notice">
                                            <i class="fas fa-check-circle"></i>
                                            <span>Numbers have been drawn</span>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </template>

                        <!-- Branding Image Card for screen only -->
                        <div v-if="grid.settings.brandingImageUrl" class="card branding-card branding-screen">
                            <div class="branding-content">
                                <img :src="grid.settings.brandingImageUrl"
                                     :alt="grid.settings.brandingImageAlt || 'Sponsor logo'">
                            </div>
                        </div>

                        <!-- Notes Card for screen only -->
                        <div v-if="grid.settings.notes" class="card notes-card notes-screen">
                            <div class="card-header">
                                <i class="fas fa-sticky-note"></i>
                                <h3>Organizer Note</h3>
                            </div>
                            <div class="notes-content">{{ grid.settings.notes }}</div>
                        </div>

                        <div v-if="$slots['sidebar-extra']" class="sidebar-extra">
                            <slot name="sidebar-extra" :grid="grid" :config="config"></slot>
                        </div>

                        <!-- Number Set Legend (only for multi-set pools) -->
                        <div v-if="hasMultipleNumberSets" class="card legend-card">
                            <div class="card-header">
                                <i class="fas fa-palette"></i>
                                <h3>Number Sets</h3>
                            </div>
                            <div class="legend-items">
                                <div v-for="setType in sortedNumberSets" :key="setType" class="legend-item">
                                    <span class="legend-color" :class="setType"></span>
                                    <span class="legend-label">{{ numberSetLabels[setType] }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Settings Card -->
                        <div v-if="!embedded" class="card settings-card">
                            <div class="card-header">
                                <i class="fas fa-info-circle"></i>
                                <h3>Game Details</h3>
                            </div>
                            <div class="settings-list">
                                <template v-if="!embedded">
                                    <div class="setting-item">
                                        <label>Pool</label>
                                        <div class="setting-value">
                                            <router-link :to="`/pool/${pool.token}`" class="pool-link">
                                                <i class="fas fa-layer-group"></i>
                                                {{ pool.name }}
                                            </router-link>
                                        </div>
                                    </div>
                                </template>
                                <div v-if="!grid.bdlEvent" class="setting-item">
                                    <label>Event Date</label>
                                    <div class="setting-value">{{ eventDate }}</div>
                                </div>
                                <LinkedGameInfo v-if="grid.bdlEvent"
                                                :bdl-event="grid.bdlEvent"
                                                :payout-config="grid.payoutConfig"
                                                :number-set-config="pool.numberSetConfig"/>
                                <div class="setting-item">
                                    <label>Grid Type</label>
                                    <div class="setting-value">
                                        <span class="badge">{{ pool.gridType }}</span>
                                    </div>
                                </div>
                                <div class="setting-item">
                                    <label>Number Rotation</label>
                                    <div class="setting-value">
                                        <span class="badge">{{ numberSetConfigLabel }}</span>
                                    </div>
                                </div>
                                <div class="setting-item">
                                    <label>Payouts</label>
                                    <div class="setting-value">
                                        <span class="badge">{{ payoutConfigLabel }}</span>
                                    </div>
                                </div>
                                <div class="setting-item">
                                    <label>State</label>
                                    <div class="setting-value">
                                        <span class="status-badge" :class="{ locked: isLocked, open: !isLocked }">
                                            <i :class="isLocked ? 'fas fa-lock' : 'fas fa-lock-open'"></i>
                                            {{ isLocked ? 'Locked' : 'Open' }}
                                        </span>
                                    </div>
                                </div>
                                <div class="setting-item">
                                    <label>Numbers</label>
                                    <div class="setting-value">
                                        <span v-if="!numbersAreDrawn" class="numbers-pending">
                                            <i class="fas fa-clock"></i> Pending
                                        </span>
                                        <span v-else-if="grid.manualDraw" class="numbers-manual">
                                            <i class="fas fa-edit"></i> Manual
                                        </span>
                                        <span v-else class="numbers-random">
                                            <i class="fas fa-dice"></i> Random
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Expand/Shrink Button -->
                        <button type="button" class="expand-btn secondary"
                                @click.prevent="expandedGrid = !expandedGrid">
                            <i :class="expandedGrid ? 'fas fa-compress-arrows-alt' : 'fas fa-expand-arrows-alt'"></i>
                            {{ expandedGrid ? 'Shrink Grid' : 'Expand Grid' }}
                        </button>
                    </aside>

                    <div class="grid-main">
                        <BulkEditToolbar
                            v-if="highlightState.bulkMode && isAdmin"
                            :token="token"
                            :selected-squares="highlightState.selectedSquares"
                            :squares-data="squares"
                            @cancel="toggleBulkMode"
                        />
                        <div class="squares-container">
                            <div ref="squares"
                                 :class="{ squares: true, [gridType]: true, 'expanded-grid': expandedGrid }">
                                <div class="spacer">&nbsp;</div>

                                <div data-team="home" class="team home-team"><span>{{ grid.homeTeamName }}</span></div>
                                <div data-team="home" v-for="n in 10" :key="`home-${n}`"
                                     :class="scoreClass('home', n-1)">
                                    <template v-if="hasMultipleNumberSets">
                                        <span v-for="setType in sortedNumberSets" :key="`home-set-${setType}-${n}`"
                                              class="set-number" :class="setType">
                                            {{ getNumberSetScore(setType, 'home', n - 1) }}
                                        </span>
                                    </template>
                                    <template v-else>
                                        {{ score('home', n - 1) }}
                                    </template>
                                </div>

                                <div data-team="away" class="team away-team"><span>{{ grid.awayTeamName }}</span></div>
                                <div data-team="away" v-for="n in 10" :key="`away-${n}`"
                                     :class="scoreClass('away', n-1)">
                                    <template v-if="hasMultipleNumberSets">
                                        <span v-for="setType in sortedNumberSets" :key="`away-set-${setType}-${n}`"
                                              class="set-number" :class="setType">
                                            {{ getNumberSetScore(setType, 'away', n - 1) }}
                                        </span>
                                    </template>
                                    <template v-else>
                                        {{ score('away', n - 1) }}
                                    </template>
                                </div>

                                <template v-for="n in numSquares" :key="n">
                                    <Square
                                        :grid-id="gridIdNum"
                                        :pool-config="poolConfig"
                                        :sq-id="n"
                                        :square-data="squares[n] || {}"
                                        :annotation="annotationBySquareId(n)"
                                        :is-expanded="expandedGrid"
                                        :winning-periods="getWinningPeriodsForSquare(n)"
                                        :show-payment-states="showPaymentStates"
                                    />
                                </template>
                            </div>
                        </div>

                        <!-- Bulk selection count badge (fixed bottom-right) -->
                        <div v-if="highlightState.bulkMode && isAdmin" class="bulk-selection-badge">
                            <i class="fas fa-check-square"></i>
                            {{ highlightState.selectedSquares.size }}
                        </div>

                        <!-- Activity Log Card -->
                        <div v-if="isAdmin" class="card logs-card">
                            <div class="card-header">
                                <i class="fas fa-history"></i>
                                <h3>Activity Log</h3>
                            </div>
                            <Logs :pool-config="poolConfig" :show-add-note="false" :logs="logs"/>
                            <div class="card-footer" v-if="numLogs > logsPerPage">
                                <Pagination :current-page="currentLogPage" :per-page="logsPerPage" :total="numLogs"
                                            @page="goToLogsPage"/>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Notes for print only (after grid so it appears on page 2) -->
                <div v-if="grid.settings.notes" class="notes notes-print">{{ grid.settings.notes }}</div>
            </div>
        </template>
    </div>
</template>

<script>
import Square from '../square/Square.vue'
import Logs from './Logs.vue'
import GridCustomize from '../grid/GridCustomize.vue'
import LinkedGameInfo from '../grid/LinkedGameInfo.vue'
import BulkEditToolbar from './BulkEditToolbar.vue'
import Common from '../../common'

import ModalController from '@/controllers/ModalController'
import sqmgrClient from "@/models/sqmgrClient"
import EventBus from "@/models/EventBus"
import {SQUARE_UPDATED, GRID_UPDATED} from "@/constants/events"
import Pagination from "@/components/ui/Pagination"
import sqmgrConfig from "@/models/sqmgrConfig"
import ManualDraw from "@/components/grid/ManualDraw"
import DrawConfirmation from "@/components/grid/DrawConfirmation"
import normalizeColor from "@/utils/normalizeColor" // utility to normalize color values
import {getShortLabelSync} from "@/models/periodLabels"
import {useSquareHighlight} from "@/composables/useSquareHighlight"
import {usePoolEvents} from "@/composables/usePoolEvents"

const intColor = (color) => {
    if (!Array.isArray(color) || color.length !== 4) {
        throw new Error(`${color} is not a valid color array`)
    }

    return (
        color[0] * Math.pow(2, 24) +
        color[1] * Math.pow(2, 16) +
        color[2] * Math.pow(2, 8) +
        color[3]
    )
}

const whiteIntColor = intColor([255, 255, 255, 255])

// nonWhiteColor is used because we don't want a white color when printing.
const nonWhiteColor = (color) => {
    let normalizedIntColor
    try {
        normalizedIntColor = intColor(normalizeColor(color))
    } catch (e) {
        console.warn(`could not get normalized color: ${e}`)
    }

    if (normalizedIntColor !== whiteIntColor) {
        return color
    }

    return '#777'
}

export default {
    name: "PoolGrid",
    setup(props) {
        const {state: highlightState, setPrimarySquare, toggleBulkMode, clearSelection} = useSquareHighlight()
        // Only establish SSE when PoolGrid is a top-level route (not embedded in Pool.vue)
        if (!props.embedded) {
            usePoolEvents(props.token)
        }
        return {highlightState, setPrimarySquare, toggleBulkMode, clearSelection}
    },
    components: {
        Pagination,
        Square,
        Logs,
        LinkedGameInfo,
        BulkEditToolbar,
    },
    props: {
        token: {
            type: String,
            required: true,
        },
        initialPool: {
            type: Object,
            required: true,
        },
        gridId: {
            type: String,
            required: true,
        },
        embedded: {
            type: Boolean,
            default: false,
        },
        canAddGame: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['add-game'],
    data() {
        return {
            pool: this.initialPool,
            grid: null,
            squares: {},
            logs: [],
            userId: null,


            logsPerPage: 25,
            currentLogPage: 1,
            numLogs: 0,

            expandedGrid: false,
            config: null,
            showPaymentStates: false,
        }
    },
    created() {
        if (!this.embedded) {
            document.title = `${this.pool.name} - SqMGR`
        }
        EventBus.on(SQUARE_UPDATED, this.squareUpdated)
        EventBus.on(GRID_UPDATED, this.gridUpdated)
    },
    beforeUnmount() {
        EventBus.off(SQUARE_UPDATED, this.squareUpdated)
        EventBus.off(GRID_UPDATED, this.gridUpdated)
        // Exit bulk mode when leaving the grid
        if (this.highlightState.bulkMode) {
            this.toggleBulkMode()
        }
    },
    beforeMount() {
        // ensure store is fresh
        this.setPrimarySquare(null)

        Promise.all(
            [
                sqmgrClient.getUser(),
                sqmgrClient.getPoolGridByTokenAndGridId(this.token, this.gridId),
                sqmgrClient.getPoolSquares(this.token),
            ],
        ).then(values => {
            this.userId = values[0].id
            this.grid = values[1]
            this.squares = values[2]
            this.expandedGrid = this.pool.gridType === 'std100'
        })

        this.fetchLogs()

        sqmgrConfig().then(config => this.config = config)
    },
    computed: {
        poolConfig() {
            return {
                token: this.token,
                isLocked: this.isLocked,
                isAdmin: this.isAdmin,
                userId: this.userId,
                gridType: this.pool.gridType,
            }
        },
        gridIdNum() {
            return parseInt(this.gridId, 10)
        },
        hasEventDate() {
            return new Date(this.grid.eventDate).getFullYear() > 0
        },
        eventDate() {
            if (new Date(this.grid.eventDate).getFullYear() === 0) {
                return "Not specified"
            }

            return Common.NewDateWithoutTimezone(this.grid.eventDate).toLocaleDateString("default", Common.DateOptions)
        },
        locks() {
            const locks = new Date(this.pool.locks)
            return locks.getFullYear() > 1 ? locks : null
        },
        locksFormatted() {
            return this.locks ? this.locks.toLocaleDateString(undefined, Common.DateTimeOptions) : null
        },
        isLocked() {
            return this.locks && this.locks.getTime() < new Date().getTime()
        },
        numbersAreDrawn() {
            // Check both legacy single-set and new multi-set
            if (this.grid.homeNumbers || this.grid.awayNumbers) {
                return true
            }
            if (this.grid.numberSets && Object.keys(this.grid.numberSets).length > 0) {
                return true
            }
            return false
        },
        hasMultipleNumberSets() {
            return this.pool.numberSetConfig && this.pool.numberSetConfig !== 'standard' &&
                this.grid.numberSets && Object.keys(this.grid.numberSets).length > 0
        },
        sortedNumberSets() {
            if (!this.hasMultipleNumberSets) return []
            const order = ['q1', 'q2', 'q3', 'q4', 'half', 'final']
            return order.filter(key => this.grid.numberSets[key])
        },
        numberSetLabels() {
            // Use the centralized config for labels, with fallbacks
            const labels = {}
            const periods = ['q1', 'q2', 'q3', 'q4', 'half', 'final']
            for (const period of periods) {
                labels[period] = getShortLabelSync(this.config, period)
            }
            return labels
        },
        isAdmin() {
            return this.pool.isAdmin
        },
        needsCustomization() {
            return this.grid?.homeTeamName === 'Home Team' && this.grid?.awayTeamName === 'Away Team'
        },
        numberSetConfigLabel() {
            const found = this.config?.numberSetConfigs?.find(c => c.key === this.pool.numberSetConfig)
            return found?.label || 'Standard'
        },
        payoutConfigLabel() {
            const config = this.grid?.payoutConfig || this.pool?.numberSetConfig || 'standard'
            if (config === 'standard') {
                return 'Final'
            }
            const found = this.config?.numberSetConfigs?.find(c => c.key === config)
            return found?.label || 'Final'
        },
        numSquares() {
            return Object.values(this.squares).length
        },
        gridType() {
            return this.pool.gridType
        },
        rollover() {
            return this.grid && this.grid.rollover && this.pool.gridType === 'roll100'
        },
        divClasses() {
            const classes = {}
            classes[`grid-type-${this.gridType}`] = true
            classes.rollover = this.rollover
            classes['is-locked'] = this.isLocked

            return classes
        },
        eventStatusClass() {
            if (!this.grid?.bdlEvent) return ''
            switch (this.grid.bdlEvent.status) {
                case 'in_progress':
                    return 'live'
                case 'final':
                    return 'final'
                default:
                    return 'scheduled'
            }
        },
        eventStatusIcon() {
            if (!this.grid?.bdlEvent) return ''
            switch (this.grid.bdlEvent.status) {
                case 'in_progress':
                    return 'fas fa-circle'
                case 'final':
                    return 'fas fa-check-circle'
                default:
                    return 'fas fa-clock'
            }
        },
        eventStatusText() {
            if (!this.grid?.bdlEvent) return ''
            switch (this.grid.bdlEvent.status) {
                case 'in_progress':
                    return ''
                case 'final':
                    return 'Final'
                default:
                    return 'Scheduled'
            }
        },
        periodLabel() {
            const period = this.grid?.bdlEvent?.period
            if (!period) return ''

            const league = this.grid?.bdlEvent?.league

            // College basketball uses halves
            if (league === 'ncaab') {
                if (period === 1) return '1st Half'
                if (period === 2) return '2nd Half'
                if (period > 2) return `OT${period - 2}`
            }

            // NBA, WNBA, NFL, NCAAF all use quarters
            if (period === 1) return '1st'
            if (period === 2) return '2nd'
            if (period === 3) return '3rd'
            if (period === 4) return '4th'
            if (period > 4) return `OT${period - 4}`
            return `${period}`
        },
        gameClockDisplay() {
            const event = this.grid?.bdlEvent
            if (!event) return ''

            const detail = event.statusDetail?.toLowerCase() || ''

            // Handle halftime
            if (detail.includes('halftime')) {
                return event.statusDetail
            }

            // Handle "End of Period" - enhance with specific period info
            if (detail.includes('end of')) {
                // If the statusDetail already has specific period (e.g., "End of 1st Quarter"), use it
                // Otherwise, enhance "End of Period" with the actual period
                if (detail.includes('1st') || detail.includes('2nd') || detail.includes('3rd') || detail.includes('4th') || detail.includes('ot')) {
                    return event.statusDetail
                }
                // Generic "End of Period" - add specific period info
                return `End of ${this.periodLabel}`
            }

            // Show clock + period during active play
            if (event.clock) {
                return `${event.clock} - ${this.periodLabel}`
            }

            return this.periodLabel
        },
        winningSquaresMap() {
            // Map from squareId -> array of winning period types
            const map = {}
            if (!this.grid?.winningSquares) return map

            for (const [periodType, squareId] of Object.entries(this.grid.winningSquares)) {
                if (!map[squareId]) {
                    map[squareId] = []
                }
                map[squareId].push(periodType)
            }
            return map
        },
    },
    watch: {
        grid(newGrid) {
            if (!this.embedded) {
                document.title = `${this.pool.name}: ${newGrid.name} - SqMGR`
            }
            this.updateTeamColors()
        },
    },
    mounted() {
        this.updateTeamColors()
    },
    updated() {
        this.updateTeamColors()
    },
    methods: {
        scoreClass(homeAway, n) {
            const classes = ['score', `${homeAway}-score`, `${homeAway}-score-${n}`]
            if (this.hasMultipleNumberSets) {
                classes.push('multi-set', `multi-set-${this.sortedNumberSets.length}`)
            }

            return classes
        },
        fetchLogs() {
            if (!this.isAdmin) {
                return
            }

            const offset = (this.currentLogPage - 1) * this.logsPerPage
            sqmgrClient.getPoolLogs(this.token, offset, this.logsPerPage)
                .then(res => {
                    this.logs = res.logs
                    this.numLogs = res.total
                })
        },
        goToLogsPage(page) {
            this.currentLogPage = page
            this.fetchLogs()
        },
        squareUpdated() {
            sqmgrClient.getPoolSquares(this.token)
                .then(res => this.squares = res)
                .catch(err => ModalController.showError(err))

            this.fetchLogs()
        },
        gridUpdated() {
            sqmgrClient.getPoolGridByTokenAndGridId(this.token, this.gridId)
                .then(res => this.grid = res)
                .catch(err => ModalController.showError(err))
        },
        customizeWasClicked() {
            sqmgrClient.getPoolGridByTokenAndGridId(this.token, this.grid.id)
                .then(grid => {
                    ModalController.show('Customize Grid', GridCustomize, {
                        grid,
                        token: this.token,
                        pool: this.pool,
                    }, {
                        saved() {
                            ModalController.hide()
                            ModalController.showPrompt('Changes Saved', 'Changes saved successfully.', {
                                dismissButton: 'OK',
                            })
                        },
                    })

                })
                .catch(err => ModalController.showError(err))
        },
        checkAllSquaresClaimed() {
            let allClaimed = true
            for (const key of Object.keys(this.squares)) {
                const square = this.squares[key]
                if (square.state === 'unclaimed') {
                    allClaimed = false
                    break
                }
            }

            return allClaimed
        },
        manuallyDrawNumbersWasClicked() {
            ModalController.show('Manually Draw Numbers', ManualDraw, {
                allSquaresClaimed: this.checkAllSquaresClaimed(),
                isLocked: this.isLocked,
                grid: this.grid,
                pool: this.pool,
            }, {
                draw: (nums, lockPool) => {
                    sqmgrClient.drawManualNumbers(this.token, this.grid.id, nums.homeNumbers, nums.awayNumbers, lockPool)
                        .then(response => {
                            this.grid = response
                            if (response.poolLocks) {
                                this.pool.locks = response.poolLocks
                            }
                            ModalController.hide()
                        })
                        .catch(err => ModalController.showError(err))
                },
                drawMultiSet: (numberSets, lockPool) => {
                    sqmgrClient.drawManualNumbersMultiSet(this.token, this.grid.id, numberSets, lockPool)
                        .then(response => {
                            this.grid = response
                            if (response.poolLocks) {
                                this.pool.locks = response.poolLocks
                            }
                            ModalController.hide()
                        })
                        .catch(err => ModalController.showError(err))
                },
            })
        },
        randomlyDrawNumbersWasClicked() {
            const allClaimed = this.checkAllSquaresClaimed()

            ModalController.show('Draw the Numbers', DrawConfirmation, {
                allSquaresClaimed: allClaimed,
                isLocked: this.isLocked,
            }, {
                confirm: (lockPool) => {
                    sqmgrClient.drawNumbers(this.token, this.grid.id, lockPool)
                        .then(response => {
                            this.grid = response
                            if (response.poolLocks) {
                                this.pool.locks = response.poolLocks
                            }
                            ModalController.hide()
                        })
                        .catch(err => ModalController.showError(err))
                },
            })
        },
        score(team, index) {
            const numbers = this.grid[`${team}Numbers`]
            if (numbers === null) {
                return ''
            }

            return numbers[index]
        },
        getNumberSetScore(setType, team, index) {
            if (!this.grid.numberSets || !this.grid.numberSets[setType]) {
                return ''
            }
            const numbers = this.grid.numberSets[setType][`${team}Numbers`]
            if (!numbers) {
                return ''
            }
            return numbers[index]
        },
        updateTeamColors() {

            const squares = this.$refs.squares
            if (squares) {
                // Set all four team colors at container level for owned square animation
                squares.style.setProperty('--home-primary', this.grid.settings.homeTeamColor1)
                squares.style.setProperty('--home-secondary', this.grid.settings.homeTeamColor2)
                squares.style.setProperty('--away-primary', this.grid.settings.awayTeamColor1)
                squares.style.setProperty('--away-secondary', this.grid.settings.awayTeamColor2)

                squares.querySelectorAll('[data-team="home"]').forEach(el => {
                    el.style.setProperty('--team-primary', this.grid.settings.homeTeamColor1)
                    el.style.setProperty('--team-secondary', this.grid.settings.homeTeamColor2)
                    el.style.setProperty('--team-secondary-no-white', nonWhiteColor(this.grid.settings.homeTeamColor2))
                })

                squares.querySelectorAll('[data-team="away"]').forEach(el => {
                    el.style.setProperty('--team-primary', this.grid.settings.awayTeamColor1)
                    el.style.setProperty('--team-secondary', this.grid.settings.awayTeamColor2)
                    el.style.setProperty('--team-secondary-no-white', nonWhiteColor(this.grid.settings.awayTeamColor2))
                })
            }
        },
        annotationBySquareId(squareId) {
            if (!this.grid) {
                return
            }

            return this.grid.annotations[squareId]
        },
        getWinningPeriodsForSquare(squareId) {
            return this.winningSquaresMap[squareId] || []
        },
    },
}
</script>

<style>
@property --spin-angle {
    syntax:        '<angle>';
    inherits:      false;
    initial-value: 0deg;
}

:root {
    --team-primary:   #000;
    --team-secondary: #666;
    --grid-gray:      #ddd;
}
</style>
<style lang="scss" scoped>
@use '../../variables' as *;
@use "sass:color";

$expand-size: 8in;

$q1-color:    #33bbee;
$q2-color:    #cc3311;
$q3-color:    #ee7733;
$q4-color:    #009988;


section.grid {
    position: relative;
}

p.customize {
    margin-top: calc(-1 * var(--spacing));
}

div.grid-layout {
    display:        flex;
    flex-direction: column;
    gap:            var(--spacing);
}

.grid-main {
    display:        flex;
    flex-direction: column;
    gap:            var(--spacing);
}

.grid-sidebar {
    flex-shrink: 0;
}

// Side-by-side when viewport is wide enough
@media (min-width: calc(100vmin + $standard-spacing + 415px)) {
    div.grid-layout {
        display:               grid;
        grid-template-columns: 1fr minmax(auto, 400px);
        align-items:           start;
    }

    .grid-sidebar {
        grid-column: 2;
        grid-row:    1;
    }

    .grid-main {
        grid-column: 1;
        grid-row:    1;
        min-width:   0;
    }

    div.squares {
        width:        min(calc(100vmin - 280px - var(--spacing) * 4), 650px);
        max-width:    100%;
        aspect-ratio: 1;
    }

    .logs-card {
        width: min(calc(100vmin - 280px - var(--spacing) * 4), 650px);
    }
}

div.squares-container {
    width: 100%;

    @include mobile {
        overflow: auto;
    }
}

div.squares {
    background-color:      transparent;
    display:               grid;
    grid-gap:              2px;
    margin:                0 auto;
    width:                 calc(100vmin - var(--spacing) * 2);
    max-width:             100%;
    aspect-ratio:          1;
    grid-template-columns: repeat(2, 0.5fr) repeat(10, 1fr);
    grid-template-rows:    repeat(2, 0.5fr) repeat(10, 1fr);
}

@media (max-width: 8.5in) {
    div.expanded-grid {
        width:        $expand-size;
        max-width:    none;
        aspect-ratio: 1;
    }
}

div.spacer {
    background-color: transparent;
    grid-column:      1/ span 2;
    grid-row:         1/ span 2;
}

div.team {
    background:  linear-gradient(var(--team-primary), var(--team-primary) calc(50% - 1px), #fff calc(50% - 1px), #fff calc(50% + 1px), var(--team-secondary) calc(50% + 1px), var(--team-secondary) 100%);
    color:       #fff;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 800;
    font-size:   2.0rem;
    position:    relative;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);

    &.home-team {
        grid-column-start: 3;
        grid-column-end:   13;
    }

    &.away-team {
        background:     linear-gradient(90deg, var(--team-primary), var(--team-primary) calc(50% - 1px), #fff calc(50% - 1px), #fff calc(50% + 1px), var(--team-secondary) calc(50% + 1px), var(--team-secondary) 100%);
        grid-row-start: 3;
        grid-row-end:   13;
    }

    span {
        display:     block;
        transform:   translate(-50%, -50%);
        position:    absolute;
        white-space: nowrap;
        top:         50%;
        left:        50%;
    }

    &.away-team span {
        transform: translate(-50%, -50%) rotate(270deg);
    }
}

div.std25 div.square span.name {
    font-size: clamp(10px, 1.8vw, 30px);
}

div.score {
    background-color: var(--grid-gray);
    display:          flex;
    align-items:      center;
    justify-content:  center;
    font-size:        clamp(10px, 1.2vw, 1.2vw);
    font-weight:      bold;

    &.home-score { grid-row-start: 2 }

    &.home-score-0 { grid-column-start: 3 }

    &.home-score-1 { grid-column-start: 4 }

    &.home-score-2 { grid-column-start: 5 }

    &.home-score-3 { grid-column-start: 6 }

    &.home-score-4 { grid-column-start: 7 }

    &.home-score-5 { grid-column-start: 8 }

    &.home-score-6 { grid-column-start: 9 }

    &.home-score-7 { grid-column-start: 10 }

    &.home-score-8 { grid-column-start: 11 }

    &.home-score-9 { grid-column-start: 12 }

    &.away-score { grid-column-start: 2 }

    &.away-score-0 { grid-row-start: 3 }

    &.away-score-1 { grid-row-start: 4 }

    &.away-score-2 { grid-row-start: 5 }

    &.away-score-3 { grid-row-start: 6 }

    &.away-score-4 { grid-row-start: 7 }

    &.away-score-5 { grid-row-start: 8 }

    &.away-score-6 { grid-row-start: 9 }

    &.away-score-7 { grid-row-start: 10 }

    &.away-score-8 { grid-row-start: 11 }

    &.away-score-9 { grid-row-start: 12 }

    &.multi-set {
        display:               grid;
        gap:                   2px;
        align-items:           stretch;
        color:                 rgba(255, 255, 255, 0.8);
        grid-template-rows: 1fr;
        grid-template-columns: 1fr 1fr;

        &.away-score {
            grid-template-rows: 2fr 2fr;
            grid-template-columns: 1fr;
        }

        &.multi-set-4 {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
        }

        & > span:first-child {
            background-color: $q1-color;
        }

        & > span:nth-child(2) {
            background-color: $q2-color;
        }

        & > span:nth-child(3) {
            background-color: $q3-color;
        }

        & > span:last-child {
            background-color: $q4-color;
        }


        span {
            display:         flex;
            justify-content: center;
            align-items:     center;
        }
    }
}

div.square {
    border:          1px solid var(--grid-gray);
    display:         flex;
    font-family:     'Barlow Condensed', sans-serif;
    font-size:       clamp(0.75rem, 1.4cqmin, 20px);
    font-weight:     500;
    align-items:     center;
    justify-content: center;
    position:        relative;
    overflow:        hidden;
    padding:         3px;
    transition:      transform 100ms ease, box-shadow 100ms ease;
    container-type:  inline-size;

    :deep(i.owned) {
        color:     $yellow;
        font-size: 0.9em;
        position:  absolute;
        top:       2px;
        left:      2px;

        @media not print {
            display: none;
        }
    }

    &:hover {
        border-color:        #000;
        box-shadow:          0 4px 12px rgba(0, 0, 0, 0.15);
        cursor:              pointer;
        user-select:         none;
        -webkit-user-select: none;
        -ms-user-select:     none;
        -moz-user-select:    none;
        transform:           scale(1.02);
        z-index:             10;
    }

    &.unclaimed:hover {
        border-color: var(--success);
        box-shadow:   0 4px 12px rgba(33, 150, 243, 0.25);
    }

    &.unclaimed {
        animation: subtle-pulse 3s ease-in-out infinite;
    }

    @keyframes subtle-pulse {
        0%, 100% { background: repeating-linear-gradient(135deg, #fff, #fff 5px, #f7f7f7 5px, #f7f7f7 10px); }
        50% { background: repeating-linear-gradient(135deg, #fff, #fff 5px, #f0f7f0 5px, #f0f7f0 10px); }
    }

    @media not print {
        &.owned {
            position: relative;

            &::before {
                content:        '';
                position:       absolute;
                inset:          0;
                border-radius:  0px;
                padding:        2px;
                background:     conic-gradient(
                                        from var(--spin-angle, 0deg),
                                        var(--home-primary),
                                        var(--home-secondary),
                                        var(--away-primary),
                                        var(--away-secondary),
                                        var(--home-primary)
                                );
                mask:           linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                mask-composite: exclude;
                animation:      spin-border 3s linear infinite;
                pointer-events: none;
            }
        }
    }

    @keyframes spin-border {
        to { --spin-angle: 360deg; }
    }


    &.unclaimed.held {
        border-color: var(--primary);
        animation:    none;
    }

    &.highlighted {
        box-shadow: 0 0 1px 1px var(--primary);
    }

    &.annotated {
        background:   linear-gradient(rgba($primary, 0.1), rgba($primary, 0.05));
        border-color: $primary;
        box-shadow:   0 0 2px $primary;
    }

    &.winner {
        border-style: solid;
        box-shadow:   0 0 4px rgba(0, 0, 0, 0.15);
    }

    @at-root .rollover &.secondary {
        & > :deep(span.name),
        & > :deep(.owned),
        & > :deep(.square-id) {
            opacity: 0.2;
        }
    }

    @at-root .is-locked.rollover &.secondary {
        & > :deep(span.name),
        & > :deep(.owned) {
            opacity: 0;
        }
    }

    :deep(span.square-id) {
        position:  absolute;
        top:       2px;
        right:     3px;
        font-size: 0.8rem;
        color:     var(--dark-gray);
        z-index:   1;
    }

    :deep(span.name) {
        position: relative;
        z-index:  2;
    }
}

div.std25 div.square {
    grid-row-start:    span 2;
    grid-column-start: span 2;
}

div.std50 div.square {
    grid-row-start:    span 1;
    grid-column-start: span 2;
}

div.notes.notes-print::before {
    content:   'Note from organizer:';
    display:   block;
    font-size: 0.8em;
    color:     var(--gray);
}

div.notes.notes-print {
    margin-bottom: var(--spacing);
    white-space:   pre-wrap;
    word-break:    break-word;
}

// Hide print-only notes on screen
.notes-print {
    display: none;
}

// Branding print section
.branding-print {
    display: none;
}

div.branding.branding-print {
    margin-bottom: var(--spacing);
    text-align:    center;

    img {
        max-width:  300px;
        max-height: 100px;
        object-fit: contain;
    }
}

section.templates {
    display: none;
}

section.audit-log {
    margin-top: var(--spacing);
}

p.add-note {
    font-size:     0.8em;
    margin-bottom: var(--minimal-spacing);
    text-align:    right;
}

@media (max-width: 800px) { // tablet breakpoint
    div#grid-container {
        overflow: auto;
        width:    100%;
    }

    div.team {
        font-size: 1.0em;
    }
}

// Page Header
.page-header {
    margin-bottom: $space-6;

    .header-content {
        display:        flex;
        flex-direction: column;
        gap:            $space-2;
    }

    .breadcrumb {
        display:     inline-flex;
        align-items: center;
        gap:         $space-2;
        font-size:   0.875rem;
        color:       $text-secondary;
        transition:  color var(--transition-fast);

        &:hover {
            color:           $primary;
            text-decoration: none;
        }

        i {
            font-size: 0.75rem;
        }
    }

    h2 {
        margin:    0;
        font-size: 1.5rem;
    }

    .header-badges {
        display:   flex;
        flex-wrap: wrap;
        gap:       $space-2;
    }
}

.date-badge {
    display:       inline-flex;
    align-items:   center;
    gap:           $space-2;
    padding:       $space-1 $space-3;
    background:    $light-gray;
    border-radius: $radius-full;
    font-size:     0.8125rem;
    color:         $text-secondary;

    i {
        font-size: 0.75rem;
    }
}

.status-badge {
    @include status-badge;

    &.open {
        background: rgba($primary, 0.1);
        color:      $primary-dark;
    }

    &.locked {
        background: rgba($red, 0.1);
        color:      $red;
    }

    i {
        font-size: 0.75rem;
    }
}

.event-status-badge {
    display:       inline-flex;
    align-items:   center;
    gap:           $space-2;
    padding:       $space-1 $space-3;
    border-radius: $radius-full;
    font-size:     0.8125rem;
    font-weight:   500;

    &.scheduled {
        background: rgba(#666, 0.1);
        color:      #666;
    }

    &.live {
        background: rgba($red, 0.1);
        color:      $red;
        gap:        $space-3;

        i {
            animation: pulse 1.5s ease-in-out infinite;
        }

        .game-clock {
            font-weight: 600;
        }

        .game-score {
            font-weight: 700;
        }

        .live-indicator {
            display:     inline-flex;
            align-items: center;
            gap:         $space-1;

            &::before {
                content:       '';
                width:         8px;
                height:        8px;
                background:    currentColor;
                border-radius: 50%;
                animation:     pulse 1.5s ease-in-out infinite;
            }
        }
    }

    &.final {
        background: rgba($primary, 0.1);
        color:      $primary-dark;
    }

    .live-indicator {
        font-weight:    700;
        letter-spacing: 0.5px;
    }
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

// Print-only elements
.print-only {
    display: none;
}

// Card Styles
.card {
    @include card-base($radius-xl);
    overflow:      hidden;
    margin-bottom: $space-5;
}

.card-header {
    @include card-header;
    gap: $space-3;

    h3 {
        margin:    0;
        font-size: 1.125rem;
    }

    > i {
        color:     $text-secondary;
        font-size: 1rem;
    }
}

.card-footer {
    @include card-footer;
}

// Admin Actions Card
.admin-card {
    .admin-actions {
        padding: $space-3;
    }

    .action-btn {
        display:       flex;
        align-items:   center;
        gap:           $space-4;
        width:         100%;
        padding:       $space-4;
        background:    #fff;
        border:        1px solid $light-gray;
        border-radius: $radius-lg;
        text-align:    left;
        cursor:        pointer;
        transition:    all var(--transition-fast);
        margin-bottom: $space-2;

        &:last-child {
            margin-bottom: 0;
        }

        &:hover {
            background:   rgba($primary, 0.03);
            border-color: rgba($primary, 0.3);
            transform:    none;
            box-shadow:   none;
        }

        &.active {
            background:   rgba($primary, 0.08);
            border-color: rgba($primary, 0.4);
            color:        $primary-dark;
        }

        &.needs-setup {
            position:     relative;
            border-color: transparent;
            overflow:     hidden;

            &::before {
                content:        '';
                position:       absolute;
                top:            50%;
                left:           50%;
                width:          300%;
                aspect-ratio:   1;
                background:     conic-gradient(#7c3aed, #3b82f6, #06b6d4, #3b82f6, #7c3aed);
                animation:      neon-shimmer 2.5s linear infinite;
                pointer-events: none;
            }

            &::after {
                content:        '';
                position:       absolute;
                inset:          2px;
                z-index:        1;
                background:     #fff;
                border-radius:  $radius-md;
                pointer-events: none;
            }

            > i, > .action-text {
                position: relative;
                z-index:  2;
            }

            > i {
                background: rgba(124, 58, 237, 0.12);
                color:      #7c3aed;
            }

            &:hover::after {
                background: #fafafa;
            }
        }

        @keyframes neon-shimmer {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        > i {
            flex-shrink:     0;
            width:           40px;
            height:          40px;
            display:         flex;
            align-items:     center;
            justify-content: center;
            background:      $light-gray;
            border-radius:   $radius-md;
            color:           $text-secondary;
            font-size:       1rem;
        }

        .action-text {
            flex:           1;
            display:        flex;
            flex-direction: column;
            gap:            $space-1;
        }

        .action-label {
            font-weight: 600;
            color:       $text-color;
        }

        .action-desc {
            font-size: 0.8125rem;
            color:     $text-secondary;

            @include mobile {
                display: none;
            }
        }
    }

    .action-divider {
        display:        flex;
        align-items:    center;
        gap:            $space-3;
        padding:        $space-3 0;
        color:          $text-secondary;
        font-size:      0.75rem;
        font-weight:    600;
        text-transform: uppercase;
        letter-spacing: 0.5px;

        &::before,
        &::after {
            content:    '';
            flex:       1;
            height:     1px;
            background: $light-gray;
        }
    }

    .numbers-drawn-notice {
        display:       flex;
        align-items:   center;
        gap:           $space-3;
        padding:       $space-4;
        background:    rgba($primary, 0.05);
        border-radius: $radius-lg;
        color:         $primary-dark;
        font-weight:   500;
        margin-top:    $space-3;

        i {
            color: $primary;
        }
    }
}

// Branding Card
.branding-card {
    .branding-content {
        padding:         $space-4 $space-5;
        display:         flex;
        justify-content: center;
        align-items:     center;

        img {
            max-width:  100%;
            max-height: 150px;
            object-fit: contain;
        }
    }
}

// Notes Card
.notes-card {
    background:   rgba($yellow, 0.08);
    border-color: rgba($yellow, 0.35);

    .card-header {
        background:   rgba($yellow, 0.12);
        border-color: rgba($yellow, 0.25);

        i {
            color: color.adjust($yellow, $lightness: -15%);
        }
    }

    .notes-content {
        padding:     $space-4 $space-5;
        white-space: pre-wrap;
        word-break:  break-word;
        line-height: 1.6;
        color:       $text-color;
    }
}

// Settings Card
.settings-card {
    .settings-list {
        padding: $space-2 0;
    }

    .setting-item {
        display:     flex;
        align-items: flex-start;
        padding:     $space-3 $space-5;
        gap:         $space-4;
        transition:  background-color var(--transition-fast);

        &:hover {
            background-color: #fafafa;
        }

        > label {
            flex:        0 0 100px;
            font-size:   0.875rem;
            color:       $text-secondary;
            padding-top: $space-1;

            @include mobile {
                flex: 0 0 80px;
            }
        }

        .setting-value {
            flex:        1;
            display:     flex;
            align-items: center;
            align-self:  center;
            gap:         $space-2;
            min-height:  24px;
        }
    }

    .pool-link {
        display:     inline-flex;
        align-items: center;
        gap:         $space-2;
        color:       $text-color;
        font-weight: 500;
        transition:  color var(--transition-fast);

        &:hover {
            color:           $primary;
            text-decoration: none;
        }

        i {
            color:     $text-secondary;
            font-size: 0.875rem;
        }
    }

    code.token {
        background:    $light-gray;
        padding:       $space-1 $space-2;
        border-radius: $radius-sm;
        font-size:     0.8125rem;
        font-family:   monospace;
    }

    .badge {
        @include badge;
    }

    .numbers-pending,
    .numbers-manual,
    .numbers-random {
        @include numbers-status;
    }

    .numbers-pending {
        color: $text-secondary;
    }

    .numbers-manual {
        color: $primary-dark;
    }

    .numbers-random {
        color: $primary-dark;
    }

}

// Legend Card
.legend-card {
    .legend-items {
        display:   flex;
        flex-wrap: wrap;
        gap:       $space-3;
        padding:   $space-4 $space-5;
    }

    .legend-item {
        display:     flex;
        align-items: center;
        gap:         $space-2;
    }

    .legend-color {
        width:         16px;
        height:        16px;
        border-radius: $radius-sm;

        &.q1, &.half { background: $q1-color; }

        &.q2 { background: $q2-color; }

        &.q3 { background: $q3-color; }

        &.q4, &.final { background: $q4-color; }
    }

    .legend-label {
        font-size:   0.875rem;
        color:       $text-color;
        font-weight: 500;
    }
}

// Expand Button
.expand-btn {
    width:           100%;
    display:         flex;
    align-items:     center;
    justify-content: center;
    gap:             $space-2;

    @media (min-width: 8.5in) {
        display: none;
    }
}

// Bulk selection badge (fixed bottom-right corner of viewport)
.bulk-selection-badge {
    position:      fixed;
    bottom:        $space-4;
    right:         $space-4;
    background:    #7c3aed;
    color:         #fff;
    border-radius: $radius-full;
    padding:       $space-2 $space-4;
    font-weight:   600;
    font-size:     0.875rem;
    display:       flex;
    align-items:   center;
    gap:           $space-2;
    box-shadow:    0 2px 8px rgba(0, 0, 0, 0.25);
    z-index:       100;
    pointer-events: none;
}

// Logs Card
.logs-card {
    width:     calc(100vmin - var(--spacing) * 2);
    max-width: 100%;
    margin:    0 auto;

    :deep(section.audit-log) {
        margin-top: 0;
    }
}

@media print {
    @page {
        margin: 0.5in;
    }

    .print-layout {
        display: block;
    }

    div.grid-layout {
        display: block;
    }

    .grid-sidebar {
        width:     auto;
        min-width: auto;
    }

    // Show print-only elements
    .print-only {
        display: block;
    }

    .print-header {
        display:          flex;
        justify-content:  space-between;
        align-items:      flex-start;
        margin-bottom:    var(--spacing);
        page-break-after: avoid;

        .print-header-text {
            flex: 1;

            .pool-name {
                font-size:     1.0em;
                font-weight:   normal;
                margin-bottom: 0;
            }

            h3 {
                font-size:     1.4em;
                font-weight:   bold;
                margin-bottom: 0;
            }

            .event-date {
                margin-bottom: 0;
                font-size:     0.7em;
                color:         var(--gray);
            }
        }

        .print-header-branding {
            flex-shrink: 0;
            margin-left: var(--spacing);

            img {
                max-width:  150px;
                max-height: 80px;
                object-fit: contain;
            }
        }
    }

    // Hide screen-only elements
    .page-header { display: none; }
    .notes-screen { display: none; }
    .branding-screen { display: none; }
    .admin-card { display: none; }
    .sidebar-extra { display: none; }
    .settings-card { display: none; }
    .legend-card { display: none; }
    .logs-card { display: none; }
    .expand-btn { display: none; }
    header { display: none; }
    footer { display: none; }
    div.content { padding: 0; }
    nav { display: none; }
    section.audit-log { display: none; }

    .notes-print {
        display:           block;
        margin-top:        var(--spacing);
        page-break-before: always;
    }

    .print-legend {
        display:       flex;
        align-items:   center;
        gap:           1rem;
        margin-bottom: var(--spacing);
        font-size:     0.875rem;

        .print-legend-item {
            display:     inline-flex;
            align-items: center;
            gap:         0.25rem;
        }

        .legend-color {
            width:         12px;
            height:        12px;
            border-radius: 2px;
            display:       inline-block;

            &.q1, &.half { background: $q1-color; }

            &.q2 { background: $q2-color; }

            &.q3 { background: $q3-color; }

            &.q4, &.final { background: $q4-color; }
        }
    }

    .squares-container {
        page-break-inside: avoid;
    }

    div.score {
        background:  transparent;
        border:      2px solid var(--team-secondary-no-white);
        color:       var(--team-secondary-no-white);
        font-weight: bold;
    }
    div.std25.squares,
    div.std50.squares,
    div.std100.squares,
    div.roll100.squares {
        width:        100%;
        max-width:    7.5in;
        height:       auto;
        aspect-ratio: 1;
    }

    div.team {
        background:  transparent;
        text-shadow: none;
        color:       var(--team-primary);

        &.away-team {
            background: transparent;
        }
    }

    div.std25.squares div.square span.name {
        font-size: clamp(10px, 2.5vw, 2.5vw);
    }

    div.square {
        span.name {
            font-size: clamp(10px, 1.5vw, 1.5vw);
        }

        span.square-id {
            font-size: 10px;
        }

        &:hover {
            border:     1px solid $border-color;
            box-shadow: none;
            transform:  none;
        }

        &::after {
            display: none;
        }
    }
}
</style>