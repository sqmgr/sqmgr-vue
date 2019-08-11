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
            if (window.location.hash) {
                const hash = window.location.hash.substr(1)
                if (hash) {
                    this.tryingHash = true
                    this.joinPool(hash, true)
                }
            }
        },
        methods: {
            joinPool(passwordOrJWT, isJWT = false) {
                this.error = null
                accessTokenManager.getAccessToken(true)
                    .then(() => sqmgrClient.joinPool(this.token, passwordOrJWT, isJWT))
                    .then(() => {
                        bus.$emit('guestJoin')

                        if (this.$route.query.target) {
                            this.$router.push(this.$route.query.target)
                            return
                        }

                        this.$router.push(`/pool/${this.token}`)
                    })
                    .catch(err => {
                        this.tryingHash = false

                        if ((err instanceof ResponseError) && err.statusCode === 400) {
                            if (isJWT) {
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
            this.$refs.password.select()
        }
    }
</script>

<style scoped>

</style>