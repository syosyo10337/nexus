---
tags:
  - flutter
  - widget
  - android
created: 2026-01-03
status: active
---

# Android のcacheが気になったときには

Flutter cleanする。

```Shell
FAILURE: Build failed with an exception.

* What went wrong:
Gradle could not start your build.
> Cannot create service of type BuildTreeActionExecutor using method LauncherServices$ToolingBuildTreeScopeServices.createActionExecutor() as there is a problem with parameter #1 of type List<BuildActionRunner>.
   > Cannot create service of type BuildModelActionRunner using BuildModelActionRunner constructor as there is a problem with parameter #1 of type PayloadSerializer.
      > Cannot create service of type PayloadSerializer using method LauncherServices$ToolingGradleUserHomeScopeServices.createPayloadSerializer() as there is a problem with parameter #2 of type PayloadClassLoaderFactory.
         > Cannot create service of type PayloadClassLoaderFactory using method LauncherServices$ToolingGradleUserHomeScopeServices.createClassLoaderFactory() as there is a problem with parameter #1 of type CachedClasspathTransformer.
            > Cannot create service of type DefaultCachedClasspathTransformer using DefaultCachedClasspathTransformer constructor as there is a problem with parameter #6 of type FileSystemAccess.
               > Cannot create service of type FileSystemAccess using method VirtualFileSystemServices$GradleUserHomeServices.createFileSystemAccess() as there is a problem with parameter #2 of type VirtualFileSystem.
                  > Cannot create service of type BuildLifecycleAwareVirtualFileSystem using method VirtualFileSystemServices$GradleUserHomeServices.createVirtualFileSystem() as there is a problem with parameter #6 of type GlobalCacheLocations.
                     > Cannot create service of type GlobalCacheLocations using method GradleUserHomeScopeServices.createGlobalCacheLocations() as there is a problem with parameter #1 of type List<GlobalCache>.
                        > Could not create service of type FileAccessTimeJournal using GradleUserHomeScopeServices.createFileAccessTimeJournal().
                           > Timeout waiting to lock journal cache (/Users/takahashimasanao/.gradle/caches/journal-1). It is currently in use by another Gradle instance.
                             Owner PID: 63134
                             Our PID: 98741
                             Owner Operation:
                             Our operation:
                             Lock file: /Users/takahashimasanao/.gradle/caches/journal-1/journal-1.lock

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.

* Get more help at https://help.gradle.org

BUILD FAILED in 1m
Running Gradle task 'assembleDebug'...                             61.3s
Error: Gradle task assembleDebug failed with exit code 1
```

やっぱり怒られたので、gradleのcacheを削除する。　

```Shell
rm -rf /Users/takahashimasanao/.gradle/caches/journal-1/journal-1.lock
```