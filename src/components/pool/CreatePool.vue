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
    <section class="create">
        <template v-if="!config">
            <div class="loading-state">
                <loading-indicator />
                <p>Loading configuration...</p>
            </div>
        </template>
        <template v-else>
            <div class="page-header">
                <h1>Create New Squares Pool</h1>
                <p class="subtitle">Set up your squares pool in seconds</p>
            </div>

            <div class="create-layout">
                <div class="form-section">
                    <form @submit.prevent="submit">
                        <validation-errors v-if="validationErrors" :validation-errors="validationErrors" />

                        <div class="form-card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i class="fas fa-edit"></i>
                                </div>
                                <div>
                                    <h2>Pool Details</h2>
                                    <p>Give your pool a name that participants will recognize</p>
                                </div>
                            </div>
                            <div class="card-content">
                                <div class="field">
                                    <label for="name">Pool Name</label>
                                    <input type="text"
                                           id="name"
                                           name="name"
                                           placeholder="e.g. Big Game Pool, Office Pool, etc."
                                           autocomplete="off"
                                           v-model="name"
                                           :maxlength="config.nameMaxLength"
                                           required
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="form-card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i class="fas fa-th"></i>
                                </div>
                                <div>
                                    <h2>Grid Configuration</h2>
                                    <p>Choose how many squares in your pool</p>
                                </div>
                            </div>
                            <div class="card-content">
                                <div class="option-cards">
                                    <option-card
                                        v-for="gt in config.gridTypes"
                                        :key="gt.key"
                                        :value="gt.key"
                                        :title="gt.description"
                                        :description="getGridDescription(gt.key)"
                                        :selected="gridType === gt.key"
                                        name="grid-type"
                                        @update:selected="gridType = $event"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="form-card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i class="fas fa-random"></i>
                                </div>
                                <div>
                                    <h2>Number Rotation</h2>
                                    <p>Do you want the numbers to remain constant or change by quarter or half?</p>
                                </div>
                            </div>
                            <div class="card-content">
                                <div class="option-cards">
                                    <option-card
                                        v-for="nsc in config.numberSetConfigs"
                                        :key="nsc.key"
                                        :value="nsc.key"
                                        :title="nsc.label"
                                        :description="getNumberSetDescription(nsc.key)"
                                        :selected="numberSetConfig === nsc.key"
                                        name="number-set-config"
                                        @update:selected="numberSetConfig = $event"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="form-card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i class="fas fa-lock"></i>
                                </div>
                                <div>
                                    <h2>Security</h2>
                                    <p>Set a password for participants to join</p>
                                </div>
                            </div>
                            <div class="card-content">
                                <password-field v-model="joinPassword" :min-length="config.minJoinPasswordLength" />
                            </div>
                        </div>

                        <div class="submit-section">
                            <div class="submit-info">
                                <i class="fas fa-info-circle"></i>
                                <span>You can customize colors and settings after creation</span>
                            </div>
                            <button type="submit" class="lg" name="submit" :disabled="this.creating">
                                <loading-indicator v-if="this.creating" class="small" />
                                <template v-else>
                                    <i class="fas fa-plus-circle"></i>
                                    Create Pool
                                </template>
                            </button>
                        </div>
                    </form>
                </div>

                <aside class="help-section">
                    <div class="help-card">
                        <div class="help-header">
                            <i class="fas fa-lightbulb"></i>
                            <h3>Quick Tips</h3>
                        </div>
                        <ul class="tips-list">
                            <li>
                                <i class="fas fa-check"></i>
                                <span>Run multiple games from one pool for a full season</span>
                            </li>
                            <li>
                                <i class="fas fa-check"></i>
                                <span>Participants keep the same squares across games</span>
                            </li>
                            <li>
                                <i class="fas fa-check"></i>
                                <span>Customize colors and team names after creation</span>
                            </li>
                        </ul>
                    </div>

                    <div class="help-card expandable" :class="{ expanded: showGridHelp }">
                        <button type="button" class="help-toggle" @click="showGridHelp = !showGridHelp">
                            <div class="help-header">
                                <i class="fas fa-th"></i>
                                <h3>Grid Types Explained</h3>
                            </div>
                            <i class="fas fa-chevron-down toggle-icon"></i>
                        </button>
                        <div class="help-content">
                            <dl class="help-definitions">
                                <dt>Standard, 100 squares</dt>
                                <dd>A 10x10 grid. The classic choice for most pools.</dd>

                                <dt>Standard, 50 squares</dt>
                                <dd>A 5x10 grid. Each square covers two possible home scores. Good for medium-sized groups.</dd>

                                <dt>Standard, 25 squares</dt>
                                <dd>A 5x5 grid. Each square covers multiple score combinations. Ideal for smaller groups.</dd>

                                <dt>Rollover, 100 squares</dt>
                                <dd>Each participant claims a primary and secondary square. You can leave the secondary blank to rollover the pot.</dd>
                            </dl>
                        </div>
                    </div>

                    <div class="help-card expandable" :class="{ expanded: showNumberHelp }">
                        <button type="button" class="help-toggle" @click="showNumberHelp = !showNumberHelp">
                            <div class="help-header">
                                <i class="fas fa-random"></i>
                                <h3>Number Rotation Explained</h3>
                            </div>
                            <i class="fas fa-chevron-down toggle-icon"></i>
                        </button>
                        <div class="help-content">
                            <dl class="help-definitions">
                                <dt v-if="numberSetTypes.has('standard')">Standard</dt>
                                <dd v-if="numberSetTypes.has('standard')">One set of numbers for the whole game.</dd>

                                <dt v-if="numberSetTypes.has('123f')">1st, 2nd, 3rd, Final</dt>
                                <dd v-if="numberSetTypes.has('123f')">Different numbers for Q1, Q2, Q3 and the Final score.</dd>

                                <dt v-if="numberSetTypes.has('hf')">Half, Final</dt>
                                <dd v-if="numberSetTypes.has('hf')">Two sets - one for halftime, one for the final score.</dd>

                                <dt v-if="numberSetTypes.has('1234')">1st, 2nd, 3rd, 4th</dt>
                                <dd v-if="numberSetTypes.has('1234')">Different numbers for each quarter.</dd>

                                <dt v-if="numberSetTypes.has('h4')">Half, 4th</dt>
                                <dd v-if="numberSetTypes.has('h4')">Two sets - one for halftime, one for end of 4th quarter.</dd>
                            </dl>
                        </div>
                    </div>
                </aside>
            </div>
        </template>
    </section>
