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
                <li aria-current="page">Super Bowl Squares Guide</li>
            </ol>
        </nav>

        <div class="article-header">
            <h1>Super Bowl Squares: The Complete Party Guide</h1>
            <p class="article-meta">By <router-link to="/about">Tom Peters</router-link> &middot; Updated February 2026</p>
            <p class="article-lead">The Super Bowl is the biggest day of the year for football squares. More pools run on that Sunday than any other day, from small friend groups to large pools that have been running for decades.</p>
        </div>

        <div class="article-toc">
            <h2><i class="fas fa-list"></i> In This Article</h2>
            <ol>
                <li><a href="#why-super-bowl">Why Super Bowl Is Perfect for Squares</a></li>
                <li><a href="#planning-ahead">Planning Ahead</a></li>
                <li><a href="#payout-structures">Popular Super Bowl Payout Structures</a></li>
                <li><a href="#draw-timing">When to Draw Numbers</a></li>
                <li><a href="#large-pools">Running Large Pools</a></li>
                <li><a href="#game-day">Game Day Tips</a></li>
                <li><a href="#faq">Frequently Asked Questions</a></li>
            </ol>
        </div>

        <section id="why-super-bowl">
            <h2>Why Super Bowl Is Perfect for Squares</h2>
            <p>Football squares thrive at the Super Bowl for several reasons:</p>
            <ul>
                <li><strong>Everyone's watching.</strong> Even casual fans and non-football viewers tune in for the halftime show and commercials, making it the most inclusive sports event to run a pool for.</li>
                <li><strong>No picks required.</strong> Unlike bracket pools or prop bets, squares requires zero football knowledge. It's immediately accessible to anyone.</li>
                <li><strong>Easy to organize online.</strong> With an online tool you can manage hundreds of participants without printing anything.</li>
            </ul>
        </section>

        <section id="planning-ahead">
            <h2>Planning Ahead</h2>
            <p>Super Bowl squares pools work best when set up early. Here's a rough planning timeline:</p>

            <div class="steps-list">
                <div class="step-card">
                    <div class="step-num">1</div>
                    <div class="step-body">
                        <h3>2–3 Weeks Before the Game</h3>
                        <p>Create your pool on SqMGR and share the link. The Super Bowl teams are confirmed after the Conference Championships (usually two weeks before the Super Bowl), so you'll know the teams in time to set them on your grid.</p>
                    </div>
                </div>
                <div class="step-card">
                    <div class="step-num">2</div>
                    <div class="step-body">
                        <h3>1 Week Before</h3>
                        <p>Send a reminder to anyone who hasn't claimed squares yet. Remind participants of the price per square and your payment method. Collect payment early to avoid game-day scrambles.</p>
                    </div>
                </div>
                <div class="step-card">
                    <div class="step-num">3</div>
                    <div class="step-body">
                        <h3>Day Before or Morning of the Game</h3>
                        <p>Lock the squares and draw your numbers. If you're doing a live draw at your party, save the draw until everyone is assembled. If you're managing a remote pool, draw via SqMGR's random draw and share the result.</p>
                    </div>
                </div>
                <div class="step-card">
                    <div class="step-num">4</div>
                    <div class="step-body">
                        <h3>Game Day</h3>
                        <p>Share the pool link with all participants so they can watch the live score on their phones. SqMGR will automatically sync the scores every five minutes (no need to refresh your page).</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="payout-structures">
            <h2>Popular Super Bowl Payout Structures</h2>
            <p>Super Bowl pools are worth tweaking from the usual split. The halftime show makes halftime a bigger deal, and the final score carries the most anticipation. Common Super Bowl splits:</p>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Period</th>
                            <th>Standard</th>
                            <th>Halftime-Heavy</th>
                            <th>Final-Heavy</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Q1</td>
                            <td>20%</td>
                            <td>15%</td>
                            <td>15%</td>
                        </tr>
                        <tr>
                            <td>Halftime</td>
                            <td>30%</td>
                            <td>40%</td>
                            <td>25%</td>
                        </tr>
                        <tr>
                            <td>Q3</td>
                            <td>20%</td>
                            <td>15%</td>
                            <td>15%</td>
                        </tr>
                        <tr>
                            <td>Final</td>
                            <td>30%</td>
                            <td>30%</td>
                            <td>45%</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p>For Super Bowl parties, the <strong>Halftime-Heavy</strong> split is popular because the halftime show creates natural buzz and energy around the halftime payout. The <strong>Final-Heavy</strong> split is common in larger pools where the biggest prize should go to whoever survives until the end.</p>
        </section>

        <section id="draw-timing">
            <h2>When to Draw Numbers</h2>
            <p>Timing the number draw can add a bit of ceremony. The rule is simple: <strong>draw after all squares are claimed</strong>, ideally where everyone can see or take part.</p>
            <p>Popular approaches for Super Bowl parties:</p>
            <ul>
                <li><strong>Pre-game draw:</strong> Do the draw while everyone is gathering, before kickoff. Use SqMGR's random draw feature and display the result on a TV or screen. Everyone sees their numbers before the first play.</li>
                <li><strong>Live draw at the party:</strong> Cut paper strips numbered 0–9, put them in two hats (one for each team's axis), and draw them one at a time. Have a guest draw each number. Enter the results manually into SqMGR. Great for engagement.</li>
                <li><strong>Remote pool draw:</strong> For pools where participants are watching from different locations, use SqMGR's random draw and share a screenshot or link to the pool page so everyone can see their numbers.</li>
            </ul>
        </section>

        <section id="game-day">
            <h2>Game Day Tips</h2>
            <ul>
                <li><strong>Share the pool link early.</strong> Text or email the link to all participants before the game so they can pull it up on their phones during the party.</li>
                <li><strong>Have your payout plan ready.</strong> Know how you're paying winners (cash on hand, Venmo, etc.). Don't be the pool manager who owes people money for weeks.</li>
                <li><strong>Take a photo of the final grid.</strong> A screenshot or photo of the completed grid with winners marked is a fun keepsake and proof of results. You can also print the results from SqMGR.</li>
            </ul>

            <div class="warning-box">
                <h3><i class="fas fa-exclamation-triangle"></i> Reminder</h3>
                <p>SqMGR is a free tool for managing grids and tracking results. We do not process payments of any kind. All financial arrangements between participants are the responsibility of the pool manager. Always ensure your pool complies with local laws regarding informal games of chance.</p>
            </div>
        </section>

        <section id="faq" class="faq-section">
            <h2>Frequently Asked Questions</h2>

            <div class="faq-item">
                <h3>How many squares should each person buy for a Super Bowl pool?</h3>
                <p>It depends on your pool size. For a 10-person pool, each person might buy 10 squares. For a 25-person pool, 4 squares each. There's no rule. Some participants buy more squares for more chances. Just ensure you have a plan for any squares that go unsold.</p>
            </div>

            <div class="faq-item">
                <h3>What's a good price per square for a Super Bowl pool?</h3>
                <p>Common prices range from $5 to $25 per square depending on your group. $10/square (a $1,000 total pot) is popular for medium-sized groups and creates meaningful payouts without being excessive. For workplace pools with mixed participation, $5/square keeps it accessible.</p>
            </div>

            <div class="faq-item">
                <h3>What if the Super Bowl goes to overtime?</h3>
                <p>In overtime, the final winner is determined by the final score when the game ends, including overtime. If your pool only pays out the Q1, Halftime, Q3, and Final periods, overtime doesn't change anything. The "Final" payout covers the actual end of the game regardless of when it ends.</p>
            </div>

            <div class="faq-item">
                <h3>Can I run a Super Bowl squares pool online for remote participants?</h3>
                <p>Absolutely. Participants can claim squares from anywhere via the pool link. Share the link via text, email, or group chat. Everyone can watch the live score grid in real time during the game on their own devices.</p>
            </div>

            <div class="faq-item">
                <h3>When should I close the pool for new participants?</h3>
                <p>Most pool managers close claims (or draw numbers) just before kickoff. Some close 24 hours in advance to give everyone time to review their squares. The key rule: numbers must be drawn <em>after</em> squares are filled, or simultaneously, to maintain fairness.</p>
            </div>
        </section>

        <div class="article-cta">
            <p>Ready to run the best Super Bowl squares pool your group has ever had?</p>
            <router-link to="/create" class="btn cta-primary">Create Your Super Bowl Pool</router-link>
        </div>

        <nav class="article-nav">
            <div class="article-nav-prev">
                <span>Previous: </span>
                <router-link to="/resources/best-numbers-in-football-squares"><i class="fas fa-arrow-left"></i> Best Numbers in Squares</router-link>
            </div>
        </nav>

        <div class="related-articles">
            <h2>More Resources</h2>
            <ul>
                <li><router-link to="/resources/how-squares-work"><i class="fas fa-th"></i> How Football Squares Work</router-link></li>
                <li><router-link to="/resources/setting-up-a-pool"><i class="fas fa-plus-circle"></i> Setting Up a Pool on SqMGR</router-link></li>
                <li><router-link to="/resources/linking-live-events-and-payouts"><i class="fas fa-link"></i> Linking Live Events &amp; Payouts</router-link></li>
                <li><router-link to="/resources/best-numbers-in-football-squares"><i class="fas fa-chart-bar"></i> Best Numbers in Football Squares</router-link></li>
            </ul>
        </div>
    </article>
</template>

<script>
    export default {
        name: "SuperBowlSquares",
        mounted() {
            this._jsonLd = document.createElement('script')
            this._jsonLd.type = 'application/ld+json'
            this._jsonLd.text = JSON.stringify([
                {
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "@id": "https://sqmgr.com/resources/super-bowl-squares",
                    "headline": "Super Bowl Squares: The Complete Party Guide",
                    "description": "Everything you need to run a Super Bowl squares pool: planning timeline, payout structures, when to draw numbers, tips for large pools, and game day advice.",
                    "url": "https://sqmgr.com/resources/super-bowl-squares",
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
                        {"@type": "ListItem", "position": 3, "name": "Super Bowl Squares Guide", "item": "https://sqmgr.com/resources/super-bowl-squares"}
                    ]
                },
                {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "How many squares should each person buy for a Super Bowl pool?",
                            "acceptedAnswer": {"@type": "Answer", "text": "It depends on your pool size. For a 10-person pool, each person might buy 10 squares. For a 25-person pool, 4 squares each. There's no rule — some participants buy more squares for more chances. Just ensure you have a plan for any squares that go unsold."}
                        },
                        {
                            "@type": "Question",
                            "name": "What's a good price per square for a Super Bowl pool?",
                            "acceptedAnswer": {"@type": "Answer", "text": "Common prices range from $5 to $25 per square depending on your group. $10/square (a $1,000 total pot) is popular for medium-sized groups. For workplace pools with mixed participation, $5/square keeps it accessible."}
                        },
                        {
                            "@type": "Question",
                            "name": "What if the Super Bowl goes to overtime?",
                            "acceptedAnswer": {"@type": "Answer", "text": "The final winner is determined by the final score when the game ends, including overtime. The 'Final' payout covers the actual end of the game regardless of when it ends."}
                        },
                        {
                            "@type": "Question",
                            "name": "Can I run a Super Bowl squares pool online for remote participants?",
                            "acceptedAnswer": {"@type": "Answer", "text": "Absolutely. Participants can claim squares from anywhere via the pool link. Everyone can watch the live score grid in real time during the game on their own devices."}
                        },
                        {
                            "@type": "Question",
                            "name": "When should I close the pool for new participants?",
                            "acceptedAnswer": {"@type": "Answer", "text": "Most pool managers close claims (or draw numbers) just before kickoff. Some close 24 hours in advance. The key rule: numbers must be drawn after squares are filled, or simultaneously, to maintain fairness."}
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
