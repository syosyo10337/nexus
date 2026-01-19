---
tags:
  - nextjs
created: 2026-01-03
status: draft
---

# Linkコンポーネント

Linkコンポーネントは、クライアントサイドのナビゲーションを提供するために使用されます。

- href属性: ナビゲーション先のURLパスを指定します。この場合、`"/communities/[id]/members"`は動的ルートを示しています。

- as属性: 実際にブラウザのアドレスバーに表示されるURLを指定します。この場合、as={/communities/${props.response.id}/members`}`は動的に生成されたURLを示しています。