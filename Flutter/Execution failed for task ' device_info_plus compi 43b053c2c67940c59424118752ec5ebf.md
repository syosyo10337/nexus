 

# Execution failed for task ':device_info_plus:compileDebugJavaWithJavac'.

codemagic上でのみ発生していた。JAVAのバージョンの問題らしい

2024/05現在

defaultだとjava11を使っている。

ので、環境変数を変更して、利用するjavaを変更してみた。

[

macOS build machine specification

A list of tools available out-of-the-box on Codemagic macOS build machines.

![](favicon.1bfe8fa6b24e46a25edac6f7c1ca96cea5e51420ad6d0a80696d25cdaaebd2f3%201.ico)https://docs.codemagic.io/specs/versions-macos/

![](default-thumb%201.png)](https://docs.codemagic.io/specs/versions-macos/)

[

Possibility to change the Java version · codemagic-ci-cd · Discussion #2132

Use case I&#39;m using the gradle version that requires Java 17, the default version on machine is 11. There is no option to choose the java version for build on Workflow editor. The only solution ...

![](Flutter/Attachments%201/fluidicon.png)https://github.com/orgs/codemagic-ci-cd/discussions/2132

![](2132.png)](https://github.com/orgs/codemagic-ci-cd/discussions/2132)