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
                <li aria-current="page">Best Numbers in Football Squares</li>
            </ol>
        </nav>

        <div class="article-header">
            <h1>Best Numbers in Football Squares</h1>
            <p class="article-meta">By <router-link to="/about">Tom Peters</router-link> &middot; Updated February 2026</p>
            <p class="article-lead">Football squares is a game of luck — you don't get to choose your numbers after the draw. But knowing which digits historically win more often adds a fun layer of math to the conversation. Some numbers are dramatically better than others, and the reason comes down to how football is scored.</p>
        </div>

        <div class="article-toc">
            <h2><i class="fas fa-list"></i> In This Article</h2>
            <ol>
                <li><a href="#why-numbers-matter">Why the Numbers Matter</a></li>
                <li><a href="#scoring-math">The Scoring Math</a></li>
                <li><a href="#best-numbers">The Best Numbers</a></li>
                <li><a href="#worst-numbers">The Worst Numbers</a></li>
                <li><a href="#best-pairs">Best Number Pairs</a></li>
                <li><a href="#college-football">College Football Differences</a></li>
                <li><a href="#faq">Frequently Asked Questions</a></li>
            </ol>
        </div>

        <section id="why-numbers-matter">
            <h2>Why the Numbers Matter</h2>
            <p>Each square on a football grid corresponds to the <strong>last digit (ones digit)</strong> of each team's score at the end of a period. NFL football scores are not uniformly distributed — the way the game is scored means certain last digits appear far more often than others.</p>
            <p>Since numbers are drawn randomly after squares are claimed, you can't choose your numbers strategically. But after the draw, you'll definitely feel better (or worse) about your chances based on what you landed.</p>
        </section>

        <section id="scoring-math">
            <h2>The Scoring Math</h2>
            <p>NFL scoring increments determine which ones digits naturally cluster. The core scoring plays and their point values:</p>
            <ul>
                <li><strong>Touchdown + Extra Point:</strong> 7 points</li>
                <li><strong>Touchdown + 2-Point Conversion:</strong> 8 points</li>
                <li><strong>Touchdown (no conversion):</strong> 6 points</li>
                <li><strong>Field Goal:</strong> 3 points</li>
                <li><strong>Safety:</strong> 2 points</li>
            </ul>
            <p>Starting from 0 and combining these increments, you quickly see that scores ending in 0, 3, 4, 7, and 6 are the most common. Scores ending in 2, 5, 8, and 9 require unusual combinations and are much rarer.</p>

            <div class="example-box">
                <h3><i class="fas fa-football-ball"></i> Common Score Progressions</h3>
                <p>A team starting at 0 follows these typical scoring paths:</p>
                <p>0 → 3 (FG) → 6 (FG) → 7 (TD+XP) → 10 (FG) → 13 (FG) → 14 (TD+XP) → 17 (FG) → 20 (FG) → 21 (TD+XP) → 24 (FG)...</p>
                <p>Notice how the ones digits cycle through: 0, 3, 6, 7, 0, 3, 4, 7, 0, 1, 4 — with 0, 3, 4, and 7 appearing repeatedly.</p>
            </div>
        </section>

        <section id="best-numbers">
            <h2>The Best Numbers</h2>
            <p>Based on historical NFL score data, the best individual digits to have on each axis are:</p>

            <div class="numbers-table">
                <table>
                    <thead>
                        <tr>
                            <th>Digit</th>
                            <th>Relative Win Rate</th>
                            <th>Why?</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>0</strong></td>
                            <td class="good">Excellent</td>
                            <td>Teams start at 0 and return here often (multiples of 10: 10, 20, 30...)</td>
                        </tr>
                        <tr>
                            <td><strong>7</strong></td>
                            <td class="good">Excellent</td>
                            <td>The most common scoring play (TD + extra point = 7) lands here repeatedly</td>
                        </tr>
                        <tr>
                            <td><strong>3</strong></td>
                            <td class="good">Very Good</td>
                            <td>Field goals (3 pts) are extremely common; 3, 13, 23, 33 all end in 3</td>
                        </tr>
                        <tr>
                            <td><strong>4</strong></td>
                            <td class="good">Very Good</td>
                            <td>14, 24, 34 (2 TDs + various combinations) appear frequently</td>
                        </tr>
                        <tr>
                            <td><strong>6</strong></td>
                            <td class="okay">Good</td>
                            <td>Common in early game scoring before extra points push to 7</td>
                        </tr>
                        <tr>
                            <td><strong>1</strong></td>
                            <td class="okay">Okay</td>
                            <td>Appears via 21 (3 TDs), 31, 41 — less common than the top tier</td>
                        </tr>
                        <tr>
                            <td><strong>8</strong></td>
                            <td class="okay">Below Average</td>
                            <td>Two-point conversions are rare; 28 and 38 appear but not frequently</td>
                        </tr>
                        <tr>
                            <td><strong>5</strong></td>
                            <td class="bad">Poor</td>
                            <td>Requires unusual combinations; 15, 25, 35 require 2-pt conversions</td>
                        </tr>
                        <tr>
                            <td><strong>9</strong></td>
                            <td class="bad">Poor</td>
                            <td>Hard to reach; requires specific combinations like 3 FGs + safety</td>
                        </tr>
                        <tr>
                            <td><strong>2</strong></td>
                            <td class="bad">Poor</td>
                            <td>Safeties are rare; mostly appears via 2-pt conversion combinations</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section id="worst-numbers">
            <h2>The Worst Numbers</h2>
            <p>The digits <strong>2</strong>, <strong>5</strong>, and <strong>9</strong> are consistently the worst in NFL football squares. Reaching a score with one of these as the last digit typically requires:</p>
            <ul>
                <li><strong>2:</strong> A safety, or a specific 2-point conversion at just the right time (e.g., 12 = 1 TD + 2-pt conversion + FG)</li>
                <li><strong>5:</strong> Very specific unusual combinations (e.g., 15 = 1 TD + 2-pt conversion + 2 FGs... and nothing else)</li>
                <li><strong>9:</strong> Requires non-standard scoring runs; 19 = 2 TDs + safety + extra point, for example</li>
            </ul>
            <p>That said, these numbers <em>do</em> win. It's just rare enough that many seasons pass without seeing 5–2 or 9–5 at the end of a quarter. When they do hit, they're often a pleasant surprise for a lucky square holder.</p>
        </section>

        <section id="best-pairs">
            <h2>Best Number Pairs</h2>
            <p>A square's value is determined by <em>both</em> numbers — one from each axis. The best squares are the ones where both digits are high-frequency. The most historically favorable pairs in NFL football squares are:</p>

            <div class="numbers-table">
                <table>
                    <thead>
                        <tr>
                            <th>Pair (Home–Away or any axis)</th>
                            <th>Why It Wins</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>0 – 0</strong></td>
                            <td>Scores tied at the end of any period, common early in games</td>
                        </tr>
                        <tr>
                            <td><strong>7 – 0</strong> or <strong>0 – 7</strong></td>
                            <td>One team with a TD lead, other team scoreless — very common Q1 result</td>
                        </tr>
                        <tr>
                            <td><strong>7 – 3</strong> or <strong>3 – 7</strong></td>
                            <td>TD vs. FG lead — one of the most common halftime scores in NFL history</td>
                        </tr>
                        <tr>
                            <td><strong>3 – 0</strong> or <strong>0 – 3</strong></td>
                            <td>Early FG lead, nothing for the other team — frequent Q1 result</td>
                        </tr>
                        <tr>
                            <td><strong>4 – 7</strong> or <strong>7 – 4</strong></td>
                            <td>14–7 is the single most common final score range in NFL history</td>
                        </tr>
                        <tr>
                            <td><strong>0 – 4</strong> or <strong>4 – 0</strong></td>
                            <td>14–0, 24–0 shutout-adjacent situations appear regularly</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section id="college-football">
            <h2>College Football Differences</h2>
            <p>College football tends to produce higher scores than the NFL, and the distribution of digits shifts slightly as a result. The key differences:</p>
            <ul>
                <li><strong>0 and 7</strong> remain excellent — still the most common, just at higher absolute scores (28, 35, 42, etc.)</li>
                <li><strong>4</strong> stays strong — 14, 21, 24, 28, 35, 42 are all common in college games</li>
                <li><strong>3</strong> remains good but field goals are slightly less dominant relative to TDs in high-scoring college games</li>
                <li><strong>Blowouts are more common</strong> — late garbage-time touchdowns shift the final digits more unpredictably in lopsided games</li>
                <li><strong>2-point conversions</strong> are attempted far more frequently in college football, making 8 a slightly better number than in the NFL</li>
            </ul>
            <p>For NCAAB (college basketball), the entire number distribution changes dramatically — higher scores mean a wider spread across all digits, with 0 still favorable but the gap between best and worst narrowing considerably.</p>
        </section>

        <section id="faq" class="faq-section">
            <h2>Frequently Asked Questions</h2>

            <div class="faq-item">
                <h3>Can knowing the best numbers help me win?</h3>
                <p>Not directly. Numbers are assigned randomly after squares are claimed, so you can't choose which digits you get. However, the information is useful for understanding your odds after the draw — if you end up with 0 and 7, you're in great shape. If you get 2 and 5, you know it's a long shot.</p>
            </div>

            <div class="faq-item">
                <h3>What is the single best square in football squares?</h3>
                <p>Statistically, 0–0 is the best single square since both teams start at 0 and ties occur frequently in the first quarter. However, 7–0, 0–7, 7–3, and 3–7 are also excellent choices. The exact "best" pair varies slightly based on dataset and whether you're analyzing Q1, halftime, or final scores.</p>
            </div>

            <div class="faq-item">
                <h3>Are the numbers the same for every quarter?</h3>
                <p>The number assignment on the grid doesn't change between quarters — your square has the same digits all game. However, certain digit pairs are more common at certain points in the game. For example, 0–0 and 0–3 are especially common in Q1, while higher-scoring combinations like 4–7 dominate final scores.</p>
            </div>

            <div class="faq-item">
                <h3>If I always get bad numbers, is the draw rigged?</h3>
                <p>Almost certainly not — variance is real and runs of bad luck happen. Over a large enough sample (many games), the random draw is fair to all participants. Individual games will always produce winner and loser squares, and the randomness of the draw means everyone has an equal chance of landing any number before the draw occurs.</p>
            </div>
        </section>

        <div class="article-cta">
            <p>Try your luck — create a free pool and see what numbers you draw.</p>
            <router-link to="/create" class="btn cta-primary">Create a Pool on SqMGR</router-link>
        </div>

        <nav class="article-nav">
            <div class="article-nav-prev">
                <span>Previous: </span>
                <router-link to="/resources/multiple-games-and-rollover"><i class="fas fa-arrow-left"></i> Multiple Games &amp; Rollover</router-link>
            </div>
            <div class="article-nav-next">
                <span>Next: </span>
                <router-link to="/resources/super-bowl-squares">Super Bowl Squares Guide <i class="fas fa-arrow-right"></i></router-link>
            </div>
        </nav>
    </article>
