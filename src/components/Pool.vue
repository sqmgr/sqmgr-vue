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
    <section class="pool" :class="{ admin: this.pool.isAdmin, rollover }">
        <template v-if="pool">
            <div class="pool-header">
                <h1>{{ this.pool.name }}</h1>
                <div class="pool-status" :class="{ locked: isLocked }">
                    <i :class="isLocked ? 'fas fa-lock' : 'fas fa-lock-open'"></i>
                    <span>{{ isLocked ? 'Locked' : 'Open' }}</span>
                </div>
            </div>

            <div class="columns">
                <div class="col-3">
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
                                            <span class="fas fa-dice" v-if="grid.rollover" title="Rollover enabled"></span>
                                        </div>

                                        <div class="event-date">
                                            <span v-if="ymd(grid.eventDate)">{{ ymd(grid.eventDate) }}</span>
                                            <span v-else class="unknown">Not set</span>
                                        </div>

                                        <div v-if="pool.isAdmin" class="actions">
                                            <button type="button" class="icon-btn" @click.prevent="customizeGrid(grid)" title="Customize">
                                                <i class="fas fa-cog"></i>
                                            </button>
                                            <button type="button" class="icon-btn destructive" @click.prevent="confirmDelete(grid)" title="Delete">
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

                        <div class="card-footer" v-if="pool.isAdmin">
                            <button :disabled="!canAddGame" type="button" @click.prevent="createGrid">
                                <i class="fas fa-plus"></i> Add Game
                            </button>
                        </div>
                    </div>
                </div>

                <div class="col-1">
                    <div class="card settings-card">
                        <div class="card-header">
                            <h2>Pool Settings</h2>
                        </div>

                        <div class="settings-list">
                            <div class="setting-item">
                                <label>Name</label>
                                <div class="setting-value">
                                    <template v-if="editPoolName">
                                        <form class="inline-edit" @submit.prevent="poolNameUpdate">
                                            <input class="pool-name" ref="poolName" type="text" v-model="pool.name"
                                                   @keydown="poolNameKeyDown"
                                                   placeholder="Squares Pool Name"/>
                                            <div class="inline-edit-actions">
                                                <button type="button" class="icon-btn secondary" @click.prevent="undoEditPoolName">
                                                    <i class="fas fa-times"></i>
                                                </button>
                                                <button type="submit" class="icon-btn">
                                                    <i class="fas fa-check"></i>
                                                </button>
                                            </div>
                                        </form>
                                    </template>
                                    <template v-else>
                                        <span class="pool-name-display">{{ pool.name }}</span>
                                        <button v-if="pool.isAdmin" class="edit-link" @click.prevent="editPoolName=true">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </template>
                                </div>
                            </div>

                            <div class="setting-item">
                                <label>Token</label>
                                <div class="setting-value">
                                    <code class="token">{{ token }}</code>
                                </div>
                            </div>

                            <div class="setting-item" v-if="pool.isAdmin">
                                <label>Invite Link</label>
                                <div class="setting-value">
                                    <button type="button" class="sm" v-if="inviteToken" @click="copyInviteLink">
                                        <i class="fas fa-copy"></i> Copy Link
                                    </button>
                                </div>
                            </div>

                            <div class="setting-item" v-if="pool.isAdmin">
                                <label>Join Password</label>
                                <div class="setting-value">
                                    <button type="button" class="sm secondary" @click="changeJoinPassword">
                                        <i class="fas fa-key"></i> Change
                                    </button>
                                </div>
                            </div>

                            <div class="setting-item">
                                <label>Grid Type</label>
                                <div class="setting-value">
                                    <span class="badge">{{ pool.gridType }}</span>
                                </div>
                            </div>

                            <div class="setting-item">
                                <label>Claimed Squares</label>
                                <div class="setting-value">
                                    <div class="progress-info">
                                        <span class="progress-text">{{ claimed }} of {{ total }}</span>
                                        <div class="progress-bar">
                                            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="setting-item">
                                <label>State</label>
                                <div class="setting-value">
                                    <span class="status-badge" :class="{ locked: isLocked, open: !isLocked }">
                                        <i :class="isLocked ? 'fas fa-lock' : 'fas fa-lock-open'"></i>
                                        {{ isLocked ? `Locked (${date(pool.locks, false)})` : 'Open' }}
                                    </span>
                                </div>
                            </div>

                            <div class="setting-item" v-if="pool.isAdmin">
                                <label>Password Required?</label>
                                <div class="setting-value">
                                    <div class="radio-group">
                                        <label class="radio-label">
                                            <input type="radio" v-model="pool.passwordRequired" :value="true"> Yes
                                        </label>
                                        <label class="radio-label">
                                            <input type="radio" v-model="pool.passwordRequired" :value="false"> No
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="setting-item" v-if="pool.isAdmin">
                                <label>Password Required if Locked?</label>
                                <div class="setting-value">
                                    <div class="radio-group">
                                        <label class="radio-label" :class="{ disabled: !pool.passwordRequired }">
                                            <input type="radio" v-model="pool.openAccessOnLock" :value="false"
                                                   :disabled="!pool.passwordRequired"> Yes
                                        </label>
                                        <label class="radio-label" :class="{ disabled: !pool.passwordRequired }">
                                            <input type="radio" v-model="pool.openAccessOnLock" :value="true"
                                                   :disabled="!pool.passwordRequired"> No
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="setting-item">
                                <label>Created</label>
                                <div class="setting-value">
                                    <span class="date-text">{{ date(pool.created, true) }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="card-footer" v-if="pool.isAdmin">
                            <button v-if="isLocked" type="button" class="secondary" @click="unlockSquares">
                                <i class="fas fa-lock-open"></i> Open Squares
                            </button>
                            <button v-else type="button" @click="lockSquares">
                                <i class="fas fa-lock"></i> Lock Squares
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <div class="help-card">
            <div class="help-icon">
                <i class="fas fa-lightbulb"></i>
            </div>
            <div class="help-content">
                <h3>How it works</h3>
                <p>SqMGR allows you to create multiple games or events within a single squares pool. People will claim a square
                    and then use that same square for all games in the pool. Each game will draw unique numbers.</p>
                <p>For example, Ted might claim square 5 for an entire football season, but each week he'll have a different set
                    of numbers for that square (e.g., 0 and 7 for week 1, 8 and 8 for week 2, etc.).</p>
            </div>
        </div>

        <transition name="copied">
            <div ref="copied" class="copied" v-if="showCopiedMessage">Copied!</div>
        </transition>
    </section>
</template>

<script>
import sqmgrClient from "@/models/sqmgrClient"
import GridCustomize from '@/components/GridCustomize'
import Common from '@/common'
import draggable from 'vuedraggable'
import ModalController from "@/controllers/ModalController"
import toClipboard from "@/utils/toClipboard"
import ManageMembership from "@/components/ManageMembership"

export default {
    name: "Pool",
    components: {draggable},
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
    data() {
        return {
            editPoolName: false,
            origPoolName: null,
            pool: this.initialPool,
            grids: [],
            inviteToken: null,
            showCopiedMessage: false,
            squares: null,

            // maximum number of grids per pool
            maxAllowed: 0,
        }
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

        sqmgrClient.getPoolSquares(this.token)
            .then(squares => this.squares = squares)

        if (this.pool.isAdmin) {
            this.getInviteToken()
        }
    },
    computed: {
        claimed() {
            const total = this.squares ? Object.values(this.squares).filter(s => s.state !== 'unclaimed').length : 0

            if (this.pool.gridType === 'roll100') {
                return total / 2
            }

            return total
        },
        total() {
            const total = this.squares ? Object.values(this.squares).length : 0

            if (this.pool.gridType === 'roll100') {
                return total / 2
            }

            return total
        },
        progressPercent() {
            if (this.total === 0) return 0
            return Math.round((this.claimed / this.total) * 100)
        },
        isLocked() {
            const locks = new Date(this.pool.locks)
            return locks.getFullYear() > 1 && locks.getTime() < new Date().getTime()
        },
        canAddGame() {
            return this.maxAllowed > this.grids.length
        },
        rollover() {
            return this.pool.gridType === 'roll100'
        },
        openAccessOnLock() {
            return this.pool.openAccessOnLock
        },
        passwordRequired() {
            return this.pool.passwordRequired
        },
    },
    watch: {
        editPoolName(newVal) {
            if (newVal) {
                this.origPoolName = this.pool.name
                this.$nextTick()
                    .then(() => this.$refs.poolName.select())
            }
        },
        passwordRequired(newVal) {
            sqmgrClient.setPasswordRequiredForPool(this.token, newVal)
                .catch(err => ModalController.showError(err))
        },
        openAccessOnLock(newVal) {
            sqmgrClient.setOpenAccessOnLockForPool(this.token, newVal)
                .catch(err => ModalController.showError(err))
        },
    },
    methods: {
        changeJoinPassword() {
            ModalController.show('Manage Membership', ManageMembership, {
                    pool: this.pool,
                },
                {
                    updated: () => {
                        this.getInviteToken()
                    },
                })
        },
        getInviteToken() {
            sqmgrClient.getPoolInviteToken(this.token)
                .then(res => this.inviteToken = res.jwt)
                .catch(err => ModalController.showError(err))
        },
        undoEditPoolName() {
            this.pool.name = this.origPoolName
            this.editPoolName = false
        },
        poolNameUpdate() {
            if (this.pool.name === '') {
                this.undoEditPoolName()
                return
            }

            sqmgrClient.renamePool(this.pool.token, this.pool.name)
                .then(() => {
                    this.editPoolName = false
                })
                .catch(err => ModalController.showError(err))
        },
        poolNameKeyDown(event) {
            if (event.key === 'Escape') {
                this.undoEditPoolName()
            }
        },
        async copyInviteLink(event) {
            const url = this.pool.passwordRequired ? `${window.location.origin}/pool/${this.token}/join#${this.inviteToken}` : `${window.location.origin}/pool/${this.token}`
            toClipboard(url)

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
        date(date, includeTime) {
            const d = new Date(date)
            if (d.getFullYear() <= 1) {
                return ''
            }

            return includeTime ? d.toLocaleString(Common.DateTimeOptions) : d.toLocaleDateString(Common.DateTimeOptions)
        },
        unlockSquares() {
            const promptOpts = {
                actionButton: "Unlock Squares",
                action: () => {
                    ModalController.hide()

                    sqmgrClient.unlockPool(this.token)
                        .then(pool => this.pool = pool)
                        .catch(err => ModalController.showError(err))
                },
            }

            ModalController.showPrompt("Unlock the squares?", "Are you sure you want to open the squares back up again for users to claim?", promptOpts)
        },
        lockSquares() {
            sqmgrClient.getPoolSquares(this.token)
                .then(squares => {
                    this.squares = squares
                    const promptOpts = {
                        actionButton: "Lock Squares",
                        action: () => {
                            ModalController.hide()

                            sqmgrClient.lockPool(this.token)
                                .then(pool => this.pool = pool)
                                .catch(err => ModalController.showError(err))
                        },
                    }

                    const unclaimedSquares = Object.values(squares).filter(s => s.state === 'unclaimed')
                    if (unclaimedSquares.length > 0) {
                        promptOpts.warning = "There are still unclaimed squares."
                    }

                    ModalController.showPrompt("Lock the squares?", "Are you sure you want to lock the squares? Users will no longer be allowed to claim any open squares.", promptOpts)
                })
                .catch(err => ModalController.showError(err))

        },
        change() {
            sqmgrClient.reorderGrids(this.token, this.grids.map(g => g.id))
                .catch(err => ModalController.showError(err))
        },
    },
}
</script>

<style scoped lang="scss">
@use '../variables.scss' as *;

// Pool Header
.pool-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $space-6;
    gap: $space-4;
    flex-wrap: wrap;

    h1 {
        margin: 0;
        font-size: 2em;
    }
}

.pool-status {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    padding: $space-2 $space-4;
    border-radius: $radius-full;
    font-size: 0.875em;
    font-weight: 600;
    background: rgba($primary, 0.1);
    color: $primary-dark;

    &.locked {
        background: rgba($red, 0.1);
        color: $red;
    }

    i {
        font-size: 0.875em;
    }
}

// Card Styles
.card {
    background: #fff;
    border: 1px solid $light-gray;
    border-radius: $radius-xl;
    box-shadow: var(--shadow-sm);
    overflow: hidden;
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $space-4 $space-5;
    border-bottom: 1px solid $light-gray;
    background: linear-gradient(180deg, #fafafa 0%, #fff 100%);

    h2 {
        margin: 0;
        font-size: 1.25em;
    }
}

.card-footer {
    padding: $space-4 $space-5;
    border-top: 1px solid $light-gray;
    background: #fafafa;
}

.game-count {
    font-size: 0.875em;
    color: $text-secondary;
    background: $light-gray;
    padding: $space-1 $space-3;
    border-radius: $radius-full;
}

// Games Grid
.grids {
    margin: 0;
}

div.grid-row {
    align-items: center;
    display: grid;
    grid-template-columns: 30px 1fr 100px;
    gap: $space-3;
    padding: $space-3 $space-5;
    transition: background-color var(--transition-fast);

    &:not(.header):hover {
        background-color: rgba($primary, 0.03);
    }

    &:not(.header):not(:last-child) {
        border-bottom: 1px solid $light-gray;
    }

    &.header {
        font-weight: 600;
        font-size: 0.8125em;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: $text-secondary;
        background: #fafafa;
        border-bottom: 1px solid $light-gray;
        padding: $space-3 $space-5;

        div.game {
            grid-column: 1 / span 2;
        }
    }

    a.game {
        font-weight: 600;
        color: $text-color;
        transition: color var(--transition-fast);

        &:hover {
            color: $primary;
            text-decoration: none;
        }
    }

    div.rollover {
        text-align: center;
        color: $primary;
    }

    div.event-date {
        font-size: 0.875em;
        color: $text-secondary;
    }

    span.unknown {
        color: $gray;
        font-style: italic;
    }
}

.handle {
    color: $gray;
    cursor: grab;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: $radius-sm;
    transition: all var(--transition-fast);

    &:hover {
        color: $dark-gray;
        background: $light-gray;
    }

    &:active {
        cursor: grabbing;
    }
}

span.index {
    text-align: right;
    color: $text-secondary;
    font-size: 0.875em;

    &::after {
        content: '.';
    }
}

// Icon Buttons
.icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border-radius: $radius-md;
    background: transparent;
    color: $text-secondary;
    border: 1px solid transparent;
    box-shadow: none;
    min-height: auto;
    transition: all var(--transition-fast);

    &:hover {
        background: $light-gray;
        color: $text-color;
        transform: none;
        box-shadow: none;
    }

    &.destructive {
        &:hover {
            background: rgba($red, 0.1);
            color: $red;
        }
    }

    &.secondary {
        border-color: $light-gray;
    }
}

div.actions {
    display: flex;
    gap: $space-1;
    justify-content: flex-end;
}

// Admin Layout
.admin {
    div.grid-row {
        grid-template-columns: 24px 30px 1fr 100px auto;

        &.header {
            div.game {
                grid-column: 2 / span 2;
            }
        }

        @include mobile {
            display: block;
            position: relative;
            padding: $space-4 $space-4;

            &.header {
                display: none;
            }

            .handle {
                position: absolute;
                left: $space-2;
                top: 50%;
                transform: translateY(-50%);
            }

            .index {
                display: inline;
                margin-left: $space-8;
            }

            a.game {
                display: inline;
            }

            .event-date {
                display: block;
                margin-top: $space-2;
                margin-left: $space-8;
            }

            .rollover {
                position: absolute;
                right: $space-4;
                top: $space-4;
            }

            .actions {
                margin-top: $space-3;
                margin-left: $space-8;
            }
        }
    }
}

// Rollover Layout
section.rollover {
    div.grid-row {
        grid-template-columns: 30px 1fr 80px 100px;

        &.header div.game {
            grid-column: 1 / span 2;
        }
    }

    &.admin div.grid-row {
        grid-template-columns: 24px 30px 1fr 80px 100px auto;

        &.header div.game {
            grid-column: 2 / span 2;
        }
    }
}

// Empty State
.empty-state {
    padding: $space-10 $space-5;
    text-align: center;
    color: $text-secondary;

    i {
        font-size: 2.5em;
        color: $gray;
        margin-bottom: $space-4;
    }

    p {
        margin: 0;
        font-size: 0.9375em;
    }
}

// Settings Card
.settings-list {
    padding: $space-2 0;
}

.setting-item {
    display: flex;
    align-items: flex-start;
    padding: $space-3 $space-5;
    gap: $space-4;
    transition: background-color var(--transition-fast);

    &:hover {
        background-color: #fafafa;
    }

    & > label {
        flex: 0 0 140px;
        font-size: 0.875em;
        color: $text-secondary;
        padding-top: $space-1;
    }

    .setting-value {
        flex: 1;
        display: flex;
        align-items: center;
        gap: $space-2;
        min-height: 32px;
    }
}

.pool-name-display {
    font-weight: 500;
}

.edit-link {
    background: transparent;
    border: none;
    box-shadow: none;
    color: $gray;
    padding: $space-1;
    min-height: auto;
    cursor: pointer;

    &:hover {
        color: $primary;
        background: transparent;
        transform: none;
        box-shadow: none;
    }
}

code.token {
    background: $light-gray;
    padding: $space-1 $space-2;
    border-radius: $radius-sm;
    font-size: 0.875em;
    font-family: monospace;
}

.badge {
    display: inline-block;
    padding: $space-1 $space-3;
    background: $light-gray;
    border-radius: $radius-full;
    font-size: 0.8125em;
    font-weight: 500;
    text-transform: uppercase;
}

// Progress Bar
.progress-info {
    width: 100%;
    max-width: 200px;
}

.progress-text {
    font-size: 0.875em;
    font-weight: 500;
    display: block;
    margin-bottom: $space-1;
}

.progress-bar {
    height: 6px;
    background: $light-gray;
    border-radius: $radius-full;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, $primary-light 0%, $primary 100%);
    border-radius: $radius-full;
    transition: width var(--transition-slow);
}

