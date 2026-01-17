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
    <section class="manual-draw">
        <form @submit.prevent="submit" class="standalone">
            <p>Instead of letting SqMGR randomly draw the numbers, you can manually input them below. This action cannot be undone.</p>

            <warning-box v-if="!allSquaresClaimed" warning="Not all squares have been claimed yet" />

            <div class="field">
                <label :style="homeTeamLabelStyle">{{ grid.homeTeamName }}</label>
                <manual-draw-numbers ref="homeNumbers" v-model="homeNumbers"/>
            </div>
            <div class="field">
                <label :style="awayTeamLabelStyle">{{ grid.awayTeamName }}</label>
                <manual-draw-numbers v-model="awayNumbers"/>
            </div>
            <div class="buttons">
                <button type="button" class="secondary" @click="cancel">Cancel</button>
                <button :disabled="!this.homeNumbers.valid || !this.awayNumbers.valid" type="submit">Draw</button>
            </div>
        </form>
    </section>
</template>

<script>
    import ManualDrawNumbers from "@/components/ManualDrawNumbers";
    import ModalController from "@/controllers/ModalController";
    import WarningBox from "@/components/WarningBox";

    export default {
        name: "ManualDraw",
        components: {WarningBox, ManualDrawNumbers},
        props: {
            allSquaresClaimed: {
                type: Boolean,
                required: true,
            },
            grid: {
                type: Object,
                required: true,
            }
        },
        emits: ['draw'],
        data() {
            return {
                homeNumbers: {
                    valid: false,
                    numbers: ['', '', '', '', '', '', '', '', '', ''],
                },
                awayNumbers: {
                    valid: false,
                    numbers: ['', '', '', '', '', '', '', '', '', ''],
                },
            }
        },
        mounted() {
            this.$refs.homeNumbers.select()
        },
        methods: {
            cancel() {
                ModalController.hide()
            },
            submit() {
                this.$emit('draw', {
                    homeNumbers: this.homeNumbers.numbers.map(n => parseInt(n, 10)),
                    awayNumbers: this.awayNumbers.numbers.map(n => parseInt(n, 10)),
                })
            },
            labelStyle(c1, c2) {
                return `background: linear-gradient(to bottom, ${c1}, ${c1} calc(50% - 1px), #fff calc(50% - 1px), #fff calc(50% + 1px), ${c2} calc(50% + 1px))`;
            }
        },
        computed: {
            homeTeamLabelStyle() {
                return this.labelStyle(this.grid.settings.homeTeamColor1, this.grid.settings.homeTeamColor2)
            },
            awayTeamLabelStyle() {
                return this.labelStyle(this.grid.settings.awayTeamColor1, this.grid.settings.awayTeamColor2)
            }
        }
    }
</script>

<style scoped lang="scss">
    @use '../variables.scss' as *;

    label {
        font-family: 'Alfa Slab One', sans-serif;
        font-size:   1.2em;
        color:       #fff;
        padding:     $minimal-spacing;
        text-align:  center;
        text-shadow: 0 0 3px rgba(black, 0.8);
    }
</style>