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
    <form class="standalone event-override-form" @submit.prevent="submit">
        <p class="intro">
            Overriding marks the event as manually managed, so the ESPN sync will leave it alone
            until the override is cleared. The new score is pushed to connected pool pages.
        </p>

        <div v-if="error" class="error" role="alert">{{ error }}</div>
        <validation-errors :validation-errors="validationErrors"/>

        <div class="field">
            <label for="override-status" class="required">Status</label>
            <select id="override-status" v-model="form.status">
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="final">Final</option>
            </select>
        </div>

        <table class="score-grid">
            <thead>
            <tr>
                <th></th>
                <th>Score</th>
                <th>Q1</th>
                <th>Q2</th>
                <th>Q3</th>
                <th>Q4</th>
                <th>OT</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="side in sides" :key="side.key">
                <th class="team">{{ side.label }}</th>
                <td>
                    <input
                        type="number"
                        min="0"
                        v-model="form[side.key].score"
                        :aria-label="`${side.label} score`"
                        required
                    />
                </td>
                <td v-for="(q, i) in form[side.key].quarters" :key="i">
                    <input
                        type="number"
                        min="0"
                        v-model="form[side.key].quarters[i]"
                        :aria-label="`${side.label} quarter ${i + 1}`"
                        placeholder="-"
                    />
                </td>
                <td>
                    <input
                        type="number"
                        min="0"
                        v-model="form[side.key].ot"
                        :aria-label="`${side.label} overtime`"
                        placeholder="-"
                    />
                </td>
            </tr>
            </tbody>
        </table>
        <p class="note">Quarter and overtime scores are optional; leave them blank to keep them unset.</p>

        <div class="field">
            <label for="override-reason" class="optional">Reason</label>
            <input
                id="override-reason"
                type="text"
                v-model="form.reason"
                placeholder="Recorded in the audit log"
                autocomplete="off"
            />
        </div>

        <div class="buttons">
            <button type="button" class="secondary" @click.prevent="ModalController.hide()" :disabled="submitting">Cancel</button>
            <button type="submit" :disabled="submitting">{{ submitting ? 'Saving...' : 'Save Override' }}</button>
        </div>
    </form>
</template>

<script>
import ModalController from "@/controllers/ModalController"
import ValidationErrors from "@/components/ui/ValidationErrors"
import sqmgrClient from "@/models/sqmgrClient"
import ResponseError from "@/models/ResponseError"
import { getErrorMessage } from "@/utils/adminFormat"

function numberOrNull(value) {
    if (value === '' || value === null || value === undefined) return null
    const num = parseInt(value, 10)
    return isNaN(num) ? null : num
}

function numberOrEmpty(value) {
    return value === null || value === undefined ? '' : value
}

export default {
    name: "EventOverrideForm",
    components: {ValidationErrors},
    props: {
        event: {
            type: Object,
            required: true,
        },
    },
    emits: ['saved'],
    data() {
        const event = this.event
        return {
            ModalController,
            submitting: false,
            error: null,
            validationErrors: null,
            sides: [
                { key: 'home', label: this.teamName(event.homeTeam, 'Home') },
                { key: 'away', label: this.teamName(event.awayTeam, 'Away') },
            ],
            form: {
                status: ['scheduled', 'in_progress', 'final'].includes(event.status) ? event.status : 'final',
                home: {
                    score: numberOrEmpty(event.homeScore),
                    quarters: [event.homeQ1, event.homeQ2, event.homeQ3, event.homeQ4].map(numberOrEmpty),
                    ot: numberOrEmpty(event.homeOT),
                },
                away: {
                    score: numberOrEmpty(event.awayScore),
                    quarters: [event.awayQ1, event.awayQ2, event.awayQ3, event.awayQ4].map(numberOrEmpty),
                    ot: numberOrEmpty(event.awayOT),
                },
                reason: '',
            },
        }
    },
    methods: {
        teamName(team, fallback) {
            if (!team) return fallback
            return team.abbreviation || team.name || fallback
        },

        buildBody() {
            const body = {
                status: this.form.status,
                homeScore: numberOrNull(this.form.home.score) ?? 0,
                awayScore: numberOrNull(this.form.away.score) ?? 0,
                homeOT: numberOrNull(this.form.home.ot),
                awayOT: numberOrNull(this.form.away.ot),
            }
            const homeQuarters = this.form.home.quarters.map(numberOrNull)
            const awayQuarters = this.form.away.quarters.map(numberOrNull)
            const anyQuarter = [...homeQuarters, ...awayQuarters].some(q => q !== null)
            if (anyQuarter) {
                body.homeQuarters = homeQuarters
                body.awayQuarters = awayQuarters
            }
            if (this.form.reason.trim()) {
                body.reason = this.form.reason.trim()
            }
            return body
        },

        async submit() {
            this.submitting = true
            this.error = null
            this.validationErrors = null
            try {
                const updated = await sqmgrClient.adminOverrideEvent(this.event.id, this.buildBody())
                this.$emit('saved', updated)
            } catch (err) {
                if (err instanceof ResponseError && err.validationErrors) {
                    this.validationErrors = err.validationErrors
                }
                this.error = getErrorMessage(err)
            } finally {
                this.submitting = false
            }
        },
    },
}
</script>

<style scoped lang="scss">
@use '../../variables' as *;

.event-override-form {
    min-width: min(560px, 85vw);

    .intro {
        color:     $text-secondary;
        font-size: 0.9em;
    }

    .error {
        @include alert-error;
        margin-bottom: var(--spacing);
    }

    .score-grid {
        width:           100%;
        border-collapse: collapse;
        margin-bottom:   $space-2;

        th, td {
            padding:    4px;
            text-align: center;
        }

        th {
            background:     transparent;
            color:          $text-secondary;
            font-size:      0.75em;
            text-transform: uppercase;
            letter-spacing: 0.04em;

            &.team {
                text-align:  left;
                color:       $text-color;
                font-size:   0.9em;
                white-space: nowrap;
            }
        }

        td {
            border-bottom: none;
            background:    transparent;

            input {
                width:      100%;
                min-width:  56px;
                padding:    6px 8px;
                min-height: 38px;
                text-align: center;
            }
        }
    }

    .note {
        margin-bottom: var(--spacing);
    }
}
</style>
