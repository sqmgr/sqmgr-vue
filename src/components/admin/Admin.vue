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

                    <div class="custom-range" v-if="selectedPeriod === 'custom'">
                        <div class="custom-range-inputs">
                            <label class="custom-range-field">
                                <span class="custom-range-label">Start</span>
                                <input
                                    type="date"
                                    v-model="customStart"
                                    :max="customEnd || undefined"
                                />
                            </label>
                            <label class="custom-range-field">
                                <span class="custom-range-label">End</span>
                                <input
                                    type="date"
                                    v-model="customEnd"
                                    :min="customStart || undefined"
                                />
                            </label>
                            <button
                                type="button"
                                class="apply-btn"
                                :disabled="!customStart || !customEnd"
                                @click="applyCustomRange"
                            >
                                Apply
                            </button>
                        </div>
                        <div v-if="customRangeError" class="error custom-range-error">{{ customRangeError }}</div>
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
                        <span class="stat-value">{{ formatNumber(stats.claimedSquares) }}</span>
                        <span class="stat-label">Claimed Squares</span>
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
                <div v-else-if="selectedPeriod === 'custom'" class="stats-placeholder">Select a date range and click Apply</div>
            </div>

            <div class="tabs">
                <button
                    v-for="tab in tabs"
                    :key="tab.value"
                    type="button"
                    :class="['tab-btn', { active: activeTab === tab.value }]"
                    @click="switchTab(tab.value)"
                >
                    <i :class="['fas', tab.icon]"></i>
                    {{ tab.label }}
                </button>
            </div>

            <div v-if="activeTab === 'pools'" class="tab-content">
                <h2>All Pools</h2>

                <div class="pools-filters">
                    <label class="filter-field">
                        <span class="filter-label">Name or Token</span>
                        <input
                            type="text"
                            v-model="searchInput"
                            placeholder="Search pools..."
                            @input="debouncedSearch"
                        />
                    </label>
                    <label class="filter-field">
                        <span class="filter-label">Owner Email</span>
                        <input
                            type="text"
                            v-model="ownerInput"
                            placeholder="Owner email contains..."
                            @input="debouncedOwnerSearch"
                        />
                    </label>
                    <label class="filter-field">
                        <span class="filter-label">Grid Type</span>
                        <select :value="poolsGridType" @change="setPoolsFilter('gridType', $event.target.value)">
                            <option value="">All Types</option>
                            <option v-for="type in gridTypes" :key="type" :value="type">{{ type }}</option>
                        </select>
                    </label>
                    <label class="filter-field">
                        <span class="filter-label">Status</span>
                        <select :value="poolsStatus" @change="setPoolsFilter('status', $event.target.value)">
                            <option value="">All</option>
                            <option value="active">Active</option>
                            <option value="archived">Archived</option>
                        </select>
                    </label>
                    <label class="filter-field">
                        <span class="filter-label">Created From</span>
                        <input
                            type="date"
                            :value="poolsStart"
                            :max="poolsEnd || undefined"
                            @change="setPoolsFilter('start', $event.target.value)"
                        />
                    </label>
                    <label class="filter-field">
                        <span class="filter-label">Created To</span>
                        <input
                            type="date"
                            :value="poolsEnd"
                            :min="poolsStart || undefined"
                            @change="setPoolsFilter('end', $event.target.value)"
                        />
                    </label>
                    <label class="filter-field">
                        <span class="filter-label">Min Fill %</span>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            :value="poolsMinFill"
                            placeholder="0"
                            @change="setPoolsFilter('minFill', $event.target.value)"
                        />
                    </label>
                    <label class="filter-field">
                        <span class="filter-label">Max Fill %</span>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            :value="poolsMaxFill"
                            placeholder="100"
                            @change="setPoolsFilter('maxFill', $event.target.value)"
                        />
                    </label>
                    <button
                        v-if="poolsFiltersActive"
                        type="button"
                        class="secondary sm"
                        @click="clearPoolsFilters"
                    >
                        Clear Filters
                    </button>
                </div>

                <div v-if="poolsLoading" class="loading">Loading pools...</div>
                <div v-else-if="poolsError" class="error">{{ poolsError }}</div>
                <div v-else-if="pools && pools.pools && pools.pools.length > 0">
                    <div class="table-wrap">
                        <table class="pools-table">
                            <thead>
                            <tr>
                                <th
                                    v-for="column in poolColumns"
                                    :key="column.key"
                                    :class="{ sortable: !!column.sort, numeric: column.numeric }"
                                    :aria-sort="column.sort ? ariaSort(poolsSortColumn === column.sort, poolsSortDirection) : undefined"
                                >
                                    <button v-if="column.sort" type="button" class="sort-btn" @click="sortPools(column.sort)">
                                        {{ column.label }}
                                        <span class="sort-icon" v-if="poolsSortColumn === column.sort">
                                            {{ poolsSortDirection === 'asc' ? '&#9650;' : '&#9660;' }}
                                        </span>
                                    </button>
                                    <template v-else>{{ column.label }}</template>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="pool in pools.pools" :key="pool.token">
                                <td>
                                    <router-link :to="`/admin/pool/${pool.token}`">{{ pool.name }}</router-link>
                                </td>
                                <td>
                                    <router-link :to="`/admin/user/${pool.ownerId}`">{{ formatOwner(pool) }}</router-link>
                                </td>
                                <td>{{ formatDate(pool.created) }}</td>
                                <td>{{ pool.gridType }}</td>
                                <td>{{ pool.numberSetConfig }}</td>
                                <td class="numeric">{{ formatNumber(pool.gridCount) }}</td>
                                <td class="numeric">{{ formatNumber(pool.memberCount) }}</td>
                                <td class="numeric">{{ formatNumber(pool.claimedSquares) }}/{{ formatNumber(pool.totalSquares) }}</td>
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
                    </div>

                    <pagination
                        v-if="pools.total > poolsPerPage"
                        :total="pools.total"
                        :per-page="poolsPerPage"
                        :current-page="currentPage"
                        @page="goToPage"
                    />
                </div>
                <div v-else class="no-pools">
                    {{ poolsFiltersActive ? 'No pools match the selected filters.' : 'No pools found.' }}
                </div>
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
                            <th class="sortable" :aria-sort="ariaSort(usersSortColumn === 'poolsOwned', usersSortDirection)">
                                <button type="button" class="sort-btn" @click="sortUsers('poolsOwned')">
                                    Pools Owned
                                    <span class="sort-icon" v-if="usersSortColumn === 'poolsOwned'">
                                        {{ usersSortDirection === 'asc' ? '&#9650;' : '&#9660;' }}
                                    </span>
                                </button>
                            </th>
                            <th class="sortable" :aria-sort="ariaSort(usersSortColumn === 'poolsJoined', usersSortDirection)">
                                <button type="button" class="sort-btn" @click="sortUsers('poolsJoined')">
                                    Pools Joined
                                    <span class="sort-icon" v-if="usersSortColumn === 'poolsJoined'">
                                        {{ usersSortDirection === 'asc' ? '&#9650;' : '&#9660;' }}
                                    </span>
                                </button>
                            </th>
                            <th class="sortable" :aria-sort="ariaSort(usersSortColumn === 'created', usersSortDirection)">
                                <button type="button" class="sort-btn" @click="sortUsers('created')">
                                    Created
                                    <span class="sort-icon" v-if="usersSortColumn === 'created'">
                                        {{ usersSortDirection === 'asc' ? '&#9650;' : '&#9660;' }}
                                    </span>
                                </button>
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
                            <td>{{ formatStoreLabel(user.store) }}</td>
                            <td>{{ formatNumber(user.poolsOwned) }}</td>
                            <td>{{ formatNumber(user.poolsJoined) }}</td>
                            <td>{{ formatDate(user.created) }}</td>
                            <td>
                                <span v-if="user.isSiteAdmin" class="status active">Yes</span>
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

                <div class="events-filters">
                    <label class="filter-field">
                        <span class="filter-label">League</span>
                        <select :value="eventsLeague" @change="setEventsFilter('league', $event.target.value)">
                            <option value="">All Leagues</option>
                            <option v-for="league in eventLeagues" :key="league.value" :value="league.value">
                                {{ league.label }}
                            </option>
                        </select>
                    </label>
                    <label class="filter-field">
                        <span class="filter-label">Status</span>
                        <select :value="eventsStatus" @change="setEventsFilter('status', $event.target.value)">
                            <option value="">All Statuses</option>
                            <option v-for="status in eventStatuses" :key="status.value" :value="status.value">
                                {{ status.label }}
                            </option>
                        </select>
                    </label>
                    <label class="filter-field">
                        <span class="filter-label">From</span>
                        <input
                            type="date"
                            :value="eventsStart"
                            :max="eventsEnd || undefined"
                            @change="setEventsFilter('start', $event.target.value)"
                        />
                    </label>
                    <label class="filter-field">
                        <span class="filter-label">To</span>
                        <input
                            type="date"
                            :value="eventsEnd"
                            :min="eventsStart || undefined"
                            @change="setEventsFilter('end', $event.target.value)"
                        />
                    </label>
                    <button
                        v-if="eventsFiltersActive"
                        type="button"
                        class="secondary sm"
                        @click="clearEventsFilters"
                    >
                        Clear Filters
                    </button>
                </div>

                <div v-if="eventsLoading" class="loading">Loading events...</div>
                <div v-else-if="eventsError" class="error">{{ eventsError }}</div>
                <div v-else-if="events && events.events && events.events.length > 0">
                    <table class="pools-table events-table">
                        <thead>
                        <tr>
                            <th class="expand-col"></th>
