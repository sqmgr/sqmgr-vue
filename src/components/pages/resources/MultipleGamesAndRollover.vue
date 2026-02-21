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
    <article class="resource-article">
        <nav class="breadcrumb" aria-label="Breadcrumb">
            <ol>
                <li>
                    <router-link to="/">Home</router-link>
                </li>
                <li>
                    <router-link to="/resources">Resources</router-link>
                </li>
                <li aria-current="page">Multiple Games &amp; the Rollover Mechanic</li>
            </ol>
        </nav>

        <div class="article-header">
            <h1>Multiple Games &amp; the Rollover Mechanic</h1>
            <p class="article-meta">By
                <router-link to="/about">Tom Peters</router-link> &middot; Updated February 2026
            </p>
            <p class="article-lead">A single pool in SqMGR can hold multiple game grids, making it ideal for playoff
                pools, weekly season pools, or any multi-game event. You can also use the Rollover grid type, which adds
                extra excitement for the playoffs (explained below in more detail).</p>
        </div>

        <div class="article-toc">
            <h2><i class="fas fa-list"></i> In This Article</h2>
            <ol>
                <li><a href="#multi-game-overview">What Is a Multi-Game Pool?</a></li>
                <li><a href="#adding-games">Adding Multiple Games</a></li>
                <li><a href="#use-cases">Use Cases</a></li>
                <li><a href="#rollover-mechanic">The Rollover Mechanic</a></li>
                <li><a href="#rollover-how">How Rollover Works Step-by-Step</a></li>
                <li><a href="#faq">Frequently Asked Questions</a></li>
            </ol>
        </div>

        <section id="multi-game-overview">
            <h2>What Is a Multi-Game Pool?</h2>
            <p>In SqMGR, a <strong>pool</strong> is the top-level container. Within a pool, you can add multiple
                games to the same pool. Participants claim the square once and it will be re-used for all games. The
                important part is that each game will have unique numbers drawn.</p>
            <p>This allows you to manage participants, payment tracking, and history all
                in one place.</p>
            <figure class="article-img">
                <img src="/images/resources/multigame.png"
                     srcset="/images/resources/multigame.png 1x, /images/resources/multigame@2x.png 2x"
                     alt="Pool dashboard showing multiple game grids"
                     loading="lazy">
                <figcaption>Pool dashboard showing multiple game grids. You'll only see this view <em>after</em> you add your second game to the pool.</figcaption>
            </figure>
        </section>

        <section id="adding-games">
            <h2>Adding Multiple Games</h2>
            <div class="section-with-aside-img">
                <div class="section-content">
                    <p>Adding a new game grid to an existing pool:</p>
                    <div class="steps-list">
                        <div class="step-card">
                            <div class="step-num">1</div>
                            <div class="step-body">
                                <h3>Open Your Pool</h3>
                                <p>Navigate to your pool. If you only have one game, you'll see your grid. If you already have multiple games, you'll see a dashboard like above.</p>
                            </div>
                        </div>
                        <div class="step-card">
                            <div class="step-num">2</div>
                            <div class="step-body">
                                <h3>Add a New Game</h3>
                                <p>Click the button "Add Another Game". Configure the grid type, payout structure, and
                                    optionally link it to a live event from SqMGR's sports database.</p>
                            </div>
                        </div>
                    </div>
                    <p>Each game grid shares the claimed squares but has its own settings like teams and colors, number assignment and winners.</p>
                </div>
                <figure class="article-img section-aside-img">
                    <img src="/images/resources/add-game.png"
                         srcset="/images/resources/add-game.png 1x, /images/resources/add-game@2x.png 2x"
                         alt="Add game button on the pool dashboard"
                         loading="lazy">
                    <figcaption>You can use the "Add Game" option on your pool dashboard to convert your pool into a multi-game pool</figcaption>
                </figure>
            </div>
        </section>

        <section id="use-cases">
            <h2>Use Cases</h2>

            <h3>NFL Playoff Pool</h3>
            <p>Run a squares pool for each playoff game leading up to the Super Bowl. Add a new grid for each Wild Card,
                Divisional, Conference Championship, and Super Bowl game. Participants buy into the pool once (or per
                game) and play through the entire postseason.</p>

            <h3>Weekly Season Pool</h3>
            <p>Some groups run a football squares pool every Sunday during the regular season. Instead of managing 18
                separate pools, create one pool for the season and add a new game grid each week. All the history,
                payments, and participants stay in one place.</p>

            <h3>Double-Header / Multiple Games One Day</h3>
            <p>For big viewing days — like an NFL Conference Championship Sunday with two games — you can add both games
                to the same pool. Participants can play both boards simultaneously, and you manage everything from one
                pool dashboard.</p>

            <h3>Tournament Brackets</h3>
            <p>While SqMGR is optimized for football, the multi-grid structure works well for any sport where you want
                to run squares for multiple games in a tournament or bracket format.</p>
        </section>

        <section id="rollover-mechanic">
            <h2>The Rollover Format</h2>

            <p>SqMGR has the concept of a rollover grid. You sell 50 squares and each participant claims a primary square and a secondary square.
            For games designated as a "rollover," the secondary square is empty. If the winning number lands on an empty square, the pot will rollover to the next game.</p>

            <p>This builds excitement as the whole group roots for a rollover if they don't have a chance of winning. The final game like the Super Bowl puts all squares into play to ensure a winner.</p>

            <figure class="article-img section-aside-img">
                <img src="/images/resources/grid-with-roll.png"
                     srcset="/images/resources/grid-with-roll.png 1x, /images/resources/grid-with-roll@2x.png 2x"
                     alt="A grid showing a game with a rollover"
                     loading="lazy">
                <figcaption>This game was designated as a rollover game and the winning square hit an empty square. This game's pot will roll to the next game for a bigger pot!</figcaption>
            </figure>
        </section>

        <section id="rollover-how">
            <h2>How Rollover Works Step-by-Step</h2>
            <div class="steps-list">
                <div class="step-card">
                    <div class="step-num">1</div>
                    <div class="step-body">
                        <h3>Create the Rollover Pool</h3>
                        <p>When creating your pool, choose the "Rollover, 100 squares" format.</p>
                    </div>
                </div>
                <div class="step-card">
                    <div class="step-num">2</div>
                    <div class="step-body">
                        <h3>Add a New Game</h3>
                        <p>Add one or more games to your pool.</p>
                    </div>
                </div>
                <div class="step-card">
                    <div class="step-num">3</div>
                    <div class="step-body">
                        <h3>Specify the Rollover Games</h3>
                        <p>Click the gear icon from the pool dashboard or click the "Customize" button. Specify if that game will be a rollover game or not. It is strongly recommended that the last game is not a rollover game.</p>
                    </div>
                </div>
            </div>

            <div class="tip-box">
                <h3><i class="fas fa-lightbulb"></i> Fairness Note</h3>
                <p>Because numbers are redrawn for each new game, the rollover mechanic is completely fair. Having the
                    same physical square position in Game 2 as Game 1 doesn't give you any statistical advantage — the
                    number assignment is fresh each time.</p>
            </div>
        </section>

        <section id="faq" class="faq-section">
            <h2>Frequently Asked Questions</h2>

            <div class="faq-item">
                <h3>Is there a limit to how many games I can add to a pool?</h3>
                <p>There is no enforced limit. You can add as many game grids as you need to a single pool, making it
                    suitable for anything from a three-game playoff weekend to a full 18-week regular season.</p>
            </div>

            <div class="faq-item">
                <h3>Do rolled-over participants need to pay again for the next game?</h3>
                <p>That's entirely up to your pool rules — SqMGR doesn't enforce payment terms. Most pools will charge a
                    fee up front and use that to fund each game's winner.</p>
            </div>
        </section>

        <div class="article-cta">
            <p>Start a multi-game pool for your next season or playoff run.</p>
            <router-link to="/create" class="btn cta-primary">Create a Free Pool</router-link>
        </div>

        <nav class="article-nav">
            <div class="article-nav-prev">
                <span>Previous: </span>
                <router-link to="/resources/linking-live-events-and-payouts"><i class="fas fa-arrow-left"></i> Live
                    Events &amp; Payouts
                </router-link>
            </div>
            <div class="article-nav-next">
                <span>Next: </span>
                <router-link to="/resources/best-numbers-in-football-squares">Best Numbers in Squares <i
                    class="fas fa-arrow-right"></i></router-link>
            </div>
        </nav>
    </article>
