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
    <section class="guest-account">
        <h1>Guest Account</h1>

        <p>You have currently joined one or more pools using a guest account. Guest accounts only persist for your current browsing session. You can easily save them by registering an account <a href="#" @click.prevent="register">here</a>.</p>

        <h2>Pools You Joined</h2>

        <your-account-pool-list
                :per-page="poolsPerPage"
                :current-page="currentPage"
                :data="pools"
                @page="goToPage"
                v-if="pools"
        />
    </section>
</template>

<script>
    import sqmgrClient from "@/models/sqmgrClient";
    import ModalController from "@/controllers/ModalController";
    import YourAccountPoolList from "@/components/pool/YourAccountPoolList";
    import { usePaginatedFetch } from "@/composables/usePaginatedFetch";

    export default {
        name: "GuestAccount",
        components: {YourAccountPoolList},
        setup() {
            const poolsPerPage = 10
            const { data: pools, currentPage, fetch: fetchPools, goToPage } = usePaginatedFetch(
                (offset, perPage) => sqmgrClient.getUserJoinedPools(offset, perPage),
                poolsPerPage,
                err => ModalController.showError(err),
            )
            fetchPools()
            return { pools, currentPage, goToPage, poolsPerPage }
        },
        methods: {
            register() {
                this.$auth.loginWithRedirect({
                    target: `/account`
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    :deep(table) {
         margin: 0 auto;
        width: auto;
    }
</style>
