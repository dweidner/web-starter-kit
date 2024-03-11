# syntax=docker/dockerfile:1

FROM node:20.11-alpine3.19 as base

ARG UID=1000
ARG GID=1000

RUN <<-EOR
	set -e
	apk add --update --no-cache shadow=~4.14
	groupmod -g "${GID}" node
	usermod -u "${UID}" -g "${GID}" node
	apk del shadow
EOR

USER node
WORKDIR /usr/src/app

FROM base as development

ENV NODE_ENV="development"

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm clean-install --include=dev

EXPOSE 5173

CMD ["npm", "run", "serve"]

FROM base as dependencies

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm clean-install --omit=dev

FROM base as production

ENV NODE_ENV="production"

COPY --from=dependencies \
     --chown=node:node \
     --link \
     /usr/src/app/node_modules ./node_modules

COPY --chown=node:node \
     --link \
     . .

CMD ["npm", "run", "build"]