</template>

<script>
export default {
    name: "MultipleGamesAndRollover",
    mounted() {
        this._jsonLd = document.createElement('script')
        this._jsonLd.type = 'application/ld+json'
        this._jsonLd.text = JSON.stringify([
            {
                "@context": "https://schema.org",
                "@type": "Article",
                "@id": "https://sqmgr.com/resources/multiple-games-and-rollover",
                "headline": "Multiple Games & the Rollover Mechanic in SqMGR",
                "description": "Learn how to add multiple game grids to a single SqMGR pool and how the rollover mechanic automatically carries claimed squares forward from game to game.",
                "url": "https://sqmgr.com/resources/multiple-games-and-rollover",
                "datePublished": "2026-02-20",
                "dateModified": "2026-02-20",
                "author": {
                    "@type": "Person",
                    "@id": "https://sqmgr.com/about#tom-peters",
                    "name": "Tom Peters",
                },
                "publisher": {
                    "@type": "Person",
                    "@id": "https://sqmgr.com/about#tom-peters",
                    "name": "Tom Peters",
                },
            },
            {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://sqmgr.com/"},
                    {"@type": "ListItem", "position": 2, "name": "Resources", "item": "https://sqmgr.com/resources"},
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": "Multiple Games & Rollover",
                        "item": "https://sqmgr.com/resources/multiple-games-and-rollover",
                    },
                ],
            },
            {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What is the rollover format in football squares?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "The rollover format uses 50 squares. Each participant claims a primary square and a secondary square. In games designated as rollover games, the secondary square is empty — if the winning number lands on an empty secondary square, the pot rolls over to the next game. The final game puts all squares into play to guarantee a winner.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Is there a limit to how many games I can add to a pool?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "There is no enforced limit. You can add as many game grids as you need to a single pool.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Do rolled-over participants need to pay again for the next game?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "That's entirely up to your pool rules — SqMGR doesn't enforce payment terms. Most pools charge a fee up front and use that to fund each game's winner.",
                        },
                    },
                ],
            },
        ])
        document.head.appendChild(this._jsonLd)
    },
    unmounted() {
        if (this._jsonLd) {
            document.head.removeChild(this._jsonLd)
        }
    },
}
</script>

<style lang="scss" scoped>
@use './resource-article';
</style>
