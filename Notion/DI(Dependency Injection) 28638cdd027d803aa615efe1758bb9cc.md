 

# DI(Dependency Injection)

[**Dependency Injectionの概要**  
](#28638cdd-027d-8050-b712-f1e033ec8732)

[DIの具体的な手法](#28638cdd-027d-8000-bafa-e42685b72c79)

[✅ 1. Constructor Injection（コンストラクタインジェクション）](#28638cdd-027d-8049-88d3-fd8045930394)

[✅ 2. Property/Setter Injection（プロパティ/セッターインジェクション）](#28638cdd-027d-8000-aa55-f1428aad04db)

[✅ 3. Method Injection（メソッドインジェクション）](#28638cdd-027d-80c3-8875-ee8833c32a1e)

[⚠️ 4. Interface Injection（インターフェースインジェクション）](#28638cdd-027d-80bd-be4e-f3f641028f12)

[推奨される使い分け](#28638cdd-027d-8018-a7a2-d8c27dc271b4)

[アンチパターンの回避](#28638cdd-027d-80fa-8cdd-c8e3a0212750)

[Service Lifetimeの考慮](#28638cdd-027d-8017-b164-febabe7a8162)

[参考/関連](#28638cdd-027d-8068-b03b-d29987aff214)

# **Dependency Injectionの概要**  

Dependency Injectionは、オブジェクトが必要とする依存関係を外部から提供するプログラミング技法です。オブジェクト自身が依存関係を内部で生成するのではなく、外部のコード（インジェクター）から提供されることで、疎結合なコードを実現します [Stackify](https://stackify.com/dependency-injection/)[Wikipedia](https://en.wikipedia.org/wiki/Dependency_injection)。

主なメリット

- **テスタビリティの向上**: 依存関係をモック実装に置き換えることで、高速で独立したユニットテストが可能

- **保守性の向上**: クラス間の結合度が下がり、変更の影響範囲が限定される

- **再利用性の向上**: コンポーネントの再利用が容易になる

- **並行開発が可能**: インターフェースに合意すれば、異なる開発者やチームが同時に作業できる  
    [Design Patterns Explained – Dependency Injection- Stackify](https://stackify.com/dependency-injection/)

## DIの具体的な手法

### ✅ 1. Constructor Injection（コンストラクタインジェクション）

**最も推奨される方法**で、依存関係をコンストラクタを通じて注入します。Springチームやマイクロソフトは、必須の依存関係にはConstructor Injectionを使用することを推奨しています [Codejack](https://codejack.com/2024/09/top-7-dependency-injection-best-practices-for-net/)[Spring](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html)。

```Go
// TypeScript/Next.jsの例
interface IUserRepository {
  findById(id: string): Promise<User>;
}

class UserService {
  constructor(private readonly userRepository: IUserRepository) {
    // 依存関係がreadonlyフィールドに注入される
  }

  async getUser(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }
}
```

**メリット:**

- 依存関係が明示的で、必須であることが明確

- オブジェクトが完全に初期化された状態で返される

- イミュータブルなオブジェクトとして実装できる

- null参照の心配がない  
    [Spring](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html)[Stack Overflow](https://stackoverflow.com/questions/1503584/dependency-injection-through-constructors-or-property-setters)

**デメリット:**

- コンストラクタのパラメータが多くなると、クラスの責任が多すぎる可能性がある（Single Responsibility Principleの違反を示唆）

- 依存関係を追加する際に全てのサブクラスの変更が必要  
    [inversion of control - Dependency injection through constructors or property setters? - Stack Overflow](https://stackoverflow.com/questions/1503584/dependency-injection-through-constructors-or-property-setters)

### ✅ 2. Property/Setter Injection（プロパティ/セッターインジェクション）

オプショナルな依存関係で、クラス内に妥当なデフォルト値を設定できる場合に使用します [Dependency Injection :: Spring Framework](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html)。

```Go
// Property Injectionの例
class ErrorAlertController {
  public logger?: ILogger; // オプショナルな依存関係
  
  public processError(error: Error): void {
    // loggerが設定されていれば使用
    this.logger?.log(error.message);
  }
}

// Setter Injectionの例
class ProductService {
  private logger?: ILogger;
  
  setLogger(logger: ILogger): void {
    this.logger = logger;
  }
}
```

**メリット:**

- オプショナルな依存関係に適している

- 依存関係の再注入が可能

- JMX MBeansなどを使った再設定に有用  
    [Stack Overflow](https://stackoverflow.com/questions/7779509/setter-di-vs-constructor-di-in-spring)[Stack Overflow](https://stackoverflow.com/questions/1503584/dependency-injection-through-constructors-or-property-setters)

**デメリット:**

- 依存関係が設定されるまでオブジェクトが不完全な状態になる可能性

- 依存関係が明示的でない

- Temporal Coupling（時間的結合）のリスク  
    [Medium](https://medium.com/@miguelangelperezdiaz444/dependency-injection-in-spring-constructor-property-or-setter-which-one-should-i-choose-d38be824c8c1)[Medium](https://medium.com/@ravipatel.it/dependency-injection-using-constructor-method-property-in-asp-net-core-8-14dcdacb0c13)

### ✅ 3. Method Injection（メソッドインジェクション）

特定のメソッドで一時的に使用される依存関係を、メソッドのパラメータとして渡す方法です [DEV Community](https://dev.to/arkilis/constructor-injection-property-injection-or-method-injection-5hmb)[Medium](https://medium.com/@ravipatel.it/dependency-injection-using-constructor-method-property-in-asp-net-core-8-14dcdacb0c13)。

```Go
class ReportGenerator {
  generateReport(data: Data, formatter: IFormatter): Report {
    // formatterは一時的にこのメソッドでのみ使用
    return formatter.format(data);
  }
}
```

**メリット:**

- 依存関係がメソッド実行時にのみ必要な場合に適している

- フィールドやプロパティとして保存する必要がない

- メソッドごとに異なる実装を使用できる  
    [Dependency Injection — using Constructor , Method & Property in ASP.NET Core 8 | by Ravi Patel | Medium](https://medium.com/@ravipatel.it/dependency-injection-using-constructor-method-property-in-asp-net-core-8-14dcdacb0c13)

**デメリット:**

- 毎回依存関係を明示的に渡す必要があり、煩雑になる可能性  
    [Dependency Injection — using Constructor , Method & Property in ASP.NET Core 8 | by Ravi Patel | Medium](https://medium.com/@ravipatel.it/dependency-injection-using-constructor-method-property-in-asp-net-core-8-14dcdacb0c13)

### ⚠️ 4. Interface Injection（インターフェースインジェクション）

Martin Fowlerが定義した手法で、Type 1 IoCとも呼ばれますが、現代ではあまり使用されていません [Inversion of Control Containers and the Dependency Injection pattern](https://martinfowler.com/articles/injection.html)。

```Go
// Interface Injectionの例（あまり推奨されない）
interface ILoggerInjectable {
  injectLogger(logger: ILogger): void;
}

class Service implements ILoggerInjectable {
  private logger?: ILogger;
  
  injectLogger(logger: ILogger): void {
    this.logger = logger;
  }
}
```

**注意点:**

- Dependency Injection Principles, Practices, and Patternsの書籍では、インジェクションメソッドが依存関係を保存するとTemporal Couplingを引き起こすため、推奨されないとしています

- 実質的にはSetter InjectionかMethod Injectionと同等  
    [c# - Difference between Interface Injection and Method Injection - Stack Overflow](https://stackoverflow.com/questions/48516359/difference-between-interface-injection-and-method-injection)

## 推奨される使い分け

業界のコンセンサスとして以下のガイドラインが推奨されています：

1. **Constructor Injection**: 必須の依存関係に使用（最優先）

2. **Property/Setter Injection**: オプショナルな依存関係で、妥当なデフォルト値がある場合

3. **Method Injection**: 特定のメソッド内でのみ一時的に使用される依存関係

4. **Interface Injection**: 現代では推奨されない  
    [dependency injection - Setter DI vs. Constructor DI in Spring? - Stack Overflow +2](https://stackoverflow.com/questions/7779509/setter-di-vs-constructor-di-in-spring)

## アンチパターンの回避

以下は避けるべきアンチパターンです：

- **Service Locatorパターン**: 依存関係を明示的に要求するため、DIの利点が失われる

- **Singletonへのscoped serviceの注入**: scopedサービスがsingletonのように振る舞い、不正な状態を引き起こす

- **静的なHttpContextへのアクセス**: DIの利点が失われる  
    [Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection-guidelines)[Microsoft Learn](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-9.0)

## Service Lifetimeの考慮

DIを使用する際は、以下のライフタイムを適切に選択する必要があります：

- **Transient**: 毎回新しいインスタンスを作成

- **Scoped**: リクエストごとに1つのインスタンス（WebアプリケーションやEntity Framework Coreで推奨）

- **Singleton**: アプリケーション全体で1つのインスタンス（スレッドセーフである必要がある）  
    [Dependency injection - .NET | Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection)

この情報は、Microsoft公式ドキュメント（2024年7月更新）、Spring Framework公式ドキュメント、Martin Fowlerの記事、およびDependency Injection Principles, Practices, and Patternsの書籍を参考にしています。

# 参考/関連

[DI Container](DI\(Dependency%20Injection\)/DI%20Container%2028638cdd027d8096aae3f85c8c26d195.html)