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
                <li><router-link to="/">Home</router-link></li>
                <li><router-link to="/resources">Resources</router-link></li>
                <li aria-current="page">Linking Live Events &amp; Configuring Payouts</li>
            </ol>
        </nav>

        <div class="article-header">
            <h1>Linking to a Live Event &amp; Configuring Payouts</h1>
            <p class="article-meta">By <router-link to="/about">Tom Peters</router-link> &middot; Updated February 2026</p>
            <p class="article-lead">When you link a grid to a live game, SqMGR pulls in real-time scores so you can see the current winning square without leaving the page. You can also configure exactly how much the pot pays out each quarter so everyone knows what they're playing for.</p>
        </div>

        <div class="article-toc">
            <h2><i class="fas fa-list"></i> In This Article</h2>
            <ol>
                <li><a href="#why-link">Why Link to a Live Event?</a></li>
                <li><a href="#finding-game">Finding &amp; Selecting Your Game</a></li>
                <li><a href="#supported-leagues">Supported Leagues</a></li>
                <li><a href="#live-scores">How Live Scores Work</a></li>
                <li><a href="#configure-payouts">Configuring Payout Percentages</a></li>
                <li><a href="#marking-winners">Marking Winners</a></li>
                <li><a href="#faq">Frequently Asked Questions</a></li>
            </ol>
        </div>

        <section id="why-link">
            <h2>Why Link to a Live Event?</h2>
            <p>Linking your grid to a live game unlocks two key features: <strong>real-time score display</strong> and <strong>automatic period tracking</strong>. Without linking, your grid is just a static squares board — you have to manually check scores elsewhere and announce results yourself.</p>
            <p>With a linked game, everyone viewing the pool can see the current score overlaid on the grid, the current winning square highlighted, and which period is active. It makes game day significantly more engaging for your participants.</p>
        </section>

        <section id="finding-game">
            <h2>Finding &amp; Selecting Your Game</h2>
            <p>When you add a new game grid to your pool, you have the option to link it to a scheduled or in-progress game from SqMGR's sports database. Here's how:</p>
            <div class="steps-list">
                <div class="step-card">
                    <div class="step-num">1</div>
                    <div class="step-body">
                        <h3>Open Pool Settings</h3>
                        <p>Navigate to your pool and click on the game grid you want to configure, then open its settings panel.</p>
                    </div>
                </div>
                <div class="step-card">
                    <div class="step-num">2</div>
                    <div class="step-body">
                        <h3>Search for Your Game</h3>
                        <p>Use the event search to find your game. You can search by team name, league, or browse upcoming games. SqMGR's sports data is updated regularly with NFL and college football schedules.</p>
                    </div>
                </div>
                <div class="step-card">
                    <div class="step-num">3</div>
                    <div class="step-body">
                        <h3>Select and Save</h3>
                        <p>Click on your game to select it. The team names are automatically populated on the grid axes. Save the settings and you're linked.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="supported-leagues">
            <h2>Supported Leagues</h2>
            <p>SqMGR currently supports live event linking for:</p>
            <ul>
                <li><strong>NFL</strong> — Regular season, playoffs, and the Super Bowl</li>
                <li><strong>NCAA Football (FBS)</strong> — Regular season and bowl games</li>
                <li><strong>NCAAB</strong> — College basketball (number set configuration is automatically adjusted; the 1st/2nd half periods replace quarters)</li>
            </ul>
            <p>More leagues may be added in future updates. Check the <router-link to="/release-notes">Release Notes</router-link> for the latest additions.</p>
        </section>

        <section id="live-scores">
            <h2>How Live Scores Work</h2>
            <p>SqMGR uses a real-time score pipeline built on PostgreSQL's <code>LISTEN</code>/<code>NOTIFY</code> mechanism and Server-Sent Events (SSE). A scheduled background job fetches the latest game scores and writes them to the database. When a score changes, PostgreSQL fires a notification event. The SqMGR server receives this instantly and fans the update out to all connected clients watching that pool.</p>
            <p>The result: scores appear on your grid within seconds of the actual play, with no page refreshes required. All participants watching the pool see the update simultaneously.</p>

            <div class="tip-box">
                <h3><i class="fas fa-wifi"></i> Real-Time, Not Polling</h3>
                <p>SqMGR's score updates are push-based, not poll-based. Your browser doesn't repeatedly check for updates — the server sends them to you the moment they're available. This means lower data usage and instant updates for everyone in the pool.</p>
            </div>
        </section>

        <section id="configure-payouts">
            <h2>Configuring Payout Percentages</h2>
            <p>Each game grid has its own configurable payout structure. You define what percentage of the total pot is paid out at each scoring period. The percentages must add up to 100%.</p>
            <p>The most common payout structures are:</p>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Period</th>
                            <th>Conservative Split</th>
                            <th>Big-Game Weighted</th>
                            <th>Equal Split</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Q1</td>
                            <td>20%</td>
                            <td>15%</td>
                            <td>25%</td>
                        </tr>
                        <tr>
                            <td>Halftime</td>
                            <td>30%</td>
                            <td>35%</td>
                            <td>25%</td>
                        </tr>
                        <tr>
                            <td>Q3</td>
                            <td>20%</td>
                            <td>15%</td>
                            <td>25%</td>
                        </tr>
                        <tr>
                            <td>Final</td>
                            <td>30%</td>
                            <td>35%</td>
                            <td>25%</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p>The "Conservative Split" (20/30/20/30) is by far the most popular. The halftime and final payouts are higher because those moments are the most eagerly watched. The "Big-Game Weighted" structure is sometimes used for Super Bowl pools where the halftime show and final score are especially anticipated.</p>

            <div class="example-box">
                <h3><i class="fas fa-calculator"></i> Example Calculation</h3>
                <p>Suppose you have 100 squares at $10 each — a $1,000 pot. With the 20/30/20/30 split:</p>
                <ul>
                    <li>Q1 winner receives $200</li>
                    <li>Halftime winner receives $300</li>
                    <li>Q3 winner receives $200</li>
                    <li>Final winner receives $300</li>
                </ul>
                <p>SqMGR shows these amounts on the grid so every participant knows exactly what each period pays out.</p>
            </div>
        </section>

        <section id="marking-winners">
            <h2>Marking Winners</h2>
            <p>At the end of each period, SqMGR determines the winning square by looking at the last digit of each team's current score and finding the intersection on the grid. If you've linked to a live event, this is shown automatically on the grid in real time.</p>
            <p>As the pool manager, you confirm and log each winner from the admin panel. You can track payment status per participant — marking squares as paid or unpaid — which is especially useful for in-person pools where people settle up after the game.</p>
        </section>

        <section id="faq" class="faq-section">
            <h2>Frequently Asked Questions</h2>

            <div class="faq-item">
                <h3>What if my game isn't in SqMGR's database?</h3>
                <p>You can still run your pool — just don't link it to a live event. You'll manually track scores and winners. You can also manually set the team names on your grid to match your game.</p>
            </div>

            <div class="faq-item">
                <h3>Can I change the payout percentages after the pool starts?</h3>
                <p>It's strongly recommended to set and communicate your payout structure before participants claim squares. Changing percentages mid-pool could create disputes. SqMGR does allow updating grid settings, but use good judgment.</p>
            </div>

            <div class="faq-item">
                <h3>What happens if the same square wins more than one quarter?</h3>
                <p>Each period pays out independently — the winner of each period gets that period's payout regardless of whether the same square wins multiple periods. It's entirely possible (and sometimes lucrative) for the same person to win multiple quarters.</p>
            </div>

            <div class="faq-item">
                <h3>Does SqMGR handle overtime?</h3>
                <p>If a game goes to overtime, the final winner is determined by the final score at the end of the game, including overtime. SqMGR tracks the live score through the end of the game.</p>
            </div>
        </section>

        <div class="article-cta">
            <p>Set up your pool and link it to a live game today.</p>
            <router-link to="/create" class="btn cta-primary">Create a Free Pool</router-link>
        </div>

        <nav class="article-nav">
            <div class="article-nav-prev">
                <span>Previous: </span>
                <router-link to="/resources/setting-up-a-pool"><i class="fas fa-arrow-left"></i> Setting Up a Pool</router-link>
            </div>
            <div class="article-nav-next">
                <span>Next: </span>
                <router-link to="/resources/multiple-games-and-rollover">Multiple Games &amp; Rollover <i class="fas fa-arrow-right"></i></router-link>
            </div>
        </nav>
    </article>
