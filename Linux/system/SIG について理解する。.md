---
tags:
  - linux
  - command
created: 2026-01-04
status: active
---

# SIG..について理解する。

# Unix/Linuxには様々なシグナルがある

```JavaScript
SIGTERM (15) ✅ 丁寧な終了要求
└─ 「終了処理をしてから止まってください」
└─ プロセスは無視できる（実際は無視しない）
└─ クリーンアップ（ファイル保存、接続切断など）ができる
```

```JavaScript
SIGKILL (9) ⚠️ 強制終了
└─ 「今すぐ止まれ！」
└─ プロセスは無視できない
└─ クリーンアップできない（データ損失の可能性）
```

```JavaScript
SIGINT (2) 💡 割り込み
└─ Ctrl+C を押したときに送られる
└─ ターミナルでの手動停止
```

```JavaScript
1. Next.jsアプリが起動中（まだ準備できていない）
↓
2. Kubernetesが10秒後にliveness probeをチェック
GET http://localhost:3000/api/livez
↓
3. ❌ 失敗（Next.jsがまだ起動中でレスポンスなし）
↓
4. 3秒後に再チェック
↓
5. ❌ また失敗（failureThreshold: 2 なので、これで限界）
↓
6. Kubernetes「このPodは異常だ、再起動させよう」
↓
7. KubernetesがPodに SIGTERM を送信 ← これ！
↓
8. npmプロセスが終了シグナルを受け取る
↓
9. npm error signal SIGTERM ← このエラーログ
↓
10. Podが終了し、Kubernetesが新しいPodを起動
```

npm error signal SIGTERM  
npm error path /opt/birdcage  
npm error command failed  
npm error command sh -c next start