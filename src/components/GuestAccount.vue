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
    <section class="guest-account">
        <h1>Guest Account</h1>

        <p>You have currently joined one or more pools using a guest account. Guest accounts only persist for your current browsing session. You can easily save them by registering an account <a href="#" @click.prevent="register">here</a>.</p>

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
    import YourAccountPoolList from "@/components/YourAccountPoolList";
    import authService from "@/models/authService";

    export default {
        name: "GuestAccount",
        components: {YourAccountPoolList},
        data() {
            return {
                poolsPerPage: 10,
                pools: null,
                currentPage: 1,
                loading: true,
            }
        },
        created() {
            this.fetchPools()
        },
        methods: {
            goToPage(page) {
                const offset = ( page - 1 ) * this.poolsPerPage
                this.fetchPools(offset)
            },
            fetchPools(offset = 0) {
                sqmgrClient.getUserJoinedPools(offset, this.poolsPerPage)
                    .then(res => {
                        this.pools = res
                        this.currentPage = Math.floor(offset / this.poolsPerPage) + 1
                    })
                    .catch(err => ModalController.showError(err))
            },
            register() {
                authService.login({
                    target: `/account`
                })
            }
        }
    }
</script>

<style scoped lang="scss">
     /deep/ table {
         margin: 0 auto;
        width: auto;
    }
</style>