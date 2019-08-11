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
    <div :class="`square ${squareData.state}`" @click.prevent="didClickSquare">
        <span class="square-id">{{ sqId }}</span>
        <span class="name">{{ squareData.claimant }}</span>

        <template v-if="squareData.userId === poolConfig.userId">
            <i class="fas fa-asterisk owned"></i>
        </template>
    </div>
</template>

<script>
    import SquareDetails from './SquareDetails.vue'
    import ModalController from '@/controllers/ModalController'
    import sqmgrClient from "@/models/sqmgrClient";

    export default {
        name: "Square.vue",
        props: {
            poolConfig: {
                type: Object,
                required: true,
            },
            gridId: {
                type: Number,
                required: true,
            },
            sqId: {
                type: Number,
                required: true,
            },
            squareData: {
                type: Object,
                required: true,
            },
        },
        methods: {
            didClickSquare() {
                sqmgrClient.getSquareByTokenAndSquareId(this.poolConfig.token, this.sqId)
                    .then(data => {
                        ModalController.show('Square Details', SquareDetails, {
                            data,
                            poolConfig: this.poolConfig,
                        })
                    })
            }
        }
    }
</script>

<style scoped lang="scss">
    span.name {
        overflow: hidden;
    }
</style>
