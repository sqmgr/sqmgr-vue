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
    <section class="admin-pool">
        <div class="admin-pool-container col-3">
            <router-link to="/admin" class="back-link">&larr; Back to Admin Dashboard</router-link>

            <div v-if="loading" class="loading">Loading pool details...</div>
            <div v-else-if="error" class="error">{{ error }}</div>
            <template v-else-if="pool">
                <!-- Header -->
                <div class="pool-header">
                    <div class="pool-info">
                        <div class="title-row">
                            <h1>{{ pool.name }}</h1>
                            <div class="badges">
                                <span :class="['status', pool.archived ? 'archived' : 'active']">
                                    {{ pool.archived ? 'Archived' : 'Active' }}
                                </span>
                                <span v-if="isLocked" class="status warning"><i class="fas fa-lock"></i> Locked</span>
                                <span v-else-if="locksAt" class="status neutral">Locks {{ formatDate(pool.locks) }}</span>
                                <span v-if="pool.passwordRequired" class="status neutral">Password Required</span>
                                <span v-if="pool.openAccessOnLock" class="status neutral">Open Access on Lock</span>
                                <span v-if="hasManualDraw" class="status neutral">Manual Draw</span>
                                <span v-if="hasRollover" class="status neutral">Rollover</span>
                            </div>
                        </div>
                        <dl class="meta">
                            <div>
                                <dt>Token</dt>
                                <dd><code>{{ pool.token }}</code></dd>
                            </div>
                            <div>
                                <dt>Grid Type</dt>
                                <dd>{{ pool.gridType }}</dd>
                            </div>
                            <div>
                                <dt>Number Set</dt>
                                <dd>{{ pool.numberSetConfig || '-' }}</dd>
                            </div>
                            <div>
                                <dt>Owner</dt>
                                <dd>
                                    <router-link :to="`/admin/user/${pool.ownerId}`">
                                        {{ formatUserLabel(pool.ownerId, pool.ownerEmail, pool.ownerStore) }}
                                    </router-link>
                                </dd>
                            </div>
                            <div>
                                <dt>Created</dt>
                                <dd>{{ formatDate(pool.created) }}</dd>
                            </div>
                            <div>
                                <dt>Modified</dt>
                                <dd>{{ formatDate(pool.modified) }}</dd>
                            </div>
                        </dl>
                        <router-link :to="`/pool/${pool.token}`" class="public-link">
                            <i class="fas fa-external-link-alt"></i> Open public pool page
                        </router-link>
                    </div>
                </div>

                <!-- Stats -->
                <div class="stat-tiles">
                    <div class="stat-card">
                        <span class="stat-value">{{ formatNumber(pool.memberCount) }}</span>
                        <span class="stat-label">Members</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">{{ formatNumber(pool.gridCount) }}</span>
                        <span class="stat-label">Grids</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">{{ formatNumber(pool.claimedSquares) }}<span class="stat-of">/ {{ formatNumber(pool.totalSquares) }}</span></span>
                        <span class="stat-label">Squares Claimed</span>
                        <span class="stat-sub">{{ formatPercent(pool.fillPercent) }} full</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">{{ formatNumber(squareStates.unclaimed) }}</span>
                        <span class="stat-label">Unclaimed</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">{{ formatNumber(squareStates.claimed) }}</span>
                        <span class="stat-label">Claimed</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">{{ formatNumber(squareStates.paidPartial) }}</span>
                        <span class="stat-label">Paid Partial</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">{{ formatNumber(squareStates.paidFull) }}</span>
                        <span class="stat-label">Paid Full</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">{{ formatNumber(pool.activeInvites) }}</span>
                        <span class="stat-label">Active Invites</span>
                    </div>
                </div>

                <!-- Admin actions -->
                <div class="panel">
                    <div class="section-header">
                        <h2>Admin Actions</h2>
                        <span v-if="busyAction" class="hint">Working...</span>
                    </div>
                    <div v-if="note" class="success-note">{{ note }}</div>
                    <div class="actions">
                        <button
                            type="button"
                            :class="{ destructive: !pool.archived, secondary: pool.archived }"
                            :disabled="!!busyAction"
                            @click="confirmArchive"
                        >
                            {{ pool.archived ? 'Unarchive Pool' : 'Archive Pool' }}
                        </button>
                        <button type="button" class="secondary" :disabled="!!busyAction" @click="confirmLock">
                            {{ isLocked ? 'Unlock Squares' : 'Lock Squares' }}
                        </button>
                        <button type="button" class="secondary" :disabled="!!busyAction" @click="confirmResetPassword">
                            Reset Join Password
                        </button>
                        <button type="button" class="secondary" :disabled="!!busyAction" @click="confirmTransfer">
                            Transfer Ownership
                        </button>
                        <button type="button" class="destructive" :disabled="!!busyAction" @click="confirmRevokeInvites">
                            Revoke Invite Links
                        </button>
                        <button type="button" :disabled="!!busyAction || !!joiningPool" @click="confirmJoinPool(pool)">
                            {{ joiningPool ? 'Joining...' : 'Join Pool' }}
                        </button>
                    </div>
                </div>

                <!-- Grids -->
                <div class="panel">
                    <div class="section-header">
                        <h2>Grids</h2>
                    </div>
                    <div v-if="pool.grids && pool.grids.length > 0" class="table-wrap">
                        <table class="pools-table">
                            <thead>
                            <tr>
                                <th>Grid</th>
                                <th>State</th>
                                <th>Event Date</th>
                                <th>Sports Event</th>
                                <th>Draw</th>
                                <th>Rollover</th>
                                <th>Created</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="grid in pool.grids" :key="grid.id">
                                <td>
                                    <router-link :to="`/pool/${pool.token}/game/${grid.id}`">{{ gridName(grid) }}</router-link>
                                </td>
                                <td>
                                    <span :class="['status', gridStateClass(grid.state)]">{{ grid.state || '-' }}</span>
                                </td>
                                <td>{{ formatDate(grid.eventDate) }}</td>
                                <td>
                                    <template v-if="grid.sportsEventId">
                                        {{ grid.sportsEventName || `Event #${grid.sportsEventId}` }}
                                        <span v-if="grid.league" class="muted"> ({{ grid.league.toUpperCase() }})</span>
                                    </template>
                                    <span v-else class="muted">-</span>
                                </td>
                                <td>{{ grid.manualDraw ? 'Manual' : 'Random' }}</td>
                                <td>{{ grid.rollover ? 'Yes' : 'No' }}</td>
                                <td>{{ formatDate(grid.created) }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else class="no-data">This pool has no grids.</div>
                </div>

                <!-- Members -->
                <div class="panel">
                    <div class="section-header">
                        <h2>Members</h2>
                    </div>
                    <div v-if="membersLoading" class="loading">Loading members...</div>
                    <div v-else-if="membersError" class="error">{{ membersError }}</div>
                    <div v-else-if="registeredMembers.length > 0" class="table-wrap">
                        <table class="pools-table">
                            <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th class="numeric">Squares Claimed</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="member in registeredMembers" :key="member.userId">
                                <td>
                                    <router-link :to="`/admin/user/${member.userId}`">
                                        {{ formatUserLabel(member.userId, member.email, member.store) }}
                                    </router-link>
                                </td>
                                <td>
                                    <span v-if="member.isOwner" class="status active">Owner</span>
                                    <span v-if="member.isManager && !member.isOwner" class="status neutral">Manager</span>
                                    <span v-if="!member.isOwner && !member.isManager" class="muted">Member</span>
                                </td>
                                <td>{{ formatDate(member.joined) }}</td>
                                <td class="numeric">{{ formatNumber(member.squaresClaimed) }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else class="no-data">This pool has no registered members.</div>
                </div>

                <!-- Squares -->
                <div class="panel">
                    <div class="section-header">
                        <h2>Squares</h2>
                        <label class="toggle">
                            <input type="checkbox" v-model="includeUnclaimed"/>
                            include unclaimed
                        </label>
                    </div>
                    <div v-if="squaresLoading" class="loading">Loading squares...</div>
                    <div v-else-if="squaresError" class="error">{{ squaresError }}</div>
                    <div v-else-if="squares && squares.length > 0" class="table-wrap">
                        <table class="pools-table">
                            <thead>
                            <tr>
                                <th class="numeric">Square</th>
                                <th>State</th>
                                <th>Claimant</th>
                                <th>User</th>
                                <th>Modified</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="square in squares" :key="square.squareId">
                                <td class="numeric">{{ square.squareId }}</td>
                                <td>
                                    <span :class="['status', squareStateClass(square.state)]">{{ formatSquareState(square.state) }}</span>
                                </td>
                                <td>{{ square.claimant || '-' }}</td>
                                <td>
                                    <router-link v-if="square.userId" :to="`/admin/user/${square.userId}`">
                                        {{ formatUserLabel(square.userId, square.userEmail, square.userStore) }}
                                    </router-link>
                                    <span v-else class="muted">-</span>
                                </td>
                                <td>{{ formatDate(square.modified) }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else class="no-data">
                        {{ includeUnclaimed ? 'This pool has no squares.' : 'No squares have been claimed yet.' }}
                    </div>
                </div>

                <!-- Activity log -->
                <div class="panel">
                    <div class="section-header">
                        <h2>Activity Log</h2>
                    </div>
                    <div v-if="activityLoading" class="loading">Loading activity...</div>
                    <div v-else-if="activityError" class="error">{{ activityError }}</div>
                    <div v-else-if="activity && activity.activity && activity.activity.length > 0">
                        <div class="table-wrap">
                            <table class="pools-table">
                                <thead>
                                <tr>
                                    <th>Created</th>
                                    <th class="numeric">Square</th>
                                    <th>State</th>
                                    <th>Claimant</th>
                                    <th>User</th>
                                    <th>Note</th>
                                    <th>Remote Address</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="entry in activity.activity" :key="entry.id">
                                    <td class="nowrap">{{ formatDate(entry.created) }}</td>
                                    <td class="numeric">{{ entry.squareId }}</td>
                                    <td>{{ formatSquareState(entry.state) }}</td>
                                    <td>{{ entry.claimant || '-' }}</td>
                                    <td>
                                        <router-link v-if="entry.userId" :to="`/admin/user/${entry.userId}`">
                                            {{ formatUserLabel(entry.userId, entry.userEmail, entry.userStore) }}
                                        </router-link>
                                        <span v-else class="muted">-</span>
                                    </td>
                                    <td>{{ entry.note || '-' }}</td>
                                    <td><code>{{ entry.remoteAddr || '-' }}</code></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <pagination
                            v-if="activity.total > activityPerPage"
                            :total="activity.total"
                            :per-page="activityPerPage"
                            :current-page="activityPage"
                            @page="goToActivityPage"
                        />
                    </div>
                    <div v-else class="no-data">No activity has been recorded for this pool.</div>
                </div>
            </template>
        </div>
    </section>
</template>

<script>
import sqmgrClient from "@/models/sqmgrClient"
import Pagination from "@/components/ui/Pagination"
import ModalController from "@/controllers/ModalController"
import ResponseError from "@/models/ResponseError"
import AdminActionPrompt from "@/components/admin/AdminActionPrompt"
import adminJoinPoolMixin from "@/components/admin/adminJoinPoolMixin"
import timedNoteMixin from "@/components/admin/timedNoteMixin"
import { usePaginatedFetch } from "@/composables/usePaginatedFetch"
import { formatDate, formatNumber, formatPercent, formatUserLabel, getErrorMessage } from "@/utils/adminFormat"

export default {
    name: "AdminPool",
    mixins: [adminJoinPoolMixin, timedNoteMixin],
    components: {Pagination},
    props: {
        token: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const activityPerPage = 50
        const {
            data: activity,
            loading: activityLoading,
            error: activityError,
            currentPage: activityPage,
            fetch: fetchActivity,
            goToPage: goToActivityPage,
        } = usePaginatedFetch(
            (offset, perPage) => sqmgrClient.getAdminPoolActivity(props.token, offset, perPage),
            activityPerPage,
        )

        return {
            activity, activityLoading, activityError, activityPage, activityPerPage,
            fetchActivity, goToActivityPage,
        }
    },
    data() {
        return {
            pool: null,
            loading: true,
            error: null,

            members: null,
            membersLoading: true,
            membersError: null,

            squares: null,
            squaresLoading: true,
            squaresError: null,
            includeUnclaimed: false,

            busyAction: null,
        }
    },
    computed: {
        // Guest accounts are transient, so the members table only lists
        // registered users.
        registeredMembers() {
            return (this.members || []).filter(member => member.store === 'auth0')
        },
        locksAt() {
            if (!this.pool || !this.pool.locks) return null
            const locks = new Date(this.pool.locks)
            return locks.getFullYear() > 1 ? locks : null
        },
        isLocked() {
            return !!this.locksAt && this.locksAt.getTime() <= Date.now()
        },
        squareStates() {
            return this.pool && this.pool.squareStates ? this.pool.squareStates : {}
        },
        hasManualDraw() {
            return !!(this.pool && this.pool.grids && this.pool.grids.some(g => g.manualDraw))
        },
        hasRollover() {
            return !!(this.pool && this.pool.grids && this.pool.grids.some(g => g.rollover))
        },
    },
    watch: {
        includeUnclaimed() {
            this.fetchSquares()
        },
        // a param-only navigation reuses this component, so reload everything
        token() {
            this.loadAll()
        },
    },
    beforeMount() {
        this.loadAll()
    },
    methods: {
        formatDate,
        formatNumber,
        formatPercent,
        formatUserLabel,

        async loadAll() {
            this.clearNote()
            this.pool = null
            this.members = null
            this.squares = null
            await this.fetchPool()
            if (this.pool) {
                this.fetchMembers()
                this.fetchSquares()
                this.fetchActivity()
            }
        },

        async fetchPool() {
            this.loading = true
            this.error = null
            try {
                this.pool = await sqmgrClient.getAdminPool(this.token)
            } catch (err) {
                if (err instanceof ResponseError && err.statusCode === 404) {
                    this.error = 'Pool not found.'
                } else {
                    this.error = getErrorMessage(err)
                }
            } finally {
                this.loading = false
            }
        },

        // refreshPool reloads the header without blanking the page
        async refreshPool() {
            try {
                this.pool = await sqmgrClient.getAdminPool(this.token)
            } catch (err) {
                ModalController.showError(getErrorMessage(err))
            }
        },

        async fetchMembers() {
            this.membersLoading = true
            this.membersError = null
            try {
                const result = await sqmgrClient.getAdminPoolMembers(this.token)
                this.members = result.members || []
            } catch (err) {
                this.membersError = getErrorMessage(err)
            } finally {
                this.membersLoading = false
            }
        },

        async fetchSquares() {
            this.squaresLoading = true
            this.squaresError = null
            try {
                const result = await sqmgrClient.getAdminPoolSquares(this.token, this.includeUnclaimed)
                this.squares = result.squares || []
            } catch (err) {
                this.squaresError = getErrorMessage(err)
            } finally {
                this.squaresLoading = false
            }
        },

        showActionPrompt(title, props, onConfirm) {
            ModalController.show(title, AdminActionPrompt, props, {
                'confirm': values => {
                    ModalController.hide()
                    onConfirm(values)
                },
            })
        },

        async runAction(action, values, successNote) {
            this.busyAction = action
            try {
                await sqmgrClient.adminPoolAction(this.token, action, values)
                this.showNote(successNote)
                await this.refreshPool()
                if (action === 'transferOwnership' || action === 'resetPassword') {
                    this.fetchMembers()
                }
            } catch (err) {
                ModalController.showError(getErrorMessage(err))
            } finally {
                this.busyAction = null
            }
        },

        confirmArchive() {
            const archiving = !this.pool.archived
            this.showActionPrompt(archiving ? 'Archive Pool' : 'Unarchive Pool', {
                description: archiving
                    ? `Archive "${this.pool.name}"? Members will no longer see it in their active pools.`
                    : `Unarchive "${this.pool.name}" and make it active again?`,
                actionButton: archiving ? 'Archive Pool' : 'Unarchive Pool',
                isDestructive: archiving,
            }, values => this.runAction(
                archiving ? 'archive' : 'unarchive',
                values,
                archiving ? 'The pool has been archived.' : 'The pool has been unarchived.',
            ))
        },

        confirmLock() {
            const locking = !this.isLocked
            this.showActionPrompt(locking ? 'Lock Squares' : 'Unlock Squares', {
                description: locking
                    ? 'Lock the squares? Members will no longer be able to claim open squares.'
                    : 'Unlock the squares so members can claim open squares again?',
                actionButton: locking ? 'Lock Squares' : 'Unlock Squares',
            }, values => this.runAction(
                locking ? 'lock' : 'unlock',
                values,
                locking ? 'The squares have been locked.' : 'The squares have been unlocked.',
            ))
        },

        confirmResetPassword() {
            this.showActionPrompt('Reset Join Password', {
                description: `Set a new join password for "${this.pool.name}".`,
                warning: 'Existing invite links will stop working. Current members keep their access.',
                actionButton: 'Reset Password',
                fields: [
                    {key: 'password', label: 'New join password', type: 'password', required: true, minLength: 6, helper: 'At least 6 characters.'},
                ],
            }, values => this.runAction('resetPassword', values, 'The join password has been reset.'))
        },

        confirmTransfer() {
            this.showActionPrompt('Transfer Ownership', {
                description: `Transfer "${this.pool.name}" to another user. The current owner stays on as a regular member.`,
                actionButton: 'Transfer Ownership',
                isDestructive: true,
                fields: [
                    {key: 'userId', label: 'New owner user ID', type: 'number', required: true, min: 1, helper: 'The numeric ID shown on the admin user page.'},
                ],
            }, values => this.runAction('transferOwnership', values, 'Ownership has been transferred.'))
        },

        confirmRevokeInvites() {
            this.showActionPrompt('Revoke Invite Links', {
                description: `Revoke all active invite links for "${this.pool.name}"?`,
                warning: 'Anyone holding an existing invite link will no longer be able to use it.',
                actionButton: 'Revoke Invites',
                isDestructive: true,
            }, values => this.runAction('revokeInvites', values, 'All invite links have been revoked.'))
        },

        // adminJoinPoolMixin hook: stay on this page and refresh instead of
        // navigating to the public pool page.
        async afterJoin() {
            this.showNote('You have joined this pool.')
            await this.refreshPool()
            this.fetchMembers()
        },

        gridName(grid) {
            if (grid.label) return grid.label
            if (grid.homeTeamName || grid.awayTeamName) {
                return `${grid.awayTeamName || 'Away'} at ${grid.homeTeamName || 'Home'}`
            }
            return `Grid #${grid.id}`
        },

        gridStateClass(state) {
            switch (state) {
                case 'active': return 'active'
                case 'archived':
                case 'deleted': return 'archived'
                default: return 'neutral'
            }
        },

        formatSquareState(state) {
            if (!state) return '-'
            return String(state)
                .split(/[-_]/)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
        },

        squareStateClass(state) {
            switch (state) {
                case 'paid-full':
                case 'paid_full': return 'active'
                case 'paid-partial':
                case 'paid_partial': return 'warning'
                case 'claimed': return 'neutral'
                default: return 'neutral'
            }
        },
    },
}
</script>

<style scoped lang="scss">
@use '../../variables' as *;
@use './admin' as *;

.admin-pool {
    padding: $standard-spacing;
    @include admin-messages;
}

.admin-pool-container {
    max-width: 1200px;
    margin:    0 auto;
}

.back-link {
    display:         inline-block;
    margin-bottom:   $space-4;
    color:           var(--primary);
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
}

.pool-header {
    @include profile-header-card;

    .pool-info {
        flex: 1;

        .title-row {
            display:     flex;
            align-items: center;
            gap:         $space-3;
            flex-wrap:   wrap;

            h1 {
                font-size:     1.5rem;
                margin-bottom: 0;
            }

            .badges {
                display:   flex;
                gap:       $space-1;
                flex-wrap: wrap;

                .status {
                    @include admin-status;

                    i {
                        margin-right: 2px;
                    }
                }
            }
        }

        .meta {
            display:   flex;
            flex-wrap: wrap;
            gap:       $space-2 $space-6;
            margin:    $space-3 0;

            dt {
                font-size:      0.7rem;
                font-weight:    600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color:          $gray;
            }

            dd {
                margin:    0;
                font-size: 0.9rem;
                color:     $text-color;

                code {
                    font-family: monospace;
                }
            }
        }

        .public-link {
            font-size: 0.9rem;

            i {
                margin-right: $space-1;
            }
        }
    }
}

.stat-tiles {
    @include admin-stat-tiles;

    .stat-card .stat-of {
        font-size:   0.9rem;
        font-weight: 500;
        color:       $text-secondary;
        margin-left: $space-1;
    }
}

.panel {
    @include admin-section;

    .section-header .hint {
        font-size: 0.85rem;
        color:     $text-secondary;
    }

    .actions {
        display:   flex;
        gap:       $space-2;
        flex-wrap: wrap;
    }

    .table-wrap {
        overflow-x: auto;
    }

    .pools-table {
        @include admin-table;
        margin-bottom: 0;

        .nowrap {
            white-space: nowrap;
        }
    }

    .status {
        @include admin-status;
    }
}

@include tablet {
    .pool-header {
        flex-direction: column;
        align-items:    stretch;
    }

    .panel .actions button {
        flex: 1 1 45%;
    }
}
</style>
