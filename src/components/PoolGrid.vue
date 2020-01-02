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
    <div :class="divClasses">
        <template v-if="grid">
            <h1 class="pool-name">Squares Pool - {{ pool.name }}</h1>

            <h2>{{ grid.name }}</h2>

            <p v-if="hasEventDate" class="event-date">{{ eventDate }}</p>

            <template v-if="isAdmin">
                <nav class="admin-menu">
                    <h3>Admin Menu</h3>

                    <button type="button" @click.prevent="customizeWasClicked">Customize</button>

                    <template v-if="!numbersAreDrawn">
                        <button type="button" @click.prevent="randomlyDrawNumbersWasClicked">Randomly Draw Numbers</button>
                        <button type="button" @click.prevent="manuallyDrawNumbersWasClicked">Manually Draw Numbers</button>
                    </template>
                </nav>
            </template>

            <template v-if="grid.settings.notes">
                <div class="notes">{{ grid.settings.notes }}</div>
            </template>

            <div class="grid-metadata">
                <table>
                    <tbody>
                    <tr>
                        <td>ID</td>
                        <td>{{ pool.token }}</td>
                    </tr>
                    <tr>
                        <td>Pool Name</td>
                        <td>
                            <router-link :to="`/pool/${pool.token}`">{{ pool.name }}</router-link>
                        </td>
                    </tr>
                    <tr>
                        <td>Event</td>
                        <td>{{ grid.name }}</td>
                    </tr>
                    <tr>
                        <td>Date of Game</td>
                        <td>{{ eventDate }}</td>
                    </tr>
                    <tr>
                        <td>Type</td>
                        <td>{{ pool.gridType }}</td>
                    </tr>
                    <tr>
                        <td>State</td>
                        <td v-if="isLocked"><i class="fas fa-lock"></i> Squares are locked</td>
                        <td v-else><i class="fas fa-lock-open"></i> Squares are open</td>
                    </tr>
                    <tr>
                        <td>Draw Type</td>
                        <td>
                            <span v-if="!grid.homeNumbers && !grid.awayNumbers">TBD</span>
                            <span v-else-if="grid.manualDraw">Manual Input</span>
                            <span v-else>Random</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <p class="expand-grid">
                <a v-if="expandedGrid" href="#" @click.prevent="expandedGrid = false"><i
                        class="fas fa-compress-arrows-alt"></i> Shrink</a>
                <a v-else href="#" @click.prevent="expandedGrid = true"><i class="fas fa-expand-arrows-alt"></i> Expand</a>
            </p>

            <div class="squares-container">
                <div ref="squares" :class="{ squares: true, [gridType]: true, 'expanded-grid': expandedGrid }">
                    <div class="spacer">&nbsp;</div>

                    <div data-team="home" class="team home-team"><span>{{ grid.homeTeamName }}</span></div>
                    <div data-team="home" v-for="n in 10" :key="`home-${n}`"
                         :class="`score home-score home-score-${n-1}`">
                        {{score('home',
                        n-1)}}
                    </div>

                    <div data-team="away" class="team away-team"><span>{{ grid.awayTeamName }}</span></div>
                    <div data-team="away" v-for="n in 10" :key="`away-${n}`"
                         :class="`score away-score away-score-${n-1}`">
                        {{score('away',
                        n-1)}}
                    </div>

                    <template v-for="n in numSquares">
                        <Square :key="n"
                                :grid-id="gridIdNum"
                                :pool-config="poolConfig"
                                :sq-id="n"
                                :square-data="squares[n] || {}"
                                :annotation="annotationBySquareId(n)"
                        />
                    </template>
                </div>
            </div>

            <template v-if="isAdmin">
                <Logs :pool-config="poolConfig" :show-add-note="false" :logs="logs"/>
                <Pagination :current-page="currentLogPage" :per-page="logsPerPage" :total="numLogs"
                            @page="goToLogsPage"/>
            </template>
        </template>
    </div>
</template>

