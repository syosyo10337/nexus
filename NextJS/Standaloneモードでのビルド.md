---
tags:
  - nextjs
  - routing
  - rendering
  - api
created: 2026-01-03
status: active
---

# Standaloneモードでのビルド

# そもそもstandaloneモードって何?

> Next.js can automatically create a standalone folder that copies only the necessary files for a production deployment, including select files in node_modules.

[https://nextjs.org/docs/app/api-reference/config/next-config-js/output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)

cf.

[

hmos.dev

Let's explore Dockerizing Next.js by combining standalone mode and a custom server.

![](https://hmos.dev/en/favicon/favicon.ico)https://hmos.dev/en/nextjs-docker-standalone-and-custom-server#1-basic-nextjs-build

![](dark-room-computer.jpeg)](https://hmos.dev/en/nextjs-docker-standalone-and-custom-server#1-basic-nextjs-build)

[

next.js/examples/with-docker/Dockerfile at canary · vercel/next.js

The React Framework. Contribute to vercel/next.js development by creating an account on GitHub.

![](NextJS/Attachments%201/fluidicon.png)https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

![](NextJS/Attachments%201/4602445c-10a2-4903-a360-c96d70531f67.png)](https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile)

```TypeScript
# standaloneビルド出力をコピー
# cf.https://nextjs.org/docs/pages/api-reference/config/next-config-js/output#automatically-copying-traced-files
COPY --chown=1000:1000 --from=builder /opt/birdcage/.next/standalone ./
COPY --chown=1000:1000 --from=builder /opt/birdcage/.next/static ./.next/static
COPY --chown=1000:1000 --from=builder /opt/birdcage/public ./public
```