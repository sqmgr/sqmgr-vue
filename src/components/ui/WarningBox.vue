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
    <div class="warning-box">
        <p><i class="fas fa-exclamation-triangle"></i> <strong>Warning!</strong><br>{{ warning }}</p>
    </div>
</template>

<script>
    export default {
        name: "WarningBox",
        props: {
            warning: {
                type: String,
                required: true,
            }
        }
    }
</script>

<style scoped lang="scss">
    @use '../../variables.scss' as *;

    div.warning-box {
        background:       linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%);
        padding:          calc(var(--spacing) * 0.75);
        margin-bottom:    var(--spacing);
        border-left:      4px solid #e6a700;
        border-radius:    0 $radius-lg $radius-lg 0;
        box-shadow:       $shadow-card;

        p {
            margin: 0;
            color: #856404;
            line-height: 1.5;

            i {
                margin-right: calc($minimal-spacing * 2);
                color: #e6a700;
            }

            strong {
                color: #664d03;
            }
        }
    }
</style>