</template>

<script>
    import sqmgrClient from "@/models/sqmgrClient";
    import ModalController from "@/controllers/ModalController";
    import ResponseError from "@/models/ResponseError";
    import LoadingIndicator from "@/components/ui/LoadingIndicator";
    import sqmgrConfig from "@/models/sqmgrConfig";
    import PasswordField from "@/components/ui/PasswordField";
    import ValidationErrors from "@/components/ui/ValidationErrors";
    import OptionCard from "@/components/ui/OptionCard";
    import { getNumberSetDescription } from "@/utils/numberSetDescriptions";

    export default {
        name: "CreatePool",
        components: {ValidationErrors, PasswordField, LoadingIndicator, OptionCard},
        data() {
            return {
                config: null,
                name: '',
                gridType: '',
                numberSetConfig: '',
                joinPassword: '',
                validationErrors: null,
                creating: false,
                showGridHelp: false,
                showNumberHelp: false,
            }
        },
        watch: {
            config(newVal) {
                if (this.gridType === '') {
                    this.gridType = newVal.gridTypes[0].key
                }
                if (this.numberSetConfig === '' && newVal.numberSetConfigs) {
                    this.numberSetConfig = newVal.numberSetConfigs[0].key
                }
            },
        },
        beforeMount() {
            sqmgrConfig()
                .then(res => this.config = res)
                .catch(err => ModalController.showError(err))
        },
        methods: {
            submit() {
                this.validationErrors = null
                this.creating = true
                sqmgrClient.createPool({
                    name: this.name,
                    gridType: this.gridType,
                    numberSetConfig: this.numberSetConfig,
                    joinPassword: this.joinPassword,
                    confirmJoinPassword: this.confirmJoinPassword,
                })
                    .then(res => this.$router.push(`/pool/${res.token}`))
                    .catch(err => {
                        if (err instanceof ResponseError && err.validationErrors) {
                            this.validationErrors = err.validationErrors
                            return
                        }

                        ModalController.showError(err)
                    })
                    .finally(() => this.creating = false)
            },
            getGridDescription(key) {
                const descriptions = {
                    'std100': 'Classic 10x10 grid for most pools',
                    'std50': 'Good for medium-sized groups',
                    'std25': 'Ideal for smaller groups',
                    'roll100': 'With rollover feature for multi-game pools',
                }
                return descriptions[key] || ''
            },
            getNumberSetDescription,
        },
        computed: {
           numberSetTypes() {
               return new Set(Object.values(this.config.numberSetConfigs).map(o => o.key))
           }
        }
    }
</script>

<style scoped lang="scss">
@use '../../variables.scss' as *;

section.create {
    max-width: 1100px;
    margin: 0 auto;
}

