---
title: "Marvel Comic Book Art"
layout: "base.njk"
data: marvelCovers
---
<div class="flex-container">
{% for cover in marvelCovers %}
    <article class="cover">
        <a href="{{ cover.urls[0].url | replace: "http:", "https:" }}" target="_detail">
        <img src="{{ cover.thumbnail.path | replace: "http:", "https:" }}.{{ cover.thumbnail.extension }}" width="300px" alt="Cover of comic titled {{ cover.title }}"/>
        </a>
        <div class="title">
            <p>{{ cover.title }}</p>
        </div>
    </article>
{% endfor %}
    <div class="pageupdates">
    <em>Page last updated on {{ page.date }}</em>
    </div>
</div>