<th class="sortable" :aria-sort="ariaSort(eventsSortColumn === 'eventDate', eventsSortDirection)">
                                <button type="button" class="sort-btn" @click="sortEvents('eventDate')">
                                    Date
                                    <span class="sort-icon" v-if="eventsSortColumn === 'eventDate'">
                                        {{ eventsSortDirection === 'asc' ? '&#9650;' : '&#9660;' }}
                                    </span>
                                </button>
                            </th>
                            <th>League</th>
                            <th>Event</th>
                            <th>Score</th>
                            <th>Status</th>
<th class="sortable" :aria-sort="ariaSort(eventsSortColumn === 'gridCount', eventsSortDirection)">
                                <button type="button" class="sort-btn" @click="sortEvents('gridCount')">
                                    Grids
                                    <span class="sort-icon" v-if="eventsSortColumn === 'gridCount'">
                                        {{ eventsSortDirection === 'asc' ? '&#9650;' : '&#9660;' }}
                                    </span>
                                </button>
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
                                    <span v-if="event.manualOverride" class="status warning" title="Scores are manually overridden">
                                        Override
                                    </span>
                                </td>
                                <td>{{ formatNumber(event.gridCount) }}</td>
                            </tr>
                            <tr v-if="expandedEvents[event.id]" class="expanded-row">
                                <td :colspan="7">
                                    <div class="event-details">
                                        <div class="event-meta">
                                            <span><strong>Last synced:</strong> {{ formatDate(event.lastSynced) }}</span>
                                            <span v-if="event.manualOverride" class="status warning">Manual override active</span>
                                        </div>
                                        <div class="event-actions">
                                            <button
                                                type="button"
                                                class="secondary sm"
                                                :disabled="eventActionBusy[event.id]"
                                                @click="refreshEvent(event)"
                                            >
                                                <i class="fas fa-sync"></i>
                                                {{ eventActionBusy[event.id] === 'refresh' ? 'Refreshing...' : 'Refresh from ESPN' }}
                                            </button>
                                            <button
                                                type="button"
                                                class="secondary sm"
                                                :disabled="eventActionBusy[event.id]"
                                                @click="openOverride(event)"
                                            >
                                                <i class="fas fa-edit"></i>
                                                Override score
                                            </button>
                                            <button
                                                v-if="event.manualOverride"
                                                type="button"
                                                class="destructive sm"
                                                :disabled="eventActionBusy[event.id]"
                                                @click="confirmClearOverride(event)"
                                            >
                                                <i class="fas fa-undo"></i>
                                                {{ eventActionBusy[event.id] === 'clear' ? 'Clearing...' : 'Clear override' }}
                                            </button>
                                        </div>
                                        <div v-if="eventActionError[event.id]" class="error inline-message">{{ eventActionError[event.id] }}</div>
                                        <div v-if="eventActionNote[event.id]" class="success-note inline-message">{{ eventActionNote[event.id] }}</div>
                                    </div>

                                    <div v-if="eventGridsLoading[event.id]" class="loading">Loading grids...</div>
                                    <div v-else-if="eventGrids[event.id] && eventGrids[event.id].grids && eventGrids[event.id].grids.length > 0">
                                        <table class="sub-table">
                                            <thead>
                                            <tr>
                                                <th>Grid</th>
                                                <th>Pool</th>
                                                <th>Created By</th>
                                                <th>Squares</th>
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
                                                    <router-link :to="`/admin/pool/${grid.poolToken}`">{{ grid.poolName }}</router-link>
                                                </td>
                                                <td>
                                                    <router-link v-if="grid.creatorId" :to="`/admin/user/${grid.creatorId}`">
                                                        {{ grid.creatorEmail || '-' }}
                                                    </router-link>
                                                    <span v-else>-</span>
                                                </td>
                                                <td>{{ formatNumber(grid.claimedSquares) }}/{{ formatNumber(grid.totalSquares) }}</td>
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
                <div v-else class="no-pools">
                    {{ eventsFiltersActive ? 'No events match the selected filters.' : 'No events with linked grids found.' }}
                </div>
            </div>

            <admin-analytics v-if="activeTab === 'analytics'" class="tab-content"/>
            <admin-sports v-if="activeTab === 'sports'" class="tab-content"/>
            <admin-audit v-if="activeTab === 'audit'" class="tab-content"/>
        </div>
    </section>
