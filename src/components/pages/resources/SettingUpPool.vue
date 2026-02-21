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
                <li aria-current="page">Setting Up a Pool on SqMGR</li>
            </ol>
        </nav>

        <div class="article-header">
            <h1>Setting Up a Football Squares Pool on SqMGR</h1>
            <p class="article-meta">By <router-link to="/about">Tom Peters</router-link> &middot; Updated February 2026</p>
            <p class="article-lead">SqMGR lets you run a football squares pool entirely online — no paper, no spreadsheets. This covers everything from creating your pool to drawing numbers.</p>
        </div>

        <div class="article-toc">
            <h2><i class="fas fa-list"></i> In This Article</h2>
            <ol>
                <li><a href="#create-account">Create an Account</a></li>
                <li><a href="#create-pool">Create Your Pool</a></li>
                <li><a href="#grid-types">Grid Types Explained</a></li>
                <li><a href="#share-link">Share the Pool Link</a></li>
                <li><a href="#claim-squares">How Participants Claim Squares</a></li>
                <li><a href="#draw-numbers">Drawing Numbers</a></li>
                <li><a href="#mark-winners">Marking Winners</a></li>
                <li><a href="#faq">Frequently Asked Questions</a></li>
            </ol>
        </div>

        <section id="create-account">
            <h2>Create an Account</h2>
            <p>To create and manage a pool, you'll need a free SqMGR account. Sign up with your email or a social login. Once logged in, you're ready to set up your first pool.</p>
            <p>Participants who join your pool <strong>do not need an account</strong>. They can claim squares as a guest using just the pool link you share with them.</p>
        </section>

        <section id="create-pool">
            <h2>Create Your Pool</h2>
            <p>From your account dashboard, click <strong>Create Pool</strong>. You'll be asked for:</p>
            <div class="steps-list">
                <div class="step-card">
                    <div class="step-num">1</div>
                    <div class="step-body">
                        <h3>Pool Name</h3>
                        <p>Give your pool a name people will recognize — something like "Office Pool".</p>
                    </div>
                </div>
                <div class="step-card">
                    <div class="step-num">2</div>
                    <div class="step-body">
                        <h3>Grid Type</h3>
                        <p>Choose between a standard 100-square grid or a 25-square grid. See the <a href="#grid-types">Grid Types section</a> below for details on each option.</p>
                    </div>
                </div>
                <div class="step-card">
                    <div class="step-num">3</div>
                    <div class="step-body">
                        <h3>Password (Optional)</h3>
                        <p>Add an optional password to restrict who can join your pool. Useful if you're sharing the link publicly and only want specific people to participate.</p>
                    </div>
                </div>
            </div>
            <p>Once you click Create, your pool is live.</p>
            <div class="img-placeholder">
                <i class="fas fa-image"></i>
                <p>Screenshot: Create pool form showing the pool name, grid type, and optional password fields</p>
            </div>
        </section>

        <section id="grid-types">
            <h2>Grid Types Explained</h2>
            <p>SqMGR supports two grid types. The right choice depends on how many people are in your pool and how you want to structure the game.</p>

            <h3>Standard 100-Square Grid</h3>
            <p>This is the classic format. A 10×10 grid with 100 individual squares, each mapped to a unique combination of the last digit of each team's score. Each participant claims one or more specific squares.</p>
            <ul>
                <li>Best for groups of 10–100+ participants</li>
                <li>Each square = one specific score combination (e.g., 7 vs 3)</li>
                <li>Random number draw assigns digits 0–9 to each axis after squares are claimed</li>
                <li>Most common format for office pools, friend groups, and large events</li>
            </ul>

            <h3>25-Square Grid</h3>
            <p>A condensed 5×5 grid where each "super square" covers a 2×2 block on the underlying 10×10 grid. This means each square you claim actually corresponds to four possible score combinations instead of one, giving participants a better chance to win.</p>
            <ul>
                <li>Best for smaller groups (10–25 participants)</li>
                <li>Each square covers 4 score digit combinations</li>
                <li>Ideal when you can't fill all 100 squares in a standard grid</li>
                <li>Numbers are still drawn randomly and assigned to the underlying 10×10 axes</li>
            </ul>

            <div class="tip-box">
                <h3><i class="fas fa-lightbulb"></i> Pro Tip</h3>
                <p>If you're running a pool with fewer than 25 people, the 25-square grid is a great choice. Everyone gets more coverage, and the game is just as fun. For larger events like a Super Bowl party, go with the standard 100-square grid.</p>
            </div>
            <div class="img-placeholder">
                <i class="fas fa-image"></i>
                <p>Screenshot: A claimed 100-square grid next to a claimed 25-square grid for comparison</p>
            </div>
        </section>

        <section id="share-link">
            <h2>Share the Pool Link</h2>
            <p>After creating your pool, SqMGR generates a unique join link for your pool. Share it via text, email, Slack, group chat — wherever your participants hang out.</p>
            <p>Anyone with the link can join the pool. If you set a password, they'll be prompted to enter it before claiming squares. Participants join as guests (no account required) and their claimed squares are stored in their browser session.</p>
        </section>

        <section id="claim-squares">
            <h2>How Participants Claim Squares</h2>
            <p>When a participant opens your pool link, they'll see the grid. They click an empty square, enter their name, and submit.</p>
            <p>Participants can claim multiple squares if you allow it. As the pool manager, you can see all claimed squares in real time from your admin view. You can also claim squares on behalf of other players directly from the grid.</p>
        </section>

        <section id="draw-numbers">
            <h2>Drawing Numbers</h2>
            <p>Once you're ready to assign numbers (typically just before kickoff), head to your pool's settings and trigger the draw. SqMGR offers two methods:</p>

            <h3>Random Draw</h3>
            <p>SqMGR randomly shuffles the digits 0–9 and assigns them to both axes of the grid. This is instant, fair, and verifiable by all participants. The numbers are revealed to everyone immediately after the draw.</p>

            <h3>Manual Draw</h3>
            <p>If you prefer the ceremony of a live draw — slips in a hat, pulled one at a time in front of participants — you can enter the numbers manually into SqMGR after your live event. Enter each digit in order as it's drawn, and SqMGR assigns them to the grid.</p>

            <div class="example-box">
                <h3><i class="fas fa-info-circle"></i> Note on Timing</h3>
                <p>Numbers should be drawn <strong>after</strong> all squares are claimed (or as close to kickoff as possible). Drawing numbers before the grid is filled allows participants to strategically pick squares knowing which digits are already assigned — defeating the purpose of the random draw.</p>
            </div>
            <div class="img-placeholder">
                <i class="fas fa-image"></i>
                <p>Screenshot: The number draw screen showing digits being assigned to each axis</p>
            </div>
        </section>

        <section id="mark-winners">
            <h2>Marking Winners</h2>
            <p>After each quarter, check the score and find the winning square on your grid. From your pool's admin view, you can mark that square as a winner for that period. SqMGR tracks winners across all four payout periods (Q1, Halftime, Q3, Final).</p>
            <p>If you've <router-link to="/resources/linking-live-events-and-payouts">linked your grid to a live game</router-link>, SqMGR can display real-time scores directly on the grid, making it easy to see the current winning square at a glance without leaving the page.</p>
            <p>You can also track payment status for each square — mark squares as paid or unpaid to keep things organized, especially for larger pools.</p>
        </section>

        <section id="faq" class="faq-section">
            <h2>Frequently Asked Questions</h2>

            <div class="faq-item">
                <h3>Does SqMGR cost anything?</h3>
                <p>No. SqMGR is completely free to use for pool managers and participants alike. There are no premium tiers, no hidden fees, and no ads tracking your participants. If you find it useful, you can support the project via the <router-link to="/tipjar">Tip Jar</router-link>.</p>
            </div>

            <div class="faq-item">
                <h3>Do participants need to create an account?</h3>
                <p>No. Participants join as guests using the pool link. Only the pool manager (the person who creates the pool) needs an account.</p>
            </div>

            <div class="faq-item">
                <h3>Can I change the grid type after creating a pool?</h3>
                <p>The grid type is set when you add a game to your pool. If you need a different format, you can add a new game grid with a different type within the same pool.</p>
            </div>

            <div class="faq-item">
                <h3>Can I run multiple games in one pool?</h3>
                <p>Yes! SqMGR supports multiple game grids within a single pool. This is great for playoff pools or weekly games. See our guide on <router-link to="/resources/multiple-games-and-rollover">Multiple Games and the Rollover Mechanic</router-link> for details.</p>
            </div>

            <div class="faq-item">
                <h3>What happens to unclaimed squares?</h3>
                <p>Unclaimed squares remain empty. The pool manager can claim them manually, or you can use the rollover feature to carry unclaimed squares into the next game in your pool.</p>
            </div>
        </section>

        <div class="article-cta">
            <p>Ready to get started?</p>
            <router-link to="/create" class="btn cta-primary">Create Your Pool Now</router-link>
        </div>

        <nav class="article-nav">
            <div class="article-nav-prev">
                <span>Previous: </span>
                <router-link to="/resources/how-squares-work"><i class="fas fa-arrow-left"></i> How Football Squares Work</router-link>
            </div>
            <div class="article-nav-next">
                <span>Next: </span>
                <router-link to="/resources/linking-live-events-and-payouts">Linking Live Events &amp; Payouts <i class="fas fa-arrow-right"></i></router-link>
            </div>
        </nav>
    </article>
