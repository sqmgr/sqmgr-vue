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
    <div class="errors" v-if="validationErrors">
        <p>There were one or more errors:</p>

        <ul>
            <li v-for="key in Object.keys(validationErrors).sort()" :key="key">
                {{key}}
                <ul>
                    <li v-for="(err, i) in validationErrors[key]" :key="`${i}-${err}`">{{err}}</li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "ValidationErrors",
        props: {
            validationErrors: Array
        }
    }
</script>

<style scoped>

</style>