</template>

<script>
import sqmgrClient from "@/models/sqmgrClient"
import Pagination from "@/components/ui/Pagination"
import ModalController from "@/controllers/ModalController"
import AdminAnalytics from "@/components/admin/AdminAnalytics"
import AdminSports from "@/components/admin/AdminSports"
import AdminAudit from "@/components/admin/AdminAudit"
import EventOverrideForm from "@/components/admin/EventOverrideForm"
import { formatDate, formatNumber, formatUserLabel, formatStoreLabel, formatEventStatus, eventStatusClass, getErrorMessage, isISODate } from "@/utils/adminFormat"
import adminJoinPoolMixin from "@/components/admin/adminJoinPoolMixin"
import { pushQuery, pageFromQuery } from "@/utils/routeQuery"
import { debounce } from "@/utils/debounce"
import { LEAGUES, GRID_TYPES } from "@/constants/admin"

const TABS = ['pools', 'users', 'events', 'analytics', 'sports', 'audit']
const POOL_SORTS = ['created', 'name', 'member_count', 'grid_count', 'total_squares', 'claimed_squares', 'fill_percent']

// fields copied from the event JSON returned by refresh/override into the list row
const EVENT_UPDATE_FIELDS = [
    'status', 'statusDetail', 'homeScore', 'awayScore',
    'homeQ1', 'homeQ2', 'homeQ3', 'homeQ4', 'homeOT',
    'awayQ1', 'awayQ2', 'awayQ3', 'awayQ4', 'awayOT',
    'lastSynced', 'manualOverride',
]

