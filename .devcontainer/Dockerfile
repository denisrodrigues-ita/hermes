FROM node:22.17.0-alpine3.22 AS development

WORKDIR /app

COPY  package*.json ./

RUN npm ci

COPY . .

RUN apk update && apk upgrade && \
  apk add --no-cache git openssh

RUN apk add --no-cache bash bash-completion
RUN echo "source /etc/bash/bash_completion.sh" > ~/.bash_profile
RUN sed -i 's#^root:x:0:0:root:/root:/bin/ash#root:x:0:0:root:/root:/bin/bash#' /etc/passwd
