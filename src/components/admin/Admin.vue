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
    <section class="admin">
        <div class="col-3">
            <h1>Admin Dashboard</h1>

            <div class="stats-container">
                <div class="period-filter">
                    <span class="label">Time Period</span>
                    <div class="options">
                        <button
                            v-for="period in periods"
                            :key="period.value"
                            type="button"
                            :class="['period-btn', { active: selectedPeriod === period.value }]"
                            @click="selectPeriod(period.value)"
                        >
                            {{ period.label }}
                        </button>
                    </div>
                </div>

                <div class="stats" v-if="stats">
                    <div class="stat-card">
                        <span class="stat-value">{{ formatNumber(stats.totalPools) }}</span>
                        <span class="stat-label">Total Pools</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">{{ formatNumber(stats.activePools) }}</span>
                        <span class="stat-label">Active Pools</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">{{ formatNumber(stats.archivedPools) }}</span>
                        <span class="stat-label">Archived Pools</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">{{ formatNumber(stats.totalUsers) }}</span>
                        <span class="stat-label">Users</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">{{ formatNumber(stats.guestUsers) }}</span>
                        <span class="stat-label">Guest Users</span>
                    </div>
                </div>
                <div v-else-if="statsLoading" class="loading">Loading statistics...</div>
                <div v-else-if="statsError" class="error">{{ statsError }}</div>
            </div>

            <div class="tabs">
                <button
                    type="button"
                    :class="['tab-btn', { active: activeTab === 'pools' }]"
                    @click="switchTab('pools')"
                >
                    <i class="fas fa-th-large"></i>
                    Pools
                </button>
                <button
                    type="button"
                    :class="['tab-btn', { active: activeTab === 'users' }]"
                    @click="switchTab('users')"
                >
                    <i class="fas fa-users"></i>
                    Users
                </button>
                <button
                    type="button"
                    :class="['tab-btn', { active: activeTab === 'events' }]"
                    @click="switchTab('events')"
                >
                    <i class="fas fa-calendar-alt"></i>
                    Events
                </button>
            </div>

            <div v-if="activeTab === 'pools'" class="tab-content">
                <h2>All Pools</h2>

                <div class="search-bar">
                    <input
                        type="text"
                        v-model="searchInput"
                        placeholder="Search pools by name..."
                        @input="debouncedSearch"
                    />
                </div>

                <div v-if="poolsLoading" class="loading">Loading pools...</div>
                <div v-else-if="poolsError" class="error">{{ poolsError }}</div>
                <div v-else-if="pools && pools.pools">
                    <table class="pools-table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Created By</th>
                            <th>Created</th>
                            <th>Type</th>
                            <th>Number Set</th>
                            <th>Grids</th>
                            <th>Members</th>
                            <th>Claimed</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="pool in pools.pools" :key="pool.token">
                            <td>
                                <router-link :to="`/pool/${pool.token}`">{{ pool.name }}</router-link>
                            </td>
                            <td>
                                <router-link :to="`/admin/user/${pool.ownerId}`">{{ formatOwner(pool) }}</router-link>
                            </td>
                            <td>{{ formatDate(pool.created) }}</td>
                            <td>{{ pool.gridType }}</td>
                            <td>{{ pool.numberSetConfig }}</td>
                            <td>{{ formatNumber(pool.gridCount) }}</td>
                            <td>{{ formatNumber(pool.memberCount) }}</td>
                            <td>{{ formatNumber(pool.claimedCount) }}</td>
                            <td>
                                <span :class="['status', pool.archived ? 'archived' : 'active']">
                                    {{ pool.archived ? 'Archived' : 'Active' }}
                                </span>
                            </td>
                            <td>
                                <button
                                    type="button"
                                    class="small"
                                    @click="confirmJoinPool(pool)"
                                    :disabled="joiningPool === pool.token"
                                >
                                    {{ joiningPool === pool.token ? 'Joining...' : 'Join' }}
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    <pagination
                        v-if="pools.total > poolsPerPage"
                        :total="pools.total"
                        :per-page="poolsPerPage"
                        :current-page="currentPage"
                        @page="goToPage"
                    />
                </div>
                <div v-else class="no-pools">No pools found.</div>
            </div>

            <div v-if="activeTab === 'users'" class="tab-content">
                <h2>All Users</h2>

                <div class="search-bar">
                    <input
                        type="text"
                        v-model="usersSearchInput"
                        placeholder="Search users by email..."
                        @input="debouncedUsersSearch"
                    />
                </div>

                <div v-if="usersLoading" class="loading">Loading users...</div>
                <div v-else-if="usersError" class="error">{{ usersError }}</div>
                <div v-else-if="users && users.users">
                    <table class="pools-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Type</th>
                            <th class="sortable" @click="sortUsers('poolsOwned')">
                                Pools Owned
                                <span class="sort-icon" v-if="usersSortColumn === 'poolsOwned'">
                                    {{ usersSortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th class="sortable" @click="sortUsers('poolsJoined')">
                                Pools Joined
                                <span class="sort-icon" v-if="usersSortColumn === 'poolsJoined'">
                                    {{ usersSortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th class="sortable" @click="sortUsers('created')">
                                Created
                                <span class="sort-icon" v-if="usersSortColumn === 'created'">
                                    {{ usersSortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th>Admin</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="user in users.users" :key="user.id">
                            <td>
                                <router-link :to="`/admin/user/${user.id}`">{{ user.id }}</router-link>
                            </td>
                            <td>
                                <router-link :to="`/admin/user/${user.id}`">{{ formatUserEmail(user) }}</router-link>
                            </td>
                            <td>{{ user.store === 'auth0' ? 'Registered' : 'Guest' }}</td>
                            <td>{{ formatNumber(user.poolsOwned) }}</td>
                            <td>{{ formatNumber(user.poolsJoined) }}</td>
                            <td>{{ formatDate(user.created) }}</td>
                            <td>
                                <span v-if="user.isAdmin" class="status active">Yes</span>
                                <span v-else class="status-muted">No</span>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    <pagination
                        v-if="users.total > usersPerPage"
                        :total="users.total"
                        :per-page="usersPerPage"
                        :current-page="currentPage"
                        @page="goToPage"
                    />
                </div>
                <div v-else class="no-pools">No users found.</div>
            </div>

            <div v-if="activeTab === 'events'" class="tab-content">
                <h2>Linked Events</h2>

                <div v-if="eventsLoading" class="loading">Loading events...</div>
                <div v-else-if="eventsError" class="error">{{ eventsError }}</div>
                <div v-else-if="events && events.events && events.events.length > 0">
                    <table class="pools-table events-table">
                        <thead>
                        <tr>
                            <th class="expand-col"></th>
                            <th class="sortable" @click="sortEvents('eventDate')">
                                Date
                                <span class="sort-icon" v-if="eventsSortColumn === 'eventDate'">
                                    {{ eventsSortDirection === 'asc' ? '&#9650;' : '&#9660;' }}
                                </span>
                            </th>
                            <th>League</th>
                            <th>Event</th>
                            <th>Score</th>
                            <th>Status</th>
                            <th class="sortable" @click="sortEvents('gridCount')">
                                Grids
                                <span class="sort-icon" v-if="eventsSortColumn === 'gridCount'">
                                    {{ eventsSortDirection === 'asc' ? '&#9650;' : '&#9660;' }}
                                </span>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <template v-for="event in events.events" :key="event.id">
                            <tr @click="toggleEventExpand(event)" class="clickable-row">
                                <td class="expand-col">
                                    <i :class="['fas', expandedEvents[event.id] ? 'fa-chevron-down' : 'fa-chevron-right']"></i>
                                </td>
                                <td>{{ formatDate(event.eventDate) }}</td>
                                <td>{{ event.league.toUpperCase() }}</td>
                                <td>{{ formatEventName(event) }}</td>
                                <td>{{ formatScore(event) }}</td>
                                <td>
                                    <span :class="['status', eventStatusClass(event.status)]">
                                        {{ formatEventStatus(event) }}
                                    </span>
                                </td>
                                <td>{{ formatNumber(event.gridCount) }}</td>
                            </tr>
                            <tr v-if="expandedEvents[event.id]" class="expanded-row">
                                <td :colspan="7">
                                    <div v-if="eventGridsLoading[event.id]" class="loading">Loading grids...</div>
                                    <div v-else-if="eventGrids[event.id] && eventGrids[event.id].grids && eventGrids[event.id].grids.length > 0">
                                        <table class="sub-table">
                                            <thead>
                                            <tr>
                                                <th>Grid</th>
                                                <th>Pool</th>
                                                <th>Created By</th>
                                                <th>Created</th>
                                                <th>State</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="grid in eventGrids[event.id].grids" :key="grid.gridId">
                                                <td>
                                                    <router-link :to="`/pool/${grid.poolToken}/game/${grid.gridId}`">
                                                        {{ grid.gridName || 'Grid #' + grid.gridId }}
                                                    </router-link>
                                                </td>
                                                <td>
                                                    <router-link :to="`/pool/${grid.poolToken}`">{{ grid.poolName }}</router-link>
                                                </td>
                                                <td>
                                                    <router-link v-if="grid.creatorId" :to="`/admin/user/${grid.creatorId}`">
                                                        {{ grid.creatorEmail || '-' }}
                                                    </router-link>
                                                    <span v-else>-</span>
                                                </td>
                                                <td>{{ formatDate(grid.created) }}</td>
                                                <td>{{ grid.gridState }}</td>
                                            </tr>
                                            </tbody>
                                        </table>

                                        <pagination
                                            v-if="eventGrids[event.id].total > eventGridsPerPage"
                                            :total="eventGrids[event.id].total"
                                            :per-page="eventGridsPerPage"
                                            :current-page="eventGridsPage[event.id] || 1"
                                            @page="(page) => goToEventGridsPage(event.id, page)"
                                        />
                                    </div>
                                    <div v-else class="no-pools">No grids found.</div>
                                </td>
                            </tr>
                        </template>
                        </tbody>
                    </table>

                    <pagination
                        v-if="events.total > eventsPerPage"
                        :total="events.total"
                        :per-page="eventsPerPage"
                        :current-page="currentPage"
                        @page="goToPage"
                    />
                </div>
                <div v-else class="no-pools">No events with linked grids found.</div>
            </div>
        </div>
    </section>
</template>

<script>
import sqmgrClient from "@/models/sqmgrClient"
import Pagination from "@/components/ui/Pagination"
import ModalController from "@/controllers/ModalController"
import ResponseError from "@/models/ResponseError"
import Common from "@/common"

export default {
    name: "Admin",
    components: {Pagination},
    data() {
        return {
            stats: null,
            statsLoading: true,
            statsError: null,
            selectedPeriod: 'all',
            periods: [
                {value: 'all', label: 'All Time'},
                {value: '1h', label: 'Last Hour'},
                {value: '24h', label: 'Last 24 Hours'},
                {value: 'week', label: 'Last Week'},
                {value: 'month', label: 'Last Month'},
                {value: 'year', label: 'Last Year'},
            ],

            pools: null,
            poolsLoading: true,
            poolsError: null,
            poolsPerPage: 25,

            joiningPool: null,

            users: null,
            usersLoading: false,
            usersError: null,
            usersPerPage: 25,
            usersFetched: false,

            events: null,
            eventsLoading: false,
            eventsError: null,
            eventsPerPage: 25,
            expandedEvents: {},
            eventGrids: {},
            eventGridsLoading: {},
            eventGridsPage: {},
            eventGridsPerPage: 25,

            // Local input state for responsive typing
            searchInput: '',
            usersSearchInput: '',
            searchTimeout: null,
            usersSearchTimeout: null,
        }
    },
    computed: {
        activeTab() {
            const tab = this.$route.query.tab
            if (tab === 'users') return 'users'
            if (tab === 'events') return 'events'
            return 'pools'
        },
        currentPage() {
            const page = parseInt(this.$route.query.page, 10)
            return (isNaN(page) || page < 1) ? 1 : page
        },
        searchQuery() {
            return this.$route.query.search || ''
        },
        usersSortColumn() {
            const col = this.$route.query.sort
            return ['poolsOwned', 'poolsJoined', 'created'].includes(col) ? col : 'created'
        },
        usersSortDirection() {
            return this.$route.query.dir === 'asc' ? 'asc' : 'desc'
        },
        eventsSortColumn() {
            const col = this.$route.query.sort
            return ['eventDate', 'gridCount'].includes(col) ? col : 'eventDate'
        },
        eventsSortDirection() {
            return this.$route.query.dir === 'asc' ? 'asc' : 'desc'
        },
    },
    async beforeMount() {
        this.fetchStats()
        // Sync local search inputs with URL on mount
        this.searchInput = this.searchQuery
        this.usersSearchInput = this.searchQuery
        // Initial data fetch based on URL state
        this.fetchDataForCurrentTab()
    },
    watch: {
        '$route.query': {
            handler(newQuery, oldQuery) {
                if (this.$route.path !== '/admin') return
                // Sync search inputs with URL
                this.searchInput = this.searchQuery
                this.usersSearchInput = this.searchQuery
                // Fetch data if query changed (not on initial load handled by beforeMount)
                if (oldQuery !== undefined) {
                    this.fetchDataForCurrentTab()
                }
            },
        },
    },
    methods: {
        updateUrl(params, replace = false) {
            const query = { ...this.$route.query }
            Object.entries(params).forEach(([key, value]) => {
                if (value === null || value === undefined || value === '' ||
                    (key === 'page' && value === 1) ||
                    (key === 'tab' && value === 'pools') ||
                    (key === 'sort' && value === 'created') ||
                    (key === 'dir' && value === 'desc')) {
                    delete query[key]
                } else {
                    query[key] = String(value)
                }
            })
            // Only update if query actually changed
            const currentQueryStr = JSON.stringify(this.$route.query)
            const newQueryStr = JSON.stringify(query)
            if (currentQueryStr !== newQueryStr) {
                this.$router[replace ? 'replace' : 'push']({ query }).catch(() => {})
            }
        },

        fetchDataForCurrentTab() {
            if (this.activeTab === 'pools') {
                this.fetchPools()
            } else if (this.activeTab === 'users') {
                this.fetchUsers()
            } else if (this.activeTab === 'events') {
                this.fetchEvents()
            }
        },

        switchTab(tab) {
            if (this.activeTab === tab) return
            this.updateUrl({ tab, page: null, search: null, sort: null, dir: null })
        },

        async fetchStats() {
            this.statsLoading = true
            this.statsError = null
            try {
                this.stats = await sqmgrClient.getAdminStats(this.selectedPeriod)
            } catch (err) {
                this.statsError = this.getErrorMessage(err)
            } finally {
                this.statsLoading = false
            }
        },

        selectPeriod(period) {
            if (this.selectedPeriod === period) return
            this.selectedPeriod = period
            this.fetchStats()
        },

        async fetchPools() {
            this.poolsLoading = true
            this.poolsError = null
            const offset = (this.currentPage - 1) * this.poolsPerPage
            try {
                this.pools = await sqmgrClient.getAdminPools(this.searchQuery, offset, this.poolsPerPage)
            } catch (err) {
                this.poolsError = this.getErrorMessage(err)
            } finally {
                this.poolsLoading = false
            }
        },

        debouncedSearch() {
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout)
            }
            this.searchTimeout = setTimeout(() => {
                this.updateUrl({ search: this.searchInput, page: 1 }, true)
            }, 300)
        },

        goToPage(page) {
            this.updateUrl({ page })
        },

        confirmJoinPool(pool) {
            ModalController.showPrompt(
                'Join Pool',
                `Are you sure you want to join the pool "${pool.name}"?`,
                {
                    actionButton: 'Join Pool',
                    action: () => {
                        this.joinPool(pool)
                        ModalController.hide()
                    },
                },
            )
        },

        async joinPool(pool) {
            this.joiningPool = pool.token
            try {
                await sqmgrClient.adminJoinPool(pool.token)
                this.$router.push(`/pool/${pool.token}`)
            } catch (err) {
                ModalController.showError(this.getErrorMessage(err))
            } finally {
                this.joiningPool = null
            }
        },

        async fetchUsers() {
            this.usersLoading = true
            this.usersError = null
            const offset = (this.currentPage - 1) * this.usersPerPage
            try {
                this.users = await sqmgrClient.getAdminUsers(
                    this.searchQuery,
                    offset,
                    this.usersPerPage,
                    this.usersSortColumn,
                    this.usersSortDirection
                )
                this.usersFetched = true
            } catch (err) {
                this.usersError = this.getErrorMessage(err)
            } finally {
                this.usersLoading = false
            }
        },

        sortUsers(column) {
            let newDir = 'desc'
            if (this.usersSortColumn === column) {
                newDir = this.usersSortDirection === 'asc' ? 'desc' : 'asc'
            }
            this.updateUrl({ sort: column, dir: newDir, page: 1 })
        },

        debouncedUsersSearch() {
            if (this.usersSearchTimeout) {
                clearTimeout(this.usersSearchTimeout)
            }
            this.usersSearchTimeout = setTimeout(() => {
                this.updateUrl({ search: this.usersSearchInput, page: 1 }, true)
            }, 300)
        },

        async fetchEvents() {
            this.eventsLoading = true
            this.eventsError = null
            const offset = (this.currentPage - 1) * this.eventsPerPage
            try {
                this.events = await sqmgrClient.getAdminEvents(
                    offset,
                    this.eventsPerPage,
                    this.eventsSortColumn,
                    this.eventsSortDirection
                )
            } catch (err) {
                this.eventsError = this.getErrorMessage(err)
            } finally {
                this.eventsLoading = false
            }
        },

        sortEvents(column) {
            let newDir = 'desc'
            if (this.eventsSortColumn === column) {
                newDir = this.eventsSortDirection === 'asc' ? 'desc' : 'asc'
            }
            this.updateUrl({ sort: column, dir: newDir, page: 1 })
        },

        async toggleEventExpand(event) {
            const id = event.id
            if (this.expandedEvents[id]) {
                this.expandedEvents = { ...this.expandedEvents, [id]: false }
                return
            }
            this.expandedEvents = { ...this.expandedEvents, [id]: true }
            if (!this.eventGrids[id]) {
                await this.fetchEventGrids(id, 1)
            }
        },

        async fetchEventGrids(eventId, page) {
            this.eventGridsLoading = { ...this.eventGridsLoading, [eventId]: true }
            const offset = (page - 1) * this.eventGridsPerPage
            try {
                const result = await sqmgrClient.getAdminEventGrids(eventId, offset, this.eventGridsPerPage)
                this.eventGrids = { ...this.eventGrids, [eventId]: result }
                this.eventGridsPage = { ...this.eventGridsPage, [eventId]: page }
            } catch (err) {
                ModalController.showError(this.getErrorMessage(err))
            } finally {
                this.eventGridsLoading = { ...this.eventGridsLoading, [eventId]: false }
            }
        },

        goToEventGridsPage(eventId, page) {
            this.fetchEventGrids(eventId, page)
        },

        formatEventName(event) {
            if (event.name) return event.name
            const away = event.awayTeam ? event.awayTeam.abbreviation : event.awayTeamId
            const home = event.homeTeam ? event.homeTeam.abbreviation : event.homeTeamId
            return `${away} @ ${home}`
        },

        formatScore(event) {
            if (event.homeScore == null || event.awayScore == null) return '-'
            const away = event.awayTeam ? event.awayTeam.abbreviation : 'AWAY'
            const home = event.homeTeam ? event.homeTeam.abbreviation : 'HOME'
            return `${away} ${event.awayScore} - ${home} ${event.homeScore}`
        },

        formatEventStatus(event) {
            if (event.statusDetail) return event.statusDetail
            switch (event.status) {
                case 'scheduled': return 'Scheduled'
                case 'in_progress': return 'In Progress'
                case 'final': return 'Final'
                default: return event.status
            }
        },

        eventStatusClass(status) {
            switch (status) {
                case 'final': return 'archived'
                case 'in_progress': return 'active'
                default: return ''
            }
        },

        formatDate(dateStr) {
            const date = new Date(dateStr)
            return date.toLocaleString(undefined, Common.DateTimeOptions)
        },

        formatOwner(pool) {
            if (pool.ownerEmail) {
                return pool.ownerEmail
            }
            if (pool.ownerStore === 'sqmgr') {
                return `Guest #${pool.ownerId}`
            }
            return `User #${pool.ownerId}`
        },

        formatUserEmail(user) {
            if (user.email) {
                return user.email
            }
            if (user.store === 'sqmgr') {
                return `Guest #${user.id}`
            }
            return `User #${user.id}`
        },

        formatNumber(num) {
            if (num === undefined || num === null) return '0'
            return num.toLocaleString()
        },

        getErrorMessage(err) {
            if (err instanceof ResponseError) {
                return err.message
            }
            return 'An unexpected error occurred. Please try again.'
        },
    },
}
</script>

<style scoped lang="scss">
@use '../../variables' as *;

.admin {
    padding: var(--spacing);
}

h1 {
    margin-bottom: var(--spacing);
}

h2 {
    margin-top:    $standard-spacing;
    margin-bottom: var(--spacing);
}

.tab-content {
    h2 {
        margin-top: var(--spacing);
    }
}

.status-muted {
    color: #999;
}

.stats-container {
    border-radius:  $radius-lg;
    padding:        $standard-spacing;
    display:        flex;
    flex-direction: column;
    gap:            $standard-spacing;
    align-items:    flex-start;
    box-shadow:     $shadow-card;
    margin-bottom:  $standard-spacing;

    .period-filter {
        margin-bottom: var(--spacing);
        background:    transparent;

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
            display:   flex;
            gap:       8px;
            flex-wrap: wrap;
        }

        .period-btn {
            background:    transparent;
            border:        1px solid #e0e0e0;
            border-radius: $radius-md;
            padding:       6px 14px;
            font-size:     0.9rem;
            color:         #666;
            cursor:        pointer;
            transition:    all 0.2s;
            font-family:   inherit;

            &:hover {
                background:   #f8f9fa;
                border-color: #d0d0d0;
                color:        #333;
            }

            &.active {
                background:   var(--primary);
                border-color: var(--primary);
                color:        white;
                font-weight:  500;
                box-shadow:   0 2px 4px rgba(0, 0, 0, 0.1);
            }
        }
    }
}

.stats {
    display:   flex;
    flex-wrap: wrap;
    gap:       var(--spacing);
}

.stat-card {
    background:     $surface-sunken;
    border:         1px solid $light-gray;
    border-radius:  $radius-lg;
    padding:        var(--spacing);
    min-width:      120px;
    text-align:     center;
    display:        flex;
    flex-direction: column;
    gap:            4px;
}

.stat-value {
    font-size:   2em;
    font-weight: bold;
    color:       var(--primary);
}

.stat-label {
    font-size: 0.9em;
    color:     var(--gray);
}

.search-bar {
    margin-bottom: var(--spacing);

    input {
        width:     100%;
        max-width: 400px;
    }
}

.pools-table {
    width:           100%;
    border-collapse: collapse;
    margin-bottom:   var(--spacing);

    th, td {
        padding:       12px;
        text-align:    left;
        border-bottom: 1px solid #e0e0e0;
    }

    th {
        background:  #f8f9fa;
        color:       $text-color;
        font-weight: 600;

        &.sortable {
            cursor:      pointer;
            user-select: none;

            &:hover {
                background: #eee;
            }

            .sort-icon {
                margin-left: 4px;
                font-size:   0.75em;
                color:       var(--primary);
            }
        }
    }

    tbody tr:hover {
        background: #f8f9fa;
    }

    a {
        color:           var(--primary);
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
}

.status {
    display:       inline-block;
    padding:       4px 8px;
    border-radius: $radius-sm;
    font-size:     0.85em;
    font-weight:   500;

    &.active {
        background: $alert-success-bg;
        color:      $alert-success-text;
    }

    &.archived {
        background: $alert-error-bg;
        color:      $alert-error-text;
    }
}

button.small {
    padding:   6px 12px;
    font-size: 0.9em;
}

.loading, .error, .no-pools {
    padding:    var(--spacing);
    text-align: center;
}

.error {
    @include alert-error;
}

.clickable-row {
    cursor: pointer;
}

.expand-col {
    width:     30px;
    min-width: 30px;
}

.expanded-row > td {
    background: #f8f9fa;
    padding:    0 12px 12px 12px;
}

.sub-table {
    width:           100%;
    border-collapse: collapse;
    margin-top:      8px;

    th, td {
        padding:       8px 12px;
        text-align:    left;
        border-bottom: 1px solid #e8e8e8;
        font-size:     0.9em;
    }

    th {
        background:  #f0f0f0;
        font-weight: 600;
    }

    a {
        color:           var(--primary);
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
}

@include tablet {
    .pools-table {
        display:    block;
        overflow-x: auto;
    }

    .stat-card {
        min-width: 100px;
    }
}
</style>