// query keys whose default value is left out of the URL
function isDefaultQueryValue(key, value) {
    return (key === 'page' && value === 1) ||
        (key === 'tab' && value === 'pools') ||
        (key === 'sort' && value === 'created') ||
        (key === 'dir' && value === 'desc')
}

// a valid YYYY-MM-DD query value, or '' when missing or malformed
function dateParam(value) {
    return isISODate(value) ? value : ''
}

export default {
    name: "Admin",
    mixins: [adminJoinPoolMixin],
    components: {Pagination, AdminAnalytics, AdminSports, AdminAudit},
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
                {value: 'custom', label: 'Custom'},
            ],
            customStart: '',
            customEnd: '',
            customRangeError: null,

            tabs: [
                {value: 'pools', label: 'Pools', icon: 'fa-th-large'},
                {value: 'users', label: 'Users', icon: 'fa-users'},
                {value: 'events', label: 'Events', icon: 'fa-calendar-alt'},
                {value: 'analytics', label: 'Analytics', icon: 'fa-chart-line'},
                {value: 'sports', label: 'Sports', icon: 'fa-football-ball'},
                {value: 'audit', label: 'Audit Log', icon: 'fa-clipboard-list'},
            ],

            pools: null,
            poolsLoading: true,
            poolsError: null,
            poolsPerPage: 25,
            gridTypes: GRID_TYPES,
            poolColumns: [
                {key: 'name', label: 'Name', sort: 'name'},
                {key: 'owner', label: 'Created By'},
                {key: 'created', label: 'Created', sort: 'created'},
                {key: 'type', label: 'Type'},
                {key: 'numberSet', label: 'Number Set'},
                {key: 'grids', label: 'Grids', sort: 'grid_count', numeric: true},
                {key: 'members', label: 'Members', sort: 'member_count', numeric: true},
                {key: 'fill', label: 'Fill', sort: 'fill_percent', numeric: true},
                {key: 'status', label: 'Status'},
                {key: 'actions', label: 'Actions'},
            ],

            users: null,
            usersLoading: false,
            usersError: null,
            usersPerPage: 25,

            events: null,
            eventsLoading: false,
            eventsError: null,
            eventsPerPage: 25,
            expandedEvents: {},
            eventGrids: {},
            eventGridsLoading: {},
            eventGridsPage: {},
            eventGridsPerPage: 25,
            eventActionBusy: {},
            eventActionError: {},
            eventActionNote: {},
            eventLeagues: LEAGUES,
            eventStatuses: [
                {value: 'scheduled', label: 'Scheduled'},
                {value: 'in_progress', label: 'In Progress'},
                {value: 'final', label: 'Final'},
            ],

            // Local input state for responsive typing
            searchInput: '',
            ownerInput: '',
            usersSearchInput: '',
        }
    },
    computed: {
        activeTab() {
            const tab = this.$route.query.tab
            return TABS.includes(tab) ? tab : 'pools'
        },
        currentPage() {
            return pageFromQuery(this.$route.query)
        },
        searchQuery() {
            return this.$route.query.search || ''
        },
        poolsOwner() {
            return this.$route.query.owner || ''
        },
        poolsGridType() {
            const type = this.$route.query.gridType
            return GRID_TYPES.includes(type) ? type : ''
        },
        poolsStatus() {
            const status = this.$route.query.status
            return ['active', 'archived'].includes(status) ? status : ''
        },
        poolsStart() {
            return dateParam(this.$route.query.start)
        },
        poolsEnd() {
            return dateParam(this.$route.query.end)
        },
        poolsMinFill() {
            return this.fillPercentOrEmpty(this.$route.query.minFill)
        },
        poolsMaxFill() {
            return this.fillPercentOrEmpty(this.$route.query.maxFill)
        },
        poolsSortColumn() {
            const col = this.$route.query.sort
            return POOL_SORTS.includes(col) ? col : 'created'
        },
        poolsSortDirection() {
            return this.$route.query.dir === 'asc' ? 'asc' : 'desc'
        },
        poolsFiltersActive() {
            return !!(this.searchQuery || this.poolsOwner || this.poolsGridType || this.poolsStatus ||
                this.poolsStart || this.poolsEnd || this.poolsMinFill !== '' || this.poolsMaxFill !== '')
        },
        poolsFilterError() {
            if (this.poolsStart && this.poolsEnd && this.poolsStart > this.poolsEnd) {
                return 'The Created From date must be on or before the Created To date.'
            }
            if (this.poolsMinFill !== '' && this.poolsMaxFill !== '' && this.poolsMinFill > this.poolsMaxFill) {
                return 'Min fill % must be less than or equal to max fill %.'
            }
            return null
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
        eventsLeague() {
            const league = this.$route.query.league
            return this.eventLeagues.some(l => l.value === league) ? league : ''
        },
        eventsStatus() {
            const status = this.$route.query.status
            return this.eventStatuses.some(s => s.value === status) ? status : ''
        },
        eventsStart() {
            return dateParam(this.$route.query.start)
        },
        eventsEnd() {
            return dateParam(this.$route.query.end)
        },
        eventsFiltersActive() {
            return !!(this.eventsLeague || this.eventsStatus || this.eventsStart || this.eventsEnd)
        },
        eventsDateRangeError() {
            // ISO dates compare correctly as strings
            if (this.eventsStart && this.eventsEnd && this.eventsStart > this.eventsEnd) {
                return 'The From date must be on or before the To date.'
            }
            return null
        },
    },
    created() {
        // Debounced URL pushes live outside data() so they are not reactive;
        // they are cancelled on unmount so a pending push cannot hit the next route.
        this.pushSearch = debounce(() => this.updateUrl({ search: this.searchInput.trim(), page: 1 }, true))
        this.pushOwner = debounce(() => this.updateUrl({ owner: this.ownerInput.trim(), page: 1 }, true))
        this.pushUsersSearch = debounce(() => this.updateUrl({ search: this.usersSearchInput.trim(), page: 1 }, true))
    },
    beforeUnmount() {
        this.pushSearch.cancel()
        this.pushOwner.cancel()
        this.pushUsersSearch.cancel()
    },
    async beforeMount() {
        this.fetchStats()
        // Sync local search inputs with URL on mount
        this.syncInputsFromUrl()
        // Initial data fetch based on URL state
        this.fetchDataForCurrentTab()
    },
    watch: {
        '$route.query': {
            handler(newQuery, oldQuery) {
                if (this.$route.path !== '/admin') return
                // Sync search inputs with URL
                this.syncInputsFromUrl()
                // Fetch data if query changed (not on initial load handled by beforeMount)
                if (oldQuery !== undefined) {
                    this.fetchDataForCurrentTab()
                }
            },
        },
    },
    methods: {

        syncInputsFromUrl() {
            this.searchInput = this.searchQuery
            this.ownerInput = this.poolsOwner
            this.usersSearchInput = this.searchQuery
        },

        updateUrl(params, replace = false) {
            pushQuery(this.$router, this.$route, params, isDefaultQueryValue, replace)
        },

        // value for th[aria-sort]
        ariaSort(active, direction) {
            if (!active) return 'none'
            return direction === 'asc' ? 'ascending' : 'descending'
        },

        fetchDataForCurrentTab() {
            // The analytics, sports and audit tabs manage their own data.
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
            // Every tab keeps its own state in the query, so start the new tab clean.
            const query = tab === 'pools' ? {} : { tab }
            this.$router.push({ query }).catch(() => {})
        },

        async fetchStats() {
            if (this.selectedPeriod === 'custom') {
                // Don't fire a request until both dates are present and valid.
                if (!this.customStart || !this.customEnd || !this.validateCustomRange()) return
            }

            this.statsLoading = true
            this.statsError = null
            try {
                this.stats = await sqmgrClient.getAdminStats(this.selectedPeriod, {
                    start: this.customStart,
                    end: this.customEnd,
                })
            } catch (err) {
                this.statsError = this.getErrorMessage(err)
            } finally {
                this.statsLoading = false
            }
        },

        selectPeriod(period) {
            if (this.selectedPeriod === period) return
            this.selectedPeriod = period
            this.customRangeError = null
            if (period === 'custom') {
                // Wait for the user to pick both dates and click Apply.
                this.stats = null
                return
            }
            this.fetchStats()
        },

        validateCustomRange() {
            if (this.customStart && this.customEnd && this.customStart > this.customEnd) {
                this.customRangeError = 'Start date must be on or before the end date.'
                return false
            }
            this.customRangeError = null
            return true
        },

        applyCustomRange() {
            if (!this.customStart || !this.customEnd) return
            if (!this.validateCustomRange()) return
            this.fetchStats()
        },

        async fetchPools() {
            if (this.poolsFilterError) {
                // The API would reject these filters, so surface the problem
                // inline and wait for the user to fix it.
                this.pools = null
                this.poolsError = this.poolsFilterError
                this.poolsLoading = false
                return
            }

            this.poolsLoading = true
            this.poolsError = null
            const offset = (this.currentPage - 1) * this.poolsPerPage
            let archived = ''
            if (this.poolsStatus === 'archived') archived = 'true'
            if (this.poolsStatus === 'active') archived = 'false'
            try {
                this.pools = await sqmgrClient.getAdminPools({
                    search: this.searchQuery,
                    ownerEmail: this.poolsOwner,
                    gridType: this.poolsGridType,
                    archived,
                    start: this.poolsStart,
                    end: this.poolsEnd,
                    minFill: this.poolsMinFill,
                    maxFill: this.poolsMaxFill,
                    sortBy: this.poolsSortColumn,
                    sortDir: this.poolsSortDirection,
                }, offset, this.poolsPerPage)
            } catch (err) {
                this.poolsError = this.getErrorMessage(err)
            } finally {
                this.poolsLoading = false
            }
        },

        debouncedSearch() {
            this.pushSearch()
        },

        debouncedOwnerSearch() {
            this.pushOwner()
        },

        setPoolsFilter(key, value) {
            this.updateUrl({ [key]: value, page: 1 })
        },

        clearPoolsFilters() {
            this.updateUrl({
                search: null, owner: null, gridType: null, status: null,
                start: null, end: null, minFill: null, maxFill: null, page: 1,
            })
        },

        sortPools(column) {
            let newDir = 'desc'
            if (this.poolsSortColumn === column) {
                newDir = this.poolsSortDirection === 'asc' ? 'desc' : 'asc'
            } else if (column === 'name') {
                newDir = 'asc'
            }
            this.updateUrl({ sort: column, dir: newDir, page: 1 })
        },

        fillPercentOrEmpty(value) {
            if (value === undefined || value === null || value === '') return ''
            const num = parseInt(value, 10)
            if (isNaN(num) || num < 0 || num > 100) return ''
            return num
        },

        goToPage(page) {
            this.updateUrl({ page })
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
            this.pushUsersSearch()
        },

        async fetchEvents() {
            if (this.eventsDateRangeError) {
                // The API would reject this range, so surface the problem
                // inline and wait for the user to fix it.
                this.events = null
                this.eventsError = this.eventsDateRangeError
                this.eventsLoading = false
                return
            }

            this.eventsLoading = true
            this.eventsError = null
            const offset = (this.currentPage - 1) * this.eventsPerPage
            try {
                this.events = await sqmgrClient.getAdminEvents(
                    offset,
                    this.eventsPerPage,
                    this.eventsSortColumn,
                    this.eventsSortDirection,
                    {
                        league: this.eventsLeague,
                        status: this.eventsStatus,
                        start: this.eventsStart,
                        end: this.eventsEnd,
                    }
                )
            } catch (err) {
                this.eventsError = this.getErrorMessage(err)
            } finally {
                this.eventsLoading = false
            }
        },

        setEventsFilter(key, value) {
            this.updateUrl({ [key]: value, page: 1 })
        },

        clearEventsFilters() {
            this.updateUrl({ league: null, status: null, start: null, end: null, page: 1 })
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

        // applyEventUpdate copies the fields from a refreshed/overridden event
        // into the list row so the table updates in place.
        applyEventUpdate(event, updated, overrides = {}) {
            if (updated && typeof updated === 'object') {
                EVENT_UPDATE_FIELDS.forEach(key => {
                    if (updated[key] !== undefined) {
                        event[key] = updated[key]
                    }
                })
            }
            Object.assign(event, overrides)
        },

        setEventAction(event, busy, error = null, note = null) {
            this.eventActionBusy = { ...this.eventActionBusy, [event.id]: busy }
            this.eventActionError = { ...this.eventActionError, [event.id]: error }
            this.eventActionNote = { ...this.eventActionNote, [event.id]: note }
        },

        async refreshEvent(event) {
            this.setEventAction(event, 'refresh')
            try {
                const updated = await sqmgrClient.adminRefreshEvent(event.id)
                this.applyEventUpdate(event, updated)
                this.setEventAction(event, null, null, 'Event refreshed from ESPN.')
            } catch (err) {
                // a 409 means the event is overridden; the API explains why
                this.setEventAction(event, null, this.getErrorMessage(err))
            }
        },

        openOverride(event) {
            ModalController.show('Override Score', EventOverrideForm, {
                event: { ...event },
            }, {
                'saved': updated => {
                    ModalController.hide()
                    this.applyEventUpdate(event, updated, { manualOverride: true })
                    this.setEventAction(event, null, null, 'Score override saved. The sync job will leave this event alone until the override is cleared.')
                },
            })
        },

        confirmClearOverride(event) {
            ModalController.showPrompt(
                'Clear Override',
                `Clear the manual override for "${this.formatEventName(event)}"? The next sync run will overwrite the event with ESPN data again.`,
                {
                    actionButton: 'Clear Override',
                    isDestructive: true,
                    action: () => {
                        ModalController.hide()
                        this.clearOverride(event)
                    },
                },
            )
        },

        async clearOverride(event) {
            this.setEventAction(event, 'clear')
            try {
                await sqmgrClient.adminClearEventOverride(event.id)
                this.applyEventUpdate(event, null, { manualOverride: false })
                this.setEventAction(event, null, null, 'Manual override cleared.')
            } catch (err) {
                this.setEventAction(event, null, this.getErrorMessage(err))
            }
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
            return formatEventStatus(event.status, event.statusDetail)
        },

        eventStatusClass,
        formatDate,
        formatNumber,
        formatStoreLabel,
        getErrorMessage,

        formatOwner(pool) {
            return formatUserLabel(pool.ownerId, pool.ownerEmail, pool.ownerStore)
        },

        formatUserEmail(user) {
            return formatUserLabel(user.id, user.email, user.store)
        },
    },
}
</script>

<style scoped lang="scss">
@use '../../variables' as *;
@use './admin' as *;

.admin {
    padding: var(--spacing);
    @include admin-messages;
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

.tabs {
    flex-wrap: wrap;
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
            @include admin-period-buttons;
        }

        .custom-range {
            margin-top: $space-3;
        }

        .custom-range-inputs {
            display:     flex;
            align-items: flex-end;
            gap:         $space-3;
            flex-wrap:   wrap;
        }

        .custom-range-field {
            display:        flex;
            flex-direction: column;
            gap:            $minimal-spacing;

            .custom-range-label {
                font-weight:    600;
                color:          var(--gray);
                font-size:      0.8rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            input[type="date"] {
                border:        1px solid #e0e0e0;
                border-radius: $radius-md;
                padding:       5px 10px;
                font-size:     0.9rem;
                font-family:   inherit;
                color:         $text-color;
                background:    white;

                &:focus {
                    outline:      none;
                    border-color: var(--primary);
                }
            }
        }

        .apply-btn {
            &:disabled {
                opacity:        0.5;
                cursor:         not-allowed;
            }
        }

        .custom-range-error {
            margin-top: $space-2;
            font-size:  0.85rem;
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

.pools-filters,
.events-filters {
    @include admin-filter-bar;
}

.table-wrap {
    overflow-x: auto;
}

.pools-table {
    @include admin-table;
}

.status {
    @include admin-status;
}

button.small {
    @include admin-small-button;
}

.stats-placeholder {
    padding:    var(--spacing);
    text-align: center;
    color:      var(--gray);
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

.event-details {
    display:        flex;
    flex-direction: column;
    gap:            $space-2;
    padding:        $space-3 0;
    border-bottom:  1px solid #e8e8e8;

    .event-meta {
        display:     flex;
        align-items: center;
        gap:         $space-3;
        flex-wrap:   wrap;
        font-size:   0.9em;
        color:       $text-secondary;
    }

    .event-actions {
        display:   flex;
        gap:       $space-2;
        flex-wrap: wrap;
    }

    .inline-message {
        padding:   $space-2 $space-3;
        margin:    0;
        font-size: 0.9em;
        text-align: left;
    }
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
