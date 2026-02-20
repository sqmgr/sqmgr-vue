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
    <section class="grid-join">
        <form class="small" @submit.prevent="submit">
            <fieldset>
                <legend>Join Squares Pool</legend>

                <div v-if="error" class="errors">
                    <ul>
                        <li>{{ error }}</li>
                    </ul>
                </div>

                <div v-if="tryingHash">
                    <p>Attempting to join squares pool...</p>
                </div>
                <div v-else>
                    <div class="field">
                        <label for="password">Password</label>
                        <input ref="password" type="password" id="password" name="password" placeholder="Password" required v-model="joinPassword" />
                    </div>

                    <div class="buttons">
                        <button type="submit" name="submit">Join</button>
                    </div>
                </div>
            </fieldset>
        </form>
    </section>
</template>

<script>
    import accessTokenManager from "@/models/accessTokenManager";
    import sqmgrClient from "@/models/sqmgrClient";
    import ModalController from "@/controllers/ModalController";
    import ResponseError from "@/models/ResponseError";
    import bus from "@/utils/bus";
    import { GUEST_JOIN } from "@/constants/events";

    export default {
        name: "PoolJoin",
        props: {
            token: {
                type: String,
                required: true,
            }
        },
        data() {
            return {
                joinPassword: '',
                error: null,
                tryingHash: false,
            }
        },
        created() {
            const invite = this.$route.query.invite || (window.location.hash && window.location.hash.substr(1))
            if (invite) {
                this.tryingHash = true
                this.joinPool(invite, true)
            }
        },
        methods: {
            joinPool(passwordOrInvite, isInvite = false) {
                this.error = null
                accessTokenManager.getAccessToken(true)
                    .then(() => sqmgrClient.joinPool(this.token, passwordOrInvite, isInvite))
                    .then(() => {
                        bus.emit(GUEST_JOIN)

                        if (this.$route.query.target) {
                            this.$router.push(this.$route.query.target)
                            return
                        }

                        this.$router.push(`/pool/${this.token}`)
                    })
                    .catch(err => {
                        this.tryingHash = false

                        if ((err instanceof ResponseError) && err.statusCode === 400) {
                            if (isInvite) {
                                this.error = 'The link is invalid. Please try entering the password instead.'
                                return
                            }

                            this.error = err.message
                            return
                        }

                        ModalController.showError(err)
                    })

            },
            submit() {
                this.joinPool(this.joinPassword, false)
            }
        },
        mounted() {
            if (this.$refs.password) {
                this.$refs.password.select()
            }
        }
    }
</script>

<style scoped>

</style>