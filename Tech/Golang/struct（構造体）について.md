---
tags:
  - golang
  - syntax
created: 2026-01-03
status: active
---

# struct（構造体）について

変数の集合体。クラスっぽい

## Structの基本

Structは関連するデータをまとめて扱うための型で、複数のフィールド（属性）を持つことができます。

```Go
// Struct型の定義
type Person struct {
    Name string
    Age  int
    Email string
}

// 使用例
func main() {
    // 初期化方法1: フィールド名を指定
    p1 := Person{
        Name: "田中太郎",
        Age: 30,
        Email: "tanaka@example.com",
    }
    
    // 初期化方法2: 順番に値を指定
    p2 := Person{"佐藤花子", 25, "sato@example.com"}
    
    // 初期化方法3: ゼロ値で初期化
    var p3 Person
    p3.Name = "山田次郎"
    p3.Age = 35
}
```

## メソッドの定義

GoではStructにメソッドを定義できます。これがOOPのクラスメソッドに相当します。

```Go
type Rectangle struct {
    Width  float64
    Height float64
}

// 値レシーバーのメソッド（元のStructは変更されない）
func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

// ポインタレシーバーのメソッド（元のStructを変更できる）
func (r *Rectangle) Scale(factor float64) {
    r.Width *= factor
    r.Height *= factor
}

func main() {
    rect := Rectangle{Width: 10, Height: 5}
    
    // メソッド呼び出し
    area := rect.Area()  // 50
    rect.Scale(2)        // Width=20, Height=10になる
}
```

## 埋め込み（Composition）によるコードの再利用

Goには継承がありませんが、埋め込みによって似た機能を実現できます。

```Go
// 基本となるStruct
type Animal struct {
    Name string
    Age  int
}

func (a Animal) Describe() string {
    return fmt.Sprintf("%s is %d years old", a.Name, a.Age)
}

// Animalを埋め込んだStruct
type Dog struct {
    Animal  // 埋め込み
    Breed string
}

func (d Dog) Bark() string {
    return "Woof!"
}

func main() {
    dog := Dog{
        Animal: Animal{Name: "ポチ", Age: 3},
        Breed: "柴犬",
    }
    
    // 埋め込まれたStructのフィールドとメソッドに直接アクセス可能
    fmt.Println(dog.Name)        // "ポチ"
    fmt.Println(dog.Describe())  // "ポチ is 3 years old"
    fmt.Println(dog.Bark())      // "Woof!"
}
```

## コンストラクタ関数のパターン

Goには専用のコンストラクタ構文はありませんが、慣習的にNew関数を定義します。

```Go
type User struct {
    id       int    // 小文字始まりは非公開フィールド
    Name     string // 大文字始まりは公開フィールド
    email    string
    isActive bool
}

// コンストラクタ関数
func NewUser(name, email string) *User {
    return &User{
        id:       generateID(),
        Name:     name,
        email:    email,
        isActive: true,
    }
}
```

## OOPとの主な違い

1. **継承がない**: 代わりに埋め込みとインターフェースで実現

2. **カプセル化**: フィールド名の大文字/小文字で公開/非公開を制御

3. **メソッドオーバーロードがない**: 同名の異なるシグネチャのメソッドは定義不可

4. **thisやselfがない**: レシーバーに明示的に名前をつける

Structは確かにOOPのクラスの代替として機能しますが、Goらしいシンプルで明確な設計になっています。継承よりもコンポジションを重視し、インターフェースとの組み合わせで柔軟な設計が可能です。