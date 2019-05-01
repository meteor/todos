FROM gitpod/workspace-full

USER gitpod

RUN cd /home/gitpod && curl https://install.meteor.com/ | sh
