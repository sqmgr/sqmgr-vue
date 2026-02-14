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
    <div class="event-search">
        <div class="field">
            <label for="league">League</label>
            <select id="league" v-model="selectedLeague" @change="loadEvents">
                <option value="">Select a league...</option>
                <option value="nfl">NFL</option>
                <option value="nba">NBA</option>
                <option value="wnba">WNBA</option>
                <option value="ncaab">NCAAB</option>
                <option value="ncaaf">NCAAF</option>
            </select>
        </div>

        <div class="field" v-if="events.length > 0 || searchQuery">
            <label for="search">Search Events</label>
            <input type="text" id="search" v-model="searchQuery" placeholder="Search by team name...">
        </div>

        <div class="loading" v-if="loading">
            Loading events...
        </div>

        <div class="searching" v-if="searching && !loading">
            Searching...
        </div>

        <div class="results-count" v-if="!loading && !searching && totalEvents > 0">
            Showing {{ filteredEvents.length }} of {{ totalEvents }} events
        </div>

        <div class="events-list" v-if="filteredEvents.length > 0 && !loading">
            <div
                v-for="event in filteredEvents"
                :key="event.id"
                class="event-card"
                :class="{ selected: selectedEvent?.id === event.id }"
                :style="{ borderLeftColor: event.homeTeam?.color ? '#' + event.homeTeam.color : 'var(--border-color)' }"
                @click="selectEvent(event)">
                <div class="event-card-header">
                    <div class="event-meta">
                        <span>{{ formatDate(event.eventDate) }}</span>
                        <span v-if="event.venue" class="meta-separator">&middot;</span>
                        <span v-if="event.venue">{{ event.venue }}</span>
                    </div>
                    <span class="league-tag">{{ event.league }}</span>
                </div>
                <div class="event-matchup">
                    <span class="team">
                        <span v-if="event.awayTeam?.abbreviation" class="team-badge" :style="{ backgroundColor: event.awayTeam.color ? '#' + event.awayTeam.color : 'var(--dark-gray)' }">{{ event.awayTeam.abbreviation }}</span>
                        <span class="team-name">{{ event.awayTeam?.name || 'Away' }}</span>
                    </span>
                    <span class="at-separator">@</span>
                    <span class="team">
                        <span v-if="event.homeTeam?.abbreviation" class="team-badge" :style="{ backgroundColor: event.homeTeam.color ? '#' + event.homeTeam.color : 'var(--dark-gray)' }">{{ event.homeTeam.abbreviation }}</span>
                        <span class="team-name">{{ event.homeTeam?.name || 'Home' }}</span>
                    </span>
                </div>
                <div class="event-name" v-if="event.name">{{ event.name }}</div>
            </div>
        </div>

        <div class="no-events" v-if="selectedLeague && !loading && events.length === 0">
            No upcoming events found for this league.
        </div>

        <div class="no-results" v-if="selectedLeague && !loading && events.length > 0 && filteredEvents.length === 0">
            No events match your filter.
        </div>
    </div>
</template>

<script>
import sqmgrClient from "@/models/sqmgrClient"
import ModalController from "@/controllers/ModalController"

