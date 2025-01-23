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
    <section class="account">
        <div class="actions col-3">
            <p>Welcome {{ $auth.profile.email }}</p>

            <p>
                <router-link to="/create">Create Squares Pool</router-link>
            </p>

            <div class="columns">
                <div class="col-2">
                    <h1>Squares Pools You Created</h1>

                    <template v-if="owned.loading">
                        <p>Loading ...</p>
                    </template>

                    <template v-if="owned.pools">
                        <p class="include-archived"><label><input type="checkbox" v-model="owned.showArchived"/> include
                            archived pools</label></p>
                        <your-account-pool-list
                                :can-archive="true"
                                :current-page="owned.currentPage"
                                :data="owned.pools"
                                :per-page="poolsPerPage"
                                @page="goToOwnedPoolsPage"
                                v-if="owned.pools"
                        />
                    </template>
                    <div v-else-if="owned.error" class="error">{{ owned.error }}</div>
                </div>

                <div class="col-2">
                    <h1>Squares Pools You Joined</h1>

                    <template v-if="joined.loading">
                        <p>Loading ...</p>
                    </template>

                    <template v-if="joined.pools">
                        <p class="include-archived-empty">&nbsp;</p>

                        <your-account-pool-list
                                :can-leave="true"
                                :current-page="joined.currentPage"
                                :data="joined.pools"
                                :per-page="poolsPerPage"
                                @page="goToJoinedPoolsPage"
                                v-if="joined.pools"
                        />
                    </template>
                    <div v-else-if="joined.error" class="error">{{ joined.error }}</div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import sqmgrClient from "@/models/sqmgrClient";
    import YourAccountPoolList from "@/components/YourAccountPoolList";
    import ResponseError from "@/models/ResponseError";

    export default {
        name: "YourAccount",
        components: {YourAccountPoolList},
        data() {
            return {
                poolsPerPage: 10,

                owned: {
                    showArchived: false,
                    pools: null,
                    loading: true,
                    currentPage: 1,
                    error: null,
                },
                joined: {
                    pools: null,
                    loading: true,
                    currentPage: 1,
                    error: null,
                },
            }
        },
        computed: {
            showArchived() {
                return this.owned.showArchived
            }
        },
        async beforeMount() {
            this.fetchOwnedPools()
            this.fetchJoinedPools()
        },
        watch: {
            showArchived() {
                this.fetchOwnedPools()
            }
        },
        methods: {
            goToOwnedPoolsPage(page) {
                this.fetchOwnedPools((page - 1) * this.poolsPerPage)
            },
            goToJoinedPoolsPage(page) {
                this.fetchJoinedPools((page - 1) * this.poolsPerPage)
            },
            fetchOwnedPools(offset = 0) {
                sqmgrClient.getUserOwnedPools(this.owned.showArchived, offset, this.poolsPerPage)
                    .then(res => {
                        this.owned.pools = res
                        this.owned.currentPage = (offset / this.poolsPerPage) + 1
                    })
                    .catch(this.catchFetchError(this.owned))
                    .finally(() => this.owned.loading = false)
            },
            fetchJoinedPools(offset = 0) {
                sqmgrClient.getUserJoinedPools(offset, this.poolsPerPage)
                    .then(res => {
                        this.joined.pools = res
                        this.joined.currentPage = (offset / this.poolsPerPage) + 1
                    })
                    .catch(this.catchFetchError(this.joined))
                    .finally(() => this.joined.loading = false)
            },
            catchFetchError(obj) {
                return err => {
                    if (err instanceof ResponseError) {
                        obj.error = err.message
                        return
                    }

                    console.log("catchFetchError", err)
                    obj.error = 'Could not request data from the server. Please try your request again.'
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    p.include-archived {
        margin-bottom: 0;

        input {
            display: inline-block;
            width:   auto;
        }
    }

    p.include-archived, p.include-archived-empty {
        line-height:   28px;
        height:        28px;
        margin-bottom: 0;
    }

    @media(max-width: 800px) {
        p.include-archived-empty {
            display: none;
        }
    }
</style>