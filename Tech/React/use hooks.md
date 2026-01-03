---
tags:
  - react
  - hooks
  - component
  - performance
created: 2026-01-03
status: active
---

# use hooks

[

use – React

The library for web and native user interfaces

![](React/Attachments/apple-touch-icon%202.png)https://react.dev/reference/react/use#streaming-data-from-server-to-client

![](og-reference%201.png)](https://react.dev/reference/react/use#streaming-data-from-server-to-client)

[

Getting Started: Fetching Data

Learn how to fetch data and stream content that depends on data.

![](https://nextjs.org/favicon.ico?favicon.e9a7e71a.ico)https://nextjs.org/docs/app/getting-started/fetching-data#streaming-data-with-the-use-hook

![](docs-og%202.png)](https://nextjs.org/docs/app/getting-started/fetching-data#streaming-data-with-the-use-hook)

```TypeScript
// app/page.js (Server Component)
import { use, Suspense } from 'react'

import { SlowSection } from './_components/section'

async function getFastData() {
  // すぐ返
  return { message: '速いデータ' }
}

export async function getSlowData() {
  // 3秒かかる処理
  await new Promise(resolve => setTimeout(resolve, 3000))
  console.log(window)
  return { message: '遅いデータ' }
}

export default function Page() {
  const fastData = use(getFastData())
  const slowData = getSlowData()
  return (
    <div>
      <h1>{fastData.message}</h1>
      {' '}
      {/* すぐ表示される */}

      <Suspense fallback={<div>Loading slow data...</div>}>
        <SlowSection slowData={slowData} />
      </Suspense>
    </div>
  )
}
```

```TypeScript
'use client'

import { use } from 'react'

export function SlowSection({
  slowData,
}: {
  slowData: Promise<{ message: string }>
}) {
  const slowDataValue = use(slowData)
  console.log(window)
  return <p>{slowDataValue.message}</p>
}
```