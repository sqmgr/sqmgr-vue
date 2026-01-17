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
    <section class="index">
        <div class="section-header">
            <h2>Why Choose SqMGR?</h2>
            <p>Everything you need to run a successful football squares pool</p>
        </div>

        <div class="features-grid">
            <div class="feature-card free">
                <div class="icon-container">
                    <i class="fas fa-wallet"></i>
                </div>
                <h3>100% Free</h3>
                <p>Unlike other sites that charge upwards of $30 per pool, SqMGR is completely free.</p>
                <ul class="benefits">
                    <li>No hidden fees</li>
                    <li>No intrusive ads</li>
                    <li>No premium tiers</li>
                </ul>
            </div>

            <div class="feature-card customizable">
                <div class="icon-container">
                    <i class="fas fa-cogs"></i>
                </div>
                <h3>Fully Customizable</h3>
                <p>Easily change settings to match exactly how you want to run your pool.</p>
                <ul class="benefits">
                    <li>Multiple grid types</li>
                    <li>Custom team colors</li>
                    <li>Flexible lock dates</li>
                </ul>
            </div>

            <div class="feature-card persistence">
                <div class="icon-container">
                    <i class="fas fa-calendar-alt"></i>
                </div>
                <h3>Season Persistence</h3>
                <p>Run pools for an entire season or playoffs with the same claimed squares.</p>
                <ul class="benefits">
                    <li>Re-use claimed squares</li>
                    <li>New numbers each week</li>
                    <li>Track all games in one place</li>
                </ul>
            </div>
        </div>

        <div class="grid-showcase">
            <p class="showcase-intro">See your pool come to life with a professional, easy-to-read grid</p>
            <div class="grid-image">
                <img srcset="../assets/grid.png,
                             ../assets/grid@2x.png 2x,
                             ../assets/grid@3x.png 3x"
                     src="../assets/grid.png"
                     alt="Football Squares Grid Example" />
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "Home",
    }
</script>

<style lang="scss" scoped>
    @use '../variables.scss' as *;

    section.index {
        max-width:  1200px;
        margin:     0 auto;
        padding:    $standard-spacing * 2 0;
    }

    .section-header {
        text-align:    center;
        margin-bottom: $standard-spacing * 2;

        h2 {
            font-size:     2em;
            margin-bottom: calc($standard-spacing / 2);
            color:         $text-color;
        }

        p {
            font-size: 1.15em;
            color:     $dark-gray;
            margin:    0;
        }
    }

    .features-grid {
        display:               grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap:              $standard-spacing * 1.5;
        margin-bottom:         $standard-spacing * 3;
    }

    .feature-card {
        background:     #fff;
        border:         1px solid #eee;
        border-radius:  16px;
        padding:        $standard-spacing * 1.5;
        text-align:     center;
        transition:     all 0.3s ease;
        box-shadow:     0 2px 8px rgba(0, 0, 0, 0.04);

        &:hover {
            transform:  translateY(-8px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
            border-color: transparent;
        }

        .icon-container {
            width:            64px;
            height:           64px;
            background:       linear-gradient(135deg, rgba($primary, 0.1) 0%, rgba($primary, 0.05) 100%);
            border-radius:    16px;
            display:          flex;
            align-items:      center;
            justify-content:  center;
            margin:           0 auto $standard-spacing;

            i {
                font-size: 1.75em;
                color:     $primary;
            }
        }

        h3 {
            font-size:     1.25em;
            margin-bottom: $standard-spacing * 0.75;
            color:         $text-color;
        }

        & > p {
            color:         $dark-gray;
            line-height:   1.6;
            font-size:     0.95em;
            margin-bottom: $standard-spacing;
        }

        ul.benefits {
            list-style:    none;
            margin:        0;
            padding:       0;
            text-align:    left;

            li {
                padding:       $standard-spacing * 0.4 0;
                padding-left:  $standard-spacing * 1.25;
                position:      relative;
                color:         $text-color;
                font-size:     0.9em;

                &::before {
                    content:     '\f00c';
                    font-family: 'Font Awesome 5 Free';
                    font-weight: 900;
                    position:    absolute;
                    left:        0;
                    color:       $primary;
                    font-size:   0.8em;
                }
            }
        }
    }

    .grid-showcase {
        text-align: center;

        .showcase-intro {
            font-size:     1.1em;
            color:         $dark-gray;
            margin-bottom: $standard-spacing * 1.5;
        }

        .grid-image {
            perspective: 1000px;

            img {
                max-width:     100%;
                width:         800px;
                transform:     rotateX(8deg) rotateY(-3deg) rotateZ(1deg);
                box-shadow:    0 25px 50px rgba(0, 0, 0, 0.15);
                border-radius: 12px;
                border:        8px solid white;
                transition:    all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);

                &:hover {
                    transform:  rotateX(0) rotateY(0) rotateZ(0) scale(1.02);
                    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
                }
            }
        }
    }

    @media(max-width: 900px) {
        .features-grid {
            grid-template-columns: 1fr;
            grid-gap: $standard-spacing;
        }

        .feature-card {
            padding: $standard-spacing;

            &:hover {
                transform: translateY(-4px);
            }
        }

        .grid-showcase {
            .grid-image {
                img {
                    transform:     none;
                    width:         100%;
                    box-shadow:    0 10px 30px rgba(0, 0, 0, 0.12);
                    border-width:  4px;
                    border-radius: 8px;

                    &:hover {
                        transform: scale(1.01);
                    }
                }
            }
        }
    }
</style>