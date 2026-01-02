 

# DI Container

# DI Containerとは

DI Container（Dependency Injection Container）は、オブジェクトのインスタンス化と設定を担当するオブジェクトです [Nette Documentation](https://doc.nette.org/en/dependency-injection/container)[Medium](https://medium.com/@annuhuss/dependency-injection-container-a-simple-introduction-for-managing-objects-from-their-creation-to-cebbcb772694)。依存関係を持つオブジェクトを自動的に生成し、その依存関係を注入する責任を持ちます。

### 核心的な役割

1. **依存関係の登録**: サービスをコンテナに登録する

2. **依存関係グラフの解決**: 依存関係のツリーを自動的に解決する

3. **ライフタイムの管理**: オブジェクトの生成・破棄を管理する

4. **自動注入**: コンストラクタに依存関係を自動的に注入する  
    [Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection)[Microsoft Learn](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-9.0)

# 手動DIとDI Containerの違い

### 手動DIの例（Pure DI）

```Go
// 手動でインスタンス化と注入を行う
class Database {
  constructor(connectionString: string) {}
}

class UserRepository {
  constructor(private db: Database) {}
}

class UserService {
  constructor(private repo: UserRepository) {}
}

// Composition Root - 手動で全て組み立てる必要がある
const db = new Database("connection-string");
const repo = new UserRepository(db);
const service = new UserService(repo);
```

手動DIでは、Composition Root（オブジェクトグラフを組み立てる場所）で全ての依存関係を手動で生成し、注入する必要があります [java - What is a DI Container? - Stack Overflow](https://stackoverflow.com/questions/50718586/what-is-a-di-container)。

### DI Containerを使用した例

```Go
// DI Containerを使用
import { container, injectable } from "tsyringe";

@injectable()
class Database {
  constructor(connectionString: string) {}
}

@injectable()
class UserRepository {
  constructor(private db: Database) {}
}

@injectable()
class UserService {
  constructor(private repo: UserRepository) {}
}

// コンテナが自動的に依存関係を解決
const service = container.resolve(UserService);
// Databaseもnew UserRepository(new Database(...))も自動的に生成される
```

DI Containerは、型のコンストラクタを解析し、各コンストラクタ引数を手動で指定する必要なく、依存関係を自動的に注入します [Stack Overflow](https://stackoverflow.com/questions/50718586/what-is-a-di-container)[Nette Documentation](https://doc.nette.org/en/dependency-injection/container)。

## 主要なDI Container

### ✅ InversifyJS（TypeScript）

InversifyJSは、TypeScriptとJavaScriptアプリケーション向けの強力で軽量なIoC containerです。デコレータとTypeScriptの型システムを活用し、SOLID原則に準拠したコードの作成を支援します [GitHub](https://github.com/inversify/InversifyJS)[NPM Compare](https://npm-compare.com/awilix,inversify,tsyringe,typedi)。

```Go
import { injectable, inject, Container } from "inversify";
import "reflect-metadata";

// Symbolで依存関係を識別（推奨）
const TYPES = {
  IUserRepository: Symbol.for("IUserRepository"),
  IDatabase: Symbol.for("IDatabase")
};

interface IDatabase {
  query(sql: string): Promise<any>;
}

@injectable()
class Database implements IDatabase {
  async query(sql: string): Promise<any> {
    // 実装
  }
}

interface IUserRepository {
  findById(id: string): Promise<User>;
}

@injectable()
class UserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.IDatabase) private db: IDatabase
  ) {}
  
  async findById(id: string): Promise<User> {
    return this.db.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// コンテナの設定
const container = new Container();
container.bind<IDatabase>(TYPES.IDatabase).to(Database);
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);

// 解決
const userRepo = container.get<IUserRepository>(TYPES.IUserRepository);
```

### ✅ TSyringe（TypeScript）

MicrosoftがメンテナンスしているTSyringeは、軽量なDI containerで、Constructor Injectionにフォーカスしています。循環依存の解決を含む、ほぼ全ての標準的なDI container機能をサポートしています [GitHub](https://github.com/microsoft/tsyringe)[LogRocket](https://blog.logrocket.com/top-five-typescript-dependency-injection-containers/)。

```Go
import "reflect-metadata";
import { container, injectable, singleton, inject } from "tsyringe";

@injectable()
class Database {
  query(sql: string): Promise<any> {
    // 実装
  }
}

// Singletonとして登録
@singleton()
class UserRepository {
  constructor(private db: Database) {}
  
  async findById(id: string): Promise<User> {
    return this.db.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// インターフェースベースの注入にはトークンを使用
container.register("IUserRepository", { useClass: UserRepository });

@singleton()
class UserService {
  constructor(
    @inject("IUserRepository") private userRepo: IUserRepository
  ) {}
}

// 解決
const userService = container.resolve(UserService);
```

2024年8月時点で、InversifyJSはTSyringeの約2倍ダウンロードされており、GitHubのスター数も2倍以上です。InversifyJSには公式ドキュメントがありますが、TsyringeはGitHubのREADMEがドキュメントの役割を果たしています [TypeScriptのDIコンテナライブラリ InversifyJSとTsyringeの基本的な使い方を比較してみた | DevelopersIO](https://dev.classmethod.jp/articles/typescript-di-inversifyjs-vs-tsyringe/)。

## DI Containerを使うべきか？

### DI Containerが有用な場合

- 大量のオブジェクトを複雑な依存関係で管理する場合

- フレームワーク上に構築されたWebアプリケーション

- 依存関係グラフが深く複雑な場合  
    [What is Dependency Injection Container?](https://doc.nette.org/en/dependency-injection/container)

### 手動DIが適している場合

- 少数のオブジェクトしか扱わない場合

- 依存関係が単純な場合

- DI containerのオーバーヘッドを避けたい場合  
    [What is Dependency Injection Container?](https://doc.nette.org/en/dependency-injection/container)

## パフォーマンスの考慮

ベンチマーク結果によると、ランタイムコンテナ（InversifyJS、TSyringe）は、トランスパイル時ソリューション（手動DI）と比較してオーバーヘッドが発生します。特に依存関係解決テストでは、ランタイムコンテナは約150倍遅くなります [DI Benchmark: Vanilla, RegistryComposer, typed-inject, tsyringe, inversify, nest.js](https://blog.vady.dev/di-benchmark-vanilla-registrycomposer-typed-inject-tsyringe-inversify-nestjs)。

しかし、ランタイムコンテナは、型安全性は劣りますが、サービスのライフタイム管理が容易です。一方、トランスパイル時ソリューションは型安全で非常に高速、フレームワークに依存しませんが、スコープライフタイムの依存関係については設計段階でより注意が必要です [DI Benchmark: Vanilla, RegistryComposer, typed-inject, tsyringe, inversify, nest.js](https://blog.vady.dev/di-benchmark-vanilla-registrycomposer-typed-inject-tsyringe-inversify-nestjs)。

## ベストプラクティス

1. **一貫性を保つ**: チームで使用するcontainerは統一し、専門家になる

2. **デフォルトの選択**: .NETでは組み込みDI、TypeScriptでは規模に応じてInversifyJSまたはTSyringeを選択

3. **ドメインモデルへの漏洩を避ける**: containerの選択がドメインモデルに影響を与えないようにする

4. **必要な場合のみ使用**: 小規模なプロジェクトでは手動DIの方が適している場合もある  
    [Do you know the best dependency injection container? | SSW.Rules](https://www.ssw.com.au/rules/the-best-dependency-injection-container/)

## Next.js/TypeScriptでの推奨

Next.jsプロジェクトでは、以下の選択肢があります：

1. **小〜中規模プロジェクト**: 手動DIまたはTSyringe（軽量で学習コストが低い）

2. **大規模プロジェクト**: InversifyJS（多機能で大規模アプリケーションに適している）

3. **サーバーサイドのみ**: Node.jsの組み込み機能と組み合わせて使用

この情報は、Microsoft公式ドキュメント、InversifyJS/TSyringeの公式リポジトリ、およびTypeScript DI containerのベンチマーク記事（2023-2024年）を参考にしています。