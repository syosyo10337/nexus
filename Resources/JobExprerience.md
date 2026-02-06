# syoya での経験をメモしておく

## React18/Next19 をつかって新規プロジェクト立ち上げ

## GCP/Cloud Run function/Vertex AI Applications つかった社内 RAG 及び Notion 連携

タイトル URL
Notion Integration
Slack App
GoogleCloud/Vertex AI Search
GoogleCloud/GCS
GoogleCloud/Cloud Run functions
GoogleCloud/Secret Manager
GoogleCloud/Vertex AI

### ラグ検索機能

```mermaid
graph TD
    %% Styles
    classDef user fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef interface fill:#fff9c4,stroke:#fbc02d,stroke-width:2px;
    classDef process fill:#fff3e0,stroke:#ff6f00,stroke-width:2px;
    classDef source fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,rx:5,ry:5;
    classDef rag_storage fill:#c8e6c9,stroke:#1b5e20,stroke-width:3px,rx:5,ry:5;
    classDef ai fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;

    %% Nodes
    subgraph "User Layer"
        Staff{{👨‍🏫 Staff/Engineer}}:::user
    end

    subgraph "Bot Layer"
        SlackBot{{🤖 Slack Bot}}:::interface
    end

    subgraph "AI Layer"
        DiscoveryEngine(🔍 Discovery Engine<br/>Vertex AI Search):::ai
    end

    subgraph "Data Pipeline"
        GHA{{⚙️ GitHub Actions}}:::process
    end

    subgraph "Data Sources"
        Notion[("📔 Notion<br/>(CHIMER Features)")]:::source
    end

    subgraph "RAG Knowledge Base"
        GCS[("☁️ GCS Bucket<br/>(HTML)")]:::rag_storage
    end

    %% User → Bot → AI
    Staff -->|"@bot 質問"| SlackBot
    SlackBot -->|"answerQuery API"| DiscoveryEngine
    DiscoveryEngine <-->|"検索"| GCS
    DiscoveryEngine -->|"AI回答 + 参照"| SlackBot
    SlackBot -->|"回答 + Notionリンク"| Staff

    %% Data Sync Pipeline
    Notion -->|"1. Fetch & Convert to HTML"| GHA
    GHA ==>|"2. Daily Sync"| GCS
```

### ドキュメント生成機能

```mermaid
 sequenceDiagram
    participant User as 👨‍🏫 Staff
    participant Bot as 🤖 Slack Bot
    participant Gemini as 🧠 Gemini AI
    participant Notion as 📔 Notion DB

    rect rgb(240, 248, 255)
        Note over User,Gemini: Phase 1: プレビュー生成
        User->>Bot: 📓 リアクション追加
        Bot->>Bot: スレッドメッセージ取得
        Bot->>Gemini: 会話を解析
        Gemini-->>Bot: 構造化ドキュメント（JSON）
        Bot-->>User: プレビュー表示
    end

    rect rgb(255, 248, 240)
        Note over User,Notion: Phase 2: Notion作成
        User->>Bot: 「Notionに作成」ボタン
        Bot->>Notion: ページ作成
        Notion-->>Bot: 作成完了
        Bot-->>User: ✅ 完了通知（リンク付き）
    end
```

## pino + cloud logging をつかったロギング戦略 for Next.js15 (Approuter)

client でのエラーか？server でのエラーか？を分けてロギングする

## Storybook 導入

## Playwright 導入

## v0 によるプロトタイピング
