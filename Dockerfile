# Use the base App Engine Docker image, based on Ubuntu 16.0.4.
FROM node:12-slim

# Creating app dir.

WORKDIR /usr/churdle/client

# Copy files

COPY package.json ./
COPY babel.config.js ./
COPY next-env.d.ts ./
COPY next.config.js ./
COPY tsconfig.json ./
COPY yarn.lock ./
# COPY .env.local ./ 
COPY src ./src/
COPY public ./public/

#COPY . .

# Installing Dependencies and build

RUN yarn install --only=production
ARG NEXT_PUBLIC_API_URL
ARG BASIC_AUTH_CREDENTIALS
ARG BASIC_AUTH_PATHS
ARG NEXT_PUBLIC_RECAPTCHA_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV BASIC_AUTH_CREDENTIALS=$BASIC_AUTH_CREDENTIALS
ENV BASIC_AUTH_PATHS=$BASIC_AUTH_PATHS
ENV NEXT_PUBLIC_RECAPTCHA_KEY=$NEXT_PUBLIC_RECAPTCHA_KEY
RUN yarn test
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
