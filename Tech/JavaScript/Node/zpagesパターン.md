---
tags:
  - nodejs
  - kubernetes
  - observability
  - pattern
created: 2026-01-04
status: active
---

# zPagesパターン

Kubernetes環境でNode.jsアプリケーションを運用する際、アプリケーション内部の状態を診断するためのHTTPエンドポイントを提供するパターンです。Kubernetesのヘルスチェック（liveness/readiness probe）や、トラブルシューティング時にアプリケーションの内部状態を確認するために使用します。

## Kubernetes環境での診断エンドポイント

Kubernetesでは、Podの状態を監視するためにヘルスチェックエンドポイントが必要です。zPagesパターンでは、以下のような診断エンドポイントを提供します：

- **ヘルスチェック用**: `/healthz`, `/readyz`, `/livez` など
- **診断用**: `/metrics`, `/debug`, `/tracez` など

## Node.jsでの実装例

### Express.jsでの実装

```javascript
const express = require('express');
const app = express();

// メインアプリケーションのエンドポイント
app.get('/api/users', (req, res) => {
  // アプリケーションロジック
});

// ヘルスチェックエンドポイント
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Readiness Probe用
app.get('/readyz', async (req, res) => {
  // データベース接続チェックなど
  const dbReady = await checkDatabaseConnection();
  if (dbReady) {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready' });
  }
});

// Liveness Probe用
app.get('/livez', (req, res) => {
  // アプリケーションが生きているかチェック
  res.status(200).json({ status: 'alive' });
});

// 診断用エンドポイント（本番環境では認証必須）
app.get('/debug/metrics', (req, res) => {
  // メモリ使用量、リクエスト数などのメトリクス
  res.json({
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    // カスタムメトリクス
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### KubernetesのProbe設定

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nodejs-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nodejs-app
  template:
    metadata:
      labels:
        app: nodejs-app
    spec:
      containers:
      - name: nodejs
        image: your-nodejs-app:latest
        ports:
        - containerPort: 3000
        # Readiness Probe: トラフィックを受け付ける準備ができているか
        readinessProbe:
          httpGet:
            path: /readyz
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        # Liveness Probe: アプリケーションが生きているか
        livenessProbe:
          httpGet:
            path: /livez
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 3
          failureThreshold: 3
        # Startup Probe: 起動に時間がかかる場合
        startupProbe:
          httpGet:
            path: /healthz
            port: 3000
          initialDelaySeconds: 0
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 30  # 最大150秒待つ
```

## 実践的な考慮事項

### 1. エンドポイントの分離

- **ヘルスチェック用**: 軽量で高速に応答する必要がある
- **診断用**: 認証を必須とし、本番環境ではアクセスを制限する

```javascript
// 認証ミドルウェア
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token !== `Bearer ${process.env.DEBUG_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

app.get('/debug/metrics', requireAuth, (req, res) => {
  // 診断情報
});
```

### 2. パフォーマンスへの影響

診断エンドポイントは軽量に保ち、メインアプリケーションのパフォーマンスに影響を与えないようにする：

```javascript
app.get('/healthz', (req, res) => {
  // シンプルなチェックのみ
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});
```

### 3. 本番環境での注意点

- 診断エンドポイントは認証を必須とする
- 機密情報（APIキー、パスワードなど）を返さない
- 診断エンドポイントへのアクセスをログに記録する
- 必要に応じて、診断エンドポイントを別ポートで公開する

```javascript
// 別ポートで診断サーバーを起動
const debugApp = express();
debugApp.get('/metrics', requireAuth, (req, res) => {
  // 診断情報
});

const DEBUG_PORT = process.env.DEBUG_PORT || 9090;
debugApp.listen(DEBUG_PORT, '127.0.0.1', () => {
  console.log(`Debug server running on port ${DEBUG_PORT}`);
});
```

## 参考

- [Health Checks | Node.JS Reference Architecture](https://nodeshift.dev/nodejs-reference-architecture/operations/healthchecks/)
- [Liveness, Readiness, and Startup Probes](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/)
- [k8sのヘルスチェックについて](../Kubernetes/health-check.md)
