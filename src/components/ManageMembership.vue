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
    <section class="reset-membership">
        <form v-if="config" @submit.prevent="submit" class="standalone">
            <fieldset>
                <validation-errors v-if="validationErrors" :validation-errors="validationErrors" />

                <password-field v-model="joinPassword" :min-length="config.minJoinPasswordLength" />
                <div class="field reset-membership">
                    <label>
                        <input type="checkbox" v-model="resetMembership"/> Reset Membership?
                    </label>
                </div>
                <div class="buttons">
                    <button type="button" @click="cancel">Cancel</button>
                    <button type="submit" class="destructive">
                        <span v-if="!resetMembershipConfirmed">Change Password</span>
                        <span v-else>Reset Membership</span>
                    </button>
                </div>
            </fieldset>
        </form>
    </section>
</template>

<script>
    import sqmgrConfig from "@/models/sqmgrConfig";
    import ModalController from "@/controllers/ModalController";
    import PasswordField from "@/components/PasswordField";
    import sqmgrClient from "@/models/sqmgrClient";
    import ResponseError from "@/models/ResponseError";
    import ValidationErrors from "@/components/ValidationErrors";

    export default {
        name: "ManageMembership",
        components: {ValidationErrors, PasswordField},
        props: {
            pool: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {
                joinPassword: '',
                config: null,
                resetMembership: false,
                resetMembershipConfirmed: false,
                validationErrors: null,
            }
        },
        watch: {
            resetMembership(reset) {
                if (reset) {
                    ModalController.showPrompt('Really Reset?', 'Do you want to boot all members from your current pool?', {
                        actionButton: 'Yes, Boot them All!',
                        warning: 'You will need to provide everyone with the updated join password or a new join link.',
                        isDestructive: true,
                        action: () => {
                            ModalController.hide()
                            this.resetMembershipConfirmed = true
                        },
                        cancelAction: () => {
                            this.resetMembership = false
                        },
                        abortedAction: () => {
                            this.resetMembership = false
                        }
                    })
                } else {
                    this.resetMembershipConfirmed = false
                }
            }
        },
        created() {
            sqmgrConfig()
                .then(config => this.config = config)
                .catch(err => ModalController.showError(err))
        },
        methods: {
            cancel() {
                ModalController.hide()
            },
            submit() {
                sqmgrClient.changeJoinPassword(this.pool.token, this.joinPassword, this.resetMembership)
                    .then(() => {
                        ModalController.hide()
                        ModalController.showPrompt('Password Changed Successful', 'The password has been successfully changed.', {
                            dismissButton: 'OK'
                        })
                        this.$emit('updated')
                    })
                    .catch(err => {
                        if (err instanceof ResponseError && err.validationErrors) {
                            this.validationErrors = err.validationErrors
                            return
                        }

                        ModalController.showError(err)
                    })
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../variables.scss';

    div.reset-membership {
        height: 1.2em;
    }

    input[type="checkbox"] {
        height:         1.2em;
        display:        inline-block;
        width:          auto;
        vertical-align: middle;
    }
</style>