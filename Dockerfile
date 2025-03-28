# use the official Bun image
FROM oven/bun:1 AS base

# Define build arguments
ARG PUBLIC_DOMAIN_URL
ARG PUBLIC_CLIENT_ID
ARG PUBLIC_ORGANIZATION_ID

# Set environment variables
ENV PUBLIC_DOMAIN_URL=$PUBLIC_DOMAIN_URL
ENV PUBLIC_CLIENT_ID=$PUBLIC_CLIENT_ID
ENV PUBLIC_ORGANIZATION_ID=$PUBLIC_ORGANIZATION_ID
ENV DATABASE_URL=$DATABASE_URL
ENV EPSILLA_API_KEY=$EPSILLA_API_KEY

WORKDIR /usr/src/app

# install dependencies into temp directory
FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM install AS prerelease
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

# build
ENV NODE_ENV=production
RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/build .
COPY --from=prerelease /usr/src/app/proto ./proto

# Copy migration files and configuration
COPY --from=prerelease /usr/src/app/drizzle.config.ts .
COPY --from=prerelease /usr/src/app/drizzle ./drizzle

# run the app
EXPOSE 8080
ENV PORT=8080

ENTRYPOINT [ "bun", "run", "index.js" ]

