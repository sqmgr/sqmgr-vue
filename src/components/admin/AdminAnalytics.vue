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
    <div class="admin-analytics">
        <h2>Analytics</h2>

        <!-- Date range: one row that scopes every panel below -->
        <div class="range-filter">
            <span class="label">Date Range</span>
            <div class="options">
                <button
                    v-for="preset in presets"
                    :key="preset.value"
                    type="button"
                    :class="['period-btn', { active: selectedPreset === preset.value }]"
                    @click="selectPreset(preset.value)"
                >
                    {{ preset.label }}
                </button>
            </div>

            <div class="custom-range" v-if="selectedPreset === 'custom'">
                <label class="filter-field">
                    <span class="filter-label">Start</span>
                    <input type="date" v-model="customStart" :max="customEnd || undefined"/>
                </label>
                <label class="filter-field">
                    <span class="filter-label">End</span>
                    <input type="date" v-model="customEnd" :min="customStart || undefined"/>
                </label>
                <button type="button" class="sm" :disabled="!customStart || !customEnd" @click="applyCustomRange">
                    Apply
                </button>
            </div>
            <div v-if="customError" class="error custom-error">{{ customError }}</div>
            <p class="range-summary">{{ rangeSummary }}</p>
        </div>

        <!-- (a) time series -->
        <section class="panel">
            <div class="section-header">
                <h3>Activity Over Time</h3>
                <div class="controls">
                    <label class="filter-field">
                        <span class="filter-label">Metric</span>
                        <select v-model="metric">
                            <option v-for="m in metrics" :key="m.value" :value="m.value">{{ m.label }}</option>
                        </select>
                    </label>
                    <label class="filter-field">
                        <span class="filter-label">Interval</span>
                        <select v-model="interval">
                            <option value="day">Day</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                        </select>
                    </label>
                </div>
            </div>
            <div v-if="timeSeries.error" class="error">{{ timeSeries.error }}</div>
            <div v-else-if="timeSeries.loading && !timeSeries.data" class="loading">Loading time series...</div>
            <div v-else :class="['panel-body', { refreshing: timeSeries.loading }]">
                <time-series-chart
                    :points="timeSeries.data ? timeSeries.data.points : []"
                    :interval="timeSeries.data ? timeSeries.data.interval : interval"
                    :metric-label="metricLabel"
                />
            </div>
        </section>

        <!-- (b) engagement -->
        <section class="panel">
            <div class="section-header">
                <h3>Engagement</h3>
            </div>
            <div v-if="engagement.error" class="error">{{ engagement.error }}</div>
            <div v-else-if="engagement.loading && !engagement.data" class="loading">Loading engagement...</div>
            <div v-else-if="engagement.data" :class="['stat-tiles', { refreshing: engagement.loading }]">
                <div v-for="tile in engagementTiles" :key="tile.key" class="stat-card">
                    <span class="stat-value">{{ tile.value }}</span>
                    <span class="stat-label">{{ tile.label }}</span>
                </div>
            </div>
            <div v-else class="no-data">No engagement data for this range.</div>
        </section>

        <!-- (c) fill rates -->
        <section class="panel">
            <div class="section-header">
                <h3>Fill Rates</h3>
                <div class="controls">
                    <label class="filter-field">
                        <span class="filter-label">Grid Type</span>
                        <select v-model="fillGridType">
                            <option value="">All Types</option>
                            <option v-for="type in gridTypes" :key="type" :value="type">{{ type }}</option>
                        </select>
                    </label>
                    <label class="filter-field">
                        <span class="filter-label">Status</span>
                        <select v-model="fillArchived">
                            <option value="">All</option>
                            <option value="false">Active</option>
                            <option value="true">Archived</option>
                        </select>
                    </label>
                </div>
            </div>
            <div v-if="fillRates.error" class="error">{{ fillRates.error }}</div>
            <div v-else-if="fillRates.loading && !fillRates.data" class="loading">Loading fill rates...</div>
            <template v-else-if="fillRates.data">
                <div :class="['stat-tiles', { refreshing: fillRates.loading }]">
                    <div v-for="tile in fillRateTiles" :key="tile.key" class="stat-card">
                        <span class="stat-value">{{ tile.value }}</span>
                        <span class="stat-label">{{ tile.label }}</span>
                        <span v-if="tile.sub" class="stat-sub">{{ tile.sub }}</span>
                    </div>
                </div>
                <h4>Pools by fill percentage</h4>
                <div :class="['panel-body', { refreshing: fillRates.loading }]">
                    <horizontal-bar-chart
                        :rows="fillBuckets"
                        title="Pools by fill percentage"
                        empty-text="No pools were created in this range."
                    />
                </div>
            </template>
            <div v-else class="no-data">No fill rate data for this range.</div>
        </section>

        <!-- (d) breakdown -->
        <section class="panel">
            <div class="section-header">
                <h3>Pool Breakdown</h3>
                <div class="controls">
                    <label class="filter-field">
                        <span class="filter-label">Dimension</span>
                        <select v-model="dimension">
                            <option v-for="d in dimensions" :key="d.value" :value="d.value">{{ d.label }}</option>
                        </select>
                    </label>
                </div>
            </div>
            <div v-if="breakdown.error" class="error">{{ breakdown.error }}</div>
            <div v-else-if="breakdown.loading && !breakdown.data" class="loading">Loading breakdown...</div>
            <div v-else :class="['panel-body', { refreshing: breakdown.loading }]">
                <horizontal-bar-chart
                    :rows="breakdownRows"
                    :title="`Pools by ${dimensionLabel}`"
                    empty-text="No pools match this range."
                />
            </div>
        </section>

        <!-- (e) top creators -->
        <section class="panel">
            <div class="section-header">
                <h3>Top Pool Creators</h3>
                <div class="controls">
                    <label class="filter-field">
                        <span class="filter-label">Show</span>
                        <select v-model.number="topLimit">
                            <option :value="10">Top 10</option>
                            <option :value="25">Top 25</option>
                            <option :value="50">Top 50</option>
                        </select>
                    </label>
                </div>
            </div>
            <div v-if="topCreators.error" class="error">{{ topCreators.error }}</div>
            <div v-else-if="topCreators.loading && !topCreators.data" class="loading">Loading top creators...</div>
            <div v-else-if="topCreators.data && topCreators.data.creators && topCreators.data.creators.length > 0" :class="{ refreshing: topCreators.loading }">
                <table class="pools-table">
                    <thead>
                    <tr>
                        <th class="numeric">#</th>
                        <th>User</th>
                        <th>Type</th>
                        <th class="numeric">Pools Created</th>
                        <th class="numeric">Squares Claimed</th>
                        <th class="numeric">Members</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(creator, i) in topCreators.data.creators" :key="creator.userId">
                        <td class="numeric">{{ i + 1 }}</td>
                        <td>
                            <router-link :to="`/admin/user/${creator.userId}`">
                                {{ formatUserLabel(creator.userId, creator.email, creator.store) }}
                            </router-link>
                        </td>
                        <td>{{ formatStoreLabel(creator.store) }}</td>
                        <td class="numeric">{{ formatNumber(creator.poolsCreated) }}</td>
                        <td class="numeric">{{ formatNumber(creator.squaresClaimedInTheirPools) }}</td>
                        <td class="numeric">{{ formatNumber(creator.membersAcrossTheirPools) }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div v-else class="no-data">No pools were created in this range.</div>
        </section>
    </div>
</template>

<script>
import sqmgrClient from "@/models/sqmgrClient"
import TimeSeriesChart from "@/components/admin/charts/TimeSeriesChart"
import HorizontalBarChart from "@/components/admin/charts/HorizontalBarChart"
import { formatNumber, formatPercent, formatDecimal, formatUserLabel, formatStoreLabel, getErrorMessage, toISODate } from "@/utils/adminFormat"
import { GRID_TYPES } from "@/constants/admin"

// seq counts requests per panel so a slow, stale response is discarded
function panelState() {
    return { data: null, loading: false, error: null, seq: 0 }
}

const DAY_MS = 24 * 60 * 60 * 1000

export default {
    name: "AdminAnalytics",
    components: {TimeSeriesChart, HorizontalBarChart},
    data() {
        return {
            presets: [
                {value: '7d', label: 'Last 7 Days'},
                {value: '30d', label: 'Last 30 Days'},
                {value: '90d', label: 'Last 90 Days'},
                {value: 'ytd', label: 'Year to Date'},
                {value: 'all', label: 'All Time'},
                {value: 'custom', label: 'Custom'},
            ],
            selectedPreset: '30d',
            customStart: '',
            customEnd: '',
            appliedCustom: null,
            customError: null,

            metrics: [
                {value: 'pools_created', label: 'Pools Created'},
                {value: 'users_registered', label: 'Users Registered'},
                {value: 'guest_users_created', label: 'Guest Users Created'},
                {value: 'squares_claimed', label: 'Squares Claimed'},
                {value: 'grids_created', label: 'Grids Created'},
                {value: 'pool_members_joined', label: 'Pool Members Joined'},
            ],
            metric: 'pools_created',
            interval: 'day',

            dimensions: [
                {value: 'grid_type', label: 'Grid Type'},
                {value: 'number_set_config', label: 'Number Set Config'},
                {value: 'archived', label: 'Archived'},
                {value: 'password_required', label: 'Password Required'},
                {value: 'open_access_on_lock', label: 'Open Access on Lock'},
                {value: 'owner_store', label: 'Owner Account Type'},
                {value: 'league', label: 'League'},
                {value: 'square_state', label: 'Square State'},
            ],
            dimension: 'grid_type',

            gridTypes: GRID_TYPES,
            fillGridType: '',
            fillArchived: '',

            topLimit: 10,

            timeSeries: panelState(),
            engagement: panelState(),
            fillRates: panelState(),
            breakdown: panelState(),
            topCreators: panelState(),
        }
    },
    computed: {
        range() {
            const today = new Date()
            const end = toISODate(today)
            const daysAgo = days => toISODate(new Date(today.getTime() - (days - 1) * DAY_MS))
            switch (this.selectedPreset) {
                case '7d':
                    return { start: daysAgo(7), end }
                case '30d':
                    return { start: daysAgo(30), end }
                case '90d':
                    return { start: daysAgo(90), end }
                case 'ytd':
                    return { start: `${today.getUTCFullYear()}-01-01`, end }
                case 'custom':
                    return this.appliedCustom
                default:
                    return {}
            }
        },
        rangeKey() {
            return JSON.stringify(this.range)
        },
        rangeSummary() {
            if (!this.range) return 'Pick a start and end date, then click Apply.'
            if (!this.range.start && !this.range.end) return 'Showing all time.'
            return `Showing ${this.range.start} through ${this.range.end} (UTC).`
        },
        metricLabel() {
            const found = this.metrics.find(m => m.value === this.metric)
            return found ? found.label : this.metric
        },
        dimensionLabel() {
            const found = this.dimensions.find(d => d.value === this.dimension)
            return found ? found.label.toLowerCase() : this.dimension
        },
        engagementTiles() {
            const e = this.engagement.data
            if (!e) return []
            return [
                {key: 'registered', label: 'Users Registered', value: formatNumber(e.registeredUsersCreated)},
                {key: 'guests', label: 'Guest Users Created', value: formatNumber(e.guestUsersCreated)},
                {key: 'pools', label: 'Pools Created', value: formatNumber(e.poolsCreated)},
                {key: 'creators', label: 'Pool Creators', value: formatNumber(e.poolCreators)},
                {key: 'repeat', label: 'Repeat Creators', value: formatNumber(e.repeatPoolCreators)},
                {key: 'returning', label: 'Returning Creators', value: formatNumber(e.returningPoolCreators)},
                {key: 'anyClaims', label: 'Pools With Claims', value: formatNumber(e.poolsWithAnyClaims)},
                {key: 'sports', label: 'Pools With Sports Event', value: formatNumber(e.poolsWithSportsEvent)},
                {key: 'avgMembers', label: 'Avg Members / Pool', value: formatDecimal(e.avgMembersPerPool)},
                {key: 'avgGrids', label: 'Avg Grids / Pool', value: formatDecimal(e.avgGridsPerPool)},
                {key: 'claims', label: 'Claim Events', value: formatNumber(e.claimEvents)},
                {key: 'claimsReg', label: 'Claims by Registered', value: formatNumber(e.claimEventsByRegisteredUsers)},
                {key: 'claimsGuest', label: 'Claims by Guests', value: formatNumber(e.claimEventsByGuestUsers)},
                {key: 'claimsAnon', label: 'Anonymous Claims', value: formatNumber(e.claimEventsAnonymous)},
                {key: 'claimers', label: 'Distinct Claimers', value: formatNumber(e.distinctClaimers)},
            ]
        },
        fillRateTiles() {
            const f = this.fillRates.data
            if (!f) return []
            return [
                {key: 'pools', label: 'Pools', value: formatNumber(f.pools)},
                {key: 'full', label: 'Full', value: formatNumber(f.fullPools), sub: `${formatPercent(f.fullPoolPercent)} of pools`},
                {key: 'partial', label: 'Partially Filled', value: formatNumber(f.partialPools)},
                {key: 'empty', label: 'Empty', value: formatNumber(f.emptyPools)},
                {key: 'avg', label: 'Average Fill', value: formatPercent(f.averageFillPercent)},
                {key: 'median', label: 'Median Fill', value: formatPercent(f.medianFillPercent)},
                {key: 'squares', label: 'Squares Claimed', value: formatNumber(f.claimedSquares), sub: `of ${formatNumber(f.totalSquares)}`},
            ]
        },
        fillBuckets() {
            const f = this.fillRates.data
            if (!f || !f.pools) return []
            const pct = count => formatPercent(f.pools > 0 ? (count / f.pools) * 100 : 0)
            return [
                {label: 'No claims', value: f.poolsWithNoClaims || 0, sublabel: pct(f.poolsWithNoClaims || 0)},
                {label: 'Under 25%', value: f.poolsUnder25Percent || 0, sublabel: pct(f.poolsUnder25Percent || 0)},
                {label: '25% to 49%', value: f.pools25To49Percent || 0, sublabel: pct(f.pools25To49Percent || 0)},
                {label: '50% to 74%', value: f.pools50To74Percent || 0, sublabel: pct(f.pools50To74Percent || 0)},
                {label: '75% to 99%', value: f.pools75To99Percent || 0, sublabel: pct(f.pools75To99Percent || 0)},
                {label: 'Full', value: f.fullPools || 0, sublabel: pct(f.fullPools || 0)},
            ]
        },
        breakdownRows() {
            const b = this.breakdown.data
            if (!b || !b.rows) return []
            return b.rows.map(row => ({
                label: this.breakdownLabel(row.value),
                value: row.count,
                sublabel: formatPercent(row.percent),
            }))
        },
    },
    watch: {
        rangeKey() {
            this.fetchAll()
        },
        metric() {
            this.fetchTimeSeries()
        },
        interval() {
            this.fetchTimeSeries()
        },
        dimension() {
            this.fetchBreakdown()
        },
        topLimit() {
            this.fetchTopCreators()
        },
        fillGridType() {
            this.fetchFillRates()
        },
        fillArchived() {
            this.fetchFillRates()
        },
    },
    beforeMount() {
        this.fetchAll()
    },
    methods: {
        formatNumber,
        formatUserLabel,
        formatStoreLabel,

        selectPreset(preset) {
            if (this.selectedPreset === preset) return
            this.selectedPreset = preset
            this.customError = null
            if (preset === 'custom') {
                this.appliedCustom = null
            }
        },

        applyCustomRange() {
            if (!this.customStart || !this.customEnd) return
            if (this.customStart > this.customEnd) {
                this.customError = 'Start date must be on or before the end date.'
                return
            }
            this.customError = null
            this.appliedCustom = { start: this.customStart, end: this.customEnd }
        },

        breakdownLabel(value) {
            if (value === null || value === undefined || value === '') return '(none)'
            const text = String(value)
            if (text === 'true') return 'Yes'
            if (text === 'false') return 'No'
            if (this.dimension === 'owner_store') return formatStoreLabel(text)
            if (this.dimension === 'league') return text.toUpperCase()
            return text
        },

        fetchAll() {
            if (!this.range) return
            this.fetchTimeSeries()
            this.fetchEngagement()
            this.fetchFillRates()
            this.fetchBreakdown()
            this.fetchTopCreators()
        },

        async loadPanel(panel, request) {
            if (!this.range) return
            const seq = ++panel.seq
            panel.loading = true
            panel.error = null
            try {
                const data = await request(this.range)
                // a newer request superseded this one; drop the stale result
                if (seq !== panel.seq) return
                panel.data = data
            } catch (err) {
                if (seq !== panel.seq) return
                panel.error = getErrorMessage(err)
            } finally {
                if (seq === panel.seq) {
                    panel.loading = false
                }
            }
        },

        fetchTimeSeries() {
            return this.loadPanel(this.timeSeries, range => sqmgrClient.getAdminAnalyticsTimeSeries(this.metric, this.interval, range))
        },

        fetchEngagement() {
            return this.loadPanel(this.engagement, range => sqmgrClient.getAdminAnalyticsEngagement(range))
        },

        fetchFillRates() {
            return this.loadPanel(this.fillRates, range => sqmgrClient.getAdminAnalyticsFillRates({
                ...range,
                gridType: this.fillGridType,
                archived: this.fillArchived,
            }))
        },

        fetchBreakdown() {
            return this.loadPanel(this.breakdown, range => sqmgrClient.getAdminAnalyticsBreakdown(this.dimension, range))
        },

        fetchTopCreators() {
            return this.loadPanel(this.topCreators, range => sqmgrClient.getAdminAnalyticsTopCreators({
                ...range,
                limit: this.topLimit,
            }))
        },
    },
}
</script>

<style scoped lang="scss">
@use '../../variables' as *;
@use './admin' as *;

.admin-analytics {
    @include admin-messages;

    h2 {
        margin-top:    var(--spacing);
        margin-bottom: var(--spacing);
    }

    .range-filter {
        @include admin-section;

        .label {
            font-weight:    600;
            color:          var(--gray);
            font-size:      0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom:  $minimal-spacing;
            display:        block;
        }

        .options {
            @include admin-period-buttons;
        }

        .custom-range {
            @include admin-filter-bar;
            margin-top:    $space-3;
            margin-bottom: 0;
        }

        .custom-error {
            margin-top: $space-2;
            font-size:  0.85rem;
        }

        .range-summary {
            margin:    $space-3 0 0;
            font-size: 0.85rem;
            color:     $text-secondary;
        }
    }

    .panel {
        @include admin-section;

        .section-header {
            .controls {
                @include admin-filter-bar;
                margin-bottom: 0;
            }
        }

        h4 {
            font-family:   inherit;
            font-size:     0.9rem;
            font-weight:   600;
            color:         $text-secondary;
            margin:        $space-2 0 $space-3;
        }

        .stat-tiles {
            @include admin-stat-tiles;
            margin-bottom: $space-3;
        }

        .pools-table {
            @include admin-table;
            margin-bottom: 0;
        }

        // hold the previous render at reduced opacity while refetching
        .refreshing {
            opacity:    0.5;
            transition: opacity var(--transition-fast);
        }
    }
}

@include tablet {
    .admin-analytics .panel .pools-table {
        display:    block;
        overflow-x: auto;
    }
}
</style>
