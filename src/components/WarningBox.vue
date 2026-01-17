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
    @use '../variables.scss' as *;

    div.warning-box {
        background:       linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%);
        padding:          calc(var(--spacing) * 0.75);
        margin-bottom:    var(--spacing);
        border-left:      4px solid #e6a700;
        border-radius:    0 8px 8px 0;
        box-shadow:       0 2px 8px rgba(0, 0, 0, 0.08);

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