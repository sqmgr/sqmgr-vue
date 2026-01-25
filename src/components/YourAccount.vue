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
import sqmgrClient from "@/models/sqmgrClient"
import YourAccountPoolList from "@/components/YourAccountPoolList"
import ResponseError from "@/models/ResponseError"

export default {
    name: "YourAccount",
    components: {YourAccountPoolList},
    data() {
        return {
            poolsPerPage: 10,
            user: null,
            stats: null,

            owned: {
                showArchived: false,
                pools: null,
                loading: true,
                currentPage: 1,
                error: null,
            },
            joined: {
                pools: null,
                loading: true,
                currentPage: 1,
                error: null,
            },
        }
    },
    computed: {
        showArchived() {
            return this.owned.showArchived
        },
        userEmail() {
            return this.user?.email || this.$auth.profile?.email || 'Guest User'
        },
        initials() {
            const email = this.userEmail
            if (!email || email === 'Guest User') return 'GU'
            const parts = email.split('@')[0].split(/[._-]/)
            if (parts.length >= 2) {
                return (parts[0][0] + parts[1][0]).toUpperCase()
            }
            return email.substring(0, 2).toUpperCase()
        },
        memberSince() {
            if (!this.user?.created) return '...'
            const date = new Date(this.user.created)
            return date.toLocaleDateString(undefined, {month: 'short', year: 'numeric'})
        },
        authProvider() {
            if (this.user?.store === 'auth0') return 'Auth0'
            if (this.user?.store === 'sqmgr') return 'Guest'
            return 'Auth0'
        },
    },
    async beforeMount() {
        this.fetchUser()
        this.fetchStats()
        this.fetchOwnedPools()
        this.fetchJoinedPools()
    },
    watch: {
        showArchived() {
            this.fetchOwnedPools()
        },
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
        goToOwnedPoolsPage(page) {
            this.fetchOwnedPools((page - 1) * this.poolsPerPage)
        },
        goToJoinedPoolsPage(page) {
            this.fetchJoinedPools((page - 1) * this.poolsPerPage)
        },
        fetchOwnedPools(offset = 0) {
            sqmgrClient.getUserOwnedPools(this.owned.showArchived, offset, this.poolsPerPage)
                .then(res => {
                    this.owned.pools = res
                    this.owned.currentPage = (offset / this.poolsPerPage) + 1
                })
                .catch(this.catchFetchError(this.owned))
                .finally(() => this.owned.loading = false)
        },
        fetchJoinedPools(offset = 0) {
            sqmgrClient.getUserJoinedPools(offset, this.poolsPerPage)
                .then(res => {
                    this.joined.pools = res
                    this.joined.currentPage = (offset / this.poolsPerPage) + 1
                })
                .catch(this.catchFetchError(this.joined))
                .finally(() => this.joined.loading = false)
        },
        catchFetchError(obj) {
            return err => {
                if (err instanceof ResponseError) {
                    obj.error = err.message
                    return
                }

                console.log("catchFetchError", err)
                obj.error = 'Could not request data from the server. Please try your request again.'
            }
        },
    },
}
</script>

<style scoped lang="scss">
@use '../variables' as *;

.account {
    padding: $standard-spacing;
}

.account-container {
    max-width: 1200px;
    margin:    0 auto;
}

// Profile Header
.profile-header {
    display:       flex;
    align-items:   center;
    gap:           $space-6;
    background:    $surface-elevated;
    padding:       $space-6;
    border-radius: $radius-xl;
    box-shadow:    $shadow-card;
    margin-bottom: $space-6;
}

.avatar {
    width:           72px;
    height:          72px;
    border-radius:   50%;
    background:      $text-color;
    color:           #fff;
    display:         flex;
    align-items:     center;
    justify-content: center;
    font-size:       1.5rem;
    font-weight:     600;
    flex-shrink:     0;
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
    display:               grid;
    grid-template-columns: repeat(4, 1fr);
    gap:                   $space-4;
    margin-bottom:         $space-6;
}

.stat-card {
    background:     $surface-elevated;
    border:         1px solid $light-gray;
    border-radius:  $radius-lg;
    padding:        $space-5;
    text-align:     center;
    display:        flex;
    flex-direction: column;
    gap:            $space-1;

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
        font-weight: 600;
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