export default {
    name: "EventSearch",
    props: {
        initialEvent: {
            type: Object,
            default: null,
        },
    },
    emits: ['selected'],
    data() {
        return {
            selectedLeague: '',
            events: [],
            searchQuery: '',
            selectedEvent: null,
            loading: false,
            searching: false,
            totalEvents: 0,
            searchDebounceTimer: null,
        }
    },
    watch: {
        searchQuery(newVal) {
            // Clear any pending debounce
            if (this.searchDebounceTimer) {
                clearTimeout(this.searchDebounceTimer)
            }

            // If search is 2+ chars, debounce server search
            if (newVal && newVal.length >= 2) {
                this.searchDebounceTimer = setTimeout(() => {
                    this.serverSearch(newVal)
                }, 300)
            } else if (newVal === '') {
                // Reset to initial load when search is cleared
                this.loadEvents()
            }
        },
    },
    computed: {
        filteredEvents() {
            if (!this.searchQuery) {
                return this.events
            }

            const query = this.searchQuery.toLowerCase()
            return this.events.filter(event => {
                const homeTeam = event.homeTeam?.name?.toLowerCase() || ''
                const awayTeam = event.awayTeam?.name?.toLowerCase() || ''
                const homeAbbr = event.homeTeam?.abbreviation?.toLowerCase() || ''
                const awayAbbr = event.awayTeam?.abbreviation?.toLowerCase() || ''
                const homeFull = event.homeTeam?.fullName?.toLowerCase() || ''
                const awayFull = event.awayTeam?.fullName?.toLowerCase() || ''

                return homeTeam.includes(query) ||
                    awayTeam.includes(query) ||
                    homeAbbr.includes(query) ||
                    awayAbbr.includes(query) ||
                    homeFull.includes(query) ||
                    awayFull.includes(query)
            })
        },
    },
    mounted() {
        if (this.initialEvent) {
            this.selectedLeague = this.initialEvent.league
            this.selectedEvent = this.initialEvent
            this.loadEvents()
        }
    },
    methods: {
        async loadEvents() {
            if (!this.selectedLeague) {
                this.events = []
                this.totalEvents = 0
                return
            }

            this.loading = true
            this.searchQuery = ''

            try {
                const response = await sqmgrClient.getBDLEvents(this.selectedLeague, 'scheduled,in_progress', 50)
                this.events = response.events || []
                this.totalEvents = response.total || this.events.length

                // If we have an initial event, make sure it's in the list
                if (this.selectedEvent && this.selectedEvent.league === this.selectedLeague) {
                    const found = this.events.find(e => e.id === this.selectedEvent.id)
                    if (!found) {
                        // Add the initial event at the beginning if it's not in the scheduled list
                        this.events.unshift(this.selectedEvent)
                    }
                }
            } catch (err) {
                ModalController.showError(err)
                this.events = []
                this.totalEvents = 0
            } finally {
                this.loading = false
            }
        },
        async serverSearch(query) {
            if (!this.selectedLeague || query.length < 2) {
                return
            }

            this.searching = true

            try {
                const response = await sqmgrClient.getBDLEvents(this.selectedLeague, 'scheduled,in_progress', 50, 0, query)
                this.events = response.events || []
                this.totalEvents = response.total || this.events.length
            } catch (err) {
                ModalController.showError(err)
            } finally {
                this.searching = false
            }
        },
        selectEvent(event) {
            this.selectedEvent = event
            this.$emit('selected', event)
        },
        formatDate(dateStr) {
            const date = new Date(dateStr)
            return date.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
            })
        },
        resetToEvent(event) {
            if (event) {
                this.selectedEvent = event
            }
        },
    },
}
</script>

<style scoped lang="scss">
@use '../../variables.scss' as *;

.event-search {
    margin-bottom: var(--spacing);

    .loading {
        padding: var(--spacing);
        text-align: center;
        color: var(--dark-gray);
    }

    .searching {
        padding: var(--minimal-spacing) var(--spacing);
        color: var(--dark-gray);
        font-style: italic;
        font-size: 0.85em;
    }

    .results-count {
        padding: var(--minimal-spacing) 0;
        font-size: 0.8em;
        color: var(--dark-gray);
    }

    .events-list {
        max-height: 350px;
        overflow-y: auto;
        margin-top: var(--minimal-spacing);
        display: flex;
        flex-direction: column;
        gap: 8px;

        .event-card {
            padding: 10px 12px;
            border-radius: var(--radius-md);
            border-left: 3px solid var(--border-color);
            background: #fff;
            box-shadow: var(--shadow-xs);
            cursor: pointer;
            transition: box-shadow var(--transition-fast), background-color var(--transition-fast);

            &:hover {
                box-shadow: var(--shadow-sm);
            }

            &.selected {
                background-color: rgba(76, 175, 80, 0.08);
                border-left-color: var(--primary) !important;
                box-shadow: var(--shadow-sm);

                .event-meta {
                    color: var(--primary-darkest);
                }

                .event-name {
                    color: var(--primary-darkest);
                }

                .league-tag {
                    color: var(--primary-darkest);
                }
            }

            .event-card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 6px;

                @include mobile {
                    flex-direction: column;
                    align-items: flex-start;
                }

                .event-meta {
                    font-size: 0.8em;
                    color: var(--dark-gray);

                    .meta-separator {
                        margin: 0 5px;
                    }
                }

                .league-tag {
                    font-size: 0.7em;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: var(--dark-gray);
                    letter-spacing: 0.03em;
                }
            }

            .event-matchup {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
                font-size: 0.95em;
                margin-bottom: 2px;

                .team {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;

                    .team-badge {
                        display: inline-block;
                        padding: 1px 6px;
                        border-radius: 9999px;
                        font-size: 0.72em;
                        font-weight: 700;
                        color: #fff;
                        line-height: 1.6;
                        letter-spacing: 0.02em;
                        white-space: nowrap;
                    }

                    .team-name {
                        white-space: nowrap;
                    }
                }

                .at-separator {
                    color: var(--dark-gray);
                    font-weight: 400;
                    font-size: 0.85em;
                }
            }

            .event-name {
                display: inline-block;
                font-size: 0.75em;
                font-weight: 600;
                color: var(--primary-darkest);
                background: rgba(76, 175, 80, 0.1);
                padding: 1px 8px;
                border-radius: 9999px;
                margin-top: 6px;
            }
        }
    }

    .no-events, .no-results {
        padding: var(--spacing);
        text-align: center;
        color: var(--dark-gray);
        font-style: italic;
    }
}
</style>
