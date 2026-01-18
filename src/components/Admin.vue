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
                        <span class="stat-value">{{ stats.totalPools }}</span>
                        <span class="stat-label">Total Pools</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">{{ stats.activePools }}</span>
                        <span class="stat-label">Active Pools</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">{{ stats.archivedPools }}</span>
                        <span class="stat-label">Archived Pools</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">{{ stats.totalUsers }}</span>
                        <span class="stat-label">Users</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">{{ stats.guestUsers }}</span>
                        <span class="stat-label">Guest Users</span>
                    </div>
                </div>
                <div v-else-if="statsLoading" class="loading">Loading statistics...</div>
                <div v-else-if="statsError" class="error">{{ statsError }}</div>
            </div>

            <h2>All Pools</h2>

            <div class="search-bar">
                <input
                    type="text"
                    v-model="searchQuery"
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
                        <th>Created</th>
                        <th>Type</th>
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
                        <td>{{ formatDate(pool.created) }}</td>
                        <td>{{ pool.gridType }}</td>
                        <td>{{ pool.gridCount }}</td>
                        <td>{{ pool.memberCount }}</td>
                        <td>{{ pool.claimedCount }}</td>
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
    </section>
</template>

<script>
import sqmgrClient from "@/models/sqmgrClient"
import Pagination from "@/components/Pagination"
import ModalController from "@/controllers/ModalController"
import ResponseError from "@/models/ResponseError"

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

            searchQuery: '',
            searchTimeout: null,
            currentPage: 1,
            poolsPerPage: 25,

            joiningPool: null,
        }
    },
    async beforeMount() {
        this.fetchStats()
        this.fetchPools()
    },
    methods: {
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

        async fetchPools(offset = 0) {
            this.poolsLoading = true
            this.poolsError = null
            try {
                this.pools = await sqmgrClient.getAdminPools(this.searchQuery, offset, this.poolsPerPage)
                this.currentPage = Math.floor(offset / this.poolsPerPage) + 1
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
                this.currentPage = 1
                this.fetchPools(0)
            }, 300)
        },

        goToPage(page) {
            const offset = (page - 1) * this.poolsPerPage
            this.fetchPools(offset)
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

        formatDate(dateStr) {
            const date = new Date(dateStr)
            return date.toLocaleDateString()
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
@use '../variables' as *;

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

.stats-container {
    border-radius:  $standard-spacing;
    padding:        $standard-spacing;
    display:        inline-flex;
    flex-direction: column;
    gap:            $standard-spacing;
    align-items:    center;
    box-shadow:     0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom:  $standard-spacing;

    .period-filter {
        margin-bottom: var(--spacing);
        background:    #fff;

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
            border-radius: 6px;
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
    background:     #f8f9fa;
    border:         1px solid #e0e0e0;
    border-radius:  8px;
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
    border-radius: 4px;
    font-size:     0.85em;
    font-weight:   500;

    &.active {
        background: #d4edda;
        color:      #155724;
    }

    &.archived {
        background: #f8d7da;
        color:      #721c24;
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
    color:         #721c24;
    background:    #f8d7da;
    border-radius: 8px;
}

@media (max-width: 800px) {
    .pools-table {
        display:    block;
        overflow-x: auto;
    }

    .stat-card {
        min-width: 100px;
    }
}
</style>
