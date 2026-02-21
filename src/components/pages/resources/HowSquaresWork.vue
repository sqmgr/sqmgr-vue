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
                <li aria-current="page">How Squares Work</li>
            </ol>
        </nav>

        <div class="article-header">
            <h1>How Squares Work</h1>
            <p class="article-meta">By
                <router-link to="/about">Tom Peters</router-link> &middot; Updated February 2026
            </p>
            <p class="article-lead">Football squares (aka, squares pool, football pool, etc.) is a popular way to add
                excitement to sporting events. You don't need to know anything about football or basketball to play, and
                there's no skill involved: it's pure luck. That's what makes it so fun for everyone from die-hard fans
                to casual viewers just watching for the commercials.</p>
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
            <p>A standard football squares grid is a 10-column by 10-row table, creating 100 individual squares. The top
                of the grid is labeled with one team's name (typically the home team or your preferred team), and the
                left side is labeled with the other team's name. The columns and rows are each numbered 0 through 9, but
                those numbers aren't assigned until <em>after</em> all the squares are claimed.</p>
            <p>Each square on the grid represents a unique combination of a ones digit from each team's score. For
                example, a square at column 7 and row 3 means you're rooting for a score where the Home Team's final
                digit is 7 and the Away Team's final digit is 3 (like 17-13, 27-3, 7-23, etc.).</p>
            <figure class="article-img">
                <img src="/images/resources/empty-10x10.png"
                     srcset="/images/resources/empty-10x10.png 1x, /images/resources/empty-10x10@2x.png 2x"
                     alt="An empty 10×10 football squares grid before numbers are drawn"
                     loading="lazy">
                <figcaption>A blank 10×10 grid — squares are claimed before numbers are drawn, so no one can pick a strategically better position</figcaption>
            </figure>
        </section>

        <section id="claiming-squares">
            <h2>Claiming Squares</h2>
            <p>Before numbers are drawn, participants choose one or more squares on the grid. Participants typically pay
                a set amount per square (often $5, $10, or $20 in friendly pools), with the total pot split among the
                winners.</p>
            <p>A pool manager sets up the grid and shares a link with friends, family, or coworkers. Each person picks
                whichever squares they want. Once all 100 squares are claimed (or the game is about to start), the
                numbers are drawn.</p>
        </section>

        <section id="drawing-numbers">
            <h2>Drawing the Numbers</h2>
            <p>After squares are filled, digits 0 through 9 are randomly assigned to each column and each row which
                gives you the unique combination for your square. The random draw is the key to keeping the game fair.
                Nobody can strategically pick a "winning" square before the draw.</p>
            <p>On SqMGR, we offer two ways to assign numbers:</p>
            <ul>
                <li><strong>Random draw:</strong> SqMGR randomly shuffles the digits and assigns them.</li>
                <li><strong>Manual draw:</strong> The pool manager will manually enter the numbers. You can get creative
                    with how you randomly pick the numbers. Some like to do an in-person event where people pick random
                    cards. I've also seen large parties with the sole purpose of picking the numbers.
                </li>
            </ul>
        </section>

        <section id="determining-winners">
            <h2>How Winners Are Determined</h2>
            <p>Winners are determined by looking at the <strong>last digit (ones digit)</strong> of each team's score at
                the end of each quarter. You find that digit on the column header (one team) and the row header (the
                other team), and whoever owns the square at that intersection wins.</p>

            <div class="example-box">
                <h3><i class="fas fa-lightbulb"></i> Example</h3>
                <p>Suppose the score after the first quarter is <strong>Chiefs 3, Bills 7</strong>. You look for the
                    column labeled "7" under the Bills and the row labeled "3" under the Chiefs. The person who claimed
                    that intersection wins the Q1 payout.</p>
                <p>If the final score is <strong>Chiefs 20, Bills 24</strong>, the winning square at the end of the
                    game would be the one at column "4" and row "0".</p>
            </div>
            <figure class="article-img">
                <img src="/images/resources/winning-square.png"
                     srcset="/images/resources/winning-square.png 1x, /images/resources/winning-square@2x.png 2x"
                     alt="Grid with winning squares highlighted"
                     loading="lazy">
                <figcaption>The winning square is found at the intersection of each team's last score digit — highlighted automatically when a live game is linked</figcaption>
            </figure>

            <p>SqMGR lets you configure how many payout periods there are. Common options are for the final score only, half &amp; final, or Q1, Q2, Q3 and the final.</p>
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
                        <td>15%</td>
                        <td>$150</td>
                    </tr>
                    <tr>
                        <td>Halftime (end of Q2)</td>
                        <td>30%</td>
                        <td>$300</td>
                    </tr>
                    <tr>
                        <td>End of Q3</td>
                        <td>15%</td>
                        <td>$150</td>
                    </tr>
                    <tr>
                        <td>Final</td>
                        <td>40%</td>
                        <td>$400</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section id="grid-variations">
            <h2>Grid Variations</h2>
            <p>While 100 squares is standard, other formats exist:</p>
            <ul>
                <li><strong>25-square grid (5×5):</strong> Each square covers four digit combinations instead of one.
                    Good for smaller groups where filling 100 squares isn't feasible.
                </li>
                <li><strong>50-square grid (10×5):</strong> Each square covers two digit combinations instead of one. Great for medium size groups.
                </li>
                <li><strong>Rollover (10×10):</strong> A multi-game format designed for playoff-style pools. Each participant claims <em>two</em> squares: a primary and a secondary. Earlier rounds are designated as rollover games, meaning only the primary square is in play. If the winning score lands on an empty square, the payout rolls over to the next game! With the last game everyone's secondary square is now in play.</li>
            </ul>
        </section>

        <section id="faq" class="faq-section">
            <h2>Frequently Asked Questions</h2>

            <div class="faq-item">
                <h3>Do I need to know about football to play squares?</h3>
                <p>No. Football squares is entirely luck-based. Your winning square is determined by a random draw, so
                    no football knowledge helps or hurts your chances.</p>
            </div>

            <div class="faq-item">
                <h3>What happens if the grid isn't fully claimed before the game?</h3>
                <p>It's up to the pool manager. If the pool is for charity, they may specify that it goes to the fund. Otherwise, they may randomly assign a winner.</p>
            </div>

            <div class="faq-item">
                <h3>Is football squares gambling?</h3>
                <p>Laws vary by location. In most friendly, informal settings among friends, family, or coworkers,
                    squares pools are treated as social recreational activities. SqMGR is a free tool for managing the
                    grid and tracking results and we don't process payments or facilitate wagering of any kind. Always
                    check your local laws.</p>
            </div>

            <div class="faq-item">
                <h3>Is this only for pro football?</h3>
                <p>Nope. Many use SqMGR for college football as well as basketball (both NBA and the NCAA).
                </p>
            </div>
        </section>

        <div class="article-cta">
            <p>Ready to run your own football squares pool?</p>
            <router-link to="/create" class="btn cta-primary">Create a Free Pool</router-link>
        </div>

        <nav class="article-nav">
            <div class="article-nav-next">
                <span>Next: </span>
                <router-link to="/resources/setting-up-a-pool">Setting Up a Pool on SqMGR <i
                    class="fas fa-arrow-right"></i></router-link>
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
                "headline": "How Squares Work",
                "description": "A complete guide to football squares: the 10x10 grid, how to claim squares, how numbers are drawn, how winners are determined each quarter, and common payout structures.",
                "url": "https://sqmgr.com/resources/how-squares-work",
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
                        "name": "How Squares Work",
                        "item": "https://sqmgr.com/resources/how-squares-work",
                    },
                ],
            },
            {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "Do I need to know about football to play squares?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "No. Football squares is entirely luck-based. Your winning square is determined by a random draw, so no football knowledge helps or hurts your chances.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "What happens if the grid isn't fully claimed before the game?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "It's up to the pool manager. If the pool is for charity, they may specify unclaimed square winnings go to the fund. Otherwise, they may randomly assign a winner.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Is this only for pro football?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "No. Many use SqMGR for college football as well as basketball (both NBA and the NCAA).",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Is football squares gambling?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Laws vary by location. In most friendly, informal settings among friends, family, or coworkers, squares pools are treated as social recreational activities. Always check your local laws.",
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
