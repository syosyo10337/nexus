 

👓

# keyframe

---

より複雑なアニメーションを実装するには、keyframe と animation を使います。keyframe を使うと、経過時間ごとのアニメーションを細かく設定することができます。

```Sass
e.g.)
@keyframe Animation Name {
   0% {...}
   100% {...}
}


/* 書式 */
＠keyframe アニメーション名 {
	0%(from){ 変化させるプロパティ: 値; }
	?0%{ 変化させるプロパティ: 値; }
	100%(to) 変化させるプロパティ: 値; }
 }
```

`0% - 100%`に関しては、`from　- to`での代用可能

ここで指定した変化させるプロパティを、animationプロパティで制御する。

## `animation:`

こちらは、実際に変化させたいプロパティ自身につける。

```Sass
e.g.) /* 透明から、0.3sかけてアニメーションが浮き上がる指定 */
#modalContent {
  background: white;
  padding: 20px;
  border-radius: 15px;

  animation-name: fadeIn;
	animation-duration: .3s;
	animation-fill-mode:forwards;
}
@keyframes fadeIn{
  from {
  opacity: 0;
  }

  to {
  opacity: 1;
  }
}
```

以下参考までに、animation関連のプロパティを例示しておきます。

```Sass

animation-name: move;
animation-duration: 2s;
animation-delay: 1s;
animation-fill-mode: forwards; --移動後の位置にとどまる。
animation-iteration-count: infinite;
animation-direction: alternate-reverse;
animation-timing-function: linear
#これらはanimationの一括指定プロパティが使えます。
}
```