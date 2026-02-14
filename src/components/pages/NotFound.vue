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
    <section class="not-found">
        <h1>404</h1>
        <p class="message">The page you're looking for doesn't exist.</p>
        <router-link to="/" class="action-btn lg">Go Home</router-link>
    </section>
</template>

<script>
export default {
    name: "NotFound",
}
</script>

<style lang="scss" scoped>
@use '../../variables.scss' as *;

section.not-found {
    text-align: center;
    padding: $standard-spacing * 4 $standard-spacing;

    h1 {
        font-size: 6em;
        color: $primary;
        margin-bottom: 0;
        line-height: 1;
    }

    .message {
        font-size: 1.25em;
        color: $dark-gray;
        margin-bottom: $standard-spacing * 2;
    }
}
</style>
