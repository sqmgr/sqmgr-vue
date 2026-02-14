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
    <div v-if="modelValue" class="customize-team">
        <div class="field">
            <label :for="`name-${id}`" class="optional">{{ name }} Name</label>
            <input :id="`name-${id}`" :maxlength="teamNameMaxLength" :name="`name-${id}`" :placeholder="name"
                   @keydown="keydown"
                   @keyup="keyup" autocomplete="off" type="text" :value="modelValue.name"
                   @input="updateField('name', $event.target.value)"
                   @focus="hasFocus = true"
                   @blur="hideSuggestions"
                   :disabled="disabled">

            <div v-show="suggestTeams.length > 0 && !disabled" class="suggest">
                <div class="suggest-item" v-for="(team, idx) in suggestTeams"
                     v-bind:class="{ selected: idx === suggestIdx }" :key="team.name">
                    <a href="#" @click.prevent="selectTeam(team)" @mouseover="suggestIdx=idx">{{ team.name }}
                        ({{ team.league }})</a>
                </div>
            </div>
        </div>

        <div class="field">
            <label class="optional" :for="`color-1-${id}`">{{ name }} Colors</label>
            <input type="color" :id="`color-1-${id}`" :name="`color-1-${id}`" placeholder="#000000"
                   :value="modelValue.color1" @input="updateField('color1', $event.target.value)" tabindex="-1">
            <input type="color" :id="`color-2-${id}`" :name="`color-2-${id}`" placeholder="#000000"
                   :value="modelValue.color2" @input="updateField('color2', $event.target.value)" tabindex="-1">
        </div>
    </div>
</template>

<script>
import findTeam from '@/models/TeamColors'
import sqmgrConfig from "@/models/sqmgrConfig"
import ModalController from "@/controllers/ModalController"

export default {
    name: "GridCustomizeTeam",
    emits: ['update:modelValue'],
    watch: {
        teamName(name) {
            // Only show suggestions when user is actively typing (input has focus)
            if (this.hasFocus) {
                this.suggestTeams = findTeam(name)
                this.suggestIdx = -1
            }
        },
    },
    computed: {
        teamName() {
            return this.modelValue?.name
        },
    },
    data() {
        return {
            id: 0,
            teamNameMaxLength: 50, // real default will come from config
            suggestTeams: [],
            suggestIdx: -1,
            hasFocus: false,
        }
    },
    created() {
        sqmgrConfig()
            .then(config => {
                this.teamNameMaxLength = config.teamNameMaxLength
            })
            .catch(err => ModalController.showError(err))
    },
    props: {
        name: {
            type: String,
            required: true,
        },
        modelValue: {
            type: Object,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    mounted() {
        this.id = this._uid
    },
    methods: {
        updateField(field, value) {
            this.$emit('update:modelValue', { ...this.modelValue, [field]: value })
        },
        selectTeam(team) {
            this.$emit('update:modelValue', {
                ...this.modelValue,
                name: team.name,
                color1: team.colors[0],
                color2: team.colors[1] || team.colors[0],
            })
            setTimeout(() => this.suggestTeams = [], 1)
        },
        selectUp() {
            this.suggestIdx--

            if (this.suggestIdx < -1) {
                this.suggestIdx = this.suggestTeams.length - 1
            }
        },
        selectDown() {
            this.suggestIdx++

            if (this.suggestIdx >= this.suggestTeams.length) {
                this.suggestIdx = -1
            }
        },
        keyup(event) {
            if (event.key === 'Escape') {
                if (this.suggestTeams.length > 0) {
                    this.suggestTeams = []
                    event.stopPropagation()
                }
            }
        },
        keydown(event) {
            switch (event.key) {
                case 'Enter':
                    if (this.suggestIdx >= 0) {
                        event.preventDefault()
                        this.selectTeam(this.suggestTeams[this.suggestIdx])
                        return
                    }
                    break
                case 'ArrowDown':
                    this.selectDown()
                    break
                case 'ArrowUp':
                    this.selectUp()
                    break
                case 'n':
                    if (event.ctrlKey) {
                        this.selectDown()
                    }
                    break
                case 'p':
                    if (event.ctrlKey) {
                        this.selectUp()
                    }
                    break
            }
        },
        hideSuggestions() {
            // do this behind a timeout just in case user clicked something
            setTimeout(() => {
                this.hasFocus = false
                this.suggestIdx = -1
                this.suggestTeams = []
            }, 250)
        },
    },
}
</script>

<style scoped lang="scss">
div.customize-team {
    position: relative;

    input[type="text"]:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}

div.suggest {
    background-color: #fff;
    position:         absolute;
    margin-top:       2px;
    z-index:          1;
    padding:          var(--minimal-spacing) calc(2 * var(--minimal-spacing));
    box-shadow:       2px 4px 4px rgba(0, 0, 0, 0.2);
    border:           1px solid var(--border-color);
    width:            calc(100% - 2px);

    div.suggest-item {
        a {
            border-bottom: 1px solid var(--border-color);
            color:         #000;
            display:       block;
            padding:       var(--minimal-spacing);

            &:hover {
                text-decoration: none;
            }
        }

        &:last-child a {
            border-bottom: none;
        }

        &.selected {
            background-color: var(--primary);

            a {
                color: #fff;

                &:hover {
                    text-decoration: none;
                }
            }
        }
    }
}
</style>