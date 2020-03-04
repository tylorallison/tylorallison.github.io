---
layout: page
show_meta: false
title: "General"
subheadline: "General Articles"
header:
   image_fullwidth: "hdr-together_we_create.jpg"
permalink: "/general/"
---

<ul>
    {% for post in site.categories.general %}
    <li><a href="{{ site.url }}{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
</ul>
