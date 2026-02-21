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
                <li aria-current="page">How Football Squares Work</li>
            </ol>
        </nav>

        <div class="article-header">
            <h1>How Football Squares Work</h1>
            <p class="article-meta">By <router-link to="/about">Tom Peters</router-link> &middot; Updated February 2026</p>
            <p class="article-lead">Football squares — also called a squares pool or a football pool — is one of the most popular social sports games in the United States. You don't need to know anything about football to play, and there's no skill involved: it's pure luck. That's what makes it so fun for everyone from die-hard fans to casual viewers just watching for the commercials.</p>
        </div>

        <div class="article-toc">
            <h2><i class="fas fa-list"></i> In This Article</h2>
            <ol>
                <li><a href="#the-grid">The 10×10 Grid</a></li>
                <li><a href="#claiming-squares">Claiming Squares</a></li>
                <li><a href="#drawing-numbers">Drawing the Numbers</a></li>
                <li><a href="#determining-winners">How Winners Are Determined</a></li>
                <li><a href="#payout-structures">Common Payout Structures</a></li>
                <li><a href="#grid-variations">Grid Variations</a></li>
                <li><a href="#faq">Frequently Asked Questions</a></li>
            </ol>
        </div>

        <section id="the-grid">
            <h2>The 10×10 Grid</h2>
            <p>A standard football squares grid is a 10-column by 10-row table, creating 100 individual squares. The top of the grid is labeled with one team's name (typically the home team or your preferred team), and the left side is labeled with the other team's name. The columns and rows are each numbered 0 through 9 — but those numbers aren't assigned until <em>after</em> all the squares are claimed.</p>
            <p>Each square on the grid represents a unique combination of a ones digit from each team's score. For example, a square at column 7 and row 3 means you're rooting for a score where Team A's final digit is 7 and Team B's final digit is 3 (like 17-13, 27-3, 7-23, etc.).</p>
        </section>

        <section id="claiming-squares">
            <h2>Claiming Squares</h2>
            <p>Before numbers are drawn, participants choose one or more squares on the grid. Participants typically pay a set amount per square (often $5, $10, or $20 in friendly pools), with the total pot split among the winners.</p>
            <p>A pool manager sets up the grid and shares a link with friends, family, or coworkers. Each person picks whichever squares they want. Once all 100 squares are claimed (or the game is about to start), the numbers are drawn.</p>
        </section>

        <section id="drawing-numbers">
            <h2>Drawing the Numbers</h2>
            <p>After squares are filled, digits 0 through 9 are randomly assigned to each column and each row — giving you the unique combination for your square. The random draw is the key to keeping the game fair. Nobody can strategically pick a "winning" square before the draw.</p>
            <p>There are two common methods:</p>
            <ul>
                <li><strong>Random draw:</strong> The pool manager (or a tool like SqMGR) randomly shuffles the digits and assigns them.</li>
                <li><strong>Live draw:</strong> Digits are written on slips of paper, shuffled in a hat, and drawn one by one in front of participants. Adds a fun ceremony to game day.</li>
            </ul>
            <p>SqMGR supports both — instant random assignment or a manual draw where you enter numbers yourself.</p>
        </section>

        <section id="determining-winners">
            <h2>How Winners Are Determined</h2>
            <p>Winners are determined by looking at the <strong>last digit (ones digit)</strong> of each team's score at the end of each quarter. You find that digit on the column header (one team) and the row header (the other team), and whoever owns the square at that intersection wins.</p>

            <div class="example-box">
                <h3><i class="fas fa-lightbulb"></i> Example</h3>
                <p>Suppose the score after the first quarter is <strong>Chiefs 7, Eagles 3</strong>. You look for the column labeled "7" under the Chiefs and the row labeled "3" under the Eagles. The person who claimed that intersection wins the Q1 payout.</p>
                <p>If the final score is <strong>Chiefs 24, Eagles 20</strong>, the winning square at the end of the game would be the one at column "4" and row "0".</p>
            </div>

            <p>This is checked at the end of each scoring period — typically after Q1, at halftime (end of Q2), after Q3, and at the final whistle. Each period has its own payout.</p>
        </section>

        <section id="payout-structures">
            <h2>Common Payout Structures</h2>
            <p>Most pools divide the total pot across four payout periods. A common split is:</p>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Period</th>
                            <th>Common Split</th>
                            <th>Example (100 squares × $10)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>End of Q1</td>
                            <td>20%</td>
                            <td>$200</td>
                        </tr>
                        <tr>
                            <td>Halftime (end of Q2)</td>
                            <td>30%</td>
                            <td>$300</td>
                        </tr>
                        <tr>
                            <td>End of Q3</td>
                            <td>20%</td>
                            <td>$200</td>
                        </tr>
                        <tr>
                            <td>Final</td>
                            <td>30%</td>
                            <td>$300</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p>Some pools also pay a bonus for the reverse score (flipping the two teams' digits) or run special "second chance" rules if the same square wins twice. The pool manager decides.</p>
        </section>

        <section id="grid-variations">
            <h2>Grid Variations</h2>
            <p>While 100 squares is standard, other formats exist:</p>
            <ul>
                <li><strong>25-square grid (5×5):</strong> Each square covers four digit combinations instead of one. Good for smaller groups where filling 100 squares isn't feasible.</li>
                <li><strong>Multiple boards:</strong> Large events sometimes run 2 or 3 boards simultaneously, letting more people participate or allowing players to buy in at different price points.</li>
                <li><strong>Double action:</strong> Pays out both at the end of the quarter and at the end of the previous quarter using a second axis. Less common.</li>
            </ul>
        </section>

        <section id="faq" class="faq-section">
            <h2>Frequently Asked Questions</h2>

            <div class="faq-item">
                <h3>Do I need to know about football to play squares?</h3>
                <p>No. Football squares is entirely luck-based. Your winning square is determined by a random draw, so no football knowledge helps or hurts your chances.</p>
            </div>

            <div class="faq-item">
                <h3>What are the best numbers to have in football squares?</h3>
                <p>The numbers 0, 7, 3, and 4 are historically the most common ones digit combinations in NFL scoring. Read our full <router-link to="/resources/best-numbers-in-football-squares">Best Numbers in Football Squares</router-link> guide for the complete breakdown.</p>
            </div>

            <div class="faq-item">
                <h3>What happens if the grid isn't fully claimed before the game?</h3>
                <p>The pool manager can either fill remaining squares themselves, leave them unclaimed (no winner for those squares if they hit), or use a <router-link to="/resources/multiple-games-and-rollover">rollover mechanic</router-link> to carry unclaimed squares into a future game.</p>
            </div>

            <div class="faq-item">
                <h3>Is football squares gambling?</h3>
                <p>Laws vary by location. In most friendly, informal settings among friends, family, or coworkers, squares pools are treated as social recreational activities. SqMGR is a free tool for managing the grid and tracking results — we don't process payments or facilitate wagering of any kind. Always check your local laws.</p>
            </div>

            <div class="faq-item">
                <h3>Can football squares be played for college football?</h3>
                <p>Yes — the rules are identical. SqMGR supports college football including FBS and NCAAB. College games tend to have higher scores, which changes the winning number distribution slightly — see our <router-link to="/resources/best-numbers-in-football-squares">Best Numbers</router-link> article for details.</p>
            </div>
        </section>

        <div class="article-cta">
            <p>Ready to run your own football squares pool?</p>
            <router-link to="/create" class="btn cta-primary">Create a Free Pool on SqMGR</router-link>
        </div>

        <nav class="article-nav">
            <div class="article-nav-next">
                <span>Next: </span>
                <router-link to="/resources/setting-up-a-pool">Setting Up a Pool on SqMGR <i class="fas fa-arrow-right"></i></router-link>
            </div>
        </nav>
    </article>
</template>

<script>
    export default {
        name: "HowSquaresWork",
        mounted() {
            this._jsonLd = document.createElement('script')
            this._jsonLd.type = 'application/ld+json'
            this._jsonLd.text = JSON.stringify([
                {
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "@id": "https://sqmgr.com/resources/how-squares-work",
                    "headline": "How Football Squares Work",
                    "description": "A complete guide to football squares: the 10x10 grid, how to claim squares, how numbers are drawn, how winners are determined each quarter, and common payout structures.",
                    "url": "https://sqmgr.com/resources/how-squares-work",
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
                        {"@type": "ListItem", "position": 3, "name": "How Football Squares Work", "item": "https://sqmgr.com/resources/how-squares-work"}
                    ]
                },
                {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "Do I need to know about football to play squares?",
                            "acceptedAnswer": {"@type": "Answer", "text": "No. Football squares is entirely luck-based. Your winning square is determined by a random draw, so no football knowledge helps or hurts your chances."}
                        },
                        {
                            "@type": "Question",
                            "name": "What are the best numbers to have in football squares?",
                            "acceptedAnswer": {"@type": "Answer", "text": "The numbers 0, 7, 3, and 4 are historically the most common ones digit combinations in NFL scoring. The pairs 0-0, 7-0, 0-7, 3-0, and 0-3 appear most frequently."}
                        },
                        {
                            "@type": "Question",
                            "name": "What happens if the grid isn't fully claimed before the game?",
                            "acceptedAnswer": {"@type": "Answer", "text": "The pool manager can fill remaining squares themselves, leave them unclaimed, or use a rollover mechanic to carry unclaimed squares into a future game."}
                        },
                        {
                            "@type": "Question",
                            "name": "Is football squares gambling?",
                            "acceptedAnswer": {"@type": "Answer", "text": "Laws vary by location. In most friendly, informal settings among friends, family, or coworkers, squares pools are treated as social recreational activities. Always check your local laws."}
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
