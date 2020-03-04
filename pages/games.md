---
layout: page
show_meta: false
title: "Games"
subheadline: "Games I've contributed towards."
header:
   image_fullwidth: hdr-arcade.jpg
permalink: "/games/"
---

{% for post in site.categories.games %}
<div class="row">
    <div class="small-12 columns b60">
        {% if post.image.thumb %}
        <a href="{{ site.url }}{{ site.baseurl }}{{ post.url }}" title="{{ post.title | escape_once }}"><img src="{{ site.urlimg | absolute_url }}{{ post.image.thumb }}" class="alignleft" width="250" height="250"></a>
        {% endif %}
        <h2><a href="{{ site.url }}{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></h2>
        {% if post.meta_description %}
        {{ post.meta_description | strip_html | escape }}
        {% elsif post.teaser %}
        {{ post.teaser | strip_html | escape }}
        {% endif %}
    </div><!-- /.small-12.columns -->
</div><!-- /.row -->
{% endfor %}