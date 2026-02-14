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
    import { useSquareHighlight } from "@/composables/useSquareHighlight";

    export default {
        name: "Claim.vue",
        setup() {
            const { setPrimarySquare } = useSquareHighlight()
            return { setPrimarySquare }
        },
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
            if ('localStorage' in window) {
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

                if ('localStorage' in window) {
                    localStorage.setItem('claimant-name', this.name)
                }

                // first click will be primary, second click will be to lock it in
                if (this.poolConfig.gridType === 'roll100') {
                    this.setPrimarySquare({
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
