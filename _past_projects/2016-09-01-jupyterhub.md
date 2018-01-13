---
layout: post
title: Scalable JupyterHub Deployment
links:
  - name: Live Deployment
    url: http://datahub.berkeley.edu/
  - name: Docs
    url: http://zero-to-jupyterhub.readthedocs.io/
  - name: Code
    url: https://github.com/jupyterhub/zero-to-jupyterhub-k8s
excerpt: >
  Redesign of the computing architecture used in UC Berkeley's Data 8 course;
  now a Jupyter-endorsed standard.
---

<section class="post__toc">
  <p class="toc__title">Table of Contents</p>

  - TOC
  {:toc}
</section>

## Summary

I led a team to redesign the architecture for a distributed computing
environment in a 1000 student data science course. The resulting deployment has
an order-of-magnitude gain in availability and reduces infrastructure costs by
50% through auto-scaling. This project resulted in a new Jupyter-endorsed
standard for deploying JupyterHub.

## The Problem

[Data 8][]{:target="_blank"}, UC Berkeley flagship data science course for
freshman, had an infamously flaky computing environment.

The course uses Jupyter notebooks ([website][jupyter]{:target="_blank"}) for
all of its content. Although Jupyter notebooks are useful, getting set up is a
lengthy and error-prone process — consider [these instructions for local
setup][ds100-setup]{:target="_blank"} that we use in a later course.

We've found that installation problems intimidate students, especially those
that have had less experience doing technical work. To help make the course
more approachable for these students, course developers me created a
cloud deployment of Jupyter using a new technology called JupyterHub. The
deployment allowed students to visit a webpage to work in Jupyter, saving many
man-hours of installation issues.

The first deployment was usable when Data 8 first started, but as the course
approached the 400-student mark we quickly noticed that the infrastructure
wasn't holding up: our first labs in Spring 2016 were nearly a complete
disaster as entire classrooms of students encountered various JupyterHub
errors.

I and other course staff spent the rest of that semester racing to patch the
deployment whenever it broke. Rather unfortunately, the deployment most often
failed under high load which happened to correspond to assignment deadlines for
the class. It was a stressful time all around, illustrated best by the fact
that our technical issue forum threads got so long that they would crash the
browser on load:

<div class="post__img">
  <amp-img
    src="{{ site.imageurl }}/503.png"
    class="post__img"
    width="651"
    height="464"
    layout="responsive" />
</div>

## The Old Deployment

What caused the old deployment to break so often? It turned out to be a
combination of factors:

1. Nearly every piece of the system was a single point of failure.
2. We had no automatic way of recovering from failures.
3. We didn't know when failures occurred until students reported them, usually
   after spending significant time refreshing their browser.

Here's a simplified diagram of our previous architecture:

<div class="post__img">
  <amp-img
    src="{{ site.imageurl }}/old_arch.png"
    class="post__img"
    width="512"
    height="437"
    layout="responsive" />
</div>

When a student visited `data8.berkeley.edu` in their web browser, they were
first forwarded to a central node that handled authentication and kept track of
which nodes ran which students' notebook servers. When a student started
working, the Hub would use Docker Swarm to run a Jupyter Notebook container on
another node. Then, the Hub would proxy the student to that node.

If the Hub failed, all students were locked out of their servers. Sometimes the
Hub machine would simply go offline. Other times, the NFS server that the Hub
ran would fail which had the nasty side-effect of causing students to lose
their work.

In addition, if a single node failed the Hub would still attempt to proxy
students to that node, effectively locking out all students that were
previously assigned to that node.

The original developers created the deployment using a combination of lengthy
Ansible playbooks, bash scripts, and Docker containers. Because of this,
making significant changes to this architecture was a difficult process! With
the limited people resources that we had at the time, we were limited to simple
fixes.

As a first step towards improving the availability of the system, I set up
monitoring to notify staff if machines went down. This helped lower downtime
while we (urgently) explored our long-term options.

