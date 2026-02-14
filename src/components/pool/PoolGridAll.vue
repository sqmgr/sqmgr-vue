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
    <div class="pool-grid-all">
        <pool-grid v-for="grid in grids" :key="grid.id" :token="token" :grid-id="`${grid.id}`" :initial-pool="initialPool" embedded />
    </div>
</template>

<script>
    import sqmgrClient from "@/models/sqmgrClient";
    import ModalController from "@/controllers/ModalController";
    import PoolGrid from "@/components/pool/PoolGrid";
    import { usePoolEvents } from "@/composables/usePoolEvents";

    export default {
        name: "PoolGridAll",
        components: {PoolGrid},
        setup(props) {
            usePoolEvents(props.token)
        },
        props: {
            token: {
                type: String,
                required: true,
            },
            initialPool: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {
                grids: [],
            }
        },
        beforeMount() {
            sqmgrClient.getPoolGridsByToken(this.token)
                .then(res => this.grids = res.grids)
                .catch(err => ModalController.showError(err))
        }
    }
</script>

<style scoped lang="scss">
div.pool-grid-all {
    & > div {
        page-break-before: always;

        &:first-child {
            page-break-before: auto;
        }
    }
}
</style>