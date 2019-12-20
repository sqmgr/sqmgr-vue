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
    <form class="claim-square" @submit.prevent="submit">
        <div class="field">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Your name" v-model="name" required ref="name" :maxlength="maxLength">
        </div>

        <div class="buttons">
            <button type="button" class="secondary" @click.prevent="ModalController.hide()">Cancel</button>
            <button type="submit" name="submit" value="Claim">Claim</button>
        </div>
    </form>
</template>

<script>
    import ModalController from '@/controllers/ModalController'
    import sqmgrClient from "@/models/sqmgrClient";
    import sqmgrConfig from "@/models/sqmgrConfig";

    export default {
        name: "Claim.vue",
        props: {
            squareId: {
                type: Number,
                required: true,
            },
            poolConfig: {
                type: Object,
                required: true,
            },
        },
        data() {
            let name = null
            if (window.hasOwnProperty('localStorage')) {
                name = localStorage.getItem('claimant-name')
            }

            return {
                name,
                ModalController,
                maxLength: 100,
            }
        },
        created() {
            sqmgrConfig().then(
                res => this.maxLength = res.claimantMaxLength
            )
                .catch(err => ModalController.showError(err))
        },
        mounted() {
            this.$refs.name.select()
        },
        methods: {
            submit() {
                if (!this.name) {
                    return
                }

                if (window.hasOwnProperty('localStorage')) {
                    localStorage.setItem('claimant-name', this.name)
                }

                // first click will be primary, second click will be to lock it in
                if (this.poolConfig.gridType === 'roll100') {
                    this.$store.commit('primarySquare', {
                        squareId: this.squareId,
                        name: this.name,
                    })

                    ModalController.hideAll()
                    ModalController.showPrompt('Primary Selected', 'Your primary square has been selected. This square will be used for all games. Please now select your secondary square which will only be used for non-rollover games.', {
                        dismissButton: 'OK',
                    })

                    return
                }

                sqmgrClient.claimSquare(this.poolConfig.token, this.squareId, this.name)
                    .then(() => ModalController.hideAll())
                    .catch(err => ModalController.showError(err))
            }
        }
    }
</script>
