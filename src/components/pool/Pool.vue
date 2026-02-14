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
    <section class="pool" :class="{ admin: this.pool.isAdmin, rollover }">
        <template v-if="pool">
            <div class="pool-header">
                <h1>{{ this.pool.name }}</h1>
                <div class="pool-status" :class="{ locked: isLocked }">
                    <i :class="isLocked ? 'fas fa-lock' : 'fas fa-lock-open'"></i>
                    <span>{{ isLocked ? 'Locked' : 'Open' }}</span>
                </div>
            </div>

            <LoadingIndicator v-if="!grids" text="Loading..."/>

            <!-- Embedded grid (single-grid only) -->
            <PoolGrid v-if="grids && isSingleGrid"
                      :token="token" :initial-pool="pool"
                      :grid-id="`${grids[0].id}`" embedded
                      :can-add-game="canAddGame"
                      @add-game="createGrid">
                <template #sidebar-extra="{ grid: gridData, config: gridConfig }">
                    <PoolSettingsCard class="pool-settings-card" :pool="pool" :token="token"
                                      :grid="gridData" :grid-config="gridConfig"
                                      @update:pool="pool = $event"
                                      @copied="handleCopied"/>
                </template>
            </PoolGrid>

            <!-- Multi-grid layout -->
            <div v-if="grids && !isSingleGrid" class="pool-body multi-grid">
                <div class="games-in-pool">
                    <div class="card games-card">
                        <div class="card-header">
                            <h2>Games in Pool</h2>
                            <span class="game-count">{{ grids.length }} game{{ grids.length !== 1 ? 's' : '' }}</span>
                        </div>

                        <div class="grids" v-if="grids.length > 0">
                            <div class="grid-row header">
                                <div class="game">Game</div>
                                <div class="rollover" v-if="rollover">Rollover</div>
                                <div class="event-date">Event Date</div>
                            </div>

                            <draggable v-model="grids" @start="drag=true" @end="drag=false" :disabled="!pool.isAdmin"
                                       handle=".handle" @change="change" item-key="id">
                                <template #item="{ element: grid, index: i }">
                                    <div class="grid-row">
                                        <span v-if="pool.isAdmin" class="handle"><i
                                            class="fas fa-grip-vertical"></i></span>

                                        <span class="index">{{ i + 1 }}</span>

                                        <router-link class="game" :to="`/pool/${token}/game/${grid.id}`">
                                            {{ grid.name }}
                                        </router-link>

                                        <div class="rollover" v-if="rollover">
                                            <span class="fas fa-dice" v-if="grid.rollover"
                                                  title="Rollover enabled"></span>
                                        </div>

                                        <div class="event-date">
                                            <span v-if="ymd(grid.eventDate)">{{ ymd(grid.eventDate) }}</span>
                                            <span v-else class="unknown">Not set</span>
                                        </div>

                                        <div v-if="pool.isAdmin" class="actions">
                                            <button type="button" class="icon-btn" @click.prevent="customizeGrid(grid)"
                                                    title="Customize">
                                                <i class="fas fa-cog"></i>
                                            </button>
                                            <button type="button" class="icon-btn destructive"
                                                    @click.prevent="confirmDelete(grid)" title="Delete">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                </template>
                            </draggable>
                        </div>

                        <div class="empty-state" v-else>
                            <i class="fas fa-football-ball"></i>
                            <p>No games yet. Add your first game to get started.</p>
                        </div>

                        <div class="get-started" v-if="showGetStarted">
                            <div class="get-started-text">
                                <strong>Get started — customize your first game</strong>
                                <p>Set team names, pick an event date, and view your squares grid.</p>
                            </div>
                            <div class="get-started-actions">
                                <button type="button" class="sm secondary" @click.prevent="customizeGrid(grids[0])">
                                    <i class="fas fa-cog"></i> Customize
                                </button>
                                <router-link :to="`/pool/${token}/game/${grids[0].id}`" class="sm action-btn">
                                    View Squares <i class="fas fa-arrow-right"></i>
                                </router-link>
                            </div>
                        </div>

                        <div class="card-footer" v-if="pool.isAdmin">
                            <button :disabled="!canAddGame" type="button" @click.prevent="createGrid">
                                <i class="fas fa-plus"></i> Add Game
                            </button>
                        </div>
                    </div>
                </div>

                <div class="pool-settings">
                    <PoolSettingsCard :pool="pool" :token="token"
                                      @update:pool="pool = $event"
                                      @copied="handleCopied"/>
                </div>
            </div>
        </template>

        <Teleport to="body">
            <transition name="copied">
                <div ref="copied" class="copied" v-if="showCopiedMessage">Copied!</div>
            </transition>
        </Teleport>
    </section>
