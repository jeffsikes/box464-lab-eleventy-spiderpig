---
title: "Peter Porker, the Spectacular Spider-Ham"
layout: "base.njk"
data: marvelCovers
---
  <div class="card-container">
{% for cover in marvelCovers %}
    <div class="card">
      <a href="{{ cover.urls[0].url }}" target="_detail">
      <img src="{{ cover.thumbnail.path }}.{{cover.thumbnail.extension }}" alt="Cover of comic titled {{ cover.title }}"/>
      </a>
      <div class="content">
        <h3>{{ cover.title }}</h3>
      </div>
    </div>
{% endfor %}
</div>
</section>
