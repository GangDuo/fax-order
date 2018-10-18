FROM centos:7

RUN set -x && \
    curl -sL https://rpm.nodesource.com/setup_10.x | bash - && \
    yum -y install nodejs

WORKDIR /mail-feed
COPY package.json /mail-feed
RUN set -x && \
    npm install 
