---
tag:
  - OIDC
  - Ouah2.0
  - web
created_at: 2026-02-06
status: active
---

# OIDC(OpenID Connect)とは

OpenID Connectは、OAuth 2.0の上に構築された認証プロトコル標準です。OAuth 2.0が「認可」(何にアクセスできるか)を扱うのに対し、OIDCは「認証」(誰なのか)を扱います

主要な特徴

- OpenID Foundation(Google、Microsoftなどが参加)が策定
- JSON Web Token (JWT) を使用し、OAuth 2.0がベース
- 2012年頃から標準化されており、旧OpenID 2.0よりもシンプルで相互運用性が高い Ping Identity

GitHub ActionsがOIDCトークンを発行し、それをGoogle CloudのOAuth 2.0トークンに交換 GitHub
