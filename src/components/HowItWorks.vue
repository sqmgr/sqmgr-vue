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
@use '../variables.scss' as *;

section.how-it-works {
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
        margin-bottom: calc($standard-spacing / 2);
    }

    .lead {
        font-size: 1.2em;
        color: $dark-gray;
    }
}

.steps-grid {
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
    position: relative;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 12px rgba(0,0,0,0.15);
    }

    .step-number {
        position: absolute;
        top: -15px;
        left: 20px;
        width: 36px;
        height: 36px;
        background: $primary;
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 1.2em;
    }

    h2 {
        color: $text-color;
        font-size: 1.3em;
        margin-bottom: $standard-spacing;
        margin-top: calc($standard-spacing / 2);
        display: flex;
        align-items: center;
        gap: 10px;

        i {
            color: $primary;
        }
    }

    p {
        color: $text-color;
        line-height: 1.6;
    }
}

.cta-section {
    text-align: center;
    margin-top: $standard-spacing * 2;

    .btn.cta-primary {
        display: inline-block;
        font-size: 1.1em;
        padding: 14px 32px;
        border-radius: 50px;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: bold;
        background: $primary;
        color: #fff;
        text-decoration: none;
        transition: all 0.2s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);

        &:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.25);
            text-decoration: none;
        }
    }
}

@media (max-width: 600px) {
    .intro {
        h1 {
            font-size: 2em;
        }

        .lead {
            font-size: 1.1em;
        }
    }

    .steps-grid {
        grid-template-columns: 1fr;
    }

    .card h2 {
        font-size: 1.2em;
    }
}
</style>
