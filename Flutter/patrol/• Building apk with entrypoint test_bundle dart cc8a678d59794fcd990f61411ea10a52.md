 

# • Building apk with entrypoint test_bundle.dart...

以下アラート文

```Shell
• Building apk with entrypoint test_bundle.dart...
$ ./gradlew :app:assembleDebug -Ptarget=/Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/integration_test/test_bundle.dart -Pdart-defines=RkxBVk9SPWRldmVsb3BtZW50,UEFUUk9MX1dBSVQ9MA==,UEFUUk9MX0FQUF9QQUNLQUdFX05BTUU9Y29tLmNyb29vb2Jlcl9pZC51cGdhcmFnZS5kZXZlbG9wbWVudA==,UEFUUk9MX0FQUF9CVU5ETEVfSUQ9Y29tLmNyb29vb2Jlci1pZC51cGdhcmFnZS5kZXZlbG9wbWVudA==,SU5URUdSQVRJT05fVEVTVF9TSE9VTERfUkVQT1JUX1JFU1VMVFNfVE9fTkFUSVZFPWZhbHNl,UEFUUk9MX1RFU1RfTEFCRUxfRU5BQkxFRD10cnVl,UEFUUk9MX1RFU1RfU0VSVkVSX1BPUlQ9ODA4MQ==,UEFUUk9MX0FQUF9TRVJWRVJfUE9SVD04MDgy -Papp-server-port=8082 -Ptest-server-port=8081
	
	FAILURE: Build failed with an exception.
	
	* What went wrong:
	Gradle could not start your build.
	> Cannot create service of type BuildTreeActionExecutor using method LauncherServices$ToolingBuildTreeScopeServices.createActionExecutor() as there is a problem with parameter #1 of type List<BuildActionRunner>.
	   > Could not create service of type FileHasher using GradleUserHomeServices.createCachingFileHasher().
	      > Timeout waiting to lock file hash cache (/Users/takahashimasanao/.gradle/caches/7.4/fileHashes). It is currently in use by another Gradle instance.
	        Owner PID: 28587
	        Our PID: 34982
	        Owner Operation:
	        Our operation:
	        Lock file: /Users/takahashimasanao/.gradle/caches/7.4/fileHashes/fileHashes.lock
	
	* Try:
	> Run with --stacktrace option to get the stack trace.
	> Run with --info or --debug option to get more log output.
	> Run with --scan to get full insights.
	
	* Get more help at https://help.gradle.org
	
	BUILD FAILED in 1m 2s
✗ Failed to build apk with entrypoint test_bundle.dart (Gradle build failed with code 1) (62.9s
```

# TL;DR

以下のコマンドでgradleに引っかかるpsを切るしてみる。ss

```Shell
ps aux | grep gradle

kill -9 <PID>
```

要するに、ほかのgradleインスタンスによってファイルのcacheを持ったままだった。

なのでプロセスを表示して、killするが正解らしい。　

