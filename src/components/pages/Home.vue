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
                    <li>Add your own branding</li>
                </ul>
                <div class="new-callout">
                    <span class="new-badge">New</span>
                    <span>Live score syncing for football &amp; basketball</span>
                </div>
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
                <picture>
                    <source srcset="/images/grid.webp" type="image/webp">
                    <img src="/images/grid.png"
                         alt="Football Squares Grid Example"
                         width="780"
                         height="572"/>
                </picture>
            </div>
        </div>
    </section>
</template>

<script setup>
</script>

<style lang="scss" scoped>
@use "sass:color";
@use '../../variables.scss' as *;

section.index {
    max-width: 1100px;
    margin:    0 auto;
    padding:   $space-12 0 $space-16;
}

.section-header {
    text-align:    center;
    margin-bottom: $space-12;

    h2 {
        font-size:      2.25em;
        margin-bottom:  $space-3;
        color:          $text-color;
        letter-spacing: -0.02em;
    }

    p {
        font-size:   1.1em;
        color:       $dark-gray;
        margin:      0;
        font-weight: 400;
    }
}

.features-grid {
    display:               grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap:              $space-6;
    margin-bottom:         $space-16;
}

.feature-card {
    background:    $surface-elevated;
    border:        1px solid $light-gray;
    border-radius: $radius-xl;
    padding:       $space-8;
    text-align:    left;
    transition:    all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow:    $shadow-card;
    position:      relative;

    &:hover {
        transform:    translateY(-6px);
        box-shadow:   0 8px 32px rgba(0, 0, 0, 0.1);
        border-color: color.adjust($primary, $alpha: -0.7);
    }

    .icon-container {
        width:           52px;
        height:          52px;
        background:      rgba($primary, 0.08);
        border-radius:   $radius-lg;
        display:         flex;
        align-items:     center;
        justify-content: center;
        margin-bottom:   $space-5;

        i {
            font-size: 1.25em;
            color:     $primary;
        }
    }

    h3 {
        font-size:     1.2em;
        margin-bottom: $space-3;
        color:         $text-color;
        font-weight:   400;
    }

    & > p {
        color:         $dark-gray;
        line-height:   1.65;
        font-size:     0.9em;
        margin-bottom: $space-5;
    }

    ul.benefits {
        list-style: none;
        margin:     0;
        padding:    0;

        li {
            padding:     $space-1 0 $space-1 $space-6;
            position:    relative;
            color:       $text-secondary;
            font-size:   0.875em;
            line-height: 1.5;

            &::before {
                font-family: 'Font Awesome 7 Pro';
                font-weight: 900;
                content:     '\f00c';
                position:    absolute;
                left:        0;
                color:       $primary;
                font-size:   0.7em;
                top:         7px;
            }
        }
    }

    .new-callout {
        display:     flex;
        align-items: center;
        gap:         $space-3;
        margin-top:  $space-5;
        padding-top: $space-5;
        border-top:  1px solid $light-gray;
        font-size:   0.8em;
        color:       $text-secondary;

        .new-badge {
            background:     $accent;
            color:          #1a1d23;
            font-size:      0.7em;
            font-weight:    700;
            padding:        3px 8px;
            border-radius:  $radius-sm;
            text-transform: uppercase;
            letter-spacing: 0.06em;
        }
    }
}

.grid-showcase {
    text-align: center;

    .showcase-intro {
        font-size:     1.1em;
        color:         $dark-gray;
        margin-bottom: $space-8;
    }

    .grid-image {
        picture {
            perspective: 1200px;
            display:     block;
        }

        img {
            max-width:     100%;
            width:         780px;
            height:        auto;
            transform:     rotateX(6deg) rotateY(-2deg) rotateZ(0.5deg);
            box-shadow:    0 20px 60px rgba(0, 0, 0, 0.12), 0 8px 20px rgba(0, 0, 0, 0.06);
            border-radius: $radius-xl;
            border:        6px solid white;
            transition:    all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);

            &:hover {
                transform:  rotateX(0) rotateY(0) rotateZ(0) scale(1.015);
                box-shadow: 0 32px 80px rgba(0, 0, 0, 0.14), 0 12px 28px rgba(0, 0, 0, 0.08);
            }
        }
    }
}

@media(max-width: 900px) {
    section.index {
        padding: $space-8 0 $space-10;
    }

    .section-header {
        margin-bottom: $space-8;

        h2 {
            font-size: 1.75em;
        }
    }

    .features-grid {
        grid-template-columns: 1fr;
        grid-gap:              $space-4;
        margin-bottom:         $space-10;
    }

    .feature-card {
        padding: $space-6;

        &:hover {
            transform: translateY(-3px);
        }
    }

    .grid-showcase {
        .grid-image {
            img {
                transform:     none;
                width:         100%;
                box-shadow:    0 8px 24px rgba(0, 0, 0, 0.1);
                border-width:  4px;
                border-radius: $radius-lg;

                &:hover {
                    transform: scale(1.01);
                }
            }
        }
    }
}
</style>