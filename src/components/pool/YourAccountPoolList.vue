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
    <section class="your-account-pool-list">
        <!-- Empty State -->
        <div v-if="!data.pools || data.pools.length === 0" class="empty-state">
            <div class="empty-icon">
                <i class="fas fa-folder-open"></i>
            </div>
            <p class="empty-message">No pools yet</p>
            <p class="empty-hint" v-if="canArchive">Create your first squares pool to get started!</p>
            <p class="empty-hint" v-else>Join a pool to see it here.</p>
        </div>

        <!-- Pool Cards Grid -->
        <div v-else class="pool-cards-grid">
            <div
                v-for="pool in data.pools"
                :key="pool.token"
                :class="['pool-card', { deleted: deletedPools[pool.token], archived: pool.archived }]"
            >
                <div class="pool-info">
                    <router-link :to="`/pool/${pool.token}`" class="pool-name">{{ pool.name }}</router-link>
                    <span class="pool-meta">
                        <span v-if="pool.archived" class="archived-badge">
                            <i class="fas fa-archive"></i> Archived
                        </span>
                        <span class="pool-type">{{ gridType(pool.gridType) }}</span>
                        <span class="meta-separator">·</span>
                        <span class="pool-date">Created: {{ date(pool.created) }}</span>
                    </span>
                </div>

                <div class="pool-actions">
                    <router-link :to="`/pool/${pool.token}`" class="action-btn view-btn">
                        <i class="fas fa-eye"></i> View
                    </router-link>

                    <template v-if="canArchive">
                        <button
                            v-if="pool.archived"
                            class="action-btn unarchive-btn"
                            @click="unarchivePool(pool)"
                        >
                            <i class="fas fa-box-open"></i> Unarchive
                        </button>
                        <button
                            v-else
                            class="action-btn archive-btn"
                            @click="archivePool(pool)"
                        >
                            <i class="fas fa-archive"></i> Archive
                        </button>
                    </template>

                    <button
                        v-if="canLeave"
                        :disabled="deletedPools[pool.token]"
                        class="action-btn leave-btn"
                        @click="leavePool(pool)"
                    >
                        <i class="fas fa-sign-out-alt"></i> Leave
                    </button>
                </div>
            </div>
        </div>

        <Pagination
            v-if="data.pools && data.pools.length > 0"
            :total="data.total"
            :per-page="perPage"
            :current-page="currentPage"
            @page="goToPage"
        />
    </section>
</template>

