 

# <Suspense>

[

Suspense – React

The library for web and native user interfaces

![](React/Attachments/apple-touch-icon.png)https://react.dev/reference/react/Suspense

![](og-reference.png)](https://react.dev/reference/react/Suspense)

loading Stateをコンポーネント単位で管理するためのもの

Suspenseのfallbackに対して、placeholderを、childrenにdata fetchを行うコンポーネントを配置すること。

```TypeScript
e.g.
import { Suspense } from 'react'

import { EventListHeader } from '@/features/events/compositions/list-view/header'
import { EventSkeleton } from '@/features/events/compositions/list-view/main-content/event-list-skeleton'
import { EventListContainer } from '@/features/events/compositions/list-view/main-content/list-container'
import { AppBreadcrumb } from '@/shared/components/layout/app-breadcrumb'

export default function Page() {
  const breadcrumbItems = [
    {
      label: 'コミュニティイベント',
      href: '/events',
    },
    {
      label: '一覧',
      isCurrent: true,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <AppBreadcrumb items={breadcrumbItems} />
      <EventListHeader />

      <Suspense fallback={<EventSkeleton />}>
        <EventListContainer />
      </Suspense>
    </div>
  )
}
```