</template>

<script>
import sqmgrClient from "@/models/sqmgrClient"
import GridCustomize from '@/components/grid/GridCustomize'
import Common from '@/common'
import draggable from 'vuedraggable'
import ModalController from "@/controllers/ModalController"
import PoolGrid from "@/components/pool/PoolGrid"
import PoolSettingsCard from "@/components/pool/PoolSettingsCard"
import LoadingIndicator from "@/components/ui/LoadingIndicator"
import EventBus from "@/models/EventBus"
import {GRID_UPDATED, POOL_UPDATED} from "@/constants/events"
import {usePoolEvents} from "@/composables/usePoolEvents"

export default {
    name: "Pool",
    components: {draggable, PoolGrid, PoolSettingsCard, LoadingIndicator},
    props: {
        initialPool: {
            type: Object,
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const {connected} = usePoolEvents(props.token)
        return {sseConnected: connected}
    },
    data() {
        return {
            pool: this.initialPool,
            grids: null,
            showCopiedMessage: false,
            maxAllowed: 0,
        }
    },
    created() {
        EventBus.on(GRID_UPDATED, this.refreshGrids)
        EventBus.on(POOL_UPDATED, this.refreshPool)
    },
    beforeUnmount() {
        EventBus.off(GRID_UPDATED, this.refreshGrids)
        EventBus.off(POOL_UPDATED, this.refreshPool)
    },
    beforeRouteUpdate(to, from, next) {
        next()
    },
    beforeMount() {
        document.title = `${this.pool.name} - SqMGR`
        sqmgrClient.getPoolGridsByToken(this.token)
            .then(data => {
                this.grids = data.grids
                this.maxAllowed = data.maxAllowed
            })
            .catch(err => ModalController.showError(err))
    },
    computed: {
        isLocked() {
            const locks = new Date(this.pool.locks)
            return locks.getFullYear() > 1 && locks.getTime() < new Date().getTime()
        },
        canAddGame() {
            return this.grids && this.maxAllowed > this.grids.length
        },
        rollover() {
            return this.pool.gridType === 'roll100'
        },
        showGetStarted() {
            // return true if there is only one grid and the original team names are still showing
            if (!this.pool.isAdmin || !this.grids || this.grids.length !== 1) return false
            const grid = this.grids[0]
            return grid.awayTeamName === 'Away Team' && grid.homeTeamName === 'Home Team'
        },
        isSingleGrid() {
            return this.grids && this.grids.length === 1
        },
    },
    methods: {
        refreshGrids() {
            sqmgrClient.getPoolGridsByToken(this.token)
                .then(data => {
                    this.grids = data.grids
                    this.maxAllowed = data.maxAllowed
                })
                .catch(err => ModalController.showError(err))
        },
        refreshPool() {
            sqmgrClient.getPoolByToken(this.token)
                .then(data => {
                    this.pool = data
                })
                .catch(err => ModalController.showError(err))
        },
        async handleCopied(event) {
            this.showCopiedMessage = true

            await this.$nextTick()
            const rect = event.target.getBoundingClientRect()
            this.$refs.copied.style.position = 'absolute'
            this.$refs.copied.style.top = `${rect.bottom + window.scrollY}px`
            this.$refs.copied.style.left = `${rect.x + window.scrollX}px`

            setTimeout(() => this.showCopiedMessage = false, 1000)
        },
        createGrid() {
            ModalController.show('Customize Grid', GridCustomize, {
                token: this.token,
                pool: this.pool,
            }, {
                'saved': grid => {
                    ModalController.hide()
                    this.grids.push(grid)
                },
            })
        },
        customizeGrid(grid) {
            sqmgrClient.getPoolGridByTokenAndGridId(this.token, grid.id)
                .then(grid => {
                    ModalController.show('Customize Grid', GridCustomize, {
                        grid,
                        token: this.token,
                        pool: this.pool,
                    }, {
                        'saved': grid => {
                            ModalController.hide()
                            let index = -1
                            for (let i = 0; i < this.grids.length; i++) {
                                if (this.grids[i].id === grid.id) {
                                    index = i
                                }
                            }

                            if (index >= 0) {
                                this.grids.splice(index, 1, grid)
                            }
                        },
                    })

                })
        },
        confirmDelete(grid) {
            ModalController.showPrompt('Are you sure?', `Do you really want to delete "${grid.name}"`, {
                actionButton: 'Delete It',
                action: () => {
                    sqmgrClient.deletePoolGridByTokenAndGridId(this.token, grid.id)
                        .then(() => {
                            const index = this.grids.indexOf(grid)
                            if (index >= 0) {
                                this.grids.splice(index, 1)
                            }
                            ModalController.hide()
                        })
                        .catch(err => ModalController.showError(err))
                },
            })

            return false
        },
        ymd(eventDate) {
            const d = Common.NewDateWithoutTimezone(eventDate)
            if (d.getFullYear() <= 1) {
                return ''
            }

            return d.toLocaleDateString(Common.DateOptions)
        },
        change() {
            sqmgrClient.reorderGrids(this.token, this.grids.map(g => g.id))
                .catch(err => ModalController.showError(err))
        },
    },
}
</script>

<style scoped lang="scss">
@use '../../variables.scss' as *;

// Pool Header
.pool-header {
    display:         flex;
    align-items:     center;
    justify-content: space-between;
    margin-bottom:   $space-6;
    gap:             $space-4;
    flex-wrap:       wrap;

    h1 {
        margin:    0;
        font-size: 2rem;
    }
}

.pool-status {
    display:       inline-flex;
    align-items:   center;
    gap:           $space-2;
    padding:       $space-2 $space-4;
    border-radius: $radius-full;
    font-size:     0.875rem;
    font-weight:   600;
    background:    rgba($primary, 0.1);
    color:         $primary-dark;

    &.locked {
        background: rgba($red, 0.1);
        color:      $red;
    }

    i {
        font-size: 0.875rem;
    }
}

// Pool Body Layout
.pool-body.multi-grid {
    display:               grid;
    grid-gap:              var(--spacing);
    grid-template-columns: 3fr 1fr;
    align-items:           start;

    @include tablet {
        display: block;

        > * {
            margin-bottom: var(--spacing);
        }

        > *:last-child {
            margin-bottom: 0;
        }
    }
}

// Embedded pool settings card (inside PoolGrid sidebar slot)
.pool-settings-card {
    margin-bottom: $space-5;
}

// Card Styles
.card {
    @include card-base($radius-xl);
    overflow: hidden;
}

.card-header {
    @include card-header;
    justify-content: space-between;

    h2 {
        margin:    0;
        font-size: 1.25rem;
    }
}

.games-in-pool {
    .card-footer {
        text-align: right;
    }
}

.card-footer {
    @include card-footer;
}

.game-count {
    font-size:     0.875rem;
    color:         $text-secondary;
    background:    $light-gray;
    padding:       $space-1 $space-3;
    border-radius: $radius-full;
}

// Games Grid
.grids {
    margin: 0;
}

div.grid-row {
    align-items:           center;
    display:               grid;
    grid-template-columns: 30px 1fr 100px;
    gap:                   $space-3;
    padding:               $space-3 $space-5;
    transition:            background-color var(--transition-fast);

    &:not(.header):hover {
        background-color: rgba($primary, 0.03);
    }

    &:not(.header):not(:last-child) {
        border-bottom: 1px solid $light-gray;
    }

    &:not(.header) div.event-date {
        font-size: 0.875rem;
    }

    &.header {
        font-weight:    600;
        font-size:      0.8125rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color:          $text-secondary;
        background:     #fafafa;
        border-bottom:  1px solid $light-gray;
        padding:        $space-3 $space-5;

        div.game {
            grid-column: 2;
        }
    }

    a.game {
        font-weight: 600;
        color:       $text-color;
        transition:  color var(--transition-fast);

        &:hover {
            color:           $primary;
            text-decoration: none;
        }
    }

    div.rollover {
        text-align: center;

        & > span {
            color: $text-secondary;
        }
    }

    div.event-date {
        color: $text-secondary;
    }

    span.unknown {
        color:      $gray;
        font-style: italic;
    }
}

.handle {
    color:           $gray;
    cursor:          grab;
    display:         flex;
    align-items:     center;
    justify-content: center;
    width:           24px;
    height:          24px;
    border-radius:   $radius-sm;
    transition:      all var(--transition-fast);

    &:hover {
        color:      $dark-gray;
        background: $light-gray;
    }

    &:active {
        cursor: grabbing;
    }
}

span.index {
    text-align: right;
    color:      $text-secondary;
    font-size:  0.875rem;

    &::after {
        content: '.';
    }
}

// Icon Buttons
.icon-btn {
    @include icon-btn;

    &.destructive {
        &:hover {
            background: rgba($red, 0.1);
            color:      $red;
        }
    }

    &.secondary {
        border-color: $light-gray;
    }
}

div.actions {
    display:         flex;
    gap:             $space-1;
    justify-content: flex-end;
}

// Admin Layout
.admin {
    div.grid-row {
        grid-template-columns: 24px 30px 1fr 100px 75px;

        &.header {
            div.game {
                grid-column: 3 / span 1;
            }

            div.event-date {
                grid-column: 4 / span 1;
            }
        }

        @include mobile {
            grid-template-columns: 24px 3ch 1fr 1fr;
            row-gap:               0;

            .handle {
                grid-column-start: 1;
                grid-row:          1 / span 2;
            }
            .index {
                grid-column-start: 2;
                grid-row:          1 / span 2;
            }
            &.header .game {
                grid-row-start:    1;
                grid-column-start: 1;
            }
            .game {
                grid-column: 3 / span 2;
            }

            &.header .event-date {
                grid-row-start:    1;
                grid-column-start: 3 / span 2;
            }
            .event-date {
                grid-column-start: 3;
                align-self:        start;
            }
            .actions {
                grid-column-start: 4;
            }
        }
    }
}

// Rollover Layout
section.rollover {
    div.grid-row {
        grid-template-columns: 30px 1fr 80px 100px;

        &.header .game {
            grid-column: 2;
        }

        @include mobile {
            grid-template-columns: 25px 1fr auto;
            row-gap:               0;

            &.header {
                .game {
                    grid-column: 2;
                }

                .rollover {
                    grid-column: 3;
                }

                .event-date {
                    grid-column: 2;
                }
            }

            .index {
                grid-row:    1;
                grid-column: 1;
            }
            .game {
                grid-row:    1;
                grid-column: 2;
            }
            .rollover {
                grid-row:    1;
                grid-column: 3;
            }
            .event-date {
                grid-row:    2;
                grid-column: 2;
            }


        }

    }

    &.admin {
        div.grid-row {
            grid-template-columns: 24px 3ch 1fr 100px 100px 75px;

            &.header {
                & > * {
                }

                .game {
                    grid-column: 3;
                }

                .rollover {
                    grid-column: 4;
                }

                .event-date {
                    grid-column: 5;
                }

            }

            @include mobile {
                grid-template-columns: 24px 3ch 1fr auto;

                &.header {
                    .rollover {
                        grid-column: 4;
                    }

                    .event-date {
                        grid-column: 3;
                    }
                }

                .handle {
                    grid-row:    1 / span 2;
                    grid-column: 1;
                }

                .index {
                    grid-row:    1 / span 2;
                    grid-column: 2;
                }

                .game {
                    grid-column: 3;
                }

                .event-date {
                    grid-row:    2;
                    grid-column: 3;
                    align-self:  start;
                }

                .rollover {
                    grid-row:    1;
                    grid-column: 4;
                }

                .actions {
                    grid-row:    2;
                    grid-column: 4;
                }
            }
        }
    }
}

// Empty State
.empty-state {
    @include empty-state;
}

// Get Started CTA
.get-started {
    padding:    $space-4 $space-5;
    background: linear-gradient(135deg, rgba($primary, 0.05) 0%, rgba($primary, 0.1) 100%);
    border-top: 1px solid rgba($primary, 0.15);
    text-align: center;

    strong {
        display:       block;
        margin-bottom: $space-1;
        color:         $primary-dark;
    }

    p {
        margin:    0;
        font-size: 0.875rem;
        color:     $text-secondary;
    }

    .get-started-actions {
        display:         flex;
        gap:             $space-3;
        margin-top:      $space-3;
        align-items:     center;
        justify-content: center;
    }
}

// Copied Toast
div.copied {
    background:    $primary;
    color:         #fff;
    padding:       $space-2 $space-4;
    border-radius: $radius-md;
    font-size:     0.875rem;
    font-weight:   500;
    box-shadow:    var(--shadow-lg);
    z-index:       1000;
}

.copied-enter-active,
.copied-leave-active {
    transition: all 0.3s ease;
}

.copied-enter-from,
.copied-leave-to {
    opacity:   0;
    transform: translateY(-8px);
}

@media print {
    .pool-header { display: none; }
    .pool-settings { display: none; }
    div.copied { display: none; }
}
</style>