<script>
    import Pagination from "@/components/ui/Pagination";
    import ModalController from '@/controllers/ModalController'
    import sqmgrClient from "@/models/sqmgrClient";

    export default {
        name: "YourAccountPoolList",
        components: {Pagination},
        props: {
            currentPage: {
                type: Number,
                required: true,
            },
            perPage: {
                type: Number,
                required: true,
            },
            data: {
                type: Object,
                required: true,
            },
            canArchive: {
                type: Boolean,
                required: false,
            },
            canLeave: {
                type: Boolean,
                required: false,
            },
        },
        data() {
            return {
                deletedPools: {},
            }
        },
        methods: {
            goToPage(page) {
                this.$emit('page', page)
            },
            date(datetime) {
                return new Date(datetime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
            },
            archivePool(pool) {
                sqmgrClient.archivePool(pool.token)
                    .then(() => {
                        pool.archived = true
                    })
                    .catch(err => ModalController.showError(err))
            },
            unarchivePool(pool) {
                sqmgrClient.unarchivePool(pool.token)
                    .then(() => {
                        pool.archived = false
                    })
                    .catch(err => ModalController.showError(err))
            },
            leavePool(pool) {
                ModalController.showPrompt('Leave the Squares Pool?', 'Are you sure you want to leave the squares pool?', {
                    actionButton: 'Leave',
                    action: () => {
                        sqmgrClient.leavePool(pool.token)
                            .then(() => {
                                this.deletedPools[pool.token] = true
                                ModalController.hide()
                            })
                            .catch(err => ModalController.showError(err))
                    },
                })
            },
            gridType(gridType) {
                switch (gridType) {
                    case 'std100':
                        return 'Standard Grid';
                    case 'std50':
                        return '50 Squares';
                    case 'std25':
                        return '25 Squares';
                    case 'roll100':
                        return 'Rollover';
                }

                return gridType
            }
        }
    }
</script>

<style scoped lang="scss">
    @use '../../variables' as *;

    .your-account-pool-list {
        min-height: 100px;
    }

    // Empty State
    .empty-state {
        text-align: center;
        padding: $space-8 $space-4;
        color: $text-secondary;

        .empty-icon {
            font-size: 2.5rem;
            margin-bottom: $space-4;
            opacity: 0.5;
        }

        .empty-message {
            font-size: 1rem;
            font-weight: 500;
            margin-bottom: $space-2;
            color: $text-color;
        }

        .empty-hint {
            font-size: 0.85rem;
            margin: 0;
        }
    }

    // Pool Cards Grid
    .pool-cards-grid {
        display: flex;
        flex-direction: column;
        gap: $space-3;
    }

    .pool-card {
        background: $surface-sunken;
        border: 1px solid $light-gray;
        border-radius: $radius-lg;
        padding: $space-3 $space-4;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: $space-4;
        transition: box-shadow 0.2s, opacity 0.2s;

        &:hover {
            box-shadow: $shadow-card;
        }

        &.deleted {
            opacity: 0.5;
            text-decoration: line-through;
        }

        &.archived {
            border-color: $gray;
            background: rgba($gray, 0.08);
            opacity: 0.75;

            &:hover {
                opacity: 1;
            }

            .pool-name {
                color: $text-secondary;
            }
        }

        .pool-info {
            display: flex;
            flex-direction: column;
            gap: $space-1;
            min-width: 0;
        }

        .pool-name {
            font-weight: 600;
            font-size: 1rem;
            color: $text-color;
            text-decoration: none;

            &:hover {
                color: $primary;
            }
        }

        .pool-meta {
            display: flex;
            align-items: center;
            gap: $space-2;
            font-size: 0.8rem;
            color: $text-secondary;
        }

        .meta-separator {
            color: $gray;
        }

        .archived-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: $gray;
            color: #fff;
            font-size: 0.7rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 2px 8px;
            border-radius: 4px;
            margin-right: $space-2;

            i {
                font-size: 0.65rem;
            }
        }

        .pool-type {
            color: $text-secondary;
        }

        .pool-date {
            color: $text-secondary;
        }

        .pool-actions {
            display: flex;
            flex-wrap: nowrap;
            gap: $space-2;
            flex-shrink: 0;
        }

        .action-btn {
            font-size: 0.8rem;
            padding: $space-1 $space-3;
            border-radius: 4px;
            border: 1px solid $border-color;
            background: $surface-elevated;
            color: $text-secondary;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: $space-1;
            transition: all 0.2s;

            &:hover {
                border-color: $primary;
                color: $primary;
            }

            &:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            i {
                font-size: 0.75rem;
            }
        }

        .view-btn {
            background: linear-gradient(180deg, $primary 0%, $primary-dark 100%);
            color: #fff;
            border-color: transparent;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1);

            &:hover {
                background: linear-gradient(180deg, $primary-light 0%, $primary 100%);
                border-color: transparent;
                color: #fff;
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15);
            }

            &:active {
                transform: translateY(0);
                background: $primary-dark;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.1);
            }
        }

        .archive-btn,
        .leave-btn,
        .unarchive-btn {
            background: transparent;
            border-color: transparent;
            color: $text-secondary;

            &:hover {
                background: transparent;
                border-color: transparent;
                color: $red;
            }
        }

        .unarchive-btn {
            &:hover {
                color: $primary;
            }
        }
    }

    // Responsive: stack on mobile
    @media (max-width: $breakpoint-sm) {
        .pool-card {
            flex-direction: column;
            align-items: flex-start;

            .pool-actions {
                width: 100%;
                justify-content: flex-start;
                padding-top: $space-2;
                border-top: 1px solid $light-gray;
                margin-top: $space-2;
            }
        }
    }

    // Pagination spacing
    :deep(.pagination) {
        margin-top: $space-4;
    }
</style>
