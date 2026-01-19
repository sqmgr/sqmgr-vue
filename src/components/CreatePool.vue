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
    <section class="create">
        <template v-if="!config">
            <p>Loading...</p>
        </template>
        <template v-else>
            <h1>Create New Squares Pool</h1>

            <div class="columns">
                <form class="col-2" @submit.prevent="submit">
                    <validation-errors v-if="validationErrors" :validation-errors="validationErrors" />

                    <fieldset>
                        <legend>Basic Settings</legend>

                        <div class="field">
                            <label for="name">Squares Pool Name</label>
                            <input type="text"
                                   id="name"
                                   name="name"
                                   placeholder="Squares Pool Name"
                                   autocomplete="off"
                                   v-model="name"
                                   :maxlength="config.nameMaxLength"
                                   required
                            />
                        </div>

                        <div class="field">
                            <label for="grid-type">Grid Configuration</label>
                            <select id="grid-type" name="grid-type" v-model="gridType">
                                <option v-for="gridType in config.gridTypes" :key="gridType.key" :value="gridType.key">
                                    {{gridType.description}}
                                </option>
                            </select>
                        </div>

                        <password-field v-model="joinPassword" :min-length="config.minJoinPasswordLength" />

                        <div class="buttons">
                            <loading-indicator v-if="this.creating" class="small" />
                            <button type="submit" name="submit" :disabled="this.creating">Create</button>
                        </div>
                    </fieldset>
                </form>
                <div class="help col-2">
                    <h2>Help</h2>

                    <p>You can run multiple games from the same pool which is perfect for tracking a full season
                        where participants keep the same squares across games.</p>

                    <p>You'll have further opportunity to customize the look &amp; feel after you create your squares
                        pool.</p>

                    <h3>Grid Configuration</h3>

                    <ul>
                        <li><strong>Standard, 100 squares:</strong> A 10x10 grid with 100 squares. The classic choice for most pools.</li>
                        <li><strong>Standard, 50 squares:</strong> A 5x10 grid with 50 squares. Each square covers two possible home scores. Good for medium-sized groups.</li>
                        <li><strong>Standard, 25 squares:</strong> A 5x5 grid with 25 squares. Each square covers multiple score combinations. Ideal for smaller groups.</li>
                        <li><strong>Rollover, 100 squares:</strong> A 10x10 grid where each participant claims two squares: a primary and a secondary. You can designated specific games where the secondary square will be left blank which will allow the pot to "rollover" to the next game.</li>
                    </ul>

                    <h3>Join Password</h3>

                    <p>The password will be required by people you invite before they are allowed to view the board. You'll have the option to make it optional.</p>
                </div>
            </div>
        </template>
    </section>
</template>

<script>
    import sqmgrClient from "@/models/sqmgrClient";
    import ModalController from "@/controllers/ModalController";
    import ResponseError from "@/models/ResponseError";
    import LoadingIndicator from "@/components/LoadingIndicator";
    import sqmgrConfig from "@/models/sqmgrConfig";
    import PasswordField from "@/components/PasswordField";
    import ValidationErrors from "@/components/ValidationErrors";

    export default {
        name: "CreatePool",
        components: {ValidationErrors, PasswordField, LoadingIndicator},
        data() {
            return {
                config: null,
                name: '',
                gridType: '',
                joinPassword: '',
                validationErrors: null,
                creating: false,
            }
        },
        watch: {
            config(newVal) {
                if (this.gridType === '') {
                    this.gridType = newVal.gridTypes[0].key
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
            }
        }
    }
</script>

<style scoped lang="scss">
@use '../variables.scss' as *;
ul {
    li {
        margin: $standard-spacing;
    }
}
</style>