// Status Badge
.status-badge {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    padding: $space-1 $space-3;
    border-radius: $radius-full;
    font-size: 0.8125em;
    font-weight: 500;

    &.open {
        background: rgba($primary, 0.1);
        color: $primary-dark;
    }

    &.locked {
        background: rgba($red, 0.1);
        color: $red;
    }

    i {
        font-size: 0.875em;
    }
}

// Radio Group
.radio-group {
    display: flex;
    gap: $space-4;
}

.radio-label {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    font-size: 0.875em;
    cursor: pointer;

    &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    input[type="radio"] {
        margin: 0;
    }
}

.date-text {
    font-size: 0.875em;
    color: $text-secondary;
}

// Inline Edit
.inline-edit {
    display: flex;
    align-items: center;
    gap: $space-2;
    width: 100%;

    input.pool-name {
        flex: 1;
        padding: $space-2 $space-3;
        border: 1px solid $border-color;
        border-radius: $radius-md;
        font-size: 0.9375em;

        &:focus {
            outline: none;
            border-color: $primary;
            box-shadow: 0 0 0 3px rgba($primary, 0.1);
        }
    }
}

.inline-edit-actions {
    display: flex;
    gap: $space-1;
}

// Help Card
.help-card {
    display: flex;
    gap: $space-5;
    padding: $space-5;
    margin-top: $space-6;
    background: linear-gradient(135deg, rgba($primary, 0.03) 0%, rgba($primary, 0.08) 100%);
    border: 1px solid rgba($primary, 0.15);
    border-radius: $radius-xl;

    @include mobile {
        flex-direction: column;
        text-align: center;
    }
}

.help-icon {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $primary;
    color: #fff;
    border-radius: $radius-lg;
    font-size: 1.25em;

    @include mobile {
        margin: 0 auto;
    }
}

.help-content {
    h3 {
        margin: 0 0 $space-3;
        font-size: 1.125em;
        color: $primary-dark;
    }

    p {
        margin: 0 0 $space-3;
        color: $text-secondary;
        font-size: 0.9375em;
        line-height: 1.6;

        &:last-child {
            margin-bottom: 0;
        }
    }
}

// Copied Toast
div.copied {
    background: $primary;
    color: #fff;
    padding: $space-2 $space-4;
    border-radius: $radius-md;
    font-size: 0.875em;
    font-weight: 500;
    box-shadow: var(--shadow-lg);
    z-index: 1000;
}

.copied-enter-active,
.copied-leave-active {
    transition: all 0.3s ease;
}

.copied-enter-from,
.copied-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}

// Responsive adjustments
@include tablet {
    .pool-header h1 {
        font-size: 1.5em;
    }

    .setting-item {
        flex-direction: column;
        gap: $space-2;

        & > label {
            flex: none;
        }
    }
}
</style>