<script>
    import Square from './Square.vue'
    import Logs from './Logs.vue'
    import GridCustomize from './GridCustomize.vue'
    import Common from '../common'

    import ModalController from '@/controllers/ModalController'
    import sqmgrClient from "@/models/sqmgrClient";
    import EventBus from "@/models/EventBus";
    import Pagination from "@/components/Pagination";
    import '@/models/sqmgrConfig'
    import ManualDraw from "@/components/ManualDraw"; // load this right away

    export default {
        name: "PoolGrid",
        components: {
            Pagination,
            Square,
            Logs,
        },
        props: {
            token: {
                type: String,
                required: true,
            },
            initialPool: {
                type: Object,
                required: true,
            },
            gridId: {
                type: String,
                required: true,
            },
        },
        data() {
            return {
                pool: this.initialPool,
                grid: null,
                squares: {},
                logs: [],
                userId: null,


                logsPerPage: 25,
                currentLogPage: 1,
                numLogs: 0,

                expandedGrid: false,
            }
        },
        created() {
            document.title = `${this.pool.name} - SqMGR`
            EventBus.$on('square-updated', this.squareUpdated)
            EventBus.$on('grid-updated', this.gridUpdated)
        },
        beforeDestroy() {
            EventBus.$off('square-updated', this.squareUpdated)
            EventBus.$off('grid-updated', this.gridUpdated)
        },
        beforeMount() {
            // ensure store is fresh
            this.$store.commit('primarySquare', null)

            Promise.all(
                [
                    sqmgrClient.getUser(),
                    sqmgrClient.getPoolGridByTokenAndGridId(this.token, this.gridId),
                    sqmgrClient.getPoolSquares(this.token),
                ]
            ).then(values => {
                this.userId = values[0].id
                this.grid = values[1]
                this.squares = values[2]
                this.expandedGrid = this.pool.gridType === 'std100'
            })

            this.fetchLogs()
        },
        computed: {
            poolConfig() {
                return {
                    token: this.token,
                    isLocked: this.isLocked,
                    isAdmin: this.isAdmin,
                    userId: this.userId,
                    gridType: this.pool.gridType,
                }
            },
            gridIdNum() {
                return parseInt(this.gridId, 10)
            },
            hasEventDate() {
                return new Date(this.grid.eventDate).getFullYear() > 0
            },
            eventDate() {
                if (new Date(this.grid.eventDate).getFullYear() === 0) {
                    return "Not specified"
                }

                return Common.NewDateWithoutTimezone(this.grid.eventDate).toLocaleDateString("default", Common.DateOptions)
            },
            locks() {
                const locks = new Date(this.pool.locks)
                return locks.getFullYear() > 1 ? locks : null
            },
            locksFormatted() {
                return this.locks ? this.locks.toLocaleDateString(undefined, Common.DateTimeOptions) : null
            },
            isLocked() {
                return this.locks && this.locks.getTime() < new Date().getTime()
            },
            numbersAreDrawn() {
                return this.grid.homeNumbers || this.grid.awayNumbers
            },
            isAdmin() {
                return this.pool.isAdmin
            },
            numSquares() {
                return Object.values(this.squares).length
            },
            gridType() {
                return this.pool.gridType
            },
            rollover() {
                return this.grid && this.grid.rollover && this.pool.gridType === 'roll100'
            },
            divClasses() {
                const classes = {}
                classes[`grid-type-${this.gridType}`] = true
                classes.rollover = this.rollover
                classes['is-locked'] = this.isLocked

                return classes
            }
        },
        watch: {
            grid(newGrid) {
                document.title = `${this.pool.name}: ${newGrid.name} - SqMGR`
                this.updateTeamColors()
            }
        },
        mounted() {
            this.updateTeamColors()
        },
        updated() {
            this.updateTeamColors()
        },
        methods: {
            fetchLogs() {
                if (!this.isAdmin) {
                    return
                }

                const offset = (this.currentLogPage - 1) * this.logsPerPage
                sqmgrClient.getPoolLogs(this.token, offset, this.logsPerPage)
                    .then(res => {
                        this.logs = res.logs
                        this.numLogs = res.total
                    })
            },
            goToLogsPage(page) {
                this.currentLogPage = page
                this.fetchLogs()
            },
            squareUpdated() {
                sqmgrClient.getPoolSquares(this.token)
                    .then(res => this.squares = res)
                    .catch(err => ModalController.showError(err))

                this.fetchLogs()
            },
            gridUpdated() {
                sqmgrClient.getPoolGridByTokenAndGridId(this.token, this.gridId)
                    .then(res => this.grid = res)
                    .catch(err => ModalController.showError(err))
            },
            customizeWasClicked() {
                sqmgrClient.getPoolGridByTokenAndGridId(this.token, this.grid.id)
                    .then(grid => {
                        ModalController.show('Customize Grid', GridCustomize, {
                            grid,
                            token: this.token,
                            pool: this.pool,
                        }, {
                            saved() {
                                ModalController.hide()
                                ModalController.showPrompt('Changes Saved', 'Changes saved successfully.', {
                                    dismissButton: 'OK',
                                })
                            }
                        })

                    })
                    .catch(err => ModalController.showError(err))
            },
            checkAllSquaresClaimed() {
                let allClaimed = true
                for (const key of Object.keys(this.squares)) {
                    const square = this.squares[key]
                    if (square.state === 'unclaimed') {
                        allClaimed = false
                        break
                    }
                }

                return allClaimed
            },
            manuallyDrawNumbersWasClicked() {
                ModalController.show('Manually Draw Numbers', ManualDraw, {
                    allSquaresClaimed: this.checkAllSquaresClaimed(),
                    grid: this.grid,
                }, {
                    submit: nums => {
                        sqmgrClient.drawManualNumbers(this.token, this.grid.id, nums.homeNumbers, nums.awayNumbers)
                            .then(grid => {
                                this.grid = grid
                                ModalController.hide()
                            })
                            .catch(err => ModalController.showError(err))
                    }
                })
            },
            randomlyDrawNumbersWasClicked() {
                const allClaimed = this.checkAllSquaresClaimed()
                const description = 'Do you want to randomly draw the numbers for this game? This action cannot be undone.'
                const warning = !allClaimed && 'Not all squares have been claimed yet'

                ModalController.showPrompt('Draw the Numbers', description, {
                    warning,
                    actionButton: 'Draw',
                    action: () => {
                        sqmgrClient.drawNumbers(this.token, this.grid.id)
                            .then(grid => {
                                this.grid = grid
                                ModalController.hide()
                            })
                            .catch(err => ModalController.showError(err))
                    },
                })
            },
            score(team, index) {
                const numbers = this.grid[`${team}Numbers`]
                if (numbers === null) {
                    return ''
                }

                return numbers[index]
            },
            updateTeamColors() {
                const squares = this.$refs.squares
                if (squares) {
                    squares.querySelectorAll('[data-team="home"]').forEach(el => {
                        el.style.setProperty('--team-primary', this.grid.settings.homeTeamColor1)
                        el.style.setProperty('--team-secondary', this.grid.settings.homeTeamColor2)
                    })

                    squares.querySelectorAll('[data-team="away"]').forEach(el => {
                        el.style.setProperty('--team-primary', this.grid.settings.awayTeamColor1)
                        el.style.setProperty('--team-secondary', this.grid.settings.awayTeamColor2)
                    })
                }
            },
            annotationBySquareId(squareId) {
                if (!this.grid) {
                    return
                }

                return this.grid.annotations[squareId]
            }
        }
    }
