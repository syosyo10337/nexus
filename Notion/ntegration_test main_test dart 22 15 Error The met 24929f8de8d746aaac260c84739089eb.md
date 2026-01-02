 

![](Notion/Attachments/met_camille_pissarro_1896.jpg)

# ntegration_test/main_test.dart:22:15: Error: The method 'tap' isn't defined for the class 'PatrolIntegrationTester'.  
- 'PatrolIntegrationTester' is from

このときvscode上もpatrolのメソッドが読み込めない。

```Ruby
  : > Task :app:compileFlutterBuildDebug
	../../../.pub-cache/hosted/pub.dev/patrol_finders-2.0.2/lib/src/custom_finders/patrol_tester.dart:160:16: Error: Expected ';' after this.
	  Future<void> https://patrol.leancode.co/ci/platforms#other-1({
	               ^^^^^
	../../../.pub-cache/hosted/pub.dev/patrol_finders-2.0.2/lib/src/custom_finders/patrol_tester.dart:160:21: Error: Expected a class member, but got ':'.
	  Future<void> https://patrol.leancode.co/ci/platforms#other-1({
	                    ^
	../../../.pub-cache/hosted/pub.dev/patrol_finders-2.0.2/lib/src/custom_finders/patrol_tester.dart:162:5: Error: Expected ';' after this.
	    EnginePhase phase = EnginePhase.sendSemanticsUpdate,
	    ^^^^^^^^^^^
	../../../.pub-cache/hosted/pub.dev/patrol_finders-2.0.2/lib/src/custom_finders/patrol_tester.dart:162:17: Error: Variables must be declared using the keywords 'const', 'final', 'var' or a type name.
	Try adding the name of the type of the variable or the keyword 'var'.
	    EnginePhase phase = EnginePhase.sendSemanticsUpdate,
	                ^^^^^
	../../../.pub-cache/hosted/pub.dev/patrol_finders-2.0.2/lib/src/custom_finders/patrol_tester.dart:163:5: Error: Expected ';' after this.
	    Duration? timeout,
	    ^^^^^^^^
	../../../.pub-cache/hosted/pub.dev/patrol_finders-2.0.2/lib/src/custom_finders/patrol_tester.dart:163:13: Error: Operator declarations must be preceded by the keyword 'operator'.
	Try adding the keyword 'operator'.
	    Duration? timeout,
	            ^
	../../../.pub-cache/hosted/pub.dev/patrol_finders-2.0.2/lib/src/custom_finders/patrol_tester.dart:163:13: Error: The string '?' isn't a user-definable operator.
	    Duration? timeout,
	            ^
	../../../.pub-cache/hosted/pub.dev/patrol_finders-2.0.2/lib/src/custom_finders/patrol_tester.dart:163:13: Error: A method declaration needs an explicit list of parameters.
	Try adding a parameter list to the method declaration.
	    Duration? timeout,
	            ^
	../../../.pub-cache/hosted/pub.dev/patrol_finders-2.0.2/lib/src/custom_finders/patrol_tester.dart:163:15: Error: Expected '{' before this.
	    Duration? timeout,
	              ^^^^^^^
	../../../.pub-cache/hosted/pub.dev/patrol_finders-2.0.2/lib/src/custom_finders/patrol_tester.dart:163:15: Error: Variables must be declared using the keywords 'const', 'final', 'var' or a type name.
	Try adding the name of the type of the variable or the keyword 'var'.
	    Duration? timeout,
	              ^^^^^^^
	../../../.pub-cache/hosted/pub.dev/patrol_finders-2.0.2/lib/src/custom_finders/patrol_tester.dart:164:3: Error: Expected an identifier, but got '}'.
	Try inserting an identifier before '}'.
	  }) async {
	  ^
	../../../.pub-cache/hosted/pub.dev/patrol_finders-2.0.2/lib/src/custom_finders/patrol_tester.dart:163:22: Error: Expected ';' after this.
	    Duration? timeout,
	                     ^
	../../../.pub-cache/hosted/pub.dev/patrol_finders-2.0.2/lib/src/custom_finders/patrol_tester.dart:145:5: Error: 'Duration' isn't a type.
	    Duration? duration,
	    ^^^^^^^^
	../../../.pub-cache/hosted/pub.dev/patrol_finders-2.0.2/lib/src/custom_finders/patrol_tester.dart:163:5: Context: This isn't a type.
	    Duration? timeout,
	    ^^^^^^^^
	../../../.pub-cache/hosted/pub.dev/patrol_finders-2.0.2/lib/src/custom_finders/patrol_tester.dart:146:5: Error: 'EnginePhase' isn't a type.
	    EnginePhase phase = EnginePhase.sendSemanticsUpdate,
	    ^^^^^^^^^^^
	../../../.pub-cache/hosted/pub.dev/patrol_finders-2.0.2/lib/src/custom_finders/patrol_tester.dart:162:5: Context: This isn't a type.
```