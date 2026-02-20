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
    <section class="about">
        <div class="intro">
            <h1>About SqMGR</h1>
            <p class="lead">The best way to manage your football squares pools online.</p>
        </div>

        <div class="content-grid">
            <div class="card origin">
                <h2><i class="fas fa-history"></i> Origin Story</h2>
                <p>SqMGR was born out of frustration. Managing paper pools is messy, and existing online tools were either outdated or expensive. I wanted to build something better, something I would want to use myself.</p>
            </div>

            <div class="card goals">
                <h2><i class="fas fa-bullseye"></i> Project Goals</h2>
                <ul>
                    <li><strong>User Experience:</strong> Make the site intuitive for both administrators and participants.</li>
                    <li><strong>Privacy Focused:</strong> No selling user data. Your privacy matters.</li>
                    <li><strong>Open Source:</strong> The code is available for anyone to inspect and contribute to.</li>
                    <li><strong>Free Forever:</strong> The core service will always be free to use.</li>
                    <li><strong>Compliance &amp; Ethics:</strong> SqMGR is a recreational tool for social pools. We do not facilitate wagering, process payments, or host real-money gambling of any kind.</li>
                </ul>
            </div>

            <div class="card tech">
                <h2><i class="fas fa-code"></i> Technology</h2>
                <p>SqMGR is built with Vue.js on the frontend and Go on the backend, backed by PostgreSQL and deployed on Kubernetes.</p>
                <p>The real-time score pipeline avoids the usual overhead of a dedicated message broker entirely. When a scheduled job writes an updated score, PostgreSQL fires a <code>NOTIFY</code> event on a named channel. The Go server holds an active <code>LISTEN</code> connection and, on receipt, fans the event out to every affected pool's connected clients via Server-Sent Events (SSE). Scores appear on your grid instantly—no polling, no page refresh, no Redis.</p>
            </div>
        </div>

        <div class="developer">
            <div class="developer-bio">
                <div class="developer-text">
                    <h2>Built by Tom Peters</h2>
                    <p class="developer-title">Sr. Director of Product &amp; Lifelong Buffalo Sports Fan</p>
                    <p>I'm Tom Peters, a product management leader with two decades (yeesh) of experience building and shipping software used by millions. I've run football and basketball squares pools with friends for years and I got tired of managing them using spreadsheets. As a result, I built SqMGR as a fun side project back in 2019 and here we are.</p>
                    <p>Go Bills</p>
                    <div class="developer-links">
                        <a href="https://www.linkedin.com/in/thomas-peters/" target="_blank" rel="noopener noreferrer" class="linkedin-link">
                            <i class="fab fa-linkedin"></i> Connect on LinkedIn
                        </a>
                        <a href="https://github.com/weters" target="_blank" rel="noopener noreferrer" class="github-link">
                            <i class="fab fa-github"></i> GitHub
                        </a>
                    </div>
                </div>
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
@use '../../variables.scss' as *;

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
        margin-bottom: calc($standard-spacing / 2);
    }

    .lead {
        font-size: 1.2em;
        color: $dark-gray;
    }
}

.developer {
    margin-top: $standard-spacing * 2;
}

.developer-bio {
    background:    $surface-elevated;
    border:        1px solid $light-gray;
    border-radius: $radius-lg;
    box-shadow:    $shadow-card;
    padding:       $standard-spacing * 1.5;
}

.developer-text {
    h2 {
        font-size:     1.6em;
        margin-bottom: calc($standard-spacing / 4);
        color:         $text-color;
    }

    p.developer-title {
        font-size:     0.95em;
        font-weight:   600;
        color:         $primary;
        margin-bottom: $standard-spacing;
    }

    p {
        color:       $text-secondary;
        line-height: 1.65;
        font-size:   0.95em;
    }
}

.developer-links {
    display:    flex;
    gap:        $space-3;
    margin-top: calc($standard-spacing / 2);
    flex-wrap:  wrap;
}

.linkedin-link,
.github-link {
    display:         inline-flex;
    align-items:     center;
    gap:             8px;
    padding:         $space-2 $space-5;
    color:           #fff;
    border-radius:   $radius-md;
    font-size:       0.9em;
    font-weight:     600;
    text-decoration: none;
    transition:      background 200ms ease, transform 150ms ease;

    i {
        font-size: 1.1em;
    }

    &:hover {
        color:           #fff;
        text-decoration: none;
        transform:       translateY(-1px);
    }
}

.linkedin-link {
    background: #0a66c2;

    &:hover {
        background: #004182;
    }
}

.github-link {
    background: #24292f;

    &:hover {
        background: #000;
    }
}


.card.tech code {
    font-family:      monospace;
    font-size:        0.88em;
    background:       rgba($primary, 0.08);
    color:            $primary;
    padding:          1px 5px;
    border-radius:    $radius-sm;
}

.content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: $standard-spacing * 1.5;
}

.card {
    background: $surface-elevated;
    padding: $standard-spacing * 1.5;
    border-radius: $radius-lg;
    box-shadow: $shadow-card;
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
            margin-bottom: calc($standard-spacing / 2);
        }
    }
}
</style>