To get more help, I pitched this project to [Blueprint][]{:target="_blank"}, a
student-run software development organization. In the Fall of 2016, I led a
team of four other developers to overhaul the JupyterHub deployment for Data 8.

## Redesigning the Deployment

Fortunately, we came across Google's [Kubernetes][k8s]{:target="_blank"}
project early on in our search.

Kubernetes gave us a key abstraction: instead of manually assigning containers
to specific nodes, Kubernetes' scheduler allowed us to specify containers to
run and automatically scheduled containers to nodes without requiring us to run
Docker commands manually. In addition, Kubernetes effectively solved our
recovery problem for us by giving us the ability to require containers to be
available, starting them if needed.

These key benefits and its simpler, declarative configuration convinced us that
switching to Kubernetes for our deployment was a very good idea.

In 10 weeks, I and my team recreated Data 8's JupyterHub deployment and after
stress testing felt confident enough to deploy the project into production.
In Spring 2017, Data 8 used our JupyterHub deployment on Kubernetes for the
first time as the class grew once more from 400 to 800 students.

The system was noticeably more stable because of Kubernetes' orchestration
functionality and because of the key changes to the JupyterHub architecture.
Overall, these improvements gave an **order of magnitude increase in
availability** from hours of downtime a month to less than 5 minutes a month on
average. Here are two of most important architecture decisions we made:

### Avoiding Single Points of Failure

We split apart the Hub container into a Proxy and an Spawner. This helped us
address the fact that the Hub was still a single point of failure in the system
architecture. When a student needs to log in, they will visit the Spawner.
However, once the student has a Jupyter server running, they will be
transparently sent to the Proxy which forwards the student to a running Jupyter
server in another Kubernetes pod.

This allows the Spawner to fail without affecting students who have already
logged in. Replicating the Proxy is easier than replicating the Spawner which
gives us another measure of failure tolerance.

### Dynamically Provisioned Disks

We switched to dynamically provisioned [Kubernetes
Volumes][k8s-vols]{:target="_blank"} to store student files instead of NFS. NFS
turned out to be a major source of problems for us previously since it was
quite flaky and a single source of failure. When a student logs into JupyterHub
for the first time, we create a disk that is then associated with the student's
account and attached to their pod whenever they start their Jupyter server.

This prevents a whole class of problems that caused system-wide failures for us
previously. For example, this scheme restricts disk storage and corruption
issues to only affect the student the disk belongs to.

## Additional Improvements

I oversaw continued development on this project the following semester,
although another dev handled the day-to-day management.

We made the following improvements to the system in Spring 2017:

- We automatic create periodic snapshots of student disks.
- We allow students to back up their files onto Google Drive so they can keep
  their files after their semester in Data 8.
- We implemented cluster autoscaling based on usage. **This cut our operational
  costs by 50%**, from over $4000 a month to $2000 a month. Here's a chart of
  usage comparison during a project deadline:

<div class="post__img">
  <amp-img
    src="{{ site.imageurl }}/autoscaling.png"
    class="post__img"
    width="781"
    height="349"
    layout="responsive" />
</div>

## Project Handoff

Finally, we abstracted away the Data 8 specific parts of the deployment to
allow others to reuse our architecture for their own organizations. We have
since handed the project off to the Jupyter team and the project now lives on
in Jupyter's official [Zero to JupyterHub][zero-k8s]{:target="_blank"} guide
and as part of a public, cloud-based Jupyter service called
[Binder][binder]{:target="_blank"}.

The deployment is currently used most heavily by Data 8, serving over 1000
students in Fall 2017. It is also used for classrooms and research computing
across UC Berkeley and at other universities.

[Data 8]: https://data.berkeley.edu/education/foundations
[jupyter]: http://jupyter.org/
[ds100-setup]: http://www.ds100.org/fa17/setup
[Blueprint]: https://www.calblueprint.org/
[k8s]: https://kubernetes.io/
[k8s-vols]: https://kubernetes.io/docs/concepts/storage/volumes/
[zero-k8s]: https://zero-to-jupyterhub.readthedocs.io/en/latest/
[binder]: https://mybinder.org/
