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
    <div class="linked-game-section">
        <div class="linked-game-header">
            <i class="fas fa-link"></i>
            <span class="linked-game-title">Linked Game</span>
            <span class="league-badge">{{ bdlEvent.league?.toUpperCase() }}</span>
        </div>
        <div class="linked-game-body">
            <div class="linked-game-matchup">
                <span class="team-abbr">{{ bdlEvent.awayTeam?.abbreviation }}</span>
                <span class="at-divider">@</span>
                <span class="team-abbr">{{ bdlEvent.homeTeam?.abbreviation }}</span>
            </div>
            <div v-if="bdlEvent.name || linkedGameDate" class="linked-game-meta">
                <span v-if="bdlEvent.name" class="meta-tag">
                    <i class="fas fa-trophy"></i> {{ bdlEvent.name }}
                </span>
                <span v-if="linkedGameDate" class="meta-tag">
                    <i class="fas fa-calendar-alt"></i> {{ linkedGameDate }}
                </span>
            </div>
            <div v-if="scores.length" class="linked-game-scoreboard">
                <div v-for="score in scores" :key="score.label"
                     class="scoreboard-cell" :class="{ 'is-final': score.label === 'Final' }">
                    <span class="period-label">{{ score.label }}</span>
                    <span class="period-score">{{ score.away }}-{{ score.home }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "LinkedGameInfo",
    props: {
        bdlEvent: {
            type: Object,
            required: true,
        },
        payoutConfig: {
            type: String,
            default: 'standard',
        },
        numberSetConfig: {
            type: String,
            default: 'standard',
        },
    },
    computed: {
        linkedGameDate() {
            if (!this.bdlEvent?.eventDate) return null
            const date = new Date(this.bdlEvent.eventDate)
            return date.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
            })
        },
        scores() {
            const event = this.bdlEvent
            if (!event) {
                return []
            }

            const config = this.payoutConfig || this.numberSetConfig || 'standard'
            const scores = []
            const status = event.status
            const period = event.period || 0
            const detail = event.statusDetail?.toLowerCase() || ''

            const atEndOfPeriod = detail.includes('end of')
            const atHalftime = detail.includes('halftime')

            const isFinal = status === 'final'
            const league = event.league
            const usesHalves = league === 'ncaab'

            const q1Complete = isFinal || period >= 2 || (period === 1 && atEndOfPeriod)
            const halfComplete = usesHalves
                ? (isFinal || period >= 2 || atHalftime || (period === 1 && atEndOfPeriod))
                : (isFinal || period >= 3 || atHalftime || (period === 2 && atEndOfPeriod))
            const q2Complete = isFinal || period >= 3 || atHalftime || (period === 2 && atEndOfPeriod)
            const q3Complete = isFinal || period >= 4 || (period === 3 && atEndOfPeriod)

            if (config === 'hf') {
                if (halfComplete && event.homeQ1 != null) {
                    const halfHome = usesHalves
                        ? (event.homeQ1 || 0)
                        : (event.homeQ1 || 0) + (event.homeQ2 || 0)
                    const halfAway = usesHalves
                        ? (event.awayQ1 || 0)
                        : (event.awayQ1 || 0) + (event.awayQ2 || 0)
                    scores.push({
                        label: 'Half',
                        home: halfHome,
                        away: halfAway,
                    })
                }
                if (isFinal && event.homeScore != null) {
                    scores.push({label: 'Final', home: event.homeScore, away: event.awayScore})
                }
            } else if (config === '123f') {
                if (q1Complete && event.homeQ1 != null) {
                    scores.push({label: '1st', home: event.homeQ1, away: event.awayQ1})
                }
                if (q2Complete && event.homeQ2 != null) {
                    scores.push({
                        label: '2nd',
                        home: (event.homeQ1 || 0) + (event.homeQ2 || 0),
                        away: (event.awayQ1 || 0) + (event.awayQ2 || 0),
                    })
                }
                if (q3Complete && event.homeQ3 != null) {
                    scores.push({
                        label: '3rd',
                        home: (event.homeQ1 || 0) + (event.homeQ2 || 0) + (event.homeQ3 || 0),
                        away: (event.awayQ1 || 0) + (event.awayQ2 || 0) + (event.awayQ3 || 0),
                    })
                }
                if (isFinal && event.homeScore != null) {
                    scores.push({label: 'Final', home: event.homeScore, away: event.awayScore})
                }
            } else {
                if (isFinal && event.homeScore != null) {
                    scores.push({label: 'Final', home: event.homeScore, away: event.awayScore})
                }
            }

            return scores
        },
    },
}
</script>

<style lang="scss" scoped>
@use '../../variables' as *;

.linked-game-section {
    margin:        0 $space-3;
    border:        1px solid rgba($primary, 0.2);
    border-radius: $radius-lg;
    overflow:      hidden;

    .linked-game-header {
        display:     flex;
        align-items: center;
        gap:         $space-2;
        padding:     $space-2 $space-3;
        background:  linear-gradient(135deg, rgba($primary, 0.04), rgba($primary, 0.08));
        border-bottom: 1px solid rgba($primary, 0.12);

        > i {
            color:     $primary;
            font-size: 0.75rem;
        }
    }

    .linked-game-title {
        font-size:      0.8rem;
        font-weight:    600;
        color:          $primary-dark;
        text-transform: uppercase;
        letter-spacing: 0.03em;
    }

    .league-badge {
        margin-left:   auto;
        font-size:     0.7rem;
        padding:       2px $space-2;
        background:    rgba($primary, 0.12);
        border-radius: $radius-sm;
        color:         $primary-dark;
        font-weight:   600;
        letter-spacing: 0.03em;
    }

    .linked-game-body {
        padding: $space-3;
    }

    .linked-game-matchup {
        display:     flex;
        align-items: baseline;
        gap:         $space-2;
        font-size:   1.1rem;
        font-weight: 700;
        color:       $text-color;
        justify-content: center;

        .at-divider {
            color:       $text-secondary;
            font-weight: 400;
            font-size:   0.85em;
        }
    }

    .linked-game-meta {
        display:         flex;
        justify-content: center;
        flex-wrap:       wrap;
        gap:             $space-2;
        margin-top:      $space-2;

        .meta-tag {
            display:        inline-flex;
            align-items:    center;
            gap:            $space-1;
            font-size:      0.75rem;
            color:          $text-secondary;
            padding:        2px $space-2;
            background:     $surface-sunken;
            border-radius:  $radius-full;

            i {
                font-size: 0.65rem;
                color:     $primary;
            }
        }
    }

    .linked-game-scoreboard {
        display:       flex;
        margin-top:    $space-3;
        border:        1px solid $light-gray;
        border-radius: $radius-md;
        overflow:      hidden;

        .scoreboard-cell {
            flex:           1;
            display:        flex;
            flex-direction: column;
            align-items:    center;
            padding:        $space-2 $space-2;
            border-right:   1px solid $light-gray;

            &:last-child {
                border-right: none;
            }

            &.is-final {
                background: rgba($primary, 0.05);
            }
        }

        .period-label {
            font-size:      0.65rem;
            color:          $text-secondary;
            text-transform: uppercase;
            font-weight:    500;
            letter-spacing: 0.03em;
        }

        .period-score {
            font-weight:          700;
            font-variant-numeric: tabular-nums;
            font-size:            0.875rem;
            color:                $text-color;
        }
    }
}
</style>
