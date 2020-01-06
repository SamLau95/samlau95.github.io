---
layout: post
title: nbinteract
featured: true
image: /assets/images/nbinteract.png
links:
  - name: Blog Post
    url: projects/2017-09-01-nbinteract
  - name: Demo
    url: https://www.nbinteract.com/tutorial/tutorial_monty_hall.html
  - name: Docs
    url: https://www.nbinteract.com/
  - name: Code
    url: https://github.com/samlau95/nbinteract
excerpt: >
  Create interactive data science content with a single command.
---

<section class="post__toc">
  <p class="toc__title">Table of Contents</p>

<!-- prettier-ignore -->
- TOC
{:toc}

</section>

## tl;dr

    pip install nbinteract
    jupyter nbconvert --to interact my_notebook.ipynb

Creates an interactive webpage from a Jupyter notebook.

## Explorables

Through my teaching years I've come across a bunch of helpful interactive demos
for teaching. For example, [Explained Visually][ev]{:target="\_blank"} has a
neat demo of PCA that I show students when learning PCA for the first time:

<div class="post__img">
  <amp-img
    src="{{ site.imageurl }}/pca.gif"
    class="post__img"
    width="414"
    height="370"
    layout="responsive" />
</div>

These demos are also known as [explorables][]{:target="\_blank"} and they just
_feel_ helpful for learning. I observe that as students interact with these
types of interactive explanations they implicitly create and test their own
hypotheses about the concept. For example, in the example above I asked myself:
"How influential can one point be for PCA?". To me, these explorables encourage
**active learning** by helping students come up with and answer their own
questions.

## The Issue with Explorables

Many instructors, myself included, wish for an ideal world where almost every
lesson can be taught using an explorable demonstration. However, making
explorables require two skillsets that are infrequently found together. For
example, to recreate the PCA example above you need:

1. A strong understanding of PCA to know what to expose to the user.
2. Strong web-dev skills to implement the demo.

It just so happens that many instructors have the understanding of the skill
but not the web-dev know-how. As a first step to enable instructors to create
explorables, I created a tool called `nbinteract` that takes a Jupyter notebook
with interactivity and allows instructors to publish these notebooks as
interactive web pages.

## Interactive Jupyter Notebooks?

Turns out that Jupyter notebooks have an easy way to add interactivity using a
Python library called [`ipywidgets`][ipyw]{:target="\_blank"}. `ipywidgets`
creates an interactive interface to call a function with different arguments.
For example, the slider in the below animation calls a function to draw points
with different correlations.

<div class="post__img">
  <amp-img
    src="{{ site.imageurl }}/reg.gif"
    class="post__img"
    width="507"
    height="417"
    layout="responsive" />
</div>

For more information about `ipywidgets`, see [its
Github][ipyw]{:target="\_blank"}.

Unfortunately, if you want to show someone else this interactive demo, they
have to spin up a notebook server themselves and run your notebook before they
can play with your explorable. This is a much higher barrier-to-entry than
sharing a URL since the user needs to have Jupyter, Python, and other packages
installed on their computer to run the notebook.

## Notebook to HTML

Jupyter comes with a package called `nbconvert` that can convert a notebook to
an HTML webpage that can then be put online for others to view. With the
built-in converter tool, however, interactive widgets won't work.

The `nbinteract` package provides add-on functionality to `nbconvert`. It
performs a notebook-to-HTML conversion that keeps widgets functional. The
resulting webpage, once put online, can be viewed by anyone with a web browser.
For example, the animation below was recorded using a computer without Python
or Jupyter installed by visiting [this URL][reg_textbook]{:target="\_blank"}.

<div class="post__img">
  <amp-img
    src="{{ site.imageurl }}/reg_textbook.gif"
    class="post__img"
    width="743"
    height="469"
    layout="responsive" />
</div>

## Using `nbinteract`

To use `nbinteract`, you need to already have Jupyter and `nbconvert`
installed. To install `nbinteract`:

```
pip install nbinteract
```

Then, you can convert a notebook with:

```
jupyter nbconvert --to interact a_notebook.ipynb
```

Where `a_notebook.ipynb` is the name of your notebook file. This creates an
HTML file called `a_notebook.html`. If you put that HTML file online (using
Github pages, for example), anyone can view your notebook and interactive with
widgets that you've created.

## How it works

Widgets don't work by default when converting a notebook to HTML because
interacting with a widget is supposed to call a Python function and show its
output. Webpages aren't allowed to run Python on your computer without extra
setup. Normally, Jupyter notebooks perform this setup for you, but many
internet viewers don't have Jupyter installed.

`nbinteract` enables widgets to function by running a Jupyter notebook using
the [Binder][binder]{:target="\_blank"} service in the background. When a user
interacts with a widget on an `nbinteract` webpage, the widget sends a request
to a Binder notebook server, gets the output, and shows it in the page.

## Future work

Currently we plan to use `nbinteract` to add interactivity to pages in
Berkeley's [Data 8][data8]{:target="\_blank"} and [Prob
140][prob140]{:target="\_blank"} textbooks. We also plan to conduct some
preliminary user studies in order to see whether this tool is useful for
learning.

In the future, I plan to create new widgets specifically for learning data
science. I'm specifically interested in helping students understand sequences
of random events (eg. in a bootstrap hypothesis test). I think that students
can develop a stronger intuition for statistics not only through interacting
with explorables but also through constructing mini-explorables themselves in
the process of problem-solving.

Hope `nbinteract` is useful to you! Feel free to leave comments and questions
in the `nbinteract` [issue tracker][issues]{:target="\_blank"}.

[ev]: http://setosa.io/ev/principal-component-analysis/
[explorables]: http://explorabl.es/
[ipyw]: https://github.com/jupyter-widgets/ipywidgets
[reg_textbook]: https://www.nbinteract.com/examples/examples_correlation.html
[binder]: https://mybinder.org/
[data8]: http://data8.org/
[prob140]: http://prob140.org/
[issues]: https://github.com/samlau95/nbinteract/issues
