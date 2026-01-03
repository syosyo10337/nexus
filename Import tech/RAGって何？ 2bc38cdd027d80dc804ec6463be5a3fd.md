 

# RAGって何？

***Retrieval-Augmented Generation（検索拡張生成)**

検索が拡張された、生成のことです。

# 社内チャットボットを作成してみる。

```Mermaid

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
    
    subgraph "Interface & Intelligence Layer"
        SlackBot{{🤖 Slack Bot}}:::interface
        VertexAI(🧠 Vertex AI Agent):::ai
    end

    subgraph "Automation Layer"
        GHA{{⚙️ GitHub Actions}}:::process
    end

    subgraph "Data Sources (Human Managed)"
        Notion[("📔 Notion<br/>(Biz Specs/General)")]:::source
        GitRepo[("📂 GitHub: chimer-wiki<br/>(Tech Specs)")]:::source
    end

    subgraph "RAG Knowledge Base (AI Managed)"
        GCS[("☁️ GCS Bucket<br/>(Unified Markdown Storage)")]:::rag_storage
    end

    %% Relationships
    %% User Interactions
    Staff <-->|"UI / Interaction"| SlackBot

    %% AI/Bot Logic (RAG Search)
    SlackBot <-->|"Query / Answer"| VertexAI
    VertexAI <.-|"Indexing / Search Source"| GCS

    %% Sync Logic (ETL: Sources -> GCS)
    Notion -->|"1. Fetch & Convert to MD"| GHA
    GitRepo -->|"1. Checkout Docs"| GHA
    GHA == "2. Daily Sync (Overwrite)" ==> GCS

    %% New Knowledge Creation (Slack -> GitHub)
    SlackBot -.->|"Trigger (Create PR)"| GHA
    GHA -.->|"Create PR (New Knowledge)"| GitRepo
```

# 技術選定

- 肝心のデータソースをどう用意するか？r

- AIはどうなっているのか？
    
    - 検索用と生成を分ける？など
    

# Vertext AI search

はいわゆる生成AI(対話形式）をベースモデルやデータストアを自前で用意して作成できる。

# トラブルシュート

[GCP datastoreがmarkdownを許可していない](RAG%E3%81%A3%E3%81%A6%E4%BD%95%EF%BC%9F/GCP%20datastore%E3%81%8Cmarkdown%E3%82%92%E8%A8%B1%E5%8F%AF%E3%81%97%E3%81%A6%E3%81%84%E3%81%AA%E3%81%84%202bc38cdd027d8055b57ec99fed64f1f7.html)