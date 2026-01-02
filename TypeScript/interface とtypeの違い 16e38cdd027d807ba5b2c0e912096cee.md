 

# interface とtypeの違い

基本的にはinterfaceをつかって、必要なときだけ、Type ailiasを利用しましょう。

[

interfaceとtypeの違い | TypeScript入門『サバイバルTypeScript』

interfaceでの宣言とtype aliasによる宣言の違い

![](TypeScript/Attachments/logo%202.svg)https://typescriptbook.jp/reference/object-oriented/interface/interface-vs-type-alias

![](TypeScript/Attachments/interfaceとtypeの違い.png)](https://typescriptbook.jp/reference/object-oriented/interface/interface-vs-type-alias)

```TypeScript
interface Animal {
  name: string;
  bark(): string;
}
type Animal = {
  name: string;
  bark(): string;
};
```

# 知恵

TS公式

[

Performance

TypeScript is a superset of JavaScript that compiles to clean JavaScript output. - microsoft/TypeScript

![](TypeScript/Attachments/fluidicon.png)https://github.com/microsoft/TypeScript/wiki/Performance#preferring-interfaces-over-intersections

![](TypeScript/Attachments/TypeScript.png)](https://github.com/microsoft/TypeScript/wiki/Performance#preferring-interfaces-over-intersections)

GoogleのTSスタイルガイド

[

Google TypeScript Style Guide

This guide is based on the internal Google TypeScript style guide, but it has been slightly adjusted to remove Google-internal sections. Google's internal environment has different constraints on TypeScript than you might find outside of Google. The advice here is specifically useful for people authoring code they intend to import into Google, but otherwise may not apply in your external environment.

![](TypeScript/Attachments/favicon.ico)https://google.github.io/styleguide/tsguide.html#type-inference



](https://google.github.io/styleguide/tsguide.html#type-inference)