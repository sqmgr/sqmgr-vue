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
    <section class="resources-index">
        <div class="intro">
            <h1>Football Squares Resources</h1>
            <p class="lead">Guides for running football and basketball squares pools. How the game works, setting up on SqMGR, and getting the most out of every feature.</p>
        </div>

        <div class="articles-grid">
            <router-link to="/resources/how-squares-work" class="article-card">
                <div class="article-icon"><i class="fas fa-th"></i></div>
                <h2>How Squares Work</h2>
                <p>New to football or basketball squares? Learn the complete rules, how the grid works, how numbers are drawn, and how winners are determined each quarter.</p>
                <span class="read-more">Read article <i class="fas fa-arrow-right"></i></span>
            </router-link>

            <router-link to="/resources/setting-up-a-pool" class="article-card">
                <div class="article-icon"><i class="fas fa-plus-circle"></i></div>
                <h2>Setting Up a Pool on SqMGR</h2>
                <p>How to create your pool, choose a grid type, share with participants, and draw numbers on SqMGR.</p>
                <span class="read-more">Read article <i class="fas fa-arrow-right"></i></span>
            </router-link>

            <router-link to="/resources/linking-live-events-and-payouts" class="article-card">
                <div class="article-icon"><i class="fas fa-link"></i></div>
                <h2>Linking to a Live Event &amp; Configuring Payouts</h2>
                <p>Link your grid to a live NFL or college football game for real-time score updates and configure your payout percentages per quarter.</p>
                <span class="read-more">Read article <i class="fas fa-arrow-right"></i></span>
            </router-link>

            <router-link to="/resources/multiple-games-and-rollover" class="article-card">
                <div class="article-icon"><i class="fas fa-layer-group"></i></div>
                <h2>Multiple Games &amp; the Rollover Mechanic</h2>
                <p>Run a season-long pool with multiple grids. How to add games to a pool and carry unclaimed squares forward from week to week.</p>
                <span class="read-more">Read article <i class="fas fa-arrow-right"></i></span>
            </router-link>

            <router-link to="/resources/best-numbers-in-football-squares" class="article-card">
                <div class="article-icon"><i class="fas fa-chart-bar"></i></div>
                <h2>Best Numbers in Football Squares</h2>
                <p>Some numbers win far more often than others. We break down the historical win rates and explain the scoring math behind the most (and least) valuable squares.</p>
                <span class="read-more">Read article <i class="fas fa-arrow-right"></i></span>
            </router-link>

            <router-link to="/resources/super-bowl-squares" class="article-card featured">
                <div class="article-icon"><i class="fas fa-trophy"></i></div>
                <h2>Super Bowl Squares Guide</h2>
                <p>The Super Bowl is the biggest squares event of the year. Get tips on organizing your pool, popular payout structures, and how to run a smooth game-day experience.</p>
                <span class="read-more">Read article <i class="fas fa-arrow-right"></i></span>
            </router-link>
        </div>

        <div class="cta-section">
            <p>Ready to run your own pool?</p>
            <router-link class="btn cta-primary" to="/create">Create a Free Pool</router-link>
        </div>
    </section>
</template>

<script>
    export default {
        name: "ResourcesIndex",
        mounted() {
            this._jsonLd = document.createElement('script')
            this._jsonLd.type = 'application/ld+json'
            this._jsonLd.text = JSON.stringify([
                {
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "@id": "https://sqmgr.com/resources",
                    "name": "Football Squares Resources",
                    "description": "Guides and articles covering how football squares work, how to set up a pool on SqMGR, live event linking, payouts, and strategy.",
                    "url": "https://sqmgr.com/resources",
                    "publisher": {
                        "@type": "Person",
                        "@id": "https://sqmgr.com/about#tom-peters",
                        "name": "Tom Peters"
                    }
                },
                {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://sqmgr.com/"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Resources",
                            "item": "https://sqmgr.com/resources"
                        }
                    ]
                }
            ])
            document.head.appendChild(this._jsonLd)
        },
        unmounted() {
            if (this._jsonLd) {
                document.head.removeChild(this._jsonLd)
            }
        }
    }
</script>

<style lang="scss" scoped>
@use "sass:color";
@use '../../../variables.scss' as *;

section.resources-index {
    max-width: 1100px;
    margin:    0 auto;
    padding:   $space-8 $space-5;
}

.intro {
    text-align:    center;
    margin-bottom: $space-12;

    h1 {
        font-size:      2.5em;
        color:          $text-color;
        margin-bottom:  $space-3;
        letter-spacing: -0.02em;
    }

    .lead {
        font-size: 1.15em;
        color:     $dark-gray;
        margin:    0;
    }
}

.articles-grid {
    display:               grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap:                   $space-6;
}

.article-card {
    display:         flex;
    flex-direction:  column;
    background:      $surface-elevated;
    border:          1px solid $light-gray;
    border-radius:   $radius-xl;
    padding:         $space-8 $space-6;
    text-decoration: none;
    color:           inherit;
    box-shadow:      $shadow-card;
    transition:      all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    &:hover {
        transform:       translateY(-4px);
        box-shadow:      0 8px 28px rgba(0, 0, 0, 0.1);
        border-color:    color.adjust($primary, $alpha: -0.6);
        text-decoration: none;

        .read-more {
            color: $primary;

            i {
                transform: translateX(3px);
            }
        }
    }

    &.featured {
        border-color: color.adjust($primary, $alpha: -0.7);
        background:   linear-gradient(135deg, $surface-elevated 0%, rgba($primary, 0.02) 100%);
    }
}

.article-icon {
    width:           44px;
    height:          44px;
    background:      rgba($primary, 0.1);
    border-radius:   $radius-lg;
    display:         flex;
    align-items:     center;
    justify-content: center;
    margin-bottom:   $space-4;
    flex-shrink:     0;

    i {
        color:     $primary;
        font-size: 1.15em;
    }
}

h2 {
    font-size:      1.15em;
    color:          $text-color;
    margin-bottom:  $space-3;
    line-height:    1.3;
    letter-spacing: -0.01em;
}

p {
    color:       $text-secondary;
    font-size:   0.9em;
    line-height: 1.65;
    flex-grow:   1;
    margin:      0 0 $space-4;
}

.read-more {
    font-size:   0.875em;
    font-weight: 600;
    color:       $dark-gray;
    transition:  color 0.2s ease;
    margin-top:  auto;

    i {
        font-size:  0.8em;
        margin-left: $space-1;
        transition: transform 0.2s ease;
    }
}

.cta-section {
    text-align: center;
    margin-top: $space-16;

    p {
        color:         $dark-gray;
        margin-bottom: $space-4;
        font-size:     1.1em;
    }

    .btn.cta-primary {
        display:         inline-block;
        font-family:     'Outfit', sans-serif;
        font-size:       0.875em;
        padding:         $space-4 $space-8;
        border-radius:   $radius-full;
        text-transform:  uppercase;
        letter-spacing:  0.04em;
        font-weight:     700;
        background:      $primary;
        color:           #fff;
        text-decoration: none;
        transition:      all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        box-shadow:      0 2px 12px rgba($primary, 0.3);

        &:hover {
            transform:       translateY(-2px);
            box-shadow:      0 8px 24px rgba($primary, 0.35);
            background:      color.adjust($primary, $lightness: 6%);
            text-decoration: none;
        }
    }
}

@include mobile {
    .intro {
        margin-bottom: $space-8;

        h1 {
            font-size: 2em;
        }
    }

    .articles-grid {
        grid-template-columns: 1fr;
    }
}
</style>
