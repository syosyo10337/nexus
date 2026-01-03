---
tags:
  - flutter
  - widget
  - ios
created: 2026-01-03
status: active
---

# Error (Xcode): Cycle inside Runner; building could produce unreliable results.  
Cycle details:

Build Phaseに問題があった。

[https://github.com/flutter/flutter/issues/134256](https://github.com/flutter/flutter/issues/134256)

[

Cycle inside my app on XCode 15 be… | Apple Developer Forums

I cannot run my app, I get this error. I installed xcode 15 beta on my mac m2 pro, also I have macOS Sonoma (v14.0) installed. In previous code versions the code was able to run.

![](Flutter/Attachments%201/favicon%205.ico)https://developer.apple.com/forums/thread/731287?answerId=756374022#756374022



](https://developer.apple.com/forums/thread/731287?answerId=756374022#756374022)

I noticed this and solved the problem by rearranging the order of Embed Foundation Extensions to be right after Copy Bundle Resources.

Build Phasesで、Extenstionの直前に、Copy Bundle resourceを置くこと。