<template>
    <div class="wrapper">
        <main>
            <header id="be">
                <span id="be-bg"><h1><span class="blink-b">b</span>eError</h1></span>
            </header>
            <p>This is not the page you're looking for. Look for pages with <a href="https://duckduckgo.com">DuckDuckGo</a></p>
        </main>
        <footer>This error is powered by <g-image src="../assets/aha_i.png" alt="/|H|\" /></footer>
    </div>
</template>

<script>
//TODO this is just a quick hack :S
export default {
    metaInfo: {
        title: 'Error: Page not found',
        link: [
            {
                rel: 'stylesheet',
                href: '/css/error.css'
            }
        ]
    }
}
</script>

