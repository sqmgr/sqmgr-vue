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
                @click="selectEvent(event)">
                <div class="event-date">{{ formatDate(event.eventDate) }}</div>
                <div class="event-name" v-if="event.name">{{ event.name }}</div>
                <div class="event-matchup">
                    {{ event.awayTeam?.fullName || event.awayTeam?.name || 'Away Team' }} @ {{ event.homeTeam?.fullName || event.homeTeam?.name || 'Home Team' }}
                </div>
                <div class="event-venue" v-if="event.venue">{{ event.venue }}</div>
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
.event-search {
    margin-bottom: var(--spacing);
}

.loading {
    padding: var(--spacing);
    text-align: center;
    color: #666;
}

.events-list {
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    margin-top: var(--minimal-spacing);
}

.event-card {
    padding: var(--minimal-spacing) var(--spacing);
    border-bottom: 1px solid var(--border-color);
    cursor: pointer;
    transition: background-color 0.2s;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: #f5f5f5;
    }

    &.selected {
        background-color: var(--primary);
        color: #fff;

        .event-date, .event-venue {
            color: rgba(255, 255, 255, 0.8);
        }

        .event-name {
            color: #fff;
        }
    }
}

.event-date {
    font-size: 0.85em;
    color: #666;
    margin-bottom: 2px;
}

.event-name {
    font-weight: bold;
    font-size: 1.1em;
    color: var(--primary);
}

.event-matchup {
    font-weight: bold;
    font-size: 1em;
}

.event-venue {
    font-size: 0.8em;
    color: #888;
    margin-top: 2px;
}

.no-events, .no-results {
    padding: var(--spacing);
    text-align: center;
    color: #666;
    font-style: italic;
}

.searching {
    padding: var(--minimal-spacing) var(--spacing);
    color: #666;
    font-style: italic;
}

.results-count {
    padding: var(--minimal-spacing) var(--spacing);
    font-size: 0.85em;
    color: #666;
}
</style>