</template>

<script>
    export default {
        name: "BestNumbers",
        mounted() {
            this._jsonLd = document.createElement('script')
            this._jsonLd.type = 'application/ld+json'
            this._jsonLd.text = JSON.stringify([
                {
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "@id": "https://sqmgr.com/resources/best-numbers-in-football-squares",
                    "headline": "Best Numbers in Football Squares",
                    "description": "A data-driven look at which numbers win most often in football squares, why certain digits like 0, 7, 3, and 4 dominate, and which numbers (2, 5, 9) to avoid.",
                    "url": "https://sqmgr.com/resources/best-numbers-in-football-squares",
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
                        {"@type": "ListItem", "position": 3, "name": "Best Numbers in Football Squares", "item": "https://sqmgr.com/resources/best-numbers-in-football-squares"}
                    ]
                },
                {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "What are the best numbers in football squares?",
                            "acceptedAnswer": {"@type": "Answer", "text": "The best individual digits in NFL football squares are 0, 7, 3, and 4. These correspond to the most common scoring increments: touchdowns (+7), field goals (+3), and multiples thereof."}
                        },
                        {
                            "@type": "Question",
                            "name": "What are the worst numbers in football squares?",
                            "acceptedAnswer": {"@type": "Answer", "text": "The worst digits are 2, 5, and 9. These require unusual scoring combinations to reach and appear far less frequently in NFL game scores."}
                        },
                        {
                            "@type": "Question",
                            "name": "What is the best square combination in football squares?",
                            "acceptedAnswer": {"@type": "Answer", "text": "Statistically, 0-0 is the best single square since both teams start at 0 and ties are common early in games. The pairs 7-0, 0-7, 7-3, and 3-7 are also excellent."}
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
