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
    <section class="your-account-pool-list">
        <div class="pool-list-container">
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Created</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr :class="{ deleted: deletedPools[pool.token] }" v-for="pool in data.pools" :key="pool.token">
                    <td>
                        <router-link :to="`/pool/${pool.token}`">{{ pool.name }}</router-link>
                    </td>
                    <td>{{ pool.gridType }}</td>
                    <td>{{ date(pool.created) }}</td>
                    <td class="actions">
                        <template v-if="canArchive">
                            <button v-if="pool.archived"
                                    @click="unarchivePool(pool)"><i class="fas fa-trash-restore"></i> <span>Unarchive Pool</span>
                            </button>
                            <button v-else class="destructive"
                                    @click="archivePool(pool)"><i class="fas fa-trash"></i> <span>Archive Pool</span>
                            </button>
                        </template>
                        <button v-if="canLeave" :disabled="deletedPools[pool.token]" class="destructive"
                                @click="leavePool(pool)"><i class="fas fa-sign-out-alt"></i> <span>Leave Pool</span>
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <Pagination :total="data.total" :per-page="perPage" :current-page="currentPage" @page="goToPage"/>
    </section>
</template>

<script>
    import Pagination from "@/components/Pagination";
    import common from "@/common";
    import ModalController from '@/controllers/ModalController'
    import sqmgrClient from "@/models/sqmgrClient";

    export default {
        name: "YourAccountPoolList",
        components: {Pagination},
        props: {
            currentPage: {
                type: Number,
                required: true,
            },
            perPage: {
                type: Number,
                required: true,
            },
            data: {
                type: Object,
                required: true,
            },
            canArchive: {
                type: Boolean,
                required: false,
            },
            canLeave: {
                type: Boolean,
                required: false,
            },
        },
        data() {
            return {
                deletedPools: {},
            }
        },
        methods: {
            goToPage(page) {
                this.$emit('page', page)
            },
            date(datetime) {
                return new Date(datetime).toLocaleString(undefined, common.DateTimeOptions)
            },
            archivePool(pool) {
                sqmgrClient.archivePool(pool.token)
                    .then(() => {
                        pool.archived = true
                    })
                    .catch(err => ModalController.showError(err))
            },
            unarchivePool(pool) {
                sqmgrClient.unarchivePool(pool.token)
                    .then(() => {
                        pool.archived = false
                    })
                    .catch(err => ModalController.showError(err))
            },
            leavePool(pool) {
                ModalController.showPrompt('Leave the Squares Pool?', 'Are you sure you want to leave the squares pool?', {
                    actionButton: 'Leave',
                    action: () => {
                        sqmgrClient.leavePool(pool.token)
                            .then(() => {
                                this.$set(this.deletedPools, pool.token, true)
                                ModalController.hide()
                            })
                            .catch(err => ModalController.showError(err))
                    },
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    div.pool-list-container {
        overflow: auto;
        width: 100%;
    }

    table {
        width: 100%;

        .actions {
            text-align: right;

            button span {
                display: none;
            }
        }

        tr.deleted {
            text-decoration: line-through;
        }
    }
</style>
