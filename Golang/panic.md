 

# panic

緊急停止。例外ではない。

**Goの場合：panicは「緊急停止」**

```Go
// panicは基本的にプログラムを停止させる
var name *string = nil
length := len(*name)  // panic → プログラム終了// recover()で捕捉"できる"が...
func dangerousFunc() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("panicを回復:", r)
        }
    }()
    
    var name *string = nil
    length := len(*name)  // panicが発生
    fmt.Println(length)   // ここは実行されない
}
```

**Go = エラー値を返す文化** ✅

- 通常のエラーは`error`型で返す

- panicは「プログラムが継続できない致命的な状態」のみに使う

- recover()はあるが、頻繁に使うべきではない