</script>

<!-- TODO - Make this scoped again -->
<style scoped lang="scss">
    .grid-metadata {
        margin-bottom: var(--spacing);

        table {
            td:first-child {
                white-space: nowrap;
            }
        }
    }

    nav.admin-menu {
        border:        1px solid var(--border-color);
        margin-bottom: var(--spacing);
        padding:       var(--spacing);

        button {
            margin-right: var(--minimal-spacing);

            &:last-child {
                margin-right: 0;
            }

            @media(max-width: 800px) {
                display:       block;
                margin-bottom: var(--minimal-spacing);

                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }
</style>
<style lang="scss">
    @import '../variables';
    @import url('https://fonts.googleapis.com/css?family=Roboto+Condensed|Alfa+Slab+One');

    $expand-size: 8in;

    :root {
        --team-primary:    #000;
        --team-secondary:  #666;
        --grid-gray:       #ddd;


        --minimal-spacing: 4px;
        --spacing:         20px;

        --midnight-gray:   #171717;
        --light-gray:      #eee;
        --gray:            #bbb;
        --dark-gray:       #888;
        --red:             #f44336;
        --red-darker:      #e53935;
        --border-color:    #ccc;
        --hr-color:        #eee;
        --font:            'Roboto';
        --primary:         #4caf50;
        --primary-darker:  #43a047;
        --primary-darkest: #1b5e20;
        --success:         #2196f3;
        --warning:         #fdd835;
    }

    section.grid {
        position: relative;
    }

    p.customize {
        margin-top: calc(-1 * var(--spacing));
    }

    div.squares-container {
        width:    100%;
        overflow: auto;
    }

    div.squares {
        background-color:      #fff;
        display:               grid;
        grid-gap:              2px;
        margin:                0 auto;
        height:                calc(100vmin - var(--spacing) * 2);
        width:                 calc(100vmin - var(--spacing) * 2);
        grid-template-columns: repeat(2, 0.5fr) repeat(10, 1fr);
        grid-template-rows:    repeat(2, 0.5fr) repeat(10, 1fr);
    }

    div.expanded-grid {
        width:  $expand-size;
        height: $expand-size;
    }

    div.spacer {
        background-color: transparent;
        grid-column:      1/ span 2;
        grid-row:         1/ span 2;
    }

    div.team {
        background:  linear-gradient(var(--team-primary), var(--team-primary) calc(50% - 1px), #fff calc(50% - 1px), #fff calc(50% + 1px), var(--team-secondary) calc(50% + 1px), var(--team-secondary) 100%);
        color:       #fff;
        font-family: 'Alfa Slab One', sans-serif;
        font-size:   1.5em;
        position:    relative;
        text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);

        &.home-team {
            grid-column-start: 3;
            grid-column-end:   13;
        }

        &.away-team {
            background:     linear-gradient(90deg, var(--team-primary), var(--team-primary) calc(50% - 1px), #fff calc(50% - 1px), #fff calc(50% + 1px), var(--team-secondary) calc(50% + 1px), var(--team-secondary) 100%);
            grid-row-start: 3;
            grid-row-end:   13;
        }

        span {
            display:     block;
            transform:   translate(-50%, -50%);
            position:    absolute;
            white-space: nowrap;
            top:         50%;
            left:        50%;
        }

        &.away-team span {
            transform: translate(-50%, -50%) rotate(270deg);
        }
    }

    div.score {
        background-color: var(--grid-gray);
        display:          flex;
        align-items:      center;
        justify-content:  center;

        &.home-score { grid-row-start: 2 }

        &.home-score-0 { grid-column-start: 3 }

        &.home-score-1 { grid-column-start: 4 }

        &.home-score-2 { grid-column-start: 5 }

        &.home-score-3 { grid-column-start: 6 }

        &.home-score-4 { grid-column-start: 7 }

        &.home-score-5 { grid-column-start: 8 }

        &.home-score-6 { grid-column-start: 9 }

        &.home-score-7 { grid-column-start: 10 }

        &.home-score-8 { grid-column-start: 11 }

        &.home-score-9 { grid-column-start: 12 }

        &.away-score { grid-column-start: 2 }

        &.away-score-0 { grid-row-start: 3 }

        &.away-score-1 { grid-row-start: 4 }

        &.away-score-2 { grid-row-start: 5 }

        &.away-score-3 { grid-row-start: 6 }

        &.away-score-4 { grid-row-start: 7 }

        &.away-score-5 { grid-row-start: 8 }

        &.away-score-6 { grid-row-start: 9 }

        &.away-score-7 { grid-row-start: 10 }

        &.away-score-8 { grid-row-start: 11 }

        &.away-score-9 { grid-row-start: 12 }
    }

    div.square {
        border:          1px solid var(--grid-gray);
        display:         flex;
        font-family:     'Roboto Condensed', sans-serif;
        font-size:       14px;
        align-items:     center;
        justify-content: center;
        position:        relative;
        overflow:        hidden;
        padding:         2px;

        i.owned {
            color:     var(--midnight-gray);
            font-size: 0.9em;
            position:  absolute;
            top:       2px;
            left:      2px;
        }

        &:hover {
            border-color:        #000;
            box-shadow:          2px 2px 2px -2px #000;
            cursor:              pointer;
            user-select:         none;
            -webkit-user-select: none;
            -ms-user-select:     none;
            -moz-user-select:    none;
        }

        &.unclaimed:hover {
            border-color: var(--success);
        }

        &.paid-full::after {
            content:          '';
            position:         absolute;
            left:             2px;
            height:           4px;
            background-color: var(--success);
            bottom:           2px;
            right:            2px;
            font-size:        0.8em;
            color:            var(--success);
        }

        &.paid-partial {
        }

        &.paid-partial::after {
            content:    '';
            position:   absolute;
            left:       2px;
            height:     4px;
            background: linear-gradient(90deg, #ffc107, #ffc107 50%, var(--gray) 50%);
            bottom:     2px;
            right:      2px;
            font-size:  0.8em;
            color:      var(--gray);
        }

        &.claimed {
        }

        &.claimed::after {
            content:          '';
            position:         absolute;
            left:             2px;
            height:           4px;
            background-color: var(--gray);
            bottom:           2px;
            right:            2px;
            font-size:        0.8em;
            color:            var(--gray);
        }

        &.unclaimed {
            background: repeating-linear-gradient(135deg, #fff, #fff 5px, #f7f7f7 5px, #f7f7f7 10px);
        }

        &.unclaimed.held {
            border-color: var(--primary);
        }

        &.highlighted {
            box-shadow: 0 0 1px 1px var(--primary);
        }

        &.annotated {
            background: linear-gradient(rgba($primary, 0.1), rgba($primary, 0.05));
            border-color: $primary;
            box-shadow: 0 0 2px $primary;
        }

        @at-root .rollover &.secondary {
            & > span.name,
            & > .owned,
            & > .square-id {
                opacity: 0.2;
            }
        }

        @at-root .is-locked.rollover &.secondary {
            & > span.name,
            & > .owned {
                opacity: 0;
            }
        }

        span.square-id {
            position:  absolute;
            top:       2px;
            right:     2px;
            font-size: 0.8em;
            color:     var(--dark-gray);
            z-index:   1;
        }

        span.name {
            position: relative;
            z-index:  2;
        }
    }

    div.std25 div.square {
        grid-row-start:    span 2;
        grid-column-start: span 2;
    }

    div.notes::before {
        content:   'Note from organizer:';
        display:   block;
        font-size: 0.8em;
        color:     var(--gray);
    }

    div.notes {
        margin-bottom: var(--spacing);
        white-space:   pre-wrap;
        word-break:    break-word;
    }

    section.templates {
        display: none;
    }

    section.audit-log {
        margin-top: var(--spacing);
    }

    p.add-note {
        font-size:     0.8em;
        margin-bottom: var(--minimal-spacing);
        text-align:    right;
    }

    @media (min-width: 8.5in) {
        p.expand-grid {
            display: none;
        }
    }

    @media (max-width: 800px) {
        div#grid-container {
            overflow: auto;
            width:    100%;
        }

        div.team {
            font-size: 1.0em;
        }
    }

    p.event-date {
        display: none;
    }

    @media print {
        h1 { font-size: 1.0em; font-weight: normal; margin-bottom: 0; }
        h2 { font-size: 1.4em; margin-bottom: 0; }
        p.event-date { display: block; margin-bottom: 0; font-size: 0.7em; color: var(--gray); }
        .squares-container { margin-top: var(--spacing); }
        header { display: none; }
        footer { display: none; }
        div.content { padding: 0; }
        nav { display: none; }
        div.grid-metadata { display: none; }
        section.audit-log { display: none; }
        p.expand-grid { display: none; }
        div.score {
            background:  transparent;
            border:      2px solid var(--team-secondary);
            color:       var(--team-secondary);
            font-weight: bold;
        }
        div.std25.squares,
        div.std100.squares {
            width:  7in;
            height: 7in;
        }
        div.roll100.squares {
            width:  7in;
            height: 7in;
        }

        div.team {
            background: transparent;
            text-shadow:      none;
            color:            var(--team-primary);

            &.away-team {
                background: transparent;
            }
        }
    }
</style>