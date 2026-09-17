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
    <div class="admin-audit">
        <h2>Audit Log</h2>

        <div class="audit-filters">
            <label class="filter-field">
                <span class="filter-label">Action</span>
                <select :value="action" @change="setFilter('action', $event.target.value)">
                    <option value="">All Actions</option>
                    <option v-for="a in actions" :key="a" :value="a">{{ a }}</option>
                </select>
            </label>
            <label class="filter-field">
                <span class="filter-label">Target Type</span>
                <select :value="targetType" @change="setFilter('targetType', $event.target.value)">
                    <option value="">All Types</option>
                    <option v-for="t in targetTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
                </select>
            </label>
            <label class="filter-field">
                <span class="filter-label">Target ID</span>
                <input
                    type="text"
                    v-model="targetIdInput"
                    placeholder="Pool token or event id"
                    @input="debouncedTargetId"
                />
            </label>
            <button v-if="filtersActive" type="button" class="secondary sm" @click="clearFilters">
                Clear Filters
            </button>
        </div>

        <div v-if="loading" class="loading">Loading audit log...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="entries && entries.entries && entries.entries.length > 0">
            <div class="table-wrap">
                <table class="pools-table">
                    <thead>
                    <tr>
                        <th>Created</th>
                        <th>Admin</th>
                        <th>Action</th>
                        <th>Target</th>
                        <th>Reason</th>
                        <th>Details</th>
                    </tr>
                    </thead>
                    <tbody>
                    <template v-for="entry in entries.entries" :key="entry.id">
                        <tr>
                            <td class="nowrap">{{ formatDate(entry.created) }}</td>
                            <td>
                                <router-link :to="`/admin/user/${entry.adminUserId}`">
                                    {{ entry.adminEmail || `User #${entry.adminUserId}` }}
                                </router-link>
                            </td>
                            <td><code>{{ entry.action }}</code></td>
                            <td>
                                <router-link v-if="targetLink(entry)" :to="targetLink(entry)">{{ targetLabel(entry) }}</router-link>
                                <span v-else>{{ targetLabel(entry) }}</span>
                                <span class="muted target-type">{{ entry.targetType }}</span>
                            </td>
                            <td>{{ entry.reason || '-' }}</td>
                            <td>
                                <button
                                    v-if="hasDetails(entry)"
                                    type="button"
                                    class="secondary sm"
                                    @click="toggleDetails(entry.id)"
                                >
                                    {{ expanded[entry.id] ? 'Hide' : 'Show' }}
                                </button>
                                <span v-else class="muted">-</span>
                            </td>
                        </tr>
                        <tr v-if="expanded[entry.id]" class="details-row">
                            <td :colspan="6">
                                <pre>{{ prettyDetails(entry) }}</pre>
                            </td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </div>

            <pagination
                v-if="entries.total > perPage"
                :total="entries.total"
                :per-page="perPage"
                :current-page="currentPage"
                @page="goToPage"
            />
        </div>
        <div v-else class="no-data">
            {{ filtersActive ? 'No audit entries match the selected filters.' : 'No admin actions have been recorded yet.' }}
        </div>
    </div>
</template>

<script>
import sqmgrClient from "@/models/sqmgrClient"
import Pagination from "@/components/ui/Pagination"
import { formatDate, getErrorMessage } from "@/utils/adminFormat"
import { pushQuery, pageFromQuery } from "@/utils/routeQuery"
import { debounce } from "@/utils/debounce"

const ACTIONS = [
    'pool.join', 'pool.archive', 'pool.unarchive', 'pool.lock', 'pool.unlock',
    'pool.resetPassword', 'pool.transferOwnership', 'pool.revokeInvites',
    'event.refresh', 'event.override', 'event.clearOverride', 'sports.sync',
]

const TARGET_TYPES = [
    {value: 'pool', label: 'Pool'},
    {value: 'event', label: 'Event'},
    {value: 'sports_sync', label: 'Sports Sync'},
]