.loading-state {
    text-align: center;
    padding: $space-16 0;

    p {
        color: $dark-gray;
        margin-top: $space-4;
    }
}

.page-header {
    text-align: center;
    margin-bottom: $space-10;

    h1 {
        font-size: 2.25em;
        margin-bottom: $space-2;
        color: $text-color;
    }

    .subtitle {
        font-size: 1.1em;
        color: $dark-gray;
        margin: 0;
    }
}

.create-layout {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: $space-8;
    align-items: start;
}

// Form Section
.form-section {
    form {
        background: transparent;
        border: none;
        padding: 0;
    }
}

.form-card {
    @include card-base($radius-xl);
    margin-bottom: $space-5;
    overflow: hidden;

    .card-header {
        display: flex;
        align-items: flex-start;
        gap: $space-4;
        padding: $space-5;
        background: linear-gradient(to bottom, $surface-sunken, transparent);
        border-bottom: 1px solid $light-gray;

        .card-icon {
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, rgba($primary, 0.15) 0%, rgba($primary, 0.05) 100%);
            border-radius: $radius-lg;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;

            i {
                font-size: 1.1em;
                color: $primary;
            }
        }

        h2 {
            font-size: 1.15em;
            margin: 0 0 $space-1;
            color: $text-color;
        }

        p {
            font-size: 0.875em;
            color: $dark-gray;
            margin: 0;
        }
    }

    .card-content {
        padding: $space-5;
    }

    .field {
        margin-bottom: 0;

        label {
            font-size: 0.9em;
        }
    }

    .field-hint {
        font-size: 0.8em;
        color: $dark-gray;
        margin: $space-2 0 0;
        font-style: italic;
    }
}

// Option Cards container
.option-cards {
    display: flex;
    flex-direction: column;
    gap: $space-3;
}

// Submit Section
.submit-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $space-5;
    background: $surface-sunken;
    border-radius: $radius-xl;
    margin-top: $space-6;

    .submit-info {
        display: flex;
        align-items: center;
        gap: $space-2;
        font-size: 0.875em;
        color: $dark-gray;

        i {
            color: $primary;
        }
    }

    button {
        display: flex;
        align-items: center;
        gap: $space-2;
        padding: $space-3 $space-6;

        i {
            font-size: 1em;
        }
    }
}

// Help Section (Sidebar)
.help-section {
    position: sticky;
    top: $space-5;
}

.help-card {
    @include card-base($radius-xl);
    margin-bottom: $space-4;
    overflow: hidden;

    .help-header {
        display: flex;
        align-items: center;
        gap: $space-3;

        i {
            font-size: 1em;
            color: $primary;
        }

        h3 {
            font-size: 1em;
            margin: 0;
            color: $text-color;
        }
    }

    &:not(.expandable) {
        padding: $space-5;

        .help-header {
            margin-bottom: $space-4;
        }
    }

    &.expandable {
        .help-toggle {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: $space-4 $space-5;
            background: transparent;
            border: none;
            box-shadow: none;
            cursor: pointer;
            text-align: left;
            color: inherit;

            &:hover {
                background: $surface-sunken;
                transform: none;
            }

            .toggle-icon {
                color: $dark-gray;
                transition: transform var(--transition-base);
            }
        }

        .help-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height var(--transition-slow);

            & > * {
                padding-top: $standard-spacing;
            }
        }

        &.expanded {
            .help-toggle .toggle-icon {
                transform: rotate(180deg);
            }

            .help-content {
                max-height: 500px;
            }
        }
    }
}

.tips-list {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
        display: flex;
        align-items: flex-start;
        gap: $space-3;
        padding: $space-2 0;
        font-size: 0.9em;
        color: $text-color;

        i {
            color: $primary;
            font-size: 0.75em;
            margin-top: 4px;
            flex-shrink: 0;
        }
    }
}

.help-definitions {
    padding: 0 $space-5 $space-5;
    margin: 0;

    dt {
        font-weight: 600;
        font-size: 0.9em;
        color: $text-color;
        margin-top: $space-3;

        &:first-child {
            margin-top: 0;
        }
    }

    dd {
        font-size: 0.85em;
        color: $dark-gray;
        margin: $space-1 0 0 0;
        line-height: 1.5;
    }
}

// Responsive
@include tablet {
    .create-layout {
        grid-template-columns: 1fr;
    }

    .help-section {
        position: static;
    }

    .submit-section {
        flex-direction: column;
        gap: $space-4;
        text-align: center;

        button {
            width: 100%;
            justify-content: center;
        }
    }
}

@include mobile {
    .page-header h1 {
        font-size: 1.75em;
    }

    .form-card .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: $space-3;
    }
}
</style>
