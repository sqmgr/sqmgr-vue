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
                <li><a href="#heatmap">Score Pair Heat Map</a></li>
                <li><a href="#best-pairs">Best Number Pairs</a></li>
                <li><a href="#by-quarter">Numbers by Quarter</a></li>
                <li><a href="#college-football">College Football Differences</a></li>
                <li><a href="#faq">Frequently Asked Questions</a></li>
            </ol>
        </div>

        <section id="why-numbers-matter">
            <h2>Why the Numbers Matter</h2>
            <p>Each square on a football grid corresponds to the <strong>last digit (ones digit)</strong> of each team's score at the end of a period. NFL football scores are not uniformly distributed — the way the game is scored means certain last digits appear far more often than others.</p>
            <p>Since numbers are drawn randomly after squares are claimed, you can't choose your numbers strategically. But after the draw, you'll definitely feel better (or worse) about your chances based on what you landed.</p>

            <div class="tip-box">
                <h3><i class="fas fa-database"></i> About This Data</h3>
                <p>These numbers come from <strong>3,315 NFL regular season and playoff games</strong> spanning the 2015–2025 seasons — every game played since the NFL moved the extra point kick back to the 15-yard line in 2015, through Super Bowl LX (Seattle Seahawks 29, New England Patriots 13, February 8, 2026). That rule change slightly reduced the success rate of extra points (from ~99% to ~94%), making 2-point conversions modestly more common. The dataset represents 6,630 individual team score observations for final results, plus per-quarter breakdowns.</p>
            </div>
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
            <p>Based on 3,315 NFL games (2015–2025, including Super Bowl LX), here's how often each digit appeared as the final score's last digit:</p>

            <div class="numbers-table">
                <table>
                    <thead>
                        <tr>
                            <th>Digit</th>
                            <th>Frequency</th>
                            <th>Rating</th>
                            <th>Why?</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>0</strong></td>
                            <td class="good">17.4%</td>
                            <td class="good">Excellent</td>
                            <td>Teams start at 0 and land here at multiples of 10 (10, 20, 30…)</td>
                        </tr>
                        <tr>
                            <td><strong>7</strong></td>
                            <td class="good">15.7%</td>
                            <td class="good">Excellent</td>
                            <td>The most common scoring play (TD + XP = 7) creates 7, 14, 21, 28…</td>
                        </tr>
                        <tr>
                            <td><strong>4</strong></td>
                            <td class="good">12.8%</td>
                            <td class="good">Very Good</td>
                            <td>14, 24, 34 appear frequently; 4 edges out 3 in real data</td>
                        </tr>
                        <tr>
                            <td><strong>3</strong></td>
                            <td class="good">12.1%</td>
                            <td class="good">Very Good</td>
                            <td>Field goals (3 pts) are extremely common; 3, 13, 23, 33 all end in 3</td>
                        </tr>
                        <tr>
                            <td><strong>6</strong></td>
                            <td class="okay">9.8%</td>
                            <td class="okay">Good</td>
                            <td>Common in early game scoring before extra points push scores to 7</td>
                        </tr>
                        <tr>
                            <td><strong>1</strong></td>
                            <td class="okay">9.3%</td>
                            <td class="okay">Okay</td>
                            <td>Appears via 21 (3 TDs), 31, 41 — less common than the top tier</td>
                        </tr>
                        <tr>
                            <td><strong>8</strong></td>
                            <td class="bad">6.5%</td>
                            <td class="bad">Below Average</td>
                            <td>Two-point conversions are rare; 28 and 38 appear but not frequently</td>
                        </tr>
                        <tr>
                            <td><strong>9</strong></td>
                            <td class="bad">6.4%</td>
                            <td class="bad">Below Average</td>
                            <td>Hard to reach; requires specific combinations — nearly tied with 8</td>
                        </tr>
                        <tr>
                            <td><strong>2</strong></td>
                            <td class="bad">5.3%</td>
                            <td class="bad">Poor</td>
                            <td>Safeties are rare; mostly appears via 2-pt conversion combinations</td>
                        </tr>
                        <tr>
                            <td><strong>5</strong></td>
                            <td class="bad">4.7%</td>
                            <td class="bad">Worst</td>
                            <td>The rarest digit — requires very unusual scoring combinations</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p>Worth noting: <strong>4 slightly outperforms 3</strong> in final NFL scores (12.8% vs 12.1%). This surprises many people because field goals feel ubiquitous, but 14, 24, and 34 all require a very common two-touchdown-plus-field-goal structure that shows up constantly in real games. Also notable: <strong>8 and 9 are nearly tied</strong> and both qualify as "below average" rather than "poor" — only 5 and 2 are truly rare.</p>
        </section>

        <section id="worst-numbers">
            <h2>The Worst Numbers</h2>
            <p>Getting a score that ends in <strong>2</strong>, <strong>5</strong>, or <strong>9</strong> takes some unusual combinations:</p>
            <ul>
                <li><strong>5 (4.7% — rarest):</strong> Very specific unusual combinations — 15 requires 1 TD + 2-pt conversion + 2 FGs with no other scoring</li>
                <li><strong>2 (5.3%):</strong> A safety, or a specific 2-point conversion at just the right time (e.g., 12 = 1 TD + 2-pt conversion + FG)</li>
                <li><strong>9 (6.4%):</strong> Requires non-standard scoring runs; 19 = 2 TDs + safety + extra point, for example</li>
            </ul>
            <p>These numbers <em>do</em> win. It's just rare enough that many seasons pass without seeing 5–2 or 9–5 at the end of a quarter. When they do hit, they're often a pleasant surprise for a lucky square holder.</p>
        </section>

        <section id="heatmap">
            <h2>Score Pair Heat Map</h2>
            <p>This grid shows the probability of each digit pair appearing as a <strong>final score</strong> in NFL games (2015–2025, including Super Bowl LX). The row is the home team's last digit; the column is the away team's last digit. Darker green = more likely to win.</p>

            <div class="heatmap-wrapper">
                <div class="heatmap-scroll">
                    <table class="heatmap-table">
                        <thead>
                            <tr>
                                <th class="axis-label">Away →<br>Home ↓</th>
                                <th v-for="a in 10" :key="'ah-'+a" class="away-header">{{ a - 1 }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, h) in pairGrid" :key="'row-'+h">
                                <td class="home-header">{{ h }}</td>
                                <td
                                    v-for="(pct, a) in row"
                                    :key="'cell-'+h+'-'+a"
                                    class="heatmap-cell"
                                    :class="heatClass(pct)"
                                    :title="h + '-' + a + ': ' + pct + '%'"
                                >{{ pct }}%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="heatmap-legend">
                    <span class="legend-item tier-best">≥ 3.0% — Best</span>
                    <span class="legend-item tier-great">2.0–2.9% — Great</span>
                    <span class="legend-item tier-good">1.0–1.9% — Good</span>
                    <span class="legend-item tier-avg">0.5–0.9% — Average</span>
                    <span class="legend-item tier-poor">&lt; 0.5% — Rare</span>
                </div>
            </div>
        </section>

        <section id="best-pairs">
            <h2>Best Number Pairs</h2>
            <p>A square's value is determined by <em>both</em> numbers — one from each axis. The best squares are the ones where both digits are high-frequency. Here are the top pairs by actual frequency in 3,315 NFL final scores:</p>

            <div class="numbers-table">
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Pair</th>
                            <th>Frequency</th>
                            <th>Why It Wins</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td><strong>7 – 0</strong></td>
                            <td class="good">3.89%</td>
                            <td>Most common final: one team with a TD lead, other scoreless or tied at a multiple of 10</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td><strong>0 – 7</strong></td>
                            <td class="good">3.50%</td>
                            <td>Same as above with teams reversed — nearly as common</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td><strong>7 – 4</strong></td>
                            <td class="good">3.02%</td>
                            <td>Classic late-game score: 17–14, 24–17, 27–24 type games</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td><strong>3 – 0</strong></td>
                            <td class="good">2.93%</td>
                            <td>Early FG advantage, other team scoreless — frequent Q1 result and common final</td>
                        </tr>
                        <tr>
                            <td>5</td>
                            <td><strong>4 – 7</strong></td>
                            <td class="good">2.75%</td>
                            <td>14–7 is the single most common final score range in NFL history</td>
                        </tr>
                        <tr>
                            <td>6</td>
                            <td><strong>0 – 3</strong></td>
                            <td class="good">2.68%</td>
                            <td>Same pair as 3–0 with teams reversed</td>
                        </tr>
                        <tr>
                            <td>7</td>
                            <td><strong>0 – 4</strong></td>
                            <td class="okay">2.50%</td>
                            <td>14–0, 24–0, 24–10 shutout-adjacent situations appear regularly</td>
                        </tr>
                        <tr>
                            <td>8</td>
                            <td><strong>6 – 0</strong></td>
                            <td class="okay">2.32%</td>
                            <td>16–0, 26–0, 26–10 — teams with two-plus scores vs. scoreless opponent</td>
                        </tr>
                        <tr>
                            <td>9</td>
                            <td><strong>4 – 0</strong></td>
                            <td class="okay">2.20%</td>
                            <td>14–0, 24–0 type games; dominant performance scores</td>
                        </tr>
                        <tr>
                            <td>10</td>
                            <td><strong>3 – 7</strong></td>
                            <td class="okay">2.14%</td>
                            <td>TD vs. FG lead — one of the most common final structures</td>
                        </tr>
                        <tr>
                            <td>11</td>
                            <td><strong>0 – 0</strong></td>
                            <td class="okay">2.08%</td>
                            <td>Tied game at a multiple of 10; excellent in Q1 (15.6%) but 11th overall at final</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="tip-box">
                <h3><i class="fas fa-lightbulb"></i> The 0–0 Myth</h3>
                <p>Many guides claim 0–0 is the best square because "both teams start at 0." While 0–0 is <em>dominant in the first quarter</em> (15.6% of Q1 scores), it finishes 11th for final scores at just 2.08%. The game's most common final-score pair is <strong>7–0 at 3.89%</strong> — nearly double 0–0. If you play a winner-take-all game that only pays on the final, 0–0 is good but not the best.</p>
            </div>
        </section>

        <section id="by-quarter">
            <h2>Numbers by Quarter</h2>
            <p>The distribution of digits shifts dramatically as the game progresses. First-quarter scores are dominated by a handful of possibilities; final scores spread across a much wider range.</p>

            <div class="numbers-table">
                <table>
                    <thead>
                        <tr>
                            <th>Digit</th>
                            <th>After Q1</th>
                            <th>Halftime (Q2)</th>
                            <th>After Q3</th>
                            <th>Final (Q4)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>0</strong></td>
                            <td class="good">41.5%</td>
                            <td class="good">26.0%</td>
                            <td class="good">21.3%</td>
                            <td class="good">17.4%</td>
                        </tr>
                        <tr>
                            <td><strong>7</strong></td>
                            <td class="good">27.7%</td>
                            <td class="good">21.3%</td>
                            <td class="good">19.1%</td>
                            <td class="good">15.7%</td>
                        </tr>
                        <tr>
                            <td><strong>3</strong></td>
                            <td class="good">19.7%</td>
                            <td class="good">18.8%</td>
                            <td class="okay">15.8%</td>
                            <td class="okay">12.1%</td>
                        </tr>
                        <tr>
                            <td><strong>4</strong></td>
                            <td class="okay">5.6%</td>
                            <td class="good">12.2%</td>
                            <td class="good">13.2%</td>
                            <td class="good">12.8%</td>
                        </tr>
                        <tr>
                            <td><strong>6</strong></td>
                            <td class="bad">3.8%</td>
                            <td class="okay">9.2%</td>
                            <td class="okay">9.5%</td>
                            <td class="okay">9.8%</td>
                        </tr>
                        <tr>
                            <td><strong>1</strong></td>
                            <td class="bad">0.4%</td>
                            <td class="bad">5.2%</td>
                            <td class="okay">7.3%</td>
                            <td class="okay">9.3%</td>
                        </tr>
                        <tr>
                            <td><strong>9</strong></td>
                            <td class="bad">0.5%</td>
                            <td class="bad">3.4%</td>
                            <td class="bad">4.7%</td>
                            <td class="bad">6.4%</td>
                        </tr>
                        <tr>
                            <td><strong>8</strong></td>
                            <td class="bad">0.2%</td>
                            <td class="bad">1.5%</td>
                            <td class="bad">4.1%</td>
                            <td class="bad">6.5%</td>
                        </tr>
                        <tr>
                            <td><strong>2</strong></td>
                            <td class="bad">0.4%</td>
                            <td class="bad">1.4%</td>
                            <td class="bad">2.7%</td>
                            <td class="bad">5.3%</td>
                        </tr>
                        <tr>
                            <td><strong>5</strong></td>
                            <td class="bad">0.1%</td>
                            <td class="bad">1.0%</td>
                            <td class="bad">2.4%</td>
                            <td class="bad">4.7%</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p>A few things stand out in this data:</p>
            <ul>
                <li><strong>Q1 is dominated by 0, 7, and 3</strong> — together these three digits account for nearly 90% of all Q1 score last digits. If your pool pays quarterly, the Q1 prize is heavily concentrated.</li>
                <li><strong>4 starts slow but finishes strong</strong> — just 5.6% after Q1 but 12.8% at the final. It needs more scoring to reach multiples like 14, 24, 34.</li>
                <li><strong>1 barely exists in Q1</strong> (0.4%) but climbs to 9.3% by game's end. If you have a 1, your patience is rewarded in later quarters.</li>
                <li><strong>8 and 9 converge at the final</strong> — both under 1% through most of the game, both landing near 6.5% at the final as higher-scoring totals reach 28, 38, 29, 39.</li>
            </ul>

            <div class="numbers-table">
                <h3 style="margin-bottom: 0.5rem; font-size: 1em;">Top Pairs by Quarter</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Quarter</th>
                            <th>#1 Pair</th>
                            <th>#2 Pair</th>
                            <th>#3 Pair</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Q1</strong></td>
                            <td class="good">0–0 (15.6%)</td>
                            <td class="good">7–0 (13.1%)</td>
                            <td class="good">0–7 (11.0%)</td>
                        </tr>
                        <tr>
                            <td><strong>Halftime</strong></td>
                            <td class="good">0–0 (6.5%)</td>
                            <td class="good">7–0 (6.1%)</td>
                            <td class="good">0–3 (5.0%)</td>
                        </tr>
                        <tr>
                            <td><strong>Q3</strong></td>
                            <td class="okay">0–0 (4.6%)</td>
                            <td class="okay">7–0 (4.6%)</td>
                            <td class="okay">0–7 (4.0%)</td>
                        </tr>
                        <tr>
                            <td><strong>Final</strong></td>
                            <td class="good">7–0 (3.86%)</td>
                            <td class="good">0–7 (3.46%)</td>
                            <td class="good">7–4 (3.00%)</td>
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
                <p>For <strong>final score</strong>, the best single square is <strong>7–0</strong> (or 0–7, depending on which axis your team falls on), appearing in 3.89% of final scores across 3,315 NFL games (2015–2025). For <strong>first-quarter</strong> payouts, 0–0 is overwhelmingly the best at 15.6%. The right answer depends on your pool's payout structure.</p>
            </div>

            <div class="faq-item">
                <h3>Are the numbers the same for every quarter?</h3>
                <p>The number assignment on the grid doesn't change between quarters — your square has the same digits all game. However, certain digit pairs are more common at certain points in the game. For example, 0–0 and 0–3 are especially common in Q1 (when few scores have been recorded), while 7–4 and 7–0 dominate final scores. This is why games that pay all four quarters can reward a "mediocre" pair in an early quarter while a "great" pair like 4–7 shines late.</p>
            </div>

            <div class="faq-item">
                <h3>Why is 4 better than 3 if field goals are so common?</h3>
                <p>It seems counterintuitive, but 14, 24, and 34 — the most common scores ending in 4 — require a scoring structure (multiple TDs + field goals) that appears very frequently in actual games. While field goals alone produce 3, 6, 9 (and then back to 12, etc.), the combination of touchdowns and field goals that builds to 14-point totals happens even more often. The data from 3,315 games confirms: 4 edges out 3 at 12.8% vs 12.0%.</p>
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
        computed: {
            pairGrid() {
                // Pair percentages [home_digit 0-9][away_digit 0-9]
                // Derived from 3,315 NFL games, 2015-2025 seasons (through Super Bowl LX)
                return [
                    [2.08, 0.72, 0.81, 2.68, 2.50, 0.94, 1.48, 3.50, 0.72, 1.00], // home 0
                    [1.06, 0.75, 0.45, 1.21, 1.63, 0.57, 0.84, 1.81, 1.09, 0.60], // home 1
                    [0.69, 0.57, 0.06, 0.60, 0.60, 0.27, 0.66, 0.84, 0.57, 0.66], // home 2
                    [2.93, 0.97, 0.39, 0.90, 0.60, 0.45, 1.84, 2.14, 0.60, 0.87], // home 3
                    [2.20, 1.99, 0.87, 1.24, 0.87, 0.54, 1.18, 2.75, 0.81, 0.72], // home 4
                    [0.87, 0.39, 0.30, 0.60, 0.33, 0.18, 0.48, 0.54, 0.51, 0.21], // home 5
                    [2.32, 0.66, 0.60, 1.63, 1.30, 0.60, 0.63, 1.06, 0.69, 0.84], // home 6
                    [3.89, 1.18, 0.63, 1.75, 3.02, 0.57, 0.75, 1.57, 0.63, 1.21], // home 7
                    [1.33, 0.97, 0.39, 0.94, 0.97, 0.45, 0.57, 0.75, 0.21, 0.45], // home 8
                    [0.90, 0.42, 0.45, 0.81, 0.66, 0.30, 0.75, 1.15, 0.24, 0.39], // home 9
                ]
            }
        },
        methods: {
            heatClass(pct) {
                if (pct >= 3.0)  return 'tier-best'
                if (pct >= 2.0)  return 'tier-great'
                if (pct >= 1.0)  return 'tier-good'
                if (pct >= 0.5)  return 'tier-avg'
                return 'tier-poor'
            }
        },
        mounted() {
            this._jsonLd = document.createElement('script')
            this._jsonLd.type = 'application/ld+json'
            this._jsonLd.text = JSON.stringify([
                {
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "@id": "https://sqmgr.com/resources/best-numbers-in-football-squares",
                    "headline": "Best Numbers in Football Squares",
                    "description": "A data-driven look at which numbers win most often in football squares, based on 3,315 NFL games from 2015-2025 (through Super Bowl LX). Includes a full 10x10 score pair heat map, by-quarter breakdowns, and the real #1 best square (hint: it's not 0-0).",
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
                            "acceptedAnswer": {"@type": "Answer", "text": "The best individual digits in NFL football squares are 0 (17.4%), 7 (15.7%), 4 (12.8%), and 3 (12.0%), based on 3,315 NFL games from 2015-2025. These correspond to the most common scoring increments: touchdowns (+7), field goals (+3), and multiples thereof."}
                        },
                        {
                            "@type": "Question",
                            "name": "What are the worst numbers in football squares?",
                            "acceptedAnswer": {"@type": "Answer", "text": "The worst digits are 5 (4.7%), 2 (5.3%), and 9 (6.4%). These require unusual scoring combinations to reach and appear far less frequently in NFL game scores."}
                        },
                        {
                            "@type": "Question",
                            "name": "What is the best square combination in football squares?",
                            "acceptedAnswer": {"@type": "Answer", "text": "For final scores, the best square is 7-0 (or 0-7), appearing in 3.89% of NFL final scores from 2015-2025 (3,315 games). The commonly-cited 0-0 square is actually 11th for final scores (2.08%), though it dominates first-quarter payouts at 15.6%."}
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

// Heat map
.heatmap-wrapper {
    margin: 1.5rem 0;
}

.heatmap-scroll {
    overflow-x: auto;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
}

.heatmap-table {
    border-collapse: collapse;
    font-size: 0.75em;
    white-space: nowrap;

    th, td {
        padding: 6px 8px;
        text-align: center;
        border: 1px solid #e5e7eb;
    }

    .axis-label {
        background: #1f2937;
        color: #fff;
        font-size: 0.85em;
        padding: 8px 12px;
        font-weight: 600;
        white-space: normal;
        min-width: 80px;
    }

    .away-header,
    .home-header {
        background: #1f2937;
        color: #fff;
        font-weight: 700;
        font-size: 0.9em;
        width: 54px;
        min-width: 54px;
    }

    .heatmap-cell {
        width: 54px;
        min-width: 54px;
        font-weight: 500;
        font-variant-numeric: tabular-nums;

        &.tier-best  { background: #166534; color: #fff; font-weight: 700; }
        &.tier-great { background: #dcfce7; color: #14532d; font-weight: 600; }
        &.tier-good  { background: #fef9c3; color: #713f12; }
        &.tier-avg   { background: #f9fafb; color: #6b7280; }
        &.tier-poor  { background: #fef2f2; color: #dc2626; font-size: 0.85em; }
    }
}

.heatmap-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.75rem;
    font-size: 0.78em;

    .legend-item {
        padding: 3px 10px;
        border-radius: 99px;
        font-weight: 500;

        &.tier-best  { background: #166534; color: #fff; }
        &.tier-great { background: #dcfce7; color: #14532d; border: 1px solid #bbf7d0; }
        &.tier-good  { background: #fef9c3; color: #713f12; border: 1px solid #fde68a; }
        &.tier-avg   { background: #f9fafb; color: #6b7280; border: 1px solid #e5e7eb; }
        &.tier-poor  { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
    }
}
</style>
