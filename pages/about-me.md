---
layout: page-fullwidth
show_meta: false
title: ""
subheadline: ""
header:
   image_fullwidth: "hdr-keyboard.jpg"
permalink: "/about/"
---


<div class="row">
    <div class="small-5 columns">
        <div class="card text-center">
            <img src="{{ site.urlimg |absolute_url }}avatar.png" width="50%" class="center">
            <h1 class="card-title">{{ site.title }}</h1>
            <p> My Journey to GameDev</p>
            <ul class="social-icons" style="list-style-type:none;">
                {% for social_item in site.data.socialmedia %}
                <li style="display:inline-block;"><a href="{{ social_item.url }}" target="_blank" class="{{ social_item.class }}" title="{{ social_item.title }}"></a></li>
                {% endfor %}
            </ul>
            {% if site.data.about.location %}
            <h6>  <i class="icon-globe"></i> {{ site.data.about.location }}</h6>
            {% endif %}
            {% if site.author_email %}
            <h6><i class="icon-mail"></i> {{ site.author_email }}</h6>
            {% endif %}
            {% if site.url %}
            <h6> <i class="icon-home"></i> {{ site.url }} </h6>
            {% endif %}
        </div>
        {% if site.data.about.show_education == true %}
        <div class="card">
            <h1 class="card-title">Education</h1>
            <br />
            {% for item in site.data.about.education %}
            <div class="row">
                <div class="small-4 columns" style="height: 100%;">
                    <span style="display:inline-block; height: 100%; vertical-align: middle;"></span>
                    <img src="{{ site.urlimg |absolute_url }}{{item.logo}}">
                </div>
                <div class="small-8 columns">
                    <h4> {{ item.name }}</h4>
                    <h6> {{ item.description }} </h6>
                    <p><a href="{{ item.url }}">{{ item.url }}</a></p>
                </div>
            </div>
            {% endfor %}
        </div>
        {% endif %}
    </div>
    <div class="small-7 columns">
        {% if site.data.about.bio %}
        <div class="card">
            <h1 class="card-title">About Me</h1>
            <p>{{ site.data.about.bio }}</p>
        </div>
        {% endif %}
        {% if site.data.about.show_projects == true %}
        <div class="card">
            <h1 class="card-title">Projects</h1>
            <br />
            {% for item in site.data.about.projects %}
            <div class="row">
                <div class="small-3 columns">
                    <img src="{{ site.urlimg |absolute_url }}{{item.logo}}">
                </div>
                <div class="small-8 columns">
                    <h4> {{ item.name }}</h4>
                    <h6> {{ item.description }} </h6>
                    <p><a href="{{ item.url }}">{{ item.url }}</a></p>
                </div>
            </div>
            {% endfor %}
        </div>
        {% endif %}
        {% if site.data.about.show_work == true %}
        <div class="card">
            <h1 class="card-title">Work Experience</h1>
            <br />
            {% for item in site.data.about.work %}
            <div class="row">
                <div class="small-3 columns" style="height: 100%;">
                    <span style="display:inline-block; height: 100%; vertical-align: middle;"></span>
                    <img src="{{ site.urlimg |absolute_url }}{{item.logo}}">
                </div>
                <div class="small-8 columns">
                    <h4> {{ item.name }}</h4>
                    <h6> {{ item.description }} </h6>
                    <p><a href="{{ item.url }}">{{ item.url }}</a></p>
                </div>
            </div>
            {% endfor %}
        </div>
        {% endif %}
    </div>
</div>