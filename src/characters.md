---
title: "Marvel Characters"
layout: "base.njk"
data: marvelCharacters
---

<p align="center">Character names that start with "{{ processEnv.characterNameStartsWith }}"</p>
<div class="flex-container">
{% for character in marvelCharacters %}
    <article class="cover">
        <img src="{{ character.thumbnail.path | replace: "http:", "https:" }}.{{ character.thumbnail.extension }}" width="300px" alt="Character drawing of {{ character.name }}"/>
        <div class="title">
            {{ character.name }}<br/>
            <b>Marvel Character Id:</b> {{ character.id }}
        </div>
    </article>
{% endfor %}
</div>
<div class="pageupdates">
    <em>Page last updated on {{ page.date }}</em>
</div>
