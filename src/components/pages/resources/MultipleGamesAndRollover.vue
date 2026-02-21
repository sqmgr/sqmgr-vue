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
                <li aria-current="page">Multiple Games &amp; the Rollover Mechanic</li>
            </ol>
        </nav>

        <div class="article-header">
            <h1>Multiple Games &amp; the Rollover Mechanic</h1>
            <p class="article-meta">By <router-link to="/about">Tom Peters</router-link> &middot; Updated February 2026</p>
            <p class="article-lead">A single pool in SqMGR can hold multiple game grids, making it ideal for playoff pools, weekly season pools, or any multi-game event. The rollover mechanic ensures unclaimed squares carry forward, so no one's investment is wasted when a grid doesn't fill completely.</p>
        </div>

        <div class="article-toc">
            <h2><i class="fas fa-list"></i> In This Article</h2>
            <ol>
                <li><a href="#multi-game-overview">What Is a Multi-Game Pool?</a></li>
                <li><a href="#adding-games">Adding Multiple Games</a></li>
                <li><a href="#use-cases">Use Cases</a></li>
                <li><a href="#rollover-mechanic">The Rollover Mechanic</a></li>
                <li><a href="#rollover-how">How Rollover Works Step-by-Step</a></li>
                <li><a href="#viewing-all-games">Viewing All Games in a Pool</a></li>
                <li><a href="#faq">Frequently Asked Questions</a></li>
            </ol>
        </div>

        <section id="multi-game-overview">
            <h2>What Is a Multi-Game Pool?</h2>
            <p>In SqMGR, a <strong>pool</strong> is the top-level container. Within a pool, you can add multiple <strong>game grids</strong> — each one a separate 10×10 (or 25-square) board for a different game. All participants in the pool have access to all game grids, making it easy to run a continuing season pool under one roof.</p>
            <p>Instead of creating a new pool for every game, you manage participants, payment tracking, and history all in one place.</p>
        </section>

        <section id="adding-games">
            <h2>Adding Multiple Games</h2>
            <p>Adding a new game grid to an existing pool:</p>
            <div class="steps-list">
                <div class="step-card">
                    <div class="step-num">1</div>
                    <div class="step-body">
                        <h3>Open Your Pool</h3>
                        <p>Navigate to your pool dashboard. You'll see all existing game grids listed along with their status.</p>
                    </div>
                </div>
                <div class="step-card">
                    <div class="step-num">2</div>
                    <div class="step-body">
                        <h3>Add a New Game</h3>
                        <p>Click the option to add a new game grid. Configure the grid type, payout structure, and optionally link it to a live event from SqMGR's sports database.</p>
                    </div>
                </div>
                <div class="step-card">
                    <div class="step-num">3</div>
                    <div class="step-body">
                        <h3>Participants Claim Squares</h3>
                        <p>Existing pool members can immediately start claiming squares on the new grid. Since they're already in the pool, no new invite link is needed.</p>
                    </div>
                </div>
                <div class="step-card">
                    <div class="step-num">4</div>
                    <div class="step-body">
                        <h3>Draw Numbers and Play</h3>
                        <p>Draw numbers for the new grid independently. Each grid has its own draw, its own numbers, and its own set of winners.</p>
                    </div>
                </div>
            </div>
            <p>Each game grid is completely independent — its own number assignment, its own winners, its own payout tracking — while sharing the same pool membership and participant list.</p>
        </section>

        <section id="use-cases">
            <h2>Use Cases</h2>

            <h3>NFL Playoff Pool</h3>
            <p>Run a squares pool for each playoff game leading up to the Super Bowl. Add a new grid for each Wild Card, Divisional, Conference Championship, and Super Bowl game. Participants buy into the pool once (or per game) and play through the entire postseason.</p>

            <h3>Weekly Season Pool</h3>
            <p>Some groups run a football squares pool every Sunday during the regular season. Instead of managing 18 separate pools, create one pool for the season and add a new game grid each week. All the history, payments, and participants stay in one place.</p>

            <h3>Double-Header / Multiple Games One Day</h3>
            <p>For big viewing days — like an NFL Conference Championship Sunday with two games — you can add both games to the same pool. Participants can play both boards simultaneously, and you manage everything from one pool dashboard.</p>

            <h3>Tournament Brackets</h3>
            <p>While SqMGR is optimized for football, the multi-grid structure works well for any sport where you want to run squares for multiple games in a tournament or bracket format.</p>
        </section>

        <section id="rollover-mechanic">
            <h2>The Rollover Mechanic</h2>
            <p>Not every game fills all 100 squares — mid-season pools especially tend to have a few go unclaimed.</p>
            <p>The rollover mechanic handles this: <strong>squares claimed in Game 1 automatically carry over to Game 2</strong>. Participants don't need to re-claim squares or re-pay — their existing squares carry forward to the next game in the pool.</p>

            <div class="example-box">
                <h3><i class="fas fa-sync-alt"></i> How Rollover Helps</h3>
                <p>Imagine 80 of your 100 squares were claimed in Week 1. For Week 2, those same 80 participants are automatically entered with the same squares. You only need to sell the remaining 20. The pool pot grows week over week as more squares are filled in.</p>
            </div>
        </section>

        <section id="rollover-how">
            <h2>How Rollover Works Step-by-Step</h2>
            <div class="steps-list">
                <div class="step-card">
                    <div class="step-num">1</div>
                    <div class="step-body">
                        <h3>Game 1 Concludes</h3>
                        <p>Winners are paid out. Some squares may have been unclaimed during the game.</p>
                    </div>
                </div>
                <div class="step-card">
                    <div class="step-num">2</div>
                    <div class="step-body">
                        <h3>New Game Grid Is Added</h3>
                        <p>When you add the next game to the pool, SqMGR carries all existing square claims forward into the new grid. The grid opens with those squares already claimed.</p>
                    </div>
                </div>
                <div class="step-card">
                    <div class="step-num">3</div>
                    <div class="step-body">
                        <h3>Remaining Squares Go on Sale</h3>
                        <p>Any previously unclaimed squares are now available for new participants to claim in the new game. The rollover doesn't block new entrants — it just fills the grid head start.</p>
                    </div>
                </div>
                <div class="step-card">
                    <div class="step-num">4</div>
                    <div class="step-body">
                        <h3>New Numbers Are Drawn</h3>
                        <p>Each game gets a fresh random number draw. Rolled-over squares are in the same positions but with new numbers — so no one has a permanent advantage from game to game.</p>
                    </div>
                </div>
            </div>

            <div class="tip-box">
                <h3><i class="fas fa-lightbulb"></i> Fairness Note</h3>
                <p>Because numbers are redrawn for each new game, the rollover mechanic is completely fair. Having the same physical square position in Game 2 as Game 1 doesn't give you any statistical advantage — the number assignment is fresh each time.</p>
            </div>
        </section>

        <section id="viewing-all-games">
            <h2>Viewing All Games in a Pool</h2>
            <p>SqMGR's pool dashboard gives you a summary of every game grid — status, linked event, draw state, and winners. For a season-long pool it's the fastest way to see where things stand.</p>
            <p>Individual game grids can be accessed directly from the pool dashboard. Each grid shows its own participants, drawn numbers, and winner history independently.</p>
        </section>

        <section id="faq" class="faq-section">
            <h2>Frequently Asked Questions</h2>

            <div class="faq-item">
                <h3>Is there a limit to how many games I can add to a pool?</h3>
                <p>There is no enforced limit. You can add as many game grids as you need to a single pool, making it suitable for anything from a three-game playoff weekend to a full 18-week regular season.</p>
            </div>

            <div class="faq-item">
                <h3>Do rolled-over participants need to pay again for the next game?</h3>
                <p>That's entirely up to your pool rules — SqMGR doesn't enforce payment terms. Many pool managers charge per game, so rolled-over participants would pay for each new grid. Others charge a flat season fee upfront. The payment tracking tools in SqMGR support either approach.</p>
            </div>

            <div class="faq-item">
                <h3>Can I opt out of rollover and start fresh each game?</h3>
                <p>Yes. The rollover is a feature you choose to use when setting up the next game grid. You can always start with a completely empty grid for each new game if you prefer everyone to re-claim squares.</p>
            </div>

            <div class="faq-item">
                <h3>What happens to squares that were claimed but not paid in the previous game?</h3>
                <p>SqMGR tracks payment status separately from square ownership. Unpaid squares from Game 1 will roll over to Game 2 just like paid squares. How you handle unpaid participants is your call as the pool manager.</p>
            </div>
        </section>

        <div class="article-cta">
            <p>Start a multi-game pool for your next season or playoff run.</p>
            <router-link to="/create" class="btn cta-primary">Create a Free Pool</router-link>
        </div>

        <nav class="article-nav">
            <div class="article-nav-prev">
                <span>Previous: </span>
                <router-link to="/resources/linking-live-events-and-payouts"><i class="fas fa-arrow-left"></i> Live Events &amp; Payouts</router-link>
            </div>
            <div class="article-nav-next">
                <span>Next: </span>
                <router-link to="/resources/best-numbers-in-football-squares">Best Numbers in Squares <i class="fas fa-arrow-right"></i></router-link>
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
                        {"@type": "ListItem", "position": 3, "name": "Multiple Games & Rollover", "item": "https://sqmgr.com/resources/multiple-games-and-rollover"}
                    ]
                },
                {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "What is the rollover mechanic in football squares?",
                            "acceptedAnswer": {"@type": "Answer", "text": "The rollover mechanic automatically carries claimed squares forward from one game to the next within the same pool. Participants keep their squares without re-claiming them, and a fresh number draw happens for each new game."}
                        },
                        {
                            "@type": "Question",
                            "name": "Is there a limit to how many games I can add to a pool?",
                            "acceptedAnswer": {"@type": "Answer", "text": "There is no enforced limit on the number of game grids in a single pool on SqMGR."}
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
