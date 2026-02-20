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

        <div class="developer">
            <div class="developer-bio">
                <div class="developer-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="developer-text">
                    <h2>Built by Tom Peters</h2>
                    <p class="developer-title">Sr. Director of Product &amp; Lifelong Buffalo Sports Fan</p>
                    <p>SqMGR isn't the product of a faceless startup or an AI content farm. It was built and is actively maintained by Tom Peters—a product management leader with over a decade of experience shipping software used by millions. Tom has run football squares pools with friends and family for years and built SqMGR because every other option was either broken, expensive, or both.</p>
                    <p>As a die-hard fan of the Bills, Sabres, and Buffaloes, Tom knows exactly what game day looks like—and exactly what a squares pool manager needs to do.</p>
                    <a href="https://www.linkedin.com/in/thomas-peters/" target="_blank" rel="noopener noreferrer" class="linkedin-link">
                        <i class="fab fa-linkedin"></i> Connect on LinkedIn
                    </a>
                </div>
            </div>
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
    margin-bottom: $standard-spacing * 2;
}

.developer-bio {
    display:       flex;
    gap:           $standard-spacing * 1.5;
    align-items:   flex-start;
    background:    $surface-elevated;
    border:        1px solid $light-gray;
    border-radius: $radius-lg;
    box-shadow:    $shadow-card;
    padding:       $standard-spacing * 1.5;
}

.developer-avatar {
    flex-shrink: 0;

    i {
        font-size: 5em;
        color:     $primary;
        opacity:   0.85;
    }
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

.linkedin-link {
    display:        inline-flex;
    align-items:    center;
    gap:            8px;
    margin-top:     calc($standard-spacing / 2);
    padding:        $space-2 $space-5;
    background:     #0a66c2;
    color:          #fff;
    border-radius:  $radius-md;
    font-size:      0.9em;
    font-weight:    600;
    text-decoration: none;
    transition:     background 200ms ease, transform 150ms ease;

    i {
        font-size: 1.1em;
    }

    &:hover {
        background:      #004182;
        color:           #fff;
        text-decoration: none;
        transform:       translateY(-1px);
    }
}

@media (max-width: 600px) {
    .developer-bio {
        flex-direction: column;
        align-items:    center;
        text-align:     center;
    }

    .developer-text h2 {
        font-size: 1.4em;
    }
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