# Local production target; no deployment or external services are provisioned.
FROM oven/bun:1.4.2 AS build
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile
RUN bun run build
FROM oven/bun:1.4.2
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=build /app/apps/web/dist ./apps/web/dist
COPY --from=build /app/apps/web/server.ts ./apps/web/server.ts
ENV HOST=0.0.0.0 PORT=3000 NODE_ENV=production
EXPOSE 3000
USER bun
CMD ["bun", "apps/web/server.ts"]
