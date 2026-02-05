---
tags:
  - computer-science
  - oop
  - trait
  - programming
created: 2026-02-06
status: active
---

# OOP における Trait

**Trait** は、クラスに機能（メソッドやプロパティ）を追加するための再利用可能なコードの集まりです。単一継承の制約を補うために設計されました。

## 核心的な特徴

**「コードの水平再利用」** がtraitの本質です。クラス継承（垂直）とは異なり、継承関係のないクラス間でメソッドを共有できます。

- **インターフェースとの違い**: インターフェースは「何ができるか」の契約だけを定義するが、traitは**実装そのもの**を提供する
- **抽象クラスとの違い**: 抽象クラスは単一継承の制約を受けるが、traitは**複数を同時に組み込める**
- **Mixin との関係**: 言語によってはmixinとほぼ同義。Traitはより厳密に「状態を持たない（または制限する）」設計思想を持つことが多い

## 言語別の実装例

- **✅ PHP（trait キーワードで直接サポート）**

```php
trait Loggable {
    public function log(string $message): void {
        echo "[LOG] {$message}";
    }
}

class UserService {
    use Loggable;
}
```

- **✅ Rust（trait = インターフェース + デフォルト実装）**

```rust
trait Greet {
    fn hello(&self) -> String {
        String::from("Hello!")
    }
}
```

- **✅ Scala（trait キーワードで直接サポート、状態も持てる）**

```scala
trait Logging {
  def log(msg: String): Unit = println(s"[LOG] $msg")
}
class Service extends Logging
```

- **✅ Dart（mixin で実現）**

```dart
mixin Loggable {
    void log(String message) {
        print("[LOG] $message");
    }
}

class UserService with Loggable {
    void createUser() {
        log("created");
    }
}

void main() {
    final service = UserService();
    service.log("hello");
}
```

- **⚠ Python（Mixin パターンで慣習的に実現）**

```python
class LogMixin:
    def log(self, message):
        print(f"[LOG] {message}")

class UserService(LogMixin):
    pass
```

## 使いどころ

- **横断的関心事**（ロギング、シリアライズ、バリデーションなど）を複数クラスで共有したいとき
- 継承ツリーを深くせずに機能を合成したいとき
- 「is-a」関係ではなく「can-do」の能力を付与したいとき

## 注意点

**ダイヤモンド問題（衝突）** — 複数のtraitが同名メソッドを持つ場合、言語ごとに解決ルールが異なります（PHPでは `insteadof` で明示指定、Scalaでは線形化順序で解決）。多用しすぎると依存関係が不透明になるため、責務を小さく保つのがベストプラクティスです。
