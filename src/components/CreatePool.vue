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

                    <p>This screen will allow you to create a new squares pool. You can create many games from a single
                        squares pool (i.e., each game for your favorite team during the regular season). Each game
                        within a squares pool will use the same grid (e.g. users will have the same square each game)
                        but each game can have different numbers assigned to each square.</p>

                    <p>You'll have further opportunity to customize the look &amp; feel after you create your squares
                        pool.</p>

                    <h3>Grid Configuration</h3>

                    <ul>
                        <li><strong>Standard, 100 squares:</strong> A 10x10 grid. This is the most common pool.</li>
                        <li><strong>Standard, 25 squares:</strong> A 5x5 grid where each square will be assigned two home and two away numbers. This is great if you have fewer participants.</li>
                        <li><strong>Rollover, 100 squares:</strong> A 10x10 grid but each participant will claim two squares, a primary square and a secondary square. You can designate certain games as a "rollover" game and the secondary squares will be empty. If the final score lands on that square, you roll the money over to the next game. This is great for pools that span many games (e.g., a full season or playoffs).</li>
                    </ul>

                    <h3>Join Password</h3>

                    <p>The password will be required by people you invite before they are allowed to view the board.</p>
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
    @import '../assets/forms.css';
</style>