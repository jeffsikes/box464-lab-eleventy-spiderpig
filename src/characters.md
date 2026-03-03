---
title: "Comic Characters"
layout: "base.njk"
data: comicVineCharacters
---

<p align="center">Characters matching "{{ processEnv.characterName }}"</p>
<div class="flex-container">
{% for character in comicVineCharacters %}
    <article class="cover">
        <a href="{{ character.site_detail_url }}" target="_detail">
        <img src="{{ character.image.medium_url }}" width="300px" alt="Character drawing of {{ character.name }}"/>
        </a>
        <div class="title">
            {{ character.name }}<br/>
            {% if character.real_name %}<em>{{ character.real_name }}</em><br/>{% endif %}
            <b>ComicVine Character Id:</b> {{ character.id }}
        </div>
    </article>
{% endfor %}
</div>
<div class="pageupdates">
    <em>Page last updated on {{ page.date }}</em>
</div>
