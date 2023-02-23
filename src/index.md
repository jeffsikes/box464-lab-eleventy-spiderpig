---
title: "Peter Porker, the Spectacular Spider-Ham"
layout: "base.njk"
data: marvelCovers
---
<style>
    header {
        height: 100px;
    }
    h1 {
        text-align: center;
        padding-left: 10px;
        padding-right: 10px;
    }
    .flex-container {
        display: flex;
        flex-flow: row wrap;
        align-items: flex-start;
        flex-wrap: wrap;
        align-content: center;
        margin: 20px;
        justify-content: center;
    }

    article {
        margin: 15px;
        width: 400px;
        height: 640px;
        text-align: center;
    }
    .title {
        margin-top: 5px;
    }
    footer {
        text-align: center;
    }
</style>  
<div class="flex-container">
{% for cover in marvelCovers %}
    <article class="cover">
        <a href="{{ cover.urls[0].url }}" target="_detail">
        <img src="{{ cover.thumbnail.path }}.{{cover.thumbnail.extension }}" width="300px" alt="Cover of comic titled {{ cover.title }}"/>
        </a>
        <div class="title">
            <p>{{ cover.title }}</p>
        </div>
    </article>
{% endfor %}
</div>
