---
tags:
  - flutter
  - dart
  - widget
  - state
created: 2026-01-03
status: active
---

# Formの作成

# (TextEditingControllerを使う)

```Dart
import 'package:flutter/material.dart';

class ExpenseTitleField extends StatelessWidget {
  const ExpenseTitleField({
    super.key,
    required this.titleController,
  });

  final TextEditingController titleController;

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: titleController,
      maxLength: 50,
      decoration: const InputDecoration(label: Text('Title')),
    );
  }
}

//参照は以下のようにしてできるはず。
titleController.text
```

これは、Flutterの基本の機能の活用らしいので、単純な入力fieldが欲しい時にはこれが良いらしい。カスタマイズ性も高い

# FormBuilderTextField

`**flutter_form_builder**`パッケージに含まれるウィジェットです。これは、フォームをより簡単に構築するために設計されています

**特徴と利点:**

- **統合されたフォームバリデーション**: `**FormBuilderTextField**`は、フォームバリデーション（入力検証）を容易に実装できるようにします。例えば、必須入力やメールアドレスの形式チェックなどを簡単に追加できます。

- **フォームデータの管理**: `**FormBuilder**`ウィジェットを使って複数の`**FormBuilderTextField**`をまとめることで、フォーム全体のデータを簡単に管理・取得できます。

- **カスタムウィジェットの統合**: 他の`**FormBuilder**`フィールド（例：日付選択、スライダーなど）と容易に統合でき、一貫性のあるフォーム体験を提供します。