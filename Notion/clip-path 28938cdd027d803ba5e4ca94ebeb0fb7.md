 

# clip-path

```Go
clip-path: shape(<描画コマンド>);
```

## **座標系**

- 0% 0% = 左上

- 100% 0% = 右上

- 0% 100% = 左下

- 100% 100% = 右下

- パーセントは要素の幅・高さに対する相対値

## **主要コマンド一覧**

**1. from X Y**

**開始点の指定**（最初に必須）

from 0% 0%  _/* 左上から開始 */_

**2. line to X Y**

**直線を引く**

line to 100% 0%  _/* 現在位置から (100%, 0%) まで直線 */_

**3. arc to X Y of R [cw|ccw] [small|large]**

**円弧を引く**

[https://codepen.io/syosyo10337/pen/XJXgwdw](https://codepen.io/syosyo10337/pen/XJXgwdw)