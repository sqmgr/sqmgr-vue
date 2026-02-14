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
    <section class="admin-user">
        <div class="admin-user-container col-3">
            <router-link to="/admin" class="back-link">&larr; Back to Admin Dashboard</router-link>

            <div v-if="loading" class="loading">Loading user details...</div>
            <div v-else-if="error" class="error">{{ error }}</div>
            <template v-else-if="userData">
                <!-- Profile Header -->
                <div class="profile-header">
                    <div class="avatar">{{ initials }}</div>
                    <div class="profile-info">
                        <div class="email">{{ displayName }}</div>
                        <div class="meta">
                            <span class="member-since">Member since {{ memberSince }}</span>
                            <span class="separator">|</span>
                            <span class="auth-badge">{{ authProvider }} Account</span>
                            <span class="separator">|</span>
                            <span class="user-id">User ID: {{ userData.user.id }}</span>
                        </div>
                        <div v-if="userData.user.isAdmin" class="admin-badge">Site Admin</div>
                    </div>
                </div>

                <!-- Stats Dashboard -->
                <div class="stats-dashboard">
                    <div class="stat-card">
                        <span class="stat-value">{{ userData.stats?.poolsCreated ?? '-' }}</span>
                        <span class="stat-label">Pools Created</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">{{ userData.stats?.poolsJoined ?? '-' }}</span>
                        <span class="stat-label">Pools Joined</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">{{ userData.stats?.activePools ?? '-' }}</span>
                        <span class="stat-label">Active Pools</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">{{ userData.stats?.archivedPools ?? '-' }}</span>
                        <span class="stat-label">Archived</span>
                    </div>
                </div>

                <!-- Pools Section -->
                <div class="pools-section">
                    <div class="pools-header">
                        <h2>Pools Created</h2>
                        <label class="archive-toggle">
                            <input type="checkbox" v-model="showArchived"/>
                            include archived
                        </label>
                    </div>

                    <div v-if="poolsLoading" class="loading">Loading pools...</div>
                    <div v-else-if="poolsError" class="error">{{ poolsError }}</div>
                    <div v-else-if="pools && pools.pools && pools.pools.length > 0">
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
                    <div v-else class="no-pools">No pools created by this user.</div>
                </div>
            </template>
        </div>
    </section>
</template>

<script>
import { ref, computed, watch } from 'vue'
import sqmgrClient from "@/models/sqmgrClient"
import Pagination from "@/components/ui/Pagination"
import ModalController from "@/controllers/ModalController"
import ResponseError from "@/models/ResponseError"
import Common from "@/common"
import { useUserProfile } from "@/composables/useUserProfile"
import { usePaginatedFetch } from "@/composables/usePaginatedFetch"

export default {
    name: "AdminUser",
    components: {Pagination},
    props: {
        userId: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const userData = ref(null)
        const userRef = computed(() => userData.value?.user)
        const { displayName, initials, memberSince, authProvider } = useUserProfile(userRef)

        const showArchived = ref(false)
        const poolsPerPage = 25
        const { data: pools, loading: poolsLoading, error: poolsError, currentPage, fetch: fetchPools, goToPage } = usePaginatedFetch(
            (offset, perPage) => sqmgrClient.getAdminUserPools(props.userId, showArchived.value, offset, perPage),
            poolsPerPage,
        )

        watch(showArchived, () => {
            fetchPools()
        })

        return {
            userData, displayName, initials, memberSince, authProvider,
            showArchived, pools, poolsLoading, poolsError, currentPage, poolsPerPage,
            fetchPools, goToPage,
        }
    },
    data() {
        return {
            loading: true,
            error: null,
            joiningPool: null,
        }
    },
    async beforeMount() {
        await this.fetchUser()
        this.fetchPools()
    },
    methods: {
        async fetchUser() {
            this.loading = true
            this.error = null
            try {
                this.userData = await sqmgrClient.getAdminUser(this.userId)
            } catch (err) {
                if (err instanceof ResponseError && err.status === 404) {
                    this.error = 'User not found.'
                } else {
                    this.error = this.getErrorMessage(err)
                }
            } finally {
                this.loading = false
            }
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
            return date.toLocaleString(undefined, Common.DateTimeOptions)
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

.admin-user {
    padding: $standard-spacing;
}

.admin-user-container {
    max-width: 1200px;
    margin: 0 auto;
}

.back-link {
    display: inline-block;
    margin-bottom: $space-4;
    color: var(--primary);
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
}

// Profile Header
.profile-header {
    @include profile-header-card;
}

.avatar {
    @include avatar;
}

.profile-info {
    flex: 1;

    .email {
        font-size: 1.25rem;
        font-weight: 600;
        color: $text-color;
        margin-bottom: $space-1;
    }

    .meta {
        font-size: 0.9rem;
        color: $text-secondary;
        margin-bottom: $space-2;

        .separator {
            margin: 0 $space-2;
        }

        .auth-badge {
            background: $primary-100;
            color: $primary-dark;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
        }

        .user-id {
            font-family: monospace;
        }
    }

    .admin-badge {
        display: inline-block;
        background: $alert-error-bg;
        color: $alert-error-text;
        padding: 4px 12px;
        border-radius: 4px;
        font-size: 0.85rem;
        font-weight: 500;
    }
}

// Stats Dashboard
.stats-dashboard {
    @include stats-dashboard;
}

.stat-card {
    @include stat-card;

    .stat-value {
        font-size: 2rem;
        font-weight: 700;
        color: $primary;
    }

    .stat-label {
        font-size: 0.85rem;
        color: $text-secondary;
    }
}

// Pools Section
.pools-section {
    background: $surface-elevated;
    border-radius: $radius-xl;
    padding: $space-5;
    box-shadow: $shadow-card;
}

.pools-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-4;

    h2 {
        font-size: 1.25rem;
        color: $text-color;
        margin: 0;
    }

    .archive-toggle {
        font-size: 0.85rem;
        color: $text-secondary;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: $space-1;

        input {
            width: auto;
            margin: 0;
        }
    }
}

.pools-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: var(--spacing);

    th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #e0e0e0;
    }

    th {
        background: #f8f9fa;
        color: $text-color;
        font-weight: 600;
    }

    tbody tr:hover {
        background: #f8f9fa;
    }

    a {
        color: var(--primary);
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
}

.status {
    display: inline-block;
    padding: 4px 8px;
    border-radius: $radius-sm;
    font-size: 0.85em;
    font-weight: 500;

    &.active {
        background: $alert-success-bg;
        color: $alert-success-text;
    }

    &.archived {
        background: $alert-error-bg;
        color: $alert-error-text;
    }
}

button.small {
    padding: 6px 12px;
    font-size: 0.9em;
}

.loading, .error, .no-pools {
    padding: var(--spacing);
    text-align: center;
}

.error {
    @include alert-error;
}

// Responsive
@include tablet {
    .profile-header {
        flex-direction: column;
        text-align: center;
    }

    .profile-info .meta {
        .separator {
            display: none;
        }

        .member-since,
        .auth-badge,
        .user-id {
            display: block;
            margin: $space-1 0;
        }
    }

    .stats-dashboard {
        grid-template-columns: repeat(2, 1fr);
    }

    .pools-table {
        display: block;
        overflow-x: auto;
    }
}
</style>
