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
            <p class="article-lead">When you link a grid to a live game, SqMGR pulls in updated scores so you can see the current winning square without leaving the page. You can also configure which quarters or periods have payouts so everyone knows what they're playing for.</p>
        </div>

        <div class="article-toc">
            <h2><i class="fas fa-list"></i> In This Article</h2>
            <ol>
                <li><a href="#why-link">Why Link to a Live Event?</a></li>
                <li><a href="#finding-game">Finding &amp; Selecting Your Game</a></li>
                <li><a href="#supported-leagues">Supported Leagues</a></li>
                <li><a href="#live-scores">How Live Scores Work</a></li>
                <li><a href="#configure-payouts">Configuring Payout Periods</a></li>
                <li><a href="#marking-winners">Marking Winners</a></li>
                <li><a href="#faq">Frequently Asked Questions</a></li>
            </ol>
        </div>

        <section id="why-link">
            <h2>Why Link to a Live Event?</h2>
            <p>Linking your grid to a live game adds a <strong>near-real-time score display</strong>. Winning squares will be automatically marked on the grid. Without linking, your grid is just a static squares board and you have to manually check scores elsewhere and announce results yourself.</p>
        </section>

        <section id="finding-game">
            <h2>Finding &amp; Selecting Your Game</h2>
            <p>You have the option to link your squares to a scheduled or in-progress game from SqMGR's sports database.</p>
            <div class="steps-list">
                <div class="step-card">
                    <div class="step-num">1</div>
                    <div class="step-body">
                        <h3>Open Customize</h3>
                        <p>Navigate to your pool and click on the Customize button.</p>
                    </div>
                </div>
                <div class="step-card">
                    <div class="step-num">2</div>
                    <div class="step-body">
                        <h3>Search for Your Game</h3>
                        <p>Select the league and then your event. You can search for your event by the team name. SqMGR's sports data is updated regularly across all supported leagues.</p>
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
            <figure class="article-img">
                <img src="/images/resources/link-to-live-event.png"
                     srcset="/images/resources/link-to-live-event.png 1x, /images/resources/link-to-live-event@2x.png 2x"
                     alt="The game search interface showing a list of upcoming NFL games to link"
                     loading="lazy">
                <figcaption>Linking a live game — search for any upcoming game to automatically populate team names on your grid</figcaption>
            </figure>
        </section>

        <section id="supported-leagues">
            <h2>Supported Leagues</h2>
            <p>SqMGR currently supports live event linking for:</p>
            <ul>
                <li><strong>NFL</strong> — Regular season, playoffs, and the Super Bowl</li>
                <li><strong>NCAA Football</strong> — Regular season and bowl games</li>
                <li><strong>NCAA Basketball</strong> — College basketball</li>
                <li><strong>NBA</strong> — Regular season and playoffs</li>
                <li><strong>WNBA</strong> — Regular season and playoffs</li>
            </ul>
            <p>More leagues may be added in future updates. Check the <router-link to="/release-notes">Release Notes</router-link> for the latest additions.</p>
        </section>

        <section id="live-scores">
            <h2>How Live Scores Work</h2>
            <p>SqMGR fetches the latest game scores from its sports data provider on a regular schedule. Scores are updated approximately every <strong>5 minutes</strong> during live games. Your squares pool is automatically updated without having to refresh the page.</p>
            <p>While scores aren't instant to the second, updates come in frequently enough that everyone in your pool stays current throughout the game.</p>
            <figure class="article-img">
                <img src="/images/resources/linked-event-final.png"
                     srcset="/images/resources/linked-event-final.png 1x, /images/resources/linked-event-final@2x.png 2x"
                     alt="Grid with a live score overlay showing the current winning square highlighted in real time"
                     loading="lazy">
                <figcaption>Grid with a live score overlay showing the current winning square highlighted in real time</figcaption>
            </figure>
        </section>

        <section id="configure-payouts">
            <h2>Configuring Payout Periods</h2>
            <p>Each game grid lets you choose which quarters or periods have a payout. For example, you might pay out at the end of Q1, halftime, Q3, and the final — or you might skip the early quarters and only pay at halftime and the final. It's up to you and your pool.</p>
            <p>The payout amounts for each period are determined by you and communicated to your participants separately — SqMGR lets you select which periods are active, not the dollar amounts.</p>
            <p>Common configurations include:</p>
            <ul>
                <li><strong>All four quarters</strong> — Q1, Halftime, Q3, and Final (most common)</li>
                <li><strong>Halftime and Final only</strong> — Fewer payouts, larger prizes per period</li>
                <li><strong>Final only</strong> — Winner-take-all format</li>
            </ul>
        </section>

        <section id="marking-winners">
            <h2>Marking Winners</h2>
            <p>At the end of each period, SqMGR determines the winning square by looking at the last digit of each team's current score and finding the intersection on the grid. If you've linked to a live event, this is shown automatically on the grid in real time.</p>
            <p>If you setup the squares manually, you can mark each winner as you see fit.</p>
        </section>

        <section id="faq" class="faq-section">
            <h2>Frequently Asked Questions</h2>

            <div class="faq-item">
                <h3>What if my game isn't in SqMGR's database?</h3>
                <p>You can still run your pool — just don't link it to a live event. You'll manually track scores and winners. You can also manually set the team names on your grid to match your game.</p>
            </div>

            <div class="faq-item">
                <h3>Can I change which periods have payouts after the pool starts?</h3>
                <p>It's strongly recommended to set and communicate your payout structure before participants claim squares. Changing periods mid-pool could create disputes. SqMGR does allow updating grid settings, but use good judgment.</p>
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
                    "description": "Learn how to link your squares grid to a live NFL, NCAA Football, NCAA Basketball, NBA, or WNBA game for score updates, and how to configure which quarters or periods have payouts.",
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
                            "name": "Can I change which periods have payouts after the pool starts?",
                            "acceptedAnswer": {"@type": "Answer", "text": "It's strongly recommended to set and communicate your payout structure before participants claim squares. Changing periods mid-pool could create disputes. SqMGR does allow updating grid settings, but use good judgment."}
                        },
                        {
                            "@type": "Question",
                            "name": "What happens if the same square wins more than one quarter?",
                            "acceptedAnswer": {"@type": "Answer", "text": "Each period pays out independently — the winner of each period gets that period's payout regardless of whether the same square wins multiple periods. It's entirely possible for the same person to win multiple quarters."}
                        },
                        {
                            "@type": "Question",
                            "name": "Does SqMGR handle overtime?",
                            "acceptedAnswer": {"@type": "Answer", "text": "If a game goes to overtime, the final winner is determined by the final score at the end of the game, including overtime. SqMGR tracks the live score through the end of the game."}
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