</template>

<script>
    export default {
        name: "LinkedEventsAndPayouts",
        mounted() {
            this._jsonLd = document.createElement('script')
            this._jsonLd.type = 'application/ld+json'
            this._jsonLd.text = JSON.stringify([
                {
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "@id": "https://sqmgr.com/resources/linking-live-events-and-payouts",
                    "headline": "Linking to a Live Event and Configuring Payouts in SqMGR",
                    "description": "Learn how to link your football squares grid to a live NFL or college football game for real-time score updates, and how to configure payout percentages per quarter.",
                    "url": "https://sqmgr.com/resources/linking-live-events-and-payouts",
                    "datePublished": "2026-02-20",
                    "dateModified": "2026-02-20",
                    "author": {
                        "@type": "Person",
                        "@id": "https://sqmgr.com/about#tom-peters",
                        "name": "Tom Peters"
                    },
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
                        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://sqmgr.com/"},
                        {"@type": "ListItem", "position": 2, "name": "Resources", "item": "https://sqmgr.com/resources"},
                        {"@type": "ListItem", "position": 3, "name": "Linking Live Events & Payouts", "item": "https://sqmgr.com/resources/linking-live-events-and-payouts"}
                    ]
                },
                {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "What if my game isn't in SqMGR's database?",
                            "acceptedAnswer": {"@type": "Answer", "text": "You can still run your pool without linking to a live event. You'll manually track scores and winners. You can also manually set team names on your grid."}
                        },
                        {
                            "@type": "Question",
                            "name": "What is the most common payout structure for football squares?",
                            "acceptedAnswer": {"@type": "Answer", "text": "The most popular split is 20% for Q1, 30% for halftime, 20% for Q3, and 30% for the final. This weights the halftime and final payouts higher since those moments get the most attention."}
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
@use './resource-article';
</style>
