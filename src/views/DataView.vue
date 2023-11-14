<script setup>
  import HelpTextIcon from '@/components/HelpTextIcon.vue';
</script>
<template>
    <div class="section">
        <div class="container">
            <h1>Data</h1>
            <div class="layout-grid-3">
                <div class="grid-item-span-3">
                    <p>We keep track of data about criminal legal systems <help-text-icon>police, courts, and jails</help-text-icon> across the United States.</p>
                </div>
                <div>
                    <a href="https://data-sources.pdap.io/" class="button">Search our database</a>
                    <p>If you have a question to answer, we may already know about helpful data in your area.</p>
                </div>
                <div>
                    <a href="https://airtable.com/shrbFfWk6fjzGnNsk" class="button">Make a request</a>
                    <p>If we're missing something, or if you're just not a data person, we can help.</p>
                </div>
                <div>
                    <a href="https://docs.pdap.io/api/introduction" class="button">Use our API</a>
                    <p>If you'd like to access our data programmatically.</p>
                </div>
            </div>
        </div>
    </div>
    <div class="section">
        <div class="container">
            <h1>How our data is used</h1>
            <p>
                We serve as a “data help desk”, where people can use our tools to answer questions.
            </p>
            <p>
                Police in the United States are decentralized, and managed at the municipal and county level. 
                By organizing locally and working backward from community needs, we ensure our work is impactful 
                and relevant to the people who use data about the police every day.
            </p>
            <h2><i class="fa fa-book"></i> Sharing access to Traffic Stop data</h2>
            <div class="layout-grid-2 small">
                <div>
                    <p>
                        What is the reality of traffic enforcement in Pittsburgh, 
                        given changed policies about enforcing minor traffic violations?
                    </p>
                </div>
                <div>
                    <p>
                        Several independent groups in Pittsburgh were trying to answer this question, 
                        so we requested data from the City of Pittsburgh and 
                        <a href="https://data-sources.pdap.io/search/traffic%20stops/pittsburgh">shared it in our database</a>. 
                        Among other things, it led to this article in Public Source.
                    </p>
                    <p>
                        To see traffic stop data from other places, <a href="https://data-sources.pdap.io/search/traffic/all">start here</a>.
                    </p>
                </div>
            </div>
            <h2><i class="fa fa-phone"></i> Preserving Calls for Service data in Oakland CA</h2>
            <div class="layout-grid-2 small">
                <div>
                    <p>
                        How are police in Oakland, CA dispatched to address community needs? <br>
                    </p>
                </div>
                <div>
                    <p>
                        Calls for police service were published by the city, but only stayed online for 1&ndash;2 days. We made a
                        <a href="https://github.com/Police-Data-Accessibility-Project/github-actions-demo/tree/main">web scraper</a> 
                        to automatically collect the data daily, for free.
                    </p>
                    <p>
                        We archived data for 3 months before their site went down, and helped a journalist with her research.
                        Our open-source work is a model for future zero-budget research projects.
                    </p>
                </div>
            </div>
            <h2><i class="fa fa-sitemap"></i> Consolidating records about the Allegheny County Jail</h2>
            <div class="layout-grid-2 small">
                <p class="grid-item-span-2">
                    This facility has faced mounting scrutiny, as dozens of people have died in custody in recent years.
                </p>
                <p>
                    How many people are in jail because they cannot afford bail? <br>
                </p>
                <p>
                    <a href="https://data-sources.pdap.io/data-sources/recn5peRrGMNEksXI">County jail holding status dashboard</a>
                </p>
                <p>
                    How often are people placed in solitary confinement after it was banned in 2022?
                </p>
                <p>
                    <a href="https://data-sources.pdap.io/data-sources/recabQ04zvUH4RKQ0">Segregated Housing reports</a>
                </p>
                <p>
                    Do people in the jail receive medical attention when they request it?
                </p>
                <p>
                    <a href="https://data-sources.pdap.io/data-sources/recPdBv9M0QhyKKZN">2021</a> & <a href="https://data-sources.pdap.io/data-sources/recFUDsFf9RPpCZX6">2022</a> surveys of incarcerated population
                </p>
                <p>
                    Has the city documented any health code violations at the Allegheny County Jail?
                </p>
                <p>
                    <a href="https://data-sources.pdap.io/search/health%20/allegheny">Inspection records from the Health Department</a>
                </p>
            </div>
        </div>
    </div>
</template>