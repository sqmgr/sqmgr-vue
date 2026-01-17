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
    <section class="home-header">
        <div class="hero-content">
            <h2>The Best Way to Manage Your Football Squares Pool</h2>
            <p class="subtitle">Free. Customizable. Easy to use.</p>

            <div class="cta-container">
                <router-link class="btn cta-primary" to="/create">Create Pool</router-link>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "HomeHeader"
    }
</script>

<style lang="scss" scoped>
    @use '../variables.scss' as *;

    section.home-header {
        text-align: center;
        padding:    $standard-spacing * 2 0;

        .hero-content {
            max-width: 800px;
            margin: 0 auto;
        }

        h2 {
            font-size:     2.5em;
            margin-bottom: $standard-spacing;
            font-weight:   700;
            line-height:   1.2;
        }

        p.subtitle {
            font-size:     1.5em;
            color:         rgba(255, 255, 255, 0.9);
            margin-bottom: $standard-spacing * 2;
            font-weight:   300;
        }

        .cta-container {
            display: flex;
            justify-content: center;
            gap: $standard-spacing;
        }

        .btn {
            font-size:      1.2em;
            padding:        12px 30px;
            border-radius:  50px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight:    bold;
            transition:     all 0.2s ease;

            &.cta-primary {
                background-color: $yellow;
                color:            $text-color;
                box-shadow:       0 4px 15px rgba(0,0,0,0.2);

                &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.25);
                    background: lighten($yellow, 5%);
                }

                &:active {
                    transform: translateY(1px);
                    box-shadow: 0 2px 10px rgba(0,0,0,0.15);
                }
            }

            &.cta-secondary {
                background-color: transparent;
                border:           2px solid #fff;
                color:            #fff;

                &:hover {
                    background-color: rgba(255,255,255,0.1);
                    transform: translateY(-2px);
                }
            }
        }
    }

    @media (max-width: 600px) {
        section.home-header {
            h2 {
                font-size: 2em;
            }

            p.subtitle {
                font-size: 1.2em;
            }

            .cta-container {
                flex-direction: column;
                align-items: center;
                gap: $standard-spacing / 2;
            }

            .btn {
                width: 100%;
                max-width: 300px;
            }
        }
    }
</style>