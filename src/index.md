---
title: "Comic Book Art"
layout: "base.njk"
data: comicVineIssues
---

<div class="flex-container">
{% for issue in comicVineIssues %}
    <article class="cover">
        <a href="{{ issue.site_detail_url }}" target="_detail">
        <img src="{{ issue.image.medium_url }}" width="300px" alt="Cover of comic titled {{ issue.volume.name }} {{ issue.name }}"/>
        </a>
        <div class="title">
            <p>{{ issue.volume.name }}{% if issue.name %} - {{ issue.name }}{% endif %}</p>
        </div>
    </article>
{% endfor %}
</div>
<div class="pageupdates">
    <em>Page last updated on {{ page.date }}</em>
</div>
