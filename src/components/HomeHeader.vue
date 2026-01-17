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
            <p class="credibility-badge">Trusted by Pool Managers Everywhere</p>
            <h2>The <span class="highlight">Easiest Way</span> to Run Your Football Squares Pool</h2>
            <p class="subtitle">Create professional pools in minutes. Share with friends. Track results
                automatically.</p>

            <div class="cta-container">
                <router-link class="btn cta-primary" to="/create">Create Your Pool</router-link>
                <router-link class="btn cta-secondary" to="/how-it-works">See How It Works</router-link>
            </div>

            <p class="social-proof">100% Free - No Hidden Fees - No Ads</p>
        </div>
    </section>
</template>

<script>
export default {
    name: "HomeHeader",
}
</script>

<style lang="scss" scoped>
@use "sass:color";
@use '../variables.scss' as *;

section.home-header {
    text-align: center;
    padding:    $standard-spacing * 2.5 0;

    .hero-content {
        max-width: 800px;
        margin:    0 auto;
    }

    p.credibility-badge {
        display:         inline-block;
        background:      rgba(255, 255, 255, 0.15);
        color:           rgba(255, 255, 255, 0.95);
        padding:         6px 16px;
        border-radius:   20px;
        font-size:       0.85em;
        font-weight:     500;
        letter-spacing:  0.5px;
        margin-bottom:   $standard-spacing;
        backdrop-filter: blur(4px);
    }

    h2 {
        font-size:     2.5em;
        margin-bottom: $standard-spacing;
        font-weight:   700;
        line-height:   1.2;

        .highlight {
            color:    $yellow;
            position: relative;

            &::after {
                content:       '';
                position:      absolute;
                bottom:        2px;
                left:          0;
                right:         0;
                height:        4px;
                background:    rgba($yellow, 0.4);
                border-radius: 2px;
            }
        }
    }

    p.subtitle {
        font-size:     1.25em;
        color:         rgba(255, 255, 255, 0.9);
        margin-bottom: $standard-spacing * 1.5;
        font-weight:   400;
        line-height:   1.5;
    }

    .cta-container {
        display:         flex;
        justify-content: center;
        gap:             $standard-spacing;
        margin-bottom:   $standard-spacing * 1.5;
    }

    .btn {
        font-size:      1.1em;
        padding:        14px 32px;
        border-radius:  50px;
        border:         2px solid transparent;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight:    bold;
        transition:     all 0.2s ease;

        &.cta-primary {
            background: linear-gradient(135deg, $yellow 0%, color.adjust($yellow, $lightness: -5%) 100%);
            color:      $text-color;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1);

            &:hover {
                transform:       translateY(-3px);
                box-shadow:      0 8px 25px rgba(0, 0, 0, 0.25), 0 4px 8px rgba(0, 0, 0, 0.1);
                background:      linear-gradient(135deg, color.adjust($yellow, $lightness: 5%) 0%, $yellow 100%);
                text-decoration: none;
            }

            &:active {
                transform:  translateY(0);
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
            }
        }

        &.cta-secondary {
            background-color: transparent;
            border:           2px solid rgba(255, 255, 255, 0.8);
            color:            #fff;

            &:hover {
                background-color: rgba(255, 255, 255, 0.15);
                border-color:     #fff;
                transform:        translateY(-3px);
                text-decoration:  none;
            }
        }
    }

    p.social-proof {
        font-size: 0.9em;
        color:     rgba(255, 255, 255, 0.7);
        margin:    0;
    }
}

@media (max-width: 600px) {
    section.home-header {
        padding: $standard-spacing * 1.5 0;

        p.credibility-badge {
            font-size: 0.75em;
        }

        h2 {
            font-size: 1.8em;
        }

        p.subtitle {
            font-size: 1.1em;
        }

        .cta-container {
            flex-direction: column;
            align-items:    center;
            gap:            $standard-spacing * 0.75;
        }

        .btn {
            width:     100%;
            max-width: 280px;
            padding:   12px 24px;
            font-size: 1em;
        }

        p.social-proof {
            font-size: 0.8em;
        }
    }
}
</style>