[

Android Studioでのビルド時のジャーナルファイルロック絶対回避するマン

2023/11/19 スクリプトが間違っていたので修正しました killall -9 java → killall -9 java || true ※ ジャーナルファイルが存在しなかったときに処理がシェルスクリプトで終っていた

![](Flutter/patrol/Attachments/icon.png)https://zenn.dev/karabiner_inc/articles/9ce0dbb64ccf14

![](Flutter/patrol/Attachments/og-base-w1200-v2.png)](https://zenn.dev/karabiner_inc/articles/9ce0dbb64ccf14)

以下gptより

The error message indicates that the Gradle build failed because another Gradle instance is holding a lock on the file hash cache, preventing your build from proceeding. Specifically, it mentions a timeout while waiting to lock the file hash cache located at `/Users/takahashimasanao/.gradle/caches/7.4/fileHashes`.

### Steps to Resolve the Issue

1. **Terminate Any Running Gradle Processes**:
    
    - Ensure no other Gradle processes are running. You can list running Gradle processes and terminate them.
    
    **On macOS/Linux:**
    
    ```Plain
    ps aux | grep gradle
    ```
    
    - Identify the PID (process ID) of any running Gradle processes and terminate them using the `kill` command:
    
    ```Plain
    kill -9 <PID>
    ```
    
    **On Windows:**
    
    - Open the Task Manager (Ctrl + Shift + Esc) and look for any running Gradle processes. End those processes.
    

2. **Delete Gradle Lock Files**:
    
    - Manually delete the lock files to ensure no lingering locks prevent Gradle from starting.
    
    **On macOS/Linux:**
    
    ```Plain
    rm -rf ~/.gradle/caches/7.4/fileHashes/
    ```
    
    **On Windows:**
    
    ```Plain
    rd /s /q %USERPROFILE%\\.gradle\\caches\\7.4\\fileHashes
    ```
    

3. **Restart Your System**:
    
    - Restarting your computer can ensure that any lingering processes are terminated and locks are released.
    

4. **Clean and Rebuild the Project**:
    
    - After ensuring that no other Gradle processes are running and the lock files are deleted, clean and rebuild your project.
    
    **On macOS/Linux:**
    
    ```Plain
    flutter clean
    cd android
    ./gradlew clean
    rm -rf ~/.gradle/caches/
    rm -rf ~/.gradle/wrapper/
    cd ..
    flutter pub get
    flutter build apk   # or flutter build ios
    ```
    
    **On Windows:**
    
    ```Plain
    flutter clean
    cd android
    gradlew clean
    rd /s /q %USERPROFILE%\\.gradle\\caches
    rd /s /q %USERPROFILE%\\.gradle\\wrapper
    cd ..
    flutter pub get
    flutter build apk   # or flutter build ios
    ```
    

### Detailed Steps with Commands

### Terminate Gradle Processes (macOS/Linux)

1. List running Gradle processes:
    
    ```Plain
    ps aux | grep gradle
    ```
    

2. Terminate any running Gradle processes:
    
    ```Plain
    kill -9 <PID>
    ```
    

### Terminate Gradle Processes (Windows)

1. Open Task Manager (Ctrl + Shift + Esc).

2. Look for any running Gradle processes and end them.

### Delete Gradle Lock Files (macOS/Linux)

1. Delete the lock files:
    
    ```Plain
    rm -rf ~/.gradle/caches/7.4/fileHashes/
    ```
    

### Delete Gradle Lock Files (Windows)

1. Delete the lock files:
    
    ```Plain
    rd /s /q %USERPROFILE%\\.gradle\\caches\\7.4\\fileHashes
    ```
    

### Clean and Rebuild the Project (macOS/Linux)

1. Clean Flutter build:
    
    ```Plain
    flutter clean
    ```
    

2. Clean Gradle build:
    
    ```Plain
    cd android
    ./gradlew clean
    ```
    

3. Delete Gradle cache:
    
    ```Plain
    rm -rf ~/.gradle/caches/
    rm -rf ~/.gradle/wrapper/
    ```
    

4. Rebuild Flutter project:
    
    ```Plain
    cd ..
    flutter pub get
    flutter build apk   # or flutter build ios
    ```
    

### Clean and Rebuild the Project (Windows)

1. Clean Flutter build:
    
    ```Plain
    flutter clean
    ```
    

2. Clean Gradle build:
    
    ```Plain
    cd android
    gradlew clean
    ```
    

3. Delete Gradle cache:
    
    ```Plain
    rd /s /q %USERPROFILE%\\.gradle\\caches
    rd /s /q %USERPROFILE%\\.gradle\\wrapper
    ```
    

4. Rebuild Flutter project:
    
    ```Plain
    cd ..
    flutter pub get
    flutter build apk   # or flutter build ios
    ```
    

### Summary

- Terminate any running Gradle processes.

- Delete the Gradle lock files.

- Restart your system if necessary.

- Clean and rebuild your Flutter project.

These steps should help resolve the Gradle cache lock issue and allow you to build your project successfully.