export default {
    name: "AdminAudit",
    components: {Pagination},
    data() {
        return {
            entries: null,
            loading: true,
            error: null,
            perPage: 25,
            actions: ACTIONS,
            targetTypes: TARGET_TYPES,
            expanded: {},
            targetIdInput: '',
        }
    },
    computed: {
        currentPage() {
            return pageFromQuery(this.$route.query)
        },
        action() {
            const action = this.$route.query.action
            return ACTIONS.includes(action) ? action : ''
        },
        targetType() {
            const type = this.$route.query.targetType
            return TARGET_TYPES.some(t => t.value === type) ? type : ''
        },
        targetId() {
            return this.$route.query.targetId || ''
        },
        filtersActive() {
            return !!(this.action || this.targetType || this.targetId)
        },
    },
    watch: {
        '$route.query': {
            handler() {
                if (this.$route.path !== '/admin' || this.$route.query.tab !== 'audit') return
                this.targetIdInput = this.targetId
                this.fetchEntries()
            },
        },
    },
    created() {
        // not in data(): a debounced function has no reason to be reactive
        this.pushTargetId = debounce(() => {
            this.updateUrl({ targetId: this.targetIdInput.trim(), page: 1 }, true)
        })
    },
    beforeMount() {
        this.targetIdInput = this.targetId
        this.fetchEntries()
    },
    beforeUnmount() {
        this.pushTargetId.cancel()
    },
    methods: {
        formatDate,

        async fetchEntries() {
            this.loading = true
            this.error = null
            const offset = (this.currentPage - 1) * this.perPage
            try {
                this.entries = await sqmgrClient.getAdminAuditLog({
                    action: this.action,
                    targetType: this.targetType,
                    targetId: this.targetId,
                }, offset, this.perPage)
            } catch (err) {
                this.error = getErrorMessage(err)
            } finally {
                this.loading = false
            }
        },

        updateUrl(params, replace = false) {
            pushQuery(this.$router, this.$route, params, (key, value) => key === 'page' && value === 1, replace)
        },

        setFilter(key, value) {
            this.updateUrl({ [key]: value, page: 1 })
        },

        debouncedTargetId() {
            this.pushTargetId()
        },

        clearFilters() {
            this.updateUrl({ action: null, targetType: null, targetId: null, page: 1 })
        },

        goToPage(page) {
            this.updateUrl({ page })
        },

        targetLink(entry) {
            if (!entry.targetId) return null
            if (entry.targetType === 'pool') {
                return `/admin/pool/${entry.targetId}`
            }
            if (entry.targetType === 'event') {
                return { path: '/admin', query: { tab: 'events' } }
            }
            return null
        },

        targetLabel(entry) {
            if (entry.targetLabel) return entry.targetLabel
            if (entry.targetId) return entry.targetId
            return '-'
        },

        hasDetails(entry) {
            return entry.details !== null && entry.details !== undefined &&
                !(typeof entry.details === 'object' && Object.keys(entry.details).length === 0)
        },

        toggleDetails(id) {
            this.expanded = { ...this.expanded, [id]: !this.expanded[id] }
        },

        prettyDetails(entry) {
            try {
                return JSON.stringify(entry.details, null, 2)
            } catch {
                return String(entry.details)
            }
        },
    },
}
</script>

<style scoped lang="scss">
@use '../../variables' as *;
@use './admin' as *;

.admin-audit {
    @include admin-messages;

    h2 {
        margin-top:    var(--spacing);
        margin-bottom: var(--spacing);
    }

    .audit-filters {
        @include admin-filter-bar;
    }

    .table-wrap {
        overflow-x: auto;
    }

    .pools-table {
        @include admin-table;

        .nowrap {
            white-space: nowrap;
        }

        .target-type {
            display:     block;
            font-size:   0.75em;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }

        .details-row > td {
            background: #f8f9fa;
            padding:    0 12px 12px 12px;

            pre {
                margin:        8px 0 0;
                padding:       $space-3;
                background:    $surface-elevated;
                border:        1px solid $light-gray;
                border-radius: $radius-md;
                font-size:     0.8em;
                overflow-x:    auto;
                white-space:   pre-wrap;
                word-break:    break-word;
            }
        }
    }
}
</style>
