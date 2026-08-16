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
    <div class="season-link">
        <div class="season-hint">
            <i class="fas fa-wand-magic-sparkles"></i>
            Pick a team and a grid will be created for each of their remaining games. Games already in this pool are
            skipped.
        </div>

        <div class="field">
            <label for="season-league">League</label>
            <select id="season-league" v-model="selectedLeague" @change="leagueWasChanged">
                <option value="">Select a league...</option>
                <option value="nfl">NFL</option>
                <option value="ncaaf">NCAAF</option>
            </select>
            <small class="helper-text">Only NFL and NCAAF seasons can be linked.</small>
        </div>

        <div class="loading" v-if="loading">
            Loading teams...
        </div>

        <div class="field" v-if="selectedLeague && !loading && teams.length > 0">
            <label for="season-team">Team</label>
            <select id="season-team" v-model="selectedTeamId" @change="teamWasChanged">
                <option value="">Select a team...</option>
                <option v-for="team in teams" :key="team.id" :value="team.id">{{ teamName(team) }}</option>
            </select>
        </div>

        <div class="playoffs-hint" v-if="isPlayoffsSelected">
            <i class="fas fa-triangle-exclamation"></i>
            This creates a grid for every remaining postseason game in the league.
        </div>

        <div class="no-teams" v-if="selectedLeague && !loading && teams.length === 0">
            No teams found for this league.
        </div>
    </div>
</template>

<script>
import sqmgrClient from "@/models/sqmgrClient"
import ModalController from "@/controllers/ModalController"

export default {
    name: "SeasonLink",
    emits: ['change'],
    data() {
        return {
            selectedLeague: '',
            selectedTeamId: '',
            teams: [],
            loading: false,
        }
    },
    computed: {
        selectedTeam() {
            return this.teams.find((team) => team.id === this.selectedTeamId) || null
        },
        isPlayoffsSelected() {
            return !!this.selectedTeam?.isPlayoffs
        },
    },
    methods: {
        teamName(team) {
            return team.fullName || team.name || team.abbreviation || team.id
        },
        leagueWasChanged() {
            this.selectedTeamId = ''
            this.emitChange()
            this.loadTeams()
        },
        teamWasChanged() {
            this.emitChange()
        },
        emitChange() {
            this.$emit('change', {
                league: this.selectedLeague,
                teamId: this.selectedTeamId,
            })
        },
        async loadTeams() {
            if (!this.selectedLeague) {
                this.teams = []
                this.loading = false
                return
            }

            // responses can come back out of order when the league is changed quickly,
            // so only the response for the currently selected league is applied
            const league = this.selectedLeague
            this.loading = true

            try {
                const response = await sqmgrClient.getBDLTeams(league)
                if (league !== this.selectedLeague) return

                const teams = response.teams || []

                // ESPN syncs undetermined playoff bracket slots as multiple distinct
                // placeholder teams that all display as "TBD" - collapse them into a
                // single "Playoffs" entry at the end of the list
                const isPlaceholder = (team) => this.teamName(team).trim().toLowerCase() === 'tbd'
                const placeholders = teams.filter(isPlaceholder)
                const realTeams = teams.filter((team) => !isPlaceholder(team))

                const sortedTeams = realTeams.slice().sort((a, b) => this.teamName(a).localeCompare(this.teamName(b)))
                if (placeholders.length > 0) {
                    sortedTeams.push({...placeholders[0], fullName: 'Playoffs', isPlayoffs: true})
                }

                this.teams = sortedTeams
            } catch (err) {
                if (league !== this.selectedLeague) return

                ModalController.showError(err)
                this.teams = []
            } finally {
                if (league === this.selectedLeague) {
                    this.loading = false
                }
            }
        },
    },
}
</script>

<style scoped lang="scss">
@use '../../variables.scss' as *;

.season-link {
    margin-bottom: $standard-spacing;

    .season-hint {
        @include hint-box;
    }

    .playoffs-hint {
        @include hint-box;
    }

    .loading {
        @include picker-message;
    }

    .no-teams {
        @include picker-message;
        font-style: italic;
    }

    .helper-text {
        @include helper-text;
    }
}
</style>
