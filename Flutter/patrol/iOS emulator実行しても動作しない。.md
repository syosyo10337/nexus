---
tags:
  - flutter
  - dart
  - widget
  - state
created: 2026-01-03
status: active
---

# iOS emulator実行しても動作しない。

—verbose のログ見たら何故か起動している emulatorはiOS 17.2なのに、17.4のモノを探していた、

なので

起動しているiOSを17.4のものに切り替えた。

かいけつした

どこの記述でiosの設定がされているかまでは追えていない。

```Ruby
Verbose mode enabled. More logs will be printed.
$ flutter --suppress-analytics --no-version-check pub deps --style=list
Received 1 test target(s)
Received test target: /Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/integration_test/example_test.dart
Generated entrypoint /Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/integration_test/test_bundle.dart with 1 bundled test(s)
$ flutter --no-version-check --suppress-analytics devices --machine
Received 1 device(s) to run on
Received device: iPhone Xz
Received 8 --dart-define(s) (1 custom, 7 internal)
Received custom --dart-define: FLAVOR
Received internal --dart-define: PATROL_WAIT=0
Received internal --dart-define: PATROL_APP_PACKAGE_NAME=com.croooober_id.upgarage.development
Received internal --dart-define: PATROL_APP_BUNDLE_ID=com.croooober-id.upgarage.development
Received internal --dart-define: INTEGRATION_TEST_SHOULD_REPORT_RESULTS_TO_NATIVE=false
Received internal --dart-define: PATROL_TEST_LABEL_ENABLED=true
Received internal --dart-define: PATROL_TEST_SERVER_PORT=8081
Received internal --dart-define: PATROL_APP_SERVER_PORT=8082
• Building app with entrypoint test_bundle.dart for iOS simulator (debug)...
$ flutter build ios --no-version-check --suppress-analytics --config-only --no-codesign --debug --simulator --target /Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/integration_test/test_bundle.dart --dart-define FLAVOR=development --dart-define PATROL_WAIT=0 --dart-define PATROL_APP_PACKAGE_NAME=com.croooober_id.upgarage.development --dart-define PATROL_APP_BUNDLE_ID=com.croooober-id.upgarage.development --dart-define INTEGRATION_TEST_SHOULD_REPORT_RESULTS_TO_NATIVE=false --dart-define PATROL_TEST_LABEL_ENABLED=true --dart-define PATROL_TEST_SERVER_PORT=8081 --dart-define PATROL_APP_SERVER_PORT=8082
	Building com.croooober-id.upgarage.development for simulator (ios)...
	Running pod install...                                             10.1s
$ xcodebuild build-for-testing -workspace Runner.xcworkspace -scheme Runner -configuration Debug -sdk iphonesimulator -destination generic/platform=iOS Simulator -quiet -derivedDataPath ../build/ios_integ OTHER_SWIFT_FLAGS=$(inherited) -D PATROL_ENABLED
zzg	ld: warning: ignoring duplicate libraries: '-lc++'
	ld: warning: ignoring duplicate libraries: '-lc++'
	ld: warning: no platform load command found in '/Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/ios/Pods/MLKitBarcodeScanning/Frameworks/MLKitBarcodeScanning.framework/MLKitBarcodeScanning', assuming: iOS-simulator
	warning: The CFBundleVersion of an app extension ('1') must match that of its containing parent app ('2.1.5').
	/Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/ios/RunnerUITests/RunnerUITests.m:5:1: warning: unused variable 'result' [-Wunused-variable]
	PATROL_INTEGRATION_TEST_IOS_RUNNER(RunnerUITests)
	^
	In module 'patrol' imported from /Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/ios/RunnerUITests/RunnerUITests.m:2:
	/Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/build/ios_integ/Build/Products/Debug-iphonesimulator/patrol/patrol.framework/Headers/PatrolIntegrationTestIosRunner.h:34:10: note: expanded from macro 'PATROL_INTEGRATION_TEST_IOS_RUNNER'
	    BOOL result = [super instancesRespondToSelector:aSelector];                                                       \
	         ^
	/Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/ios/RunnerUITests/RunnerUITests.m:5:1: warning: format specifies type 'id' but the argument has type 'NSError * _Nullable __autoreleasing * _Nullable' [-Wformat]
	PATROL_INTEGRATION_TEST_IOS_RUNNER(RunnerUITests)
	^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	In module 'patrol' imported from /Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/ios/RunnerUITests/RunnerUITests.m:2:
	/Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/build/ios_integ/Build/Products/Debug-iphonesimulator/patrol/patrol.framework/Headers/PatrolIntegrationTestIosRunner.h:45:55: note: expanded from macro 'PATROL_INTEGRATION_TEST_IOS_RUNNER'
	      NSLog(@"patrolServer.start(): failed, err: %@", err);                                                           \
	                                                 ~~   ^~~
	2 warnings generated.
	ld: warning: no platform load command found in '/Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/ios/Pods/MLKitBarcodeScanning/Frameworks/MLKitBarcodeScanning.framework/MLKitBarcodeScanning', assuming: iOS-simulator
	warning: Run script build phase 'Firebase 設定ファイルの選択' will be run during every build because it does not specify any outputs. To address this warning, either add output dependencies to the script phase, or configure it to run in every build by unchecking "Based on dependency analysis" in the script phase. (in target 'Runner' from project 'Runner')
	note: Run script build phase 'Run Script' will be run during every build because the option to run the script phase "Based on dependency analysis" is unchecked. (in target 'Runner' from project 'Runner')
	note: Run script build phase 'Thin Binary' will be run during every build because the option to run the script phase "Based on dependency analysis" is unchecked. (in target 'Runner' from project 'Runner')
	warning: Run script build phase 'Admob idの設定' will be run during every build because it does not specify any outputs. To address this warning, either add output dependencies to the script phase, or configure it to run in every build by unchecking "Based on dependency analysis" in the script phase. (in target 'Runner' from project 'Runner')
	warning: Run script build phase 'Repro SDK の設定' will be run during every build because it does not specify any outputs. To address this warning, either add output dependencies to the script phase, or configure it to run in every build by unchecking "Based on dependency analysis" in the script phase. (in target 'Runner' from project 'Runner')
	warning: Run script build phase '[firebase_crashlytics] Crashlytics Upload Symbols' will be run during every build because it does not specify any outputs. To address this warning, either add output dependencies to the script phase, or configure it to run in every build by unchecking "Based on dependency analysis" in the script phase. (in target 'Runner' from project 'Runner')
	warning: Run script build phase 'xcode_backend build' will be run during every build because it does not specify any outputs. To address this warning, either add output dependencies to the script phase, or configure it to run in every build by unchecking "Based on dependency analysis" in the script phase. (in target 'RunnerUITests' from project 'Runner')
	warning: Run script build phase 'xcode_backend embed_and_thin' will be run during every build because it does not specify any outputs. To address this warning, either add output dependencies to the script phase, or configure it to run in every build by unchecking "Based on dependency analysis" in the script phase. (in target 'RunnerUITests' from project 'Runner')
✓ Completed building app with entrypoint test_bundle.dart for iOS simulator (210.3s)
Will uninstall apps before running tests
$ xcrun simctl uninstall 90AA5327-AE3B-43C8-B02E-61CF05485E12 com.croooober-id.upgarage.development
$ xcrun simctl uninstall 90AA5327-AE3B-43C8-B02E-61CF05485E12 com.croooober-id.upgarage.development.RunnerUITests.xctrunner
• Running app with entrypoint test_bundle.dart for iOS simulator on simulator iPhone Xz...
$ xcodebuild -showsdks -json
Assuming SDK version 17.4 for iphonesimulator
Looking for .xctestrun matching Runner_*iphonesimulator17.4*.xctestrun at /Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/build/ios_integ/Build/Products
Found 1 match(es), the first one will be used
Found /Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/build/ios_integ/Build/Products/Runner_iphonesimulator17.4-x86_64.xctestrun
$ xcodebuild test-without-building -xctestrun /Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/build/ios_integ/Build/Products/Runner_iphonesimulator17.4-x86_64.xctestrun -only-testing RunnerUITests/RunnerUITests -destination platform=iOS Simulator,name=iPhone Xz -destination-timeout 1 -resultBundlePath /Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/build/ios_results_1720063034423.xcresult
	Command line invocation:
	    /Applications/Xcode.app/Contents/Developer/usr/bin/xcodebuild test-without-building -xctestrun /Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/build/ios_integ/Build/Products/Runner_iphonesimulator17.4-x86_64.xctestrun -only-testing RunnerUITests/RunnerUITests -destination "platform=iOS Simulator,name=iPhone Xz" -destination-timeout 1 -resultBundlePath /Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/build/ios_results_1720063034423.xcresult
	
	User defaults from command line:
	    IDEBuildOperationResultBundlePath = /Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/build/ios_results_1720063034423.xcresult
	    IDEPackageSupportUseBuiltinSCM = YES
	
	Writing result bundle at path:
		/Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/build/ios_results_1720063034423.xcresult
	
	--- xcodebuild: WARNING: Using the first of multiple matching destinations:
	{ platform:macOS, arch:arm64e, id:00006000-000404E60121801E, name:My Mac }
	{ platform:macOS, arch:arm64, id:00006000-000404E60121801E, name:My Mac }
	{ platform:macOS, arch:x86_64, id:00006000-000404E60121801E, name:My Mac }
	{ platform:macOS, arch:arm64e, variant:Mac Catalyst, id:00006000-000404E60121801E, name:My Mac }
	{ platform:macOS, arch:arm64, variant:Mac Catalyst, id:00006000-000404E60121801E, name:My Mac }
	{ platform:macOS, arch:x86_64, variant:Mac Catalyst, id:00006000-000404E60121801E, name:My Mac }
	{ platform:macOS, arch:arm64e, variant:DriverKit, id:00006000-000404E60121801E, name:My Mac }
	{ platform:macOS, arch:arm64, variant:DriverKit, id:00006000-000404E60121801E, name:My Mac }
	{ platform:macOS, arch:arm64, variant:Designed for [iPad,iPhone], id:00006000-000404E60121801E, name:My Mac }
	{ platform:iOS, id:dvtdevice-DVTiPhonePlaceholder-iphoneos:placeholder, name:Any iOS Device }
	{ platform:iOS Simulator, id:dvtdevice-DVTiOSDeviceSimulatorPlaceholder-iphonesimulator:placeholder, name:Any iOS Simulator Device }
	{ platform:macOS, name:Any Mac }
	{ platform:macOS, variant:Mac Catalyst, name:Any Mac }
	{ platform:tvOS, id:dvtdevice-DVTiOSDevicePlaceholder-appletvos:placeholder, name:Any tvOS Device }
	{ platform:tvOS Simulator, id:dvtdevice-DVTiOSDeviceSimulatorPlaceholder-appletvsimulator:placeholder, name:Any tvOS Simulator Device }
	{ platform:visionOS, id:dvtdevice-DVTiOSDevicePlaceholder-xros:placeholder, name:Any visionOS Device }
	{ platform:visionOS Simulator, id:dvtdevice-DVTiOSDeviceSimulatorPlaceholder-xrsimulator:placeholder, name:Any visionOS Simulator Device }
	{ platform:watchOS, id:dvtdevice-DVTiOSDevicePlaceholder-watchos:placeholder, name:Any watchOS Device }
	{ platform:watchOS Simulator, id:dvtdevice-DVTiOSDeviceSimulatorPlaceholder-watchsimulator:placeholder, name:Any watchOS Simulator Device }
	{ platform:iOS Simulator, id:3C853B84-A19C-4336-A9FA-BD04F2BFF662, OS:17.2, name:iPad (10th generation) }
	{ platform:iOS Simulator, id:3C853B84-A19C-4336-A9FA-BD04F2BFF662, OS:17.2, name:iPad (10th generation) }
	{ platform:iOS Simulator, id:953F54A6-6E14-4EDF-BE37-707963FA4A66, OS:17.4, name:iPad (10th generation) }
	{ platform:iOS Simulator, id:953F54A6-6E14-4EDF-BE37-707963FA4A66, OS:17.4, name:iPad (10th generation) }
	{ platform:iOS Simulator, id:1AD28738-7110-4607-B930-D1E2083B60A1, OS:17.2, name:iPad Air (5th generation) }
	{ platform:iOS Simulator, id:1AD28738-7110-4607-B930-D1E2083B60A1, OS:17.2, name:iPad Air (5th generation) }
	{ platform:iOS Simulator, id:5BB2D3CE-BA5F-403C-8B55-88E81A039F94, OS:17.4, name:iPad Air (5th generation) }
	{ platform:iOS Simulator, id:5BB2D3CE-BA5F-403C-8B55-88E81A039F94, OS:17.4, name:iPad Air (5th generation) }
	{ platform:iOS Simulator, id:C618CA36-B919-47EA-B577-3D3C985EA375, OS:17.2, name:iPad Pro (11-inch) (4th generation) }
	{ platform:iOS Simulator, id:C618CA36-B919-47EA-B577-3D3C985EA375, OS:17.2, name:iPad Pro (11-inch) (4th generation) }
	{ platform:iOS Simulator, id:2A95A59C-C4AE-46E0-89D8-5F97CCBCBAFC, OS:17.4, name:iPad Pro (11-inch) (4th generation) }
	{ platform:iOS Simulator, id:2A95A59C-C4AE-46E0-89D8-5F97CCBCBAFC, OS:17.4, name:iPad Pro (11-inch) (4th generation) }
	{ platform:iOS Simulator, id:B21DCE2F-6DF8-4982-8451-A2D3640D1973, OS:17.2, name:iPad Pro (12.9-inch) (6th generation) }
	{ platform:iOS Simulator, id:B21DCE2F-6DF8-4982-8451-A2D3640D1973, OS:17.2, name:iPad Pro (12.9-inch) (6th generation) }
	{ platform:iOS Simulator, id:DB5A92FA-703C-4C8D-A065-3DE707E2DFA6, OS:17.4, name:iPad Pro (12.9-inch) (6th generation) }
	{ platform:iOS Simulator, id:DB5A92FA-703C-4C8D-A065-3DE707E2DFA6, OS:17.4, name:iPad Pro (12.9-inch) (6th generation) }
	{ platform:iOS Simulator, id:85D4964A-9990-4BDC-A9C6-FDF83E574C8A, OS:17.2, name:iPad mini (6th generation) }
	{ platform:iOS Simulator, id:85D4964A-9990-4BDC-A9C6-FDF83E574C8A, OS:17.2, name:iPad mini (6th generation) }
	{ platform:iOS Simulator, id:8F507AC5-7B5B-4214-B92F-F4FF455828F7, OS:17.4, name:iPad mini (6th generation) }
	{ platform:iOS Simulator, id:8F507AC5-7B5B-4214-B92F-F4FF455828F7, OS:17.4, name:iPad mini (6th generation) }
	{ platform:iOS Simulator, id:71FD20A5-29E0-4E80-B6AE-BAF294A648D7, OS:17.2, name:iPhone 15 }
	{ platform:iOS Simulator, id:71FD20A5-29E0-4E80-B6AE-BAF294A648D7, OS:17.2, name:iPhone 15 }
	{ platform:iOS Simulator, id:5082C2CA-3C7F-4780-A6F5-25719FFC3E0A, OS:17.4, name:iPhone 15 }
	{ platform:iOS Simulator, id:5082C2CA-3C7F-4780-A6F5-25719FFC3E0A, OS:17.4, name:iPhone 15 }
	{ platform:iOS Simulator, id:8BEBBDB7-6381-46C5-BC05-378E699BDF94, OS:17.2, name:iPhone 15 Plus }
	{ platform:iOS Simulator, id:8BEBBDB7-6381-46C5-BC05-378E699BDF94, OS:17.2, name:iPhone 15 Plus }
	{ platform:iOS Simulator, id:EAF399CD-6475-428A-B90E-50ED03977F07, OS:17.4, name:iPhone 15 Plus }
	{ platform:iOS Simulator, id:EAF399CD-6475-428A-B90E-50ED03977F07, OS:17.4, name:iPhone 15 Plus }
	{ platform:iOS Simulator, id:3EE5A340-32B0-46AF-829E-004531406FD5, OS:17.2, name:iPhone 15 Pro }
	{ platform:iOS Simulator, id:3EE5A340-32B0-46AF-829E-004531406FD5, OS:17.2, name:iPhone 15 Pro }
	{ platform:iOS Simulator, id:53333069-1E8C-44CC-8DA0-B204504B3AFE, OS:17.4, name:iPhone 15 Pro }
	{ platform:iOS Simulator, id:53333069-1E8C-44CC-8DA0-B204504B3AFE, OS:17.4, name:iPhone 15 Pro }
	{ platform:iOS Simulator, id:857EB40D-029E-4F90-8623-2D1E3C84393D, OS:17.2, name:iPhone 15 Pro Max }
	{ platform:iOS Simulator, id:857EB40D-029E-4F90-8623-2D1E3C84393D, OS:17.2, name:iPhone 15 Pro Max }
	{ platform:iOS Simulator, id:0D361BD4-F5A2-4224-9ECE-65E2FB7F47C1, OS:17.4, name:iPhone 15 Pro Max }
	{ platform:iOS Simulator, id:0D361BD4-F5A2-4224-9ECE-65E2FB7F47C1, OS:17.4, name:iPhone 15 Pro Max }
	{ platform:iOS Simulator, id:6EFE8622-EC6B-484A-9565-23CAD06B03EF, OS:17.2, name:iPhone SE (3rd generation) }
	{ platform:iOS Simulator, id:6EFE8622-EC6B-484A-9565-23CAD06B03EF, OS:17.2, name:iPhone SE (3rd generation) }
	{ platform:iOS Simulator, id:2ACFBE7A-8C5C-45A2-9CEB-21C2BAE3CDAA, OS:17.4, name:iPhone SE (3rd generation) }
	{ platform:iOS Simulator, id:2ACFBE7A-8C5C-45A2-9CEB-21C2BAE3CDAA, OS:17.4, name:iPhone SE (3rd generation) }
	{ platform:iOS Simulator, id:90AA5327-AE3B-43C8-B02E-61CF05485E12, OS:17.2, name:iPhone Xz }
	{ platform:iOS Simulator, id:90AA5327-AE3B-43C8-B02E-61CF05485E12, OS:17.2, name:iPhone Xz }
	2024-07-04 12:17:21.290 xcodebuild[68499:6605191]  IDELaunchReport: e972030e1f189480:e972030e1f189480: Finished with error: Could not launch “RunnerUITests”
	Domain: IDELaunchErrorDomain
	Code: 20
	Recovery Suggestion: LaunchServices has returned error -10661. Please check the system logs for the underlying cause of the error.
	User Info: {
	    DVTRadarComponentKey = 113722;
	    IDERunOperationFailingWorker = IDELaunchServicesLauncher;
	}
	--
	The operation couldn’t be completed. (OSStatus error -10661.)
	Domain: NSOSStatusErrorDomain
	Code: -10661
	User Info: {
	    "_LSFunction" = "_LSOpenStuffCallLocal";
	    "_LSLine" = 4129;
	}
	--
	2024-07-04 12:17:21.290 xcodebuild[68499:6605191]  IDELaunchReport: e972030e1f189480:e972030e1f189480: com.apple.dt.IDERunOperationWorkerFinished {
	    "device_model" = "MacBookPro18,3";
	    "device_osBuild" = "14.5 (23F79)";
	    "device_platform" = "com.apple.platform.macosx";
	    "dvt_coredevice_version" = "355.24";
	    "dvt_mobiledevice_version" = "1643.120.2";
	    "launchSession_schemeCommand" = Test;
	    "launchSession_state" = 1;
	    "launchSession_targetArch" = arm64e;
	    "operation_duration_ms" = 235;
	    "operation_errorCode" = 20;
	    "operation_errorDomain" = IDELaunchErrorDomain;
	    "operation_errorWorker" = IDELaunchServicesLauncher;
	    "operation_name" = IDERunOperationWorkerGroup;
	    "param_debugger_attachToExtensions" = 0;
	    "param_debugger_attachToXPC" = 0;
	    "param_debugger_type" = 1;
	    "param_destination_isProxy" = 0;
	    "param_destination_platform" = "com.apple.platform.macosx";
	    "param_diag_MainThreadChecker_stopOnIssue" = 0;
	    "param_diag_MallocStackLogging_enableDuringAttach" = 0;
	    "param_diag_MallocStackLogging_enableForXPC" = 0;
	    "param_diag_allowLocationSimulation" = 1;
	    "param_diag_checker_tpc_enable" = 0;
	    "param_diag_gpu_frameCapture_enable" = 3;
	    "param_diag_gpu_shaderValidation_enable" = 0;
	    "param_diag_gpu_validation_enable" = 1;
	    "param_diag_memoryGraphOnResourceException" = 0;
	    "param_diag_queueDebugging_enable" = 1;
	    "param_diag_runtimeProfile_generate" = 0;
	    "param_diag_sanitizer_asan_enable" = 0;
	    "param_diag_sanitizer_tsan_enable" = 0;
	    "param_diag_sanitizer_tsan_stopOnIssue" = 0;
	    "param_diag_sanitizer_ubsan_stopOnIssue" = 0;
	    "param_diag_showNonLocalizedStrings" = 0;
	    "param_diag_viewDebugging_enabled" = 0;
	    "param_diag_viewDebugging_insertDylibOnLaunch" = 0;
	    "param_install_style" = 2;
	    "param_launcher_UID" = 2;
	    "param_launcher_allowDeviceSensorReplayData" = 0;
	    "param_launcher_kind" = 0;
	    "param_launcher_style" = 0;
	    "param_launcher_substyle" = 8192;
	    "param_runnable_appExtensionHostRunMode" = 0;
	    "param_runnable_productType" = "com.apple.product-type.application";
	    "param_structuredConsoleMode" = 0;
	    "param_testing_launchedForTesting" = 1;
	    "param_testing_suppressSimulatorApp" = 1;
	    "param_testing_usingCLI" = 0;
	    "sdk_canonicalName" = "macosx14.4";
	    "sdk_osVersion" = "14.4";
	    "sdk_variant" = macos;
	}
	
	
	*** If you believe this error represents a bug, please attach the result bundle at /Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/build/ios_results_1720063034423.xcresult
	
	2024-07-04 12:17:43.832 xcodebuild[68499:6605149] [MT] IDETestOperationsObserverDebug: 25.715 elapsed -- Testing started completed.
	2024-07-04 12:17:43.832 xcodebuild[68499:6605149] [MT] IDETestOperationsObserverDebug: 0.000 sec, +0.000 sec -- start
	2024-07-04 12:17:43.832 xcodebuild[68499:6605149] [MT] IDETestOperationsObserverDebug: 25.715 sec, +25.715 sec -- end
	
	Test session results, code coverage, and logs:
		/Users/takahashimasanao/Dev/ZAS/zas-cityhall-square/build/ios_results_1720063034423.xcresult
	
	Testing failed:
		Could not launch “RunnerUITests”
		RunnerUITests-Runner encountered an error (Failed to install or launch the test runner. (Underlying Error: Could not launch “RunnerUITests”. LaunchServices has returned error -10661. Please check the system logs for the underlying cause of the error. (Underlying Error: The operation couldn’t be completed. (OSStatus error -10661.))))
	
	** TEST EXECUTE FAILED **
	
F	Testing started                                                                                                                                                                                           ✗ Failed to execute tests of app with entrypoint test_bundle.dart for iOS simulator on simulator iPhone Xz (xcodebuild exited with code 65) (37.1s)
Error: xcodebuild exited with code 65
#0      throwToolExit (package:patrol_cli/src/base/exceptions.dart:7:3)
#1      IOSTestBackend.execute.<anonymous closure> (package:patrol_cli/src/ios/ios_test_backend.dart:198:9)
<asynchronous suspension>
#2      DisposeScope.run (package:dispose_scope/src/dispose_scope.dart:46:7)
<asynchronous suspension>
#3      IOSTestBackend.execute (package:patrol_cli/src/ios/ios_test_backend.dart:153:5)
<asynchronous suspension>
#4      TestCommand._execute (package:patrol_cli/src/commands/test.dart:336:7)
<asynchronous suspension>
#5      TestCommand.run (package:patrol_cli/src/commands/test.dart:228:23)
<asynchronous suspension>
#6      CommandRunner.runCommand (package:args/command_runner.dart:212:13)
<asynchronous suspension>
#7      PatrolCommandRunner.runCommand (package:patrol_cli/src/runner/patrol_command_runner.dart:348:18)
<asynchronous suspension>
#8      PatrolCommandRunner.run (package:patrol_cli/src/runner/patrol_command_runner.dart:292:18)
<asynchronous suspension>
#9      patrolCommandRunner (package:patrol_cli/src/runner/patrol_command_runner.dart:70:20)
<asynchronous suspension>
#10     main (file:///Users/takahashimasanao/.pub-cache/hosted/pub.dev/patrol_cli-2.8.1/bin/main.dart:6:20)
<asynchronous suspension>

See the logs above to learn what happened. Also consider running with --verbose. If the logs still aren't useful, then it's a bug - please report it.
$ xcrun simctl uninstall 90AA5327-AE3B-43C8-B02E-61CF05485E12 com.croooober-id.upgarage.development
$ xcrun simctl uninstall 90AA5327-AE3B-43C8-B02E-61CF05485E12 com.croooober-id.upgarage.development.RunnerUITests.xctrunner
```