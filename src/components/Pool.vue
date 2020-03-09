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
            <h1>Squares Pool - {{ this.pool.name }}</h1>

            <div class="columns">
                <div class="col-3">
                    <h2>Games in Pool</h2>

                    <div class="grids">
                        <div class="grid-row header">
                            <div class="game">Game</div>
                            <div class="rollover" v-if="rollover">Rollover</div>
                            <div class="event-date">Event Date</div>
                        </div>

                        <draggable v-model="grids" @start="drag=true" @end="drag=false" :disabled="!pool.isAdmin"
                                   handle=".handle" @change="change">
                            <div class="grid-row" v-for="(grid, i) in grids" :key="grid.id">
                                <span v-if="pool.isAdmin" class="handle"><i
                                        class="fas fa-bars"></i> <span>=</span></span>

                                <span class="index">{{ i + 1 }}</span>

                                <router-link class="game" :to="`/pool/${token}/game/${grid.id}`">
                                    {{grid.name}}
                                </router-link>

                                <div class="rollover" v-if="rollover">
                                    <span class="fas fa-dice" v-if="grid.rollover"></span>
                                </div>

                                <div class="event-date">
                                    <span v-if="ymd(grid.eventDate)">{{ ymd(grid.eventDate) }}</span>
                                    <span v-else class="unknown">0/0/0000</span>
                                </div>

                                <div v-if="pool.isAdmin" class="actions">
                                    <button type="button" class="icon" @click.prevent="customizeGrid(grid)"><i
                                            class="fas fa-cog"></i><span>Customize</span></button>
                                    <button type="button" class="icon destructive" @click.prevent="confirmDelete(grid)">
                                        <span>Delete</span><i
                                            class="fas fa-trash-alt"></i></button>
                                </div>
                            </div>
                        </draggable>
                    </div>

                    <div class="buttons" v-if="pool.isAdmin">
                        <button :disabled="!canAddGame" type="button" @click.prevent="createGrid">Add Game</button>
                    </div>
                </div>

                <div class="col-1">
                    <h2>Pool Settings</h2>

                    <table class="pool-settings">
                        <tbody>
                        <tr>
                            <td>Name</td>
                            <td>
                                <template v-if="editPoolName">
                                    <form class="standalone" @submit.prevent="poolNameUpdate">
                                        <input class="pool-name" ref="poolName" type="text" v-model="pool.name"
                                               @keydown="poolNameKeyDown"
                                               placeholder="Squares Pool Name"/>
                                        <div class="buttons">
                                            <button type="button" class="small secondary"
                                                    @click.prevent="undoEditPoolName"><i class="fas fa-times"></i>
                                            </button>
                                            <button type="submit" class="small"><i class="fas fa-check"></i></button>
                                        </div>
                                    </form>
                                </template>
                                <template v-else>
                                    <div class="pool-name">
                                        {{ pool.name }} <a v-if="pool.isAdmin" class="edit" href="#"
                                                           @click.prevent="editPoolName=true"><i
                                            class="fas fa-edit"></i>
                                        <span>Edit</span></a>
                                    </div>
                                </template>
                            </td>
                        </tr>
                        <tr>
                            <td>Token</td>
                            <td>{{ token }}</td>
                        </tr>
                        <tr v-if="pool.isAdmin">
                            <td>Invite Link</td>
                            <td>
                                <button type="button" v-if="inviteToken" @click="copyInviteLink"><i
                                        class="fas fa-copy"></i> Copy
                                </button>
                            </td>
                        </tr>
                        <tr v-if="pool.isAdmin">
                            <td>Join Password</td>
                            <td>
                                <button type="button" @click="changeJoinPassword"><i class="fas fa-key"></i> Change
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>Grid Type</td>
                            <td>{{ pool.gridType }}</td>
                        </tr>
                        <tr>
                            <td>Claimed Squares</td>
                            <td>{{ claimed }} of {{ total }}</td>
                        </tr>
                        <tr>
                            <td>State</td>
                            <td>
                                <template v-if="isLocked">
                                    <i class="fas fa-lock"></i> Locked ({{ date(pool.locks, false) }})<br>

                                </template>
                                <template v-else>
                                    <i class="fas fa-lock-open"></i> Open<br>
                                </template>
                            </td>
                        </tr>
                        <tr v-if="pool.isAdmin">
                            <td>Password Required if Locked?</td>
                            <td>
                                <label>
                                    <input type="radio" v-model="pool.openAccessOnLock" :value="false"> Yes
                                </label>
                                <label>
                                    <input type="radio" v-model="pool.openAccessOnLock" :value="true"> No
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>Created</td>
                            <td>{{ date(pool.created, true) }}</td>
                        </tr>
                        </tbody>
                    </table>

                    <div class="buttons" v-if="pool.isAdmin">
                        <button v-if="isLocked" type="button" @click="unlockSquares">Open Squares</button>
                        <button v-else type="button" @click="lockSquares">Lock Squares</button>
                    </div>
                </div>
            </div>
        </template>

        <h2>Help</h2>

        <p>SqMGR allows you to create multiple games or events within a single squares pool. People will claim a square
            and then use that same square for all games in the pool. Each game will draw unique numbers.</p>

        <p>For example, Ted might claim square 5 for an entire football season, but each week he'll have a different set
            of numbers for that square (e.g., 0 and 7 for week 1, 8 and 8 for week 2, etc.).</p>

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
        },
        watch: {
            editPoolName(newVal) {
                if (newVal) {
                    this.origPoolName = this.pool.name
                    this.$nextTick()
                        .then(() => this.$refs.poolName.select())
                }
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
                const url = `${window.location.origin}/pool/${this.token}/join#${this.inviteToken}`
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
    @import '../variables.scss';

    button.icon span {
        display: none;
    }

    .handle {
        color:  #aaa;
        cursor: move;

        span {
            display: none;
        }
    }

    table, div.grids {
        margin-bottom: $standard-spacing;
    }

    div.grid-row {
        align-items:           center;
        display:               grid;
        /* handle | game |date */
        grid-template-columns: 30px 1fr 100px;
        grid-gap:              calc(2 * #{ $minimal-spacing });
        padding:               calc(2 * #{ $minimal-spacing });

        div.rollover {
            text-align: center;
        }

        &:not(.header) {
            border-bottom: 1px solid var(--border-color);
        }

        &:nth-child(odd) {
            background-color: var(--light-gray);
        }

        &.header {
            font-weight:      bold;
            background-color: var(--midnight-gray);
            color:            #fff;

            & > div {
                justify-self: stretch;
            }

            div.game {
                grid-column: 1 / span 2;
            }
        }

        span.unknown {
            color: var(--gray);
        }
    }

    .admin {
        div.grid-row {
            /* Handle | Number | Game | Date | Buttons */
            grid-template-columns: 40px 30px 1fr 100px 130px;

            & > :first-child {
                justify-self: center;
            }

            div.actions {
                text-align: right;

                button {
                    margin-left: var(--minimal-spacing);

                    &:first-child {
                        margin: 0;
                    }
                }
            }

            &.header {
                & > div {
                    justify-self: stretch;
                }

                div.game {
                    grid-column: 2 / span 2;
                }
            }

            @media(max-width: 600px) {
                display:  block;
                position: relative;

                &.header {
                    & > * {
                        display: none;
                    }

                    & > div.game {
                        display: block;
                    }
                }

                & > .index {
                    margin-left: var(--spacing);
                }

                & > .index {
                    text-align: left;
                }

                & > .event-date {
                    text-align: right;
                }

                & > .rollover {
                    position: absolute;
                    bottom:   var(--minimal-spacing);
                    left:     var(--minimal-spacing);
                }

                & > .actions {
                    margin-top: var(--spacing);
                }
            }
        }
    }

    table.pool-settings {
        width: 100%;

        td:first-child {
            width: 105px;
        }
    }

    div.copied {
        background-color: $primary;
        color:            #fff;
        padding:          $minimal-spacing;
    }

    .copied-enter-active, .copied-leave-active {
        transition: all 0.5s;
    }

    .copied-enter, .copied-leave-to {
        opacity: 0;
    }

    .copied-enter {
        transform: translateY(-1em);
    }

    a.edit {
        margin-left: $minimal-spacing;

        span {
            display: none;
        }
    }

    form.standalone {
        position: relative;

        div.buttons {
            padding:          $minimal-spacing;
            box-shadow:       0 1px 2px rgba(black, 0.4);
            background-color: #fff;
            border-radius:    0 0 3px 3px;
            text-align:       right;
            position:         absolute;
            right:            3px;

            button {
                margin-left: $minimal-spacing;

                &:first-child {
                    margin-left: 0;
                }
            }
        }
    }

    div.pool-name {
        padding: $minimal-spacing 0;
        border:  1px solid transparent;
    }

    input.pool-name {
        margin-left: calc(-1 * #{$minimal-spacing});
        width:       calc(100% + #{$minimal-spacing});
    }

    span.index {
        text-align: right;

        &::after {
            content: '.';
        }
    }

    section.rollover {
        div.grid-row {
            /* number | game | rollover | date */
            grid-template-columns: 30px 1fr 100px 100px;
        }

        &.admin {
            div.grid-row {
                /* Handle | Number | Game | Rollover | Date | Buttons */
                grid-template-columns: 40px 30px 1fr 100px 100px 130px;
            }
        }
    }
</style>