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
    <section class="how-it-works">
        <div class="intro">
            <h1>How It Works</h1>
            <p class="lead">Get your football squares pool up and running in just a few simple steps.</p>
        </div>

        <div class="steps-grid">
            <div class="card step">
                <div class="step-number">1</div>
                <h2><i class="fas fa-plus-circle"></i> Create Your Pool</h2>
                <p>Set up your pool with game details and customize settings. Choose your grid size, set the event name, and go!</p>
            </div>

            <div class="card step">
                <div class="step-number">2</div>
                <h2><i class="fas fa-share-alt"></i> Share the Link</h2>
                <p>Invite friends and family with a simple shareable link. No account required for participants to join - just send them the link and they're in.</p>
            </div>

            <div class="card step">
                <div class="step-number">3</div>
                <h2><i class="fas fa-th"></i> Claim Your Squares</h2>
                <p>Participants pick their squares on the grid.</p>
            </div>

            <div class="card step">
                <div class="step-number">4</div>
                <h2><i class="fas fa-random"></i> Numbers Are Drawn</h2>
                <p>You can either let SqMGR randomly assign numbers to your pool or you can manually pick them.</p>
            </div>

            <div class="card step">
                <div class="step-number">5</div>
                <h2><i class="fas fa-trophy"></i> Track Results</h2>
                <p>Keep track of payments and easily mark the winners on your grid.</p>
            </div>
        </div>

        <div class="cta-section">
            <router-link class="btn cta-primary" to="/create">Create Your Pool Now</router-link>
        </div>
    </section>
</template>

<script>
    export default {
        name: "HowItWorks"
    }
</script>

<style lang="scss" scoped>
@use "sass:color";
@use '../../variables.scss' as *;

section.how-it-works {
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

.steps-grid {
    display:               grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap:                   $space-6;
    counter-reset:         steps;
}

.card {
    background:    $surface-elevated;
    padding:       $space-8 $space-6;
    border-radius: $radius-xl;
    box-shadow:    $shadow-card;
    transition:    all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    border:        1px solid $light-gray;
    position:      relative;
    counter-increment: steps;

    &:hover {
        transform:    translateY(-4px);
        box-shadow:   0 8px 28px rgba(0, 0, 0, 0.1);
        border-color: color.adjust($primary, $alpha: -0.7);
    }

    .step-number {
        position:       absolute;
        top:            -14px;
        left:           $space-6;
        width:          32px;
        height:         32px;
        background:     $primary;
        color:          #fff;
        border-radius:  $radius-lg;
        display:        flex;
        align-items:    center;
        justify-content: center;
        font-weight:    400;
        font-size:      0.875em;
        font-family:    'Anton', sans-serif;
        box-shadow:     0 2px 8px rgba($primary, 0.3);
    }

    h2 {
        color:          $text-color;
        font-size:      1.15em;
        margin-bottom:  $space-3;
        margin-top:     $space-2;
        display:        flex;
        align-items:    center;
        gap:            $space-3;

        i {
            color:     $primary;
            font-size: 0.9em;
        }
    }

    p {
        color:       $text-secondary;
        line-height: 1.65;
        font-size:   0.9em;
        margin:      0;
    }
}

.cta-section {
    text-align: center;
    margin-top: $space-12;

    .btn.cta-primary {
        display:        inline-block;
        font-family:    'Outfit', sans-serif;
        font-size:      0.875em;
        padding:        $space-4 $space-8;
        border-radius:  $radius-full;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        font-weight:    700;
        background:     $primary;
        color:          #fff;
        text-decoration: none;
        transition:     all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        box-shadow:     0 2px 12px rgba($primary, 0.3);

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

        .lead {
            font-size: 1.05em;
        }
    }

    .steps-grid {
        grid-template-columns: 1fr;
        gap: $space-8;
    }

    .card {
        padding: $space-6 $space-5;

        h2 {
            font-size: 1.1em;
        }
    }
}
</style>
