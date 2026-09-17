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
    <div class="admin-sports">
        <h2>Sports Sync</h2>

        <div v-if="statusError" class="error" role="alert">{{ statusError }}</div>
        <div v-if="statusLoading && !status" class="loading">Loading sync status...</div>
        <template v-if="status">
            <div v-if="status.running" class="running-banner">
                <i class="fas fa-sync fa-spin"></i>
                Sync in progress: {{ formatSyncType(status.running.syncType) }}
                {{ formatLeague(status.running.league) }}
                since {{ formatDate(status.running.startedAt) }}
            </div>

            <!-- (b) run sync -->
            <section class="panel">
                <div class="section-header">
                    <h3>Run Sync</h3>
                </div>
                <div class="run-form">
                    <label class="filter-field">
                        <span class="filter-label">Sync Type</span>
                        <select v-model="runSyncType" :disabled="!!status.running">
                            <option v-for="type in syncTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
                        </select>
                    </label>
                    <label class="filter-field">
                        <span class="filter-label">League</span>
                        <select v-model="runLeague" :disabled="!!status.running">
                            <option value="">All Leagues</option>
                            <option v-for="league in leagues" :key="league.value" :value="league.value">{{ league.label }}</option>
                        </select>
                    </label>
                    <button type="button" :disabled="!!status.running || starting" @click="startSync">
                        {{ starting ? 'Starting...' : 'Run' }}
                    </button>
                </div>
                <div v-if="note" class="success-note">{{ note }}</div>
                <div v-if="runError" class="error">{{ runError }}</div>
            </section>

            <!-- (a) sync health: the latest run of each sync type, folded across leagues -->
            <section class="panel">
                <div class="section-header">
                    <h3>Sync Health</h3>
                    <button type="button" class="secondary sm" :disabled="statusLoading" @click="fetchStatus">
                        {{ statusLoading ? 'Refreshing...' : 'Refresh' }}
                    </button>
                </div>
                <ul class="health-list">
                    <li v-for="item in syncHealth" :key="item.type" class="health-row">
                        <span class="health-type">{{ item.label }}</span>
                        <span :class="['status', item.statusClass]">{{ item.summary }}</span>
                        <span class="health-detail">{{ item.detail }}</span>
                    </li>
                </ul>
            </section>

            <!-- (c) stale events -->
            <section class="panel">
                <div class="section-header">
                    <h3>Stale Events</h3>
                    <span class="hint">In progress but not synced in 30 minutes, or still scheduled 3 hours after kickoff.</span>
                </div>
                <div v-if="status.staleEvents && status.staleEvents.length > 0" class="table-wrap">
                    <table class="pools-table">
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>League</th>
                            <th>Event</th>
                            <th>Status</th>
                            <th class="numeric">Grids</th>
                            <th>Last Synced</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="event in status.staleEvents" :key="event.id">
                            <td>{{ formatDate(event.eventDate) }}</td>
                            <td>{{ formatLeague(event.league) }}</td>
                            <td>{{ event.name || `${event.awayTeam} at ${event.homeTeam}` }}</td>
                            <td>
                                <span :class="['status', eventStatusClass(event.status)]">{{ formatEventStatus(event.status) }}</span>
                            </td>
                            <td class="numeric">{{ formatNumber(event.gridCount) }}</td>
                            <td>{{ formatDate(event.lastSynced) }}</td>
                            <td>
                                <button
                                    type="button"
                                    class="small"
                                    :disabled="refreshing[event.id]"
                                    @click="refreshEvent(event)"
                                >
                                    {{ refreshing[event.id] ? 'Refreshing...' : 'Refresh from ESPN' }}
                                </button>
                                <div v-if="refreshErrors[event.id]" class="inline-error">{{ refreshErrors[event.id] }}</div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else class="no-data">No stale events. Everything with an active grid is up to date.</div>
            </section>
        </template>

        <!-- (d) recent runs -->
        <section class="panel">
            <div class="section-header">
                <h3>Run History</h3>
                <div class="controls">
                    <label class="filter-field">
                        <span class="filter-label">Sync Type</span>
                        <select v-model="runsSyncType">
                            <option value="">All Types</option>
                            <option v-for="type in syncTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
                        </select>
                    </label>
                    <label class="filter-field">
                        <span class="filter-label">Limit</span>
                        <select v-model.number="runsLimit">
                            <option :value="25">25</option>
                            <option :value="50">50</option>
                            <option :value="100">100</option>
                            <option :value="200">200</option>
                        </select>
                    </label>
                </div>
            </div>
            <div v-if="runsError" class="error">{{ runsError }}</div>
            <div v-else-if="runsLoading && !runs" class="loading">Loading runs...</div>
            <div v-else-if="runs && runs.runs && runs.runs.length > 0" :class="['table-wrap', { refreshing: runsLoading }]">
                <table class="pools-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>League</th>
                        <th>Started</th>
                        <th>Completed</th>
                        <th>Duration</th>
                        <th class="numeric">Records</th>
                        <th>Result</th>
                        <th>Error</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="run in runs.runs" :key="run.id">
                        <td>{{ run.id }}</td>
                        <td>{{ formatSyncType(run.syncType) }}</td>
                        <td>{{ formatLeague(run.league) }}</td>
                        <td>{{ formatDate(run.startedAt) }}</td>
                        <td>{{ run.completedAt ? formatDate(run.completedAt) : 'Running' }}</td>
                        <td>{{ formatDuration(run.startedAt, run.completedAt) }}</td>
                        <td class="numeric">{{ formatNumber(run.recordsProcessed) }}</td>
                        <td>
                            <span v-if="!run.completedAt" class="status warning">Running</span>
                            <span v-else :class="['status', run.success ? 'success' : 'failed']">
                                {{ run.success ? 'Success' : 'Failed' }}
                            </span>
                        </td>
                        <td class="error-message">{{ run.errorMessage || '-' }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div v-else class="no-data">No sync runs match the selected filter.</div>
        </section>
    </div>
</template>

<script>
import sqmgrClient from "@/models/sqmgrClient"
import timedNoteMixin from "@/components/admin/timedNoteMixin"
import { formatDate, formatDuration, formatNumber, formatRelative, formatEventStatus, eventStatusClass, getErrorMessage } from "@/utils/adminFormat"
import { LEAGUES } from "@/constants/admin"

const POLL_INTERVAL_MS = 10000

export default {
    name: "AdminSports",
    mixins: [timedNoteMixin],
    data() {
        return {
            status: null,
            statusLoading: false,
            statusError: null,
            pollTimer: null,

            syncTypes: [
                {value: 'teams', label: 'Teams'},
                {value: 'schedule', label: 'Schedule'},
                {value: 'scores', label: 'Scores'},
            ],
            leagues: LEAGUES,
            runSyncType: 'scores',
            runLeague: '',
            starting: false,
            runError: null,

            refreshing: {},
            refreshErrors: {},

            runs: null,
            runsLoading: false,
            runsError: null,
            runsSyncType: '',
            runsLimit: 50,
        }
    },
    computed: {
        // One line per sync type. Teams and schedule syncs run per league,
        // so a type is "failing" when any league's latest run failed.
        syncHealth() {
            const lastRuns = (this.status && this.status.lastRuns) || []
            return this.syncTypes.map(type => {
                const runs = lastRuns.filter(run => run.syncType === type.value)
                if (runs.length === 0) {
                    return {type: type.value, label: type.label, statusClass: 'neutral', summary: 'No runs yet', detail: ''}
                }

                const latest = runs.reduce((a, b) => (b.id > a.id ? b : a))
                const failing = runs.filter(run => run.success === false)
                const running = runs.filter(run => run.success === null || run.success === undefined)
                const lastRun = `Last run ${formatRelative(latest.startedAt)}`

                if (running.length > 0) {
                    return {type: type.value, label: type.label, statusClass: 'neutral', summary: 'Running', detail: `Started ${formatRelative(running[0].startedAt)}`}
                }
                if (failing.length > 0) {
                    const leagues = failing.map(run => this.formatLeague(run.league)).join(', ')
                    const error = failing.length === 1 && failing[0].errorMessage ? ` — ${failing[0].errorMessage}` : ''
                    return {type: type.value, label: type.label, statusClass: 'failed', summary: `Failing: ${leagues}`, detail: `${lastRun}${error}`}
                }
                return {
                    type: type.value,
                    label: type.label,
                    statusClass: 'success',
                    summary: 'Healthy',
                    detail: `${lastRun}, ${formatNumber(latest.recordsProcessed)} records in ${formatDuration(latest.startedAt, latest.completedAt)}`,
                }
            })
        },
    },
    watch: {
        runsSyncType() {
            this.fetchRuns()
        },
        runsLimit() {
            this.fetchRuns()
        },
    },
    beforeMount() {
        this.fetchStatus()
        this.fetchRuns()
    },
    beforeUnmount() {
        this.stopPolling()
    },
    methods: {
        formatDate,
        formatDuration,
        formatNumber,

        async fetchStatus() {
            this.statusLoading = true
            this.statusError = null
            const wasRunning = !!(this.status && this.status.running)
            try {
                this.status = await sqmgrClient.getAdminSportsStatus()
                if (this.status.running) {
                    this.startPolling()
                } else {
                    this.stopPolling()
                    // a run just finished, so the run history has a new row
                    if (wasRunning) {
                        this.fetchRuns()
                    }
                }
            } catch (err) {
                // keep the last good status on screen; a transient poll error
                // should not hide the form or stop watching a running sync
                this.statusError = getErrorMessage(err)
                if (!wasRunning) {
                    this.stopPolling()
                }
            } finally {
                this.statusLoading = false
            }
        },

        startPolling() {
            if (this.pollTimer) return
            this.pollTimer = setInterval(() => this.fetchStatus(), POLL_INTERVAL_MS)
        },

        stopPolling() {
            if (this.pollTimer) {
                clearInterval(this.pollTimer)
                this.pollTimer = null
            }
        },

        async startSync() {
            this.starting = true
            this.runError = null
            this.clearNote()
            try {
                await sqmgrClient.adminStartSportsSync(this.runSyncType, this.runLeague)
                this.showNote(`Started ${this.formatSyncType(this.runSyncType)} sync for ${this.formatLeague(this.runLeague)}.`)
                await this.fetchStatus()
                // a quick sync can finish before the first poll, so refresh the history now
                this.fetchRuns()
            } catch (err) {
                this.runError = getErrorMessage(err)
            } finally {
                this.starting = false
            }
        },

        async refreshEvent(event) {
            this.refreshing = { ...this.refreshing, [event.id]: true }
            this.refreshErrors = { ...this.refreshErrors, [event.id]: null }
            try {
                const updated = await sqmgrClient.adminRefreshEvent(event.id)
                if (updated) {
                    event.status = updated.status ?? event.status
                    event.lastSynced = updated.lastSynced ?? event.lastSynced
                }
                // the event may no longer be stale, so reload the list
                await this.fetchStatus()
            } catch (err) {
                this.refreshErrors = { ...this.refreshErrors, [event.id]: getErrorMessage(err) }
            } finally {
                this.refreshing = { ...this.refreshing, [event.id]: false }
            }
        },

        async fetchRuns() {
            this.runsLoading = true
            this.runsError = null
            try {
                this.runs = await sqmgrClient.getAdminSportsSyncRuns({
                    syncType: this.runsSyncType,
                    limit: this.runsLimit,
                })
            } catch (err) {
                this.runsError = getErrorMessage(err)
            } finally {
                this.runsLoading = false
            }
        },

        formatSyncType(type) {
            const found = this.syncTypes.find(t => t.value === type)
            return found ? found.label : (type || '-')
        },

        formatLeague(league) {
            return league ? String(league).toUpperCase() : 'All Leagues'
        },

        formatEventStatus,
        eventStatusClass,
    },
}
</script>

<style scoped lang="scss">
@use '../../variables' as *;
@use './admin' as *;

.admin-sports {
    @include admin-messages;

    h2 {
        margin-top:    var(--spacing);
        margin-bottom: var(--spacing);
    }

    .running-banner {
        display:       flex;
        align-items:   center;
        gap:           $space-2;
        padding:       $space-3 $space-4;
        margin-bottom: $space-5;
        background:    #fff3cd;
        color:         #856404;
        border-left:   4px solid #e6a700;
        border-radius: 0 $radius-lg $radius-lg 0;
        font-weight:   500;
    }

    .health-list {
        list-style: none;
        margin:     0;
        padding:    0;

        .health-row {
            display:     flex;
            align-items: center;
            gap:         $space-3;
            padding:     $space-2 0;
            flex-wrap:   wrap;

            & + .health-row {
                border-top: 1px solid var(--border-color);
            }
        }

        .health-type {
            font-weight: 600;
            min-width:   6rem;
        }

        .health-detail {
            color:     $text-secondary;
            font-size: 0.9em;
        }
    }

    .panel {
        @include admin-section;

        .section-header {
            .controls {
                @include admin-filter-bar;
                margin-bottom: 0;
            }

            .hint {
                font-size: 0.8rem;
                color:     $text-secondary;
            }
        }

        .run-form {
            @include admin-filter-bar;
            margin-bottom: $space-3;
        }

        .table-wrap {
            overflow-x: auto;

            &.refreshing {
                opacity: 0.5;
            }
        }

        .pools-table {
            @include admin-table;
            margin-bottom: 0;

            .error-message {
                max-width:  320px;
                font-size:  0.85em;
                color:      $alert-error-text;
                word-break: break-word;
            }

            .inline-error {
                margin-top: $space-1;
                font-size:  0.8em;
                color:      $red;
            }
        }

        .status {
            @include admin-status;
        }

        button.small {
            @include admin-small-button;
        }
    }
}
</style>
