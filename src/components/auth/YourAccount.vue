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
    <section class="account">
        <div class="account-container col-3">
            <!-- Profile Header -->
            <div class="profile-header">
                <div class="avatar">{{ initials }}</div>
                <div class="profile-info">
                    <div class="email">{{ userEmail }}</div>
                    <div class="meta">
                        <span class="member-since">Member since {{ memberSince }}</span>
                        <span class="separator">|</span>
                        <span class="auth-badge">{{ authProvider }} Account</span>
                    </div>
                </div>
                <router-link to="/create" class="action-btn">Create Squares Pool</router-link>
            </div>

            <!-- Stats Dashboard -->
            <div class="stats-dashboard">
                <div class="stat-card">
                    <span class="stat-value">{{ stats?.poolsCreated ?? '-' }}</span>
                    <span class="stat-label">Pools Created</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">{{ stats?.poolsJoined ?? '-' }}</span>
                    <span class="stat-label">Pools Joined</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">{{ stats?.activePools ?? '-' }}</span>
                    <span class="stat-label">Active Pools</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">{{ stats?.archivedPools ?? '-' }}</span>
                    <span class="stat-label">Archived</span>
                </div>
            </div>

            <!-- Pool Lists -->
            <div class="pools-section">
                <div class="pool-column">
                    <div class="pool-column-header">
                        <h2>Pools You Created</h2>
                        <label class="archive-toggle">
                            <input type="checkbox" v-model="owned.showArchived"/>
                            include archived
                        </label>
                    </div>

                    <template v-if="owned.loading">
                        <div class="loading-state">Loading...</div>
                    </template>

                    <template v-else-if="owned.pools">
                        <your-account-pool-list
                            :can-archive="true"
                            :current-page="owned.currentPage"
                            :data="owned.pools"
                            :per-page="poolsPerPage"
                            @page="goToOwnedPoolsPage"
                        />
                    </template>
                    <div v-else-if="owned.error" class="error">{{ owned.error }}</div>
                </div>

                <div class="pool-column">
                    <div class="pool-column-header">
                        <h2>Pools You Joined</h2>
                    </div>

                    <template v-if="joined.loading">
                        <div class="loading-state">Loading...</div>
                    </template>

                    <template v-else-if="joined.pools">
                        <your-account-pool-list
                            :can-leave="true"
                            :current-page="joined.currentPage"
                            :data="joined.pools"
                            :per-page="poolsPerPage"
                            @page="goToJoinedPoolsPage"
                        />
                    </template>
                    <div v-else-if="joined.error" class="error">{{ joined.error }}</div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import sqmgrClient from "@/models/sqmgrClient"
import YourAccountPoolList from "@/components/pool/YourAccountPoolList"
import { useUserProfile } from "@/composables/useUserProfile"
import { usePaginatedFetch } from "@/composables/usePaginatedFetch"

export default {
    name: "YourAccount",
    components: {YourAccountPoolList},
    setup() {
        const user = ref(null)
        const { initials, memberSince, authProvider } = useUserProfile(user)

        const poolsPerPage = 10
        const ownedShowArchived = ref(false)

        const ownedFetch = usePaginatedFetch(
            (offset, perPage) => sqmgrClient.getUserOwnedPools(ownedShowArchived.value, offset, perPage),
            poolsPerPage,
        )

        const joinedFetch = usePaginatedFetch(
            (offset, perPage) => sqmgrClient.getUserJoinedPools(offset, perPage),
            poolsPerPage,
        )

        watch(ownedShowArchived, () => {
            ownedFetch.fetch()
        })

        return {
            user, initials, memberSince, authProvider,
            poolsPerPage,
            owned: reactive({
                showArchived: ownedShowArchived,
                pools: ownedFetch.data,
                loading: ownedFetch.loading,
                currentPage: ownedFetch.currentPage,
                error: ownedFetch.error,
            }),
            joined: reactive({
                pools: joinedFetch.data,
                loading: joinedFetch.loading,
                currentPage: joinedFetch.currentPage,
                error: joinedFetch.error,
            }),
            fetchOwnedPools: ownedFetch.fetch,
            fetchJoinedPools: joinedFetch.fetch,
            goToOwnedPoolsPage: ownedFetch.goToPage,
            goToJoinedPoolsPage: joinedFetch.goToPage,
        }
    },
    data() {
        return {
            stats: null,
        }
    },
    computed: {
        userEmail() {
            return this.user?.email || this.$auth.profile?.email || 'Guest User'
        },
    },
    async beforeMount() {
        this.fetchUser()
        this.fetchStats()
        this.fetchOwnedPools()
        this.fetchJoinedPools()
    },
    methods: {
        async fetchUser() {
            try {
                this.user = await sqmgrClient.getUser()
            } catch (err) {
                console.error('Failed to fetch user:', err)
            }
        },
        async fetchStats() {
            try {
                this.stats = await sqmgrClient.getUserStats()
            } catch (err) {
                console.error('Failed to fetch stats:', err)
            }
        },
    },
}
</script>

<style scoped lang="scss">
@use '../../variables' as *;

.account {
    padding: $standard-spacing;
}

.account-container {
    max-width: 1200px;
    margin:    0 auto;
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
        font-size:     1.25rem;
        font-weight:   600;
        color:         $text-color;
        margin-bottom: $space-1;
    }

    .meta {
        font-size:     0.9rem;
        color:         $text-secondary;
        margin-bottom: $space-4;

        .separator {
            margin: 0 $space-2;
        }

        .auth-badge {
            background:    $primary-100;
            color:         $primary-dark;
            padding:       2px 8px;
            border-radius: 4px;
            font-size:     0.8rem;
        }
    }
}

// Stats Dashboard
.stats-dashboard {
    @include stats-dashboard;
}

.stat-card {
    @include stat-card;

    .stat-value {
        font-size:   2rem;
        font-weight: 700;
        color:       $primary;
    }

    .stat-label {
        font-size: 0.85rem;
        color:     $text-secondary;
    }
}

// Pool Lists
.pools-section {
    display:               grid;
    grid-template-columns: 1fr 1fr;
    gap:                   $space-6;
}

.pool-column {
    background:    $surface-elevated;
    border-radius: $radius-xl;
    padding:       $space-5;
    box-shadow:    $shadow-card;
}

.pool-column-header {
    display:         flex;
    justify-content: space-between;
    align-items:     center;
    margin-bottom:   $space-4;
    min-height:      32px;

    h2 {
        font-size:   1.1rem;
        color:       $text-color;
        margin:      0;
    }

    .archive-toggle {
        font-size:   0.85rem;
        color:       $text-secondary;
        cursor:      pointer;
        display:     flex;
        align-items: center;
        gap:         $space-1;

        input {
            width:  auto;
            margin: 0;
        }
    }
}

.loading-state {
    text-align: center;
    padding:    $space-8;
    color:      $text-secondary;
}

.error {
    @include alert-error;
    text-align: center;
}

// Responsive
@include tablet {
    .profile-header {
        flex-direction: column;
        text-align:     center;
    }

    .profile-info .meta {
        .separator {
            display: none;
        }

        .member-since,
        .auth-badge {
            display: block;
            margin:  $space-1 0;
        }
    }

    .stats-dashboard {
        grid-template-columns: repeat(2, 1fr);
    }

    .pools-section {
        grid-template-columns: 1fr;
    }
}
</style>
