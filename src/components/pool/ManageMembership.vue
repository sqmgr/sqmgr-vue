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
    import PasswordField from "@/components/ui/PasswordField";
    import sqmgrClient from "@/models/sqmgrClient";
    import ResponseError from "@/models/ResponseError";
    import ValidationErrors from "@/components/ui/ValidationErrors";

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
    @use '../../variables.scss' as *;

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