</template>

<script>
    export default {
        name: "SettingUpPool",
        mounted() {
            this._jsonLd = document.createElement('script')
            this._jsonLd.type = 'application/ld+json'
            this._jsonLd.text = JSON.stringify([
                {
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "@id": "https://sqmgr.com/resources/setting-up-a-pool",
                    "headline": "Setting Up a Football Squares Pool on SqMGR",
                    "description": "A step-by-step guide to creating a football squares pool on SqMGR, covering account setup, grid types (100-square and 25-square), sharing links, drawing numbers, and marking winners.",
                    "url": "https://sqmgr.com/resources/setting-up-a-pool",
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
                        {"@type": "ListItem", "position": 3, "name": "Setting Up a Pool on SqMGR", "item": "https://sqmgr.com/resources/setting-up-a-pool"}
                    ]
                },
                {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "Does SqMGR cost anything?",
                            "acceptedAnswer": {"@type": "Answer", "text": "No. SqMGR is completely free to use for pool managers and participants alike. There are no premium tiers, no hidden fees."}
                        },
                        {
                            "@type": "Question",
                            "name": "Do participants need to create an account?",
                            "acceptedAnswer": {"@type": "Answer", "text": "No. Participants join as guests using the pool link. Only the pool manager needs an account."}
                        },
                        {
                            "@type": "Question",
                            "name": "What is the difference between a 100-square and 25-square grid?",
                            "acceptedAnswer": {"@type": "Answer", "text": "A standard 100-square grid has 100 individual squares each mapped to a unique score combination. A 25-square grid has 25 squares where each covers 4 score combinations — better for smaller groups."}
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
