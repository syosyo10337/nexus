 

# Logging戦略について

[

Structured logging for Next.js

Using the Pino logging library to add structured logging to Next.js. How to set up logging to JSON for Next.js.

![](NextJS/Attachments%201/favicon.png)https://blog.arcjet.com/structured-logging-in-json-for-next-js/

![](space-field.jpeg)](https://blog.arcjet.com/structured-logging-in-json-for-next-js/)

[

next.config.js: logging

Configure how data fetches are logged to the console when running Next.js in development mode.

![](https://nextjs.org/favicon.ico?favicon.e9a7e71a.ico)https://nextjs.org/docs/app/api-reference/config/next-config-js/logging

![](NextJS/Attachments%201/docs-og.png)](https://nextjs.org/docs/app/api-reference/config/next-config-js/logging)

[https://cloud.google.com/logging/docs/setup/nodejs?hl=ja](https://cloud.google.com/logging/docs/setup/nodejs?hl=ja)

[https://medium.com/@scalablecto/easy-structured-logging-with-next-js-in-google-cloud-8b308904379e](https://medium.com/@scalablecto/easy-structured-logging-with-next-js-in-google-cloud-8b308904379e)

localStrageにためてから送る方式でperfomance改善

[https://www.sitepoint.com/logging-errors-client-side-apps/](https://www.sitepoint.com/logging-errors-client-side-apps/)

```Bash
// client-error-logger.ts への追加推奨
class ErrorLogBuffer {
  private buffer: ErrorLog[] = []
  private readonly MAX_BUFFER_SIZE = 10
  private readonly FLUSH_INTERVAL = 30000 // 30秒

  add(error: ErrorLog) {
    this.buffer.push(error)
    
    if (this.buffer.length >= this.MAX_BUFFER_SIZE) {
      this.flush()
    }
  }

  private async flush() {
    if (this.buffer.length === 0) return
    
    const batch = [...this.buffer]
    this.buffer = []
    
    await fetch('/api/log-error-batch', {
      method: 'POST',
      body: JSON.stringify({ errors: batch })
    })
  }
}
```

pinoがとりあえず良さそう。

pino-testがあるよ。

# General rules

[

Logging Best Practices: 12 Dos and Don'ts | Better Stack Community

To maximize the effectiveness of your logging efforts, follow the 12 well-established logging best practices detailed in this article

![](favicon-384a72f48a07e7e1e50c207c892df24ecca4d42b2fe82ffa2dd49189f0a7857e.png)https://betterstack.com/community/guides/logging/logging-best-practices/

![](logging-best-practices.png)](https://betterstack.com/community/guides/logging/logging-best-practices/)

[https://www.sitepoint.com/logging-errors-client-side-apps/](https://www.sitepoint.com/logging-errors-client-side-apps/)

[

Next.js edge logging with Pino/Datadog | Trys Mudford

Next.js edge logging with Pino/Datadog | Trys Mudford | Frontend developer

![](NextJS/Attachments%201/apple-touch-icon.png)https://www.trysmudford.com/blog/nextjs-edge-logging/

![](og-2019.jpg)](https://www.trysmudford.com/blog/nextjs-edge-logging/)

### NestJsで採用されている方針: [https://github.com/iamolegga/nestjs-pino](https://github.com/iamolegga/nestjs-pino)

# clientサイドでの扱い方

API routeに送信したいときに、errorオブジェクトがそのままシリアライズできないので、

route.tsで再度組み立てる必要がある。

```TypeScript
   JSON.stringify(new Error('test'))
-> {}
```