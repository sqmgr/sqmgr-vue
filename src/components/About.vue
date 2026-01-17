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
    <section class="about">
        <div class="intro">
            <h1>About SqMGR</h1>
            <p class="lead">The best way to manage your football squares pools online.</p>
        </div>

        <div class="content-grid">
            <div class="card origin">
                <h2><i class="fas fa-history"></i> Origin Story</h2>
                <p>SqMGR was born out of frustration. Managing paper pools is messy, and existing online tools were either outdated, expensive, or riddled with ads. I wanted to build something better, something I would want to use myself.</p>
            </div>

            <div class="card goals">
                <h2><i class="fas fa-bullseye"></i> Project Goals</h2>
                <ul>
                    <li><strong>User Experience:</strong> Make the site intuitive for both administrators and participants.</li>
                    <li><strong>Privacy Focused:</strong> No ads. No selling user data. Your privacy matters.</li>
                    <li><strong>Open Source:</strong> The code is available for anyone to inspect and contribute to.</li>
                    <li><strong>Free Forever:</strong> The core service will always be free to use.</li>
                </ul>
            </div>

            <div class="card tech">
                <h2><i class="fas fa-code"></i> Technology</h2>
                <p>SqMGR is built with modern web technologies to ensure a fast and responsive experience. It uses Vue.js for the frontend and Go for the backend, ensuring reliability and speed during the big game.</p>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "About"
    }
</script>

<style lang="scss" scoped>
@use '../variables.scss' as *;

section.about {
    max-width: 1200px;
    margin: 0 auto;
    padding: $standard-spacing;
}

.intro {
    text-align: center;
    margin-bottom: $standard-spacing * 2;

    h1 {
        font-size: 2.5em;
        color: $primary;
        margin-bottom: $standard-spacing / 2;
    }

    .lead {
        font-size: 1.2em;
        color: $dark-gray;
    }
}

.content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: $standard-spacing * 1.5;
}

.card {
    background: #fff;
    padding: $standard-spacing * 1.5;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: transform 0.2s ease;
    border: 1px solid $light-gray;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 12px rgba(0,0,0,0.15);
    }

    h2 {
        color: $text-color;
        font-size: 1.5em;
        margin-bottom: $standard-spacing;
        display: flex;
        align-items: center;
        gap: 10px;

        i {
            color: $primary;
        }
    }

    p, li {
        color: $text-color;
        line-height: 1.6;
    }

    ul {
        padding-left: $standard-spacing;
        margin-left: 0;

        li {
            margin-bottom: $standard-spacing / 2;
        }
    }
}
</style>