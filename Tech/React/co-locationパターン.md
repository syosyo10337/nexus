---
tags:
  - react
  - component
  - state
created: 2026-01-03
status: active
---

### cf. 
- [https://zenn.dev/ampersand/articles/9cf546795074d1](https://zenn.dev/ampersand/articles/9cf546795074d1)
- [https://zenn.dev/ampersand/articles/9cf546795074d1](https://zenn.dev/ampersand/articles/9cf546795074d1)

**分離すべき（ビジネスロジック）**_**// ❌ UI層に置くべきでない**_**  
- データの変換・計算ロジック  
- 複雑な条件分岐による状態変更  
- 外部APIとの直接的なやり取り  
- ルーティングの決定ロジック**

**🟡 グレーゾーン（文脈による）**_**// 🤔 プロジェクトの方針による**_**  
- Server Actionの呼び出し  
- 成功/失敗時の基本的なフィードバック  
- 簡単な状態管理**

**🟢 同居可能（UIロジック）**_**// ✅ UI層に置いても良い**_**  
- フォームの送信状態（loading, disabled）  
- UIフィードバック（toast, modal表示）  
- アニメーション・トランジション  
- propsで受け取